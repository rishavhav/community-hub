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
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!agreed) return setError("Please agree to the terms.")
    if (email !== confirmEmail) return setError("Emails do not match.")
    if (password !== confirmPassword) return setError("Passwords do not match.")

    setLoading(true)

    try {
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
        setError(result.error.message)
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
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-6">
      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />

      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
      <input type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} placeholder="Confirm Email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />

      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create Password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />

      <CardElement className="p-4 border rounded-xl bg-gray-100 shadow-inner focus:outline-none" />

      <div className="flex items-start gap-3">
        <input type="checkbox" required checked={agreed} onChange={() => setAgreed(!agreed)} />
        <label className="text-sm text-gray-600">
          I agree to the{" "}
          <a href="#" className="underline text-blue-600">
            terms of service
          </a>{" "}
          and have read the{" "}
          <a href="#" className="underline text-blue-600">
            privacy policy
          </a>
          .
        </label>
      </div>

      <p className="text-sm text-gray-600 italic">Please remember your email and password — you'll need them to log in after payment.</p>

      <button type="submit" disabled={!stripe || loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold py-2 rounded-xl shadow-lg transition-all duration-300">
        {loading ? "Processing..." : "Subscribe"}
      </button>

      <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-5 mt-6 text-sm space-y-1 shadow-md">
        <p className="font-semibold text-gray-800">Order Summary</p>
        <p>Today's Payment: {selectedPlan === "monthly" ? "$127 USD" : selectedPlan === "annual" ? "$1250 USD" : "$4997 USD"}</p>
        <p>Future Payments: {selectedPlan === "monthly" ? "$127 USD / month" : selectedPlan === "annual" ? "$1250 USD / year" : "$1250 USD / year (after 1 year)"}</p>
        <p className="font-medium text-gray-900">Total Due Today: {selectedPlan === "monthly" ? "$127" : selectedPlan === "annual" ? "$1250" : "$4997"}</p>
      </div>
    </form>
  )
}

function Membership() {
  const [selectedPlan, setSelectedPlan] = useState("monthly")

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left */}
      <div className="p-10 bg-gradient-to-br from-green-100 via-green-200 to-green-300 text-black">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-800 via-emerald-500 to-lime-500 animate-text-shimmer flex items-center gap-2">
          <span className="text-yellow-400">✨</span>
          SOOTHE WELLNESS MEMBERSHIP
        </h1>

        <p className="mt-4 mb-6 text-gray-700">Choose your subscription plan:</p>

        <div className="grid grid-cols-1 gap-3">
          <button onClick={() => setSelectedPlan("monthly")} className={`px-5 py-3 rounded-lg border transition duration-300 ease-in-out ${selectedPlan === "monthly" ? "bg-gradient-to-r from-black to-gray-800 text-white shadow-md" : "bg-white text-black hover:bg-gray-100"}`}>
            Monthly - $127
          </button>

          <button onClick={() => setSelectedPlan("annual")} className={`px-5 py-3 rounded-lg border transition duration-300 ease-in-out ${selectedPlan === "annual" ? "bg-gradient-to-r from-black to-gray-800 text-white shadow-md" : "bg-white text-black hover:bg-gray-100"}`}>
            Annual - $1250
          </button>

          <button onClick={() => setSelectedPlan("gold")} className={`px-5 py-3 rounded-lg border-2 transition duration-300 ease-in-out ${selectedPlan === "gold" ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-yellow-500 shadow-md" : "bg-white text-yellow-600 border-yellow-500 hover:bg-yellow-50"}`}>
            GOLD - $4997 (Annual + VIP Benefits)
            <span className="inline-block bg-yellow-300 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full ml-2">Popular</span>
          </button>
        </div>

        <div className="mt-6">
          {selectedPlan === "gold" ? (
            <>
              <p className="text-sm font-semibold text-yellow-800">🔥 GOLD MEMBERSHIP INCLUDES:</p>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside text-gray-800">
                <li>Everything in standard membership</li>
                <li>6 one-to-one healing sessions</li>
              </ul>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-800">Included in your plan:</p>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside text-gray-800">
                <li>Weekly teachings & practices</li>
                <li>Vault access</li>
                <li>Monthly community calls</li>
                <li>Member perks</li>
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="p-10 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
        <p className="text-gray-600 mb-3">
          Selected Plan: <span className="font-medium text-gray-800">{selectedPlan === "monthly" ? "$127 / month" : selectedPlan === "annual" ? "$1250 / year" : "$4997 one-time + $1250/year"}</span>
        </p>

        <Elements stripe={stripePromise}>
          <CheckoutForm selectedPlan={selectedPlan} />
        </Elements>
      </div>
    </div>
  )
}

export default Membership
