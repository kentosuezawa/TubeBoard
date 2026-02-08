/**
 * POST /api/stripe/webhook
 * 
 * Stripe Webhook Handler
 * - checkout.session.completed
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('[Stripe Webhook] Signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // TODO: 
        // 1. session.metadata から post_id を取得
        // 2. ads テーブルに upsert
        // 3. posts.is_ad_active = true に更新
        // 4. expires_at = now + 7days

        console.log('[Stripe Webhook] checkout.session.completed:', session.id)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge

        // TODO:
        // 1. ads.stripe_session_id から post_id を取得
        // 2. ads レコード削除
        // 3. posts.is_ad_active = false に更新

        console.log('[Stripe Webhook] charge.refunded:', charge.id)
        break
      }

      default:
        console.log('[Stripe Webhook] Unhandled event:', event.type)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[Stripe Webhook] Error processing event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
