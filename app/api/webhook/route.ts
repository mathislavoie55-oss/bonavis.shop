import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message)
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }

  // Gérer les événements d'abonnement
  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const isActive = subscription.status === 'active' || subscription.status === 'trialing'

    // Ici tu pourras plus tard désactiver les liens selon le statut
    // Pour l'instant on log simplement
    console.log('Subscription status:', subscription.status, 'Active:', isActive)
  }

  return NextResponse.json({ received: true })
}
