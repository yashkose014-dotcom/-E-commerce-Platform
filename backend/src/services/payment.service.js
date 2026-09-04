// Provider-neutral payment abstraction.
// Replace this implementation with Razorpay/Stripe/etc. in production.
// Never store card numbers, CVV, or other sensitive payment credentials.
export async function createPaymentIntent({ amount, currency = 'INR', orderId }) {
  return { provider: 'demo', amount, currency, orderId, status: 'created' }
}
