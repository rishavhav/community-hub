// stripeController.js
import Stripe from "stripe"
import dotenv from "dotenv"
dotenv.config() // Load .env before using process.env

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createSubscription = async (req, res) => {
  try {
    const { email, priceId } = req.body

    const customer = await stripe.customers.create({ email })

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    })

    const clientSecret = subscription.latest_invoice.payment_intent.client_secret

    res.json({
      clientSecret,
      stripeCustomerId: customer.id,
    })
  } catch (err) {
    console.error("Stripe subscription error:", err)
    res.status(500).json({ error: err.message })
  }
}
