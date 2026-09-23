import crypto from 'node:crypto'
import { calculateQuotes } from '../../src/utils/quoteCalculator.js'
import { methodNotAllowed, paystackRequest } from './_paystack.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(request, response) {
  if (request.method !== 'POST') return methodNotAllowed(response, 'POST')

  try {
    const { email, pet, planId, billing } = request.body || {}
    if (!emailPattern.test(email || '')) return response.status(400).json({ error: 'A valid email address is required.' })
    if (!pet || !planId || !['monthly', 'annual'].includes(billing)) return response.status(400).json({ error: 'Pet, plan and billing details are required.' })

    const quote = calculateQuotes(pet)
    const selectedPlan = quote.plans.find((plan) => plan.id === planId)
    if (!selectedPlan) return response.status(400).json({ error: 'The selected plan is not available.' })

    const amountNaira = billing === 'annual' ? selectedPlan.annualPremium : selectedPlan.monthlyPremium
    const amountKobo = amountNaira * 100
    const reference = `KPP-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
    const interval = billing === 'annual' ? 'annually' : 'monthly'

    const plan = await paystackRequest('/plan', {
      method: 'POST',
      body: JSON.stringify({
        name: `KindredPaw ${selectedPlan.name} ${reference}`,
        amount: amountKobo,
        interval,
        currency: 'NGN',
      }),
    })

    const forwardedHost = request.headers['x-forwarded-host'] || request.headers.host
    const forwardedProtocol = request.headers['x-forwarded-proto'] || 'https'
    const appUrl = (process.env.APP_URL || request.headers.origin || `${forwardedProtocol}://${forwardedHost}`).replace(/\/$/, '')
    const metadata = {
      petName: pet.name,
      petType: pet.type,
      planId,
      planName: selectedPlan.name,
      billing,
      expectedAmountKobo: amountKobo,
      riskFactor: quote.riskFactor,
    }

    const transaction = await paystackRequest('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email,
        amount: amountKobo,
        currency: 'NGN',
        reference,
        plan: plan.plan_code,
        callback_url: `${appUrl}/payment/callback`,
        metadata,
      }),
    })

    return response.status(200).json({
      authorizationUrl: transaction.authorization_url,
      accessCode: transaction.access_code,
      reference: transaction.reference,
      amount: amountNaira,
      currency: 'NGN',
      billing,
      planName: selectedPlan.name,
    })
  } catch (error) {
    const configurationError = error.message.includes('PAYSTACK_SECRET_KEY')
    return response.status(configurationError ? 503 : 502).json({ error: configurationError ? 'Payments are not configured yet.' : 'Unable to initialize payment. Please try again.' })
  }
}
