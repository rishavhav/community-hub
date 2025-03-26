import React, { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useNavigate } from "react-router-dom"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const PRICE_IDS = {
  monthly: "price_1R6y5GFmyzK3OxHjBwGXWJxf",
  annual: "price_1R6y5nFmyzK3OxHj1FIc1WHu",
  gold: "price_1R6y7BFmyzK3OxHjB9W9rLnr",
}

function CheckoutForm({ selectedPlan }) {
  const API = import.meta.env.VITE_API_BASE_URL

  const navigate = useNavigate()

  const stripe = useStripe()
  const elements = useElements()
  const [name, setName] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreed) return alert("Please agree to the terms.")

    setLoading(true)

    const res = await fetch(`${API}/api/stripe/create-subscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, priceId: PRICE_IDS[selectedPlan] }),
    })
    const data = await res.json()

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { email },
      },
    })

    if (result.error) {
      alert(result.error.message)
    } else {
      await fetch(`${API}/api/user/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          password,
          plan: selectedPlan,
          stripeCustomerId: data.stripeCustomerId,
        }),
      })

      navigate("/login")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full p-2 border rounded" />

      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" placeholder="Email" />
      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" placeholder="Create password" />
      <CardElement className="p-3 border rounded-md bg-white" />

      <div className="flex items-start gap-2">
        <input type="checkbox" required checked={agreed} onChange={() => setAgreed(!agreed)} />
        <label className="text-sm">
          I agree to the{" "}
          <a href="#" className="underline">
            terms of service
          </a>{" "}
          and have read the{" "}
          <a href="#" className="underline">
            privacy policy
          </a>
          .
        </label>
      </div>

      <button type="submit" disabled={!stripe || loading} className="bg-black text-white w-full py-2 rounded hover:bg-gray-800">
        {loading ? "Processing..." : "Subscribe"}
      </button>

      {/* Order Summary */}
      <div className="mt-6 border-t pt-4 text-sm text-gray-600 space-y-1">
        <p className="font-semibold">Order Summary</p>
        <p>Today's Payment: {selectedPlan === "monthly" ? "$127 USD" : selectedPlan === "annual" ? "$1250 USD" : "$4997 USD"}</p>
        <p>Future Payments: {selectedPlan === "monthly" ? "$127 USD / month" : selectedPlan === "annual" ? "$1250 USD / year" : "$1250 USD / year (after 1 year)"}</p>
        <p>Total due today: {selectedPlan === "monthly" ? "$127 USD" : selectedPlan === "annual" ? "$1250 USD" : "$4997 USD"}</p>
      </div>
    </form>
  )
}

function Membership() {
  const [selectedPlan, setSelectedPlan] = useState("monthly")

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left */}
      <div className="md:w-1/2 p-10 bg-white text-black">
        <h1 className="text-3xl font-bold text-green-900">SOOTHE WELLNESS MEMBERSHIP</h1>
        <p className="mt-4 mb-6">Choose your subscription plan:</p>

        <div className="flex flex-col gap-3 mb-8">
          <button onClick={() => setSelectedPlan("monthly")} className={`px-4 py-2 border rounded ${selectedPlan === "monthly" ? "bg-black text-white" : "bg-white text-black"}`}>
            Monthly - $127
          </button>

          <button onClick={() => setSelectedPlan("annual")} className={`px-4 py-2 border rounded ${selectedPlan === "annual" ? "bg-black text-white" : "bg-white text-black"}`}>
            Annual - $1250
          </button>

          <button onClick={() => setSelectedPlan("gold")} className={`px-4 py-2 border-2 border-yellow-500 rounded font-semibold shadow ${selectedPlan === "gold" ? "bg-yellow-500 text-white" : "bg-white text-yellow-600"}`}>
            GOLD - $4997 (Annual + VIP Benefits)
          </button>
        </div>

        {selectedPlan === "gold" ? (
          <>
            <p className="text-sm text-yellow-700 font-semibold">🔥 GOLD MEMBERSHIP INCLUDES:</p>
            <ul className="text-sm mt-2 space-y-1">
              <li>- Everything in standard membership</li>
              <li>- 6 one-to-one healing sessions</li>
            </ul>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">Included in your plan:</p>
            <ul className="text-sm mt-2 space-y-1">
              <li>- Weekly teachings & practices</li>
              <li>- Vault access</li>
              <li>- Monthly community calls</li>
              <li>- Member perks</li>
            </ul>
          </>
        )}
      </div>

      {/* Right */}
      <div className="md:w-1/2 p-10 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <p className="mb-2 text-sm text-gray-600">
          Selected Plan: <strong>{selectedPlan === "monthly" ? "$127 / month" : selectedPlan === "annual" ? "$1250 / year" : "$4997 one-time + $1250/year"}</strong>
        </p>

        <Elements stripe={stripePromise}>
          <CheckoutForm selectedPlan={selectedPlan} />
        </Elements>
      </div>
    </div>
  )
}

export default Membership
