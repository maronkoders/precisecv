const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const router = express.Router();

// Create a payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId: req.user._id.toString() }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: 'Payment intent creation failed' });
  }
});

// Handle successful payment
router.post('/payment-success', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      const userId = paymentIntent.metadata.userId;
      
      await User.findByIdAndUpdate(userId, {
        $push: {
          paymentHistory: {
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: 'succeeded',
            stripePaymentId: paymentIntentId
          }
        },
        hasActiveSubscription: true
      });

      res.json({ message: 'Payment processed successfully' });
    } else {
      res.status(400).json({ error: 'Payment not successful' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Get payment history
router.get('/history', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ payments: user.paymentHistory });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Create subscription
router.post('/create-subscription', async (req, res) => {
  try {
    const { paymentMethodId, priceId } = req.body;
    
    // Attach payment method to customer
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: req.user.email,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: 'Subscription creation failed' });
  }
});

// Cancel subscription
router.post('/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    const subscription = await stripe.subscriptions.del(subscriptionId);
    
    await User.findByIdAndUpdate(req.user._id, {
      hasActiveSubscription: false
    });

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

module.exports = router; 