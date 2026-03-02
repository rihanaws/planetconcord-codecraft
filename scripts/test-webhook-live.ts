import crypto from 'crypto'

async function main() {
  const secret = process.env.WHOP_WEBHOOK_SECRET!
  if (!secret) throw new Error('WHOP_WEBHOOK_SECRET not set')

  const payload = JSON.stringify({
    type: 'payment.succeeded',
    id: 'test_sig_check_001',
    data: {
      id: 'pay_test001',
      amount: 1.00,
      currency: 'usd',
      customer_email: 'test-webhook@example.com',
      customer_name: 'Webhook Test',
      product_id: 'prod_test',
      metadata: { productSlug: 'nonexistent-slug' }
    }
  })

  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  console.log('Computed sig:', sig.substring(0, 12) + '...')

  const res = await fetch('https://codecraft.techsci.xyz/api/webhooks/whop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-whop-signature': sig },
    body: payload,
  })
  const json = await res.json()
  console.log('HTTP Status:', res.status)
  console.log('Response:', JSON.stringify(json))
}

main().catch(console.error)
