import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const PRICE_IDS = {
  starter: 'price_STARTER_ID',
  standard: 'price_1UWH1FD4hy9XVkz0iT4eaXUe',
  pro: 'price_PRO_ID',
}

export async function POST(req: Request) {
  try {
    const { plan = 'standard' } = await req.json()
    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS] || PRICE_IDS.standard

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'], // Carte + Apple Pay + Google Pay
      line_items: [{ price: priceId, quantity: 1 }],
      shipping_address_collection: {
        allowed_countries: ['CA', 'US', 'FR'],
      },
      // Désactive Link explicitement
      payment_method_options: {
        card: {
          // Pas de Link
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.bonavis.shop'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.bonavis.shop'}/?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}