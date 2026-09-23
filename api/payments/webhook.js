import crypto from 'node:crypto'
import { methodNotAllowed, requireSecretKey } from './_paystack.js'

export const config = { api: { bodyParser: false } }

async function readBody(request) {
  const chunks = []
  for await (const chunk of request) chunks.push(chunk)
  return Buffer.concat(chunks)
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return methodNotAllowed(response, 'POST')

  try {
    const body = await readBody(request)
    const signature = request.headers['x-paystack-signature'] || ''
    const expected = crypto.createHmac('sha512', requireSecretKey()).update(body).digest('hex')
    const valid = signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    if (!valid) return response.status(401).end()

    const event = JSON.parse(body.toString('utf8'))
    // Persist subscription and recurring charge events in a database when the backend is connected.
    if (!event.event) return response.status(400).end()
    return response.status(200).end()
  } catch {
    return response.status(400).end()
  }
}
