const paystackBaseUrl = 'https://api.paystack.co'

export function requireSecretKey() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) throw new Error('PAYSTACK_SECRET_KEY is not configured')
  return secretKey
}

export async function paystackRequest(path, options = {}) {
  const secretKey = requireSecretKey()
  const response = await fetch(`${paystackBaseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const payload = await response.json()
  if (!response.ok || !payload.status) throw new Error(payload.message || 'Paystack request failed')
  return payload.data
}

export function methodNotAllowed(response, allowed) {
  response.setHeader('Allow', allowed)
  return response.status(405).json({ error: `Method must be ${allowed}` })
}
