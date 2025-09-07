import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  
  if (!userId) {
    console.error('No userId in session metadata');
    return;
  }

  // Update user subscription status
  await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      subscription_id: session.subscription as string,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  console.log(`Subscription activated for user ${userId}`);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Find user by customer ID
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Update subscription status
  await supabase
    .from('users')
    .update({
      subscription_status: subscription.status,
      subscription_id: subscription.id,
      subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  console.log(`Subscription created for user ${user.id}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Find user by customer ID
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Update subscription status
  await supabase
    .from('users')
    .update({
      subscription_status: subscription.status,
      subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  console.log(`Subscription updated for user ${user.id}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Find user by customer ID
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Update subscription status
  await supabase
    .from('users')
    .update({
      subscription_status: 'canceled',
      subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  console.log(`Subscription canceled for user ${user.id}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Find user by customer ID
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Log successful payment
  await supabase
    .from('payment_logs')
    .insert({
      user_id: user.id,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      created_at: new Date().toISOString(),
    });

  console.log(`Payment succeeded for user ${user.id}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Find user by customer ID
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Log failed payment
  await supabase
    .from('payment_logs')
    .insert({
      user_id: user.id,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      created_at: new Date().toISOString(),
    });

  console.log(`Payment failed for user ${user.id}`);
}
