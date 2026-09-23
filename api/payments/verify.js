import { methodNotAllowed, paystackRequest } from './_paystack.js'

function parseMetadata(metadata) {
  if (!metadata) return {}
  if (typeof metadata === 'object') return metadata
  try { return JSON.parse(metadata) } catch { return {} }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') return methodNotAllowed(response, 'GET')
  const reference = String(request.query.reference || '')
  if (!/^[A-Za-z0-9._=-]+$/.test(reference)) return response.status(400).json({ error: 'A valid payment reference is required.' })

  try {
    const transaction = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`)
    const metadata = parseMetadata(transaction.metadata)
    const amountMatches = Number(metadata.expectedAmountKobo) === Number(transaction.amount)
    const paymentVerified = transaction.status === 'success' && amountMatches && transaction.currency === 'NGN'
    if (!paymentVerified) return response.status(409).json({ error: 'Payment has not been verified.' })

    return response.status(200).json({
      reference: transaction.reference,
      status: transaction.status,
      amount: transaction.amount / 100,
      currency: transaction.currency,
      paidAt: transaction.paid_at,
      channel: transaction.channel,
      customerEmail: transaction.customer?.email,
      planId: metadata.planId,
      planName: metadata.planName,
      billing: metadata.billing,
      petName: metadata.petName,
    })
  } catch {
    return response.status(502).json({ error: 'Unable to verify this payment.' })
  }
}
