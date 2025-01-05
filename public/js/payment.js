// Import analytics for tracking payments
import analytics from './analytics.js';

class PaymentHandler {
    constructor() {
        this.stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
        this.elements = this.stripe.elements();
        this.card = null;
        this.setupPaymentForm();
    }

    setupPaymentForm() {
        // Create card element
        const style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };

        this.card = this.elements.create('card', { style });
        this.card.mount('#card-element');

        // Handle validation errors
        this.card.addEventListener('change', (event) => {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
                analytics.trackFormError('payment-form', 'card_validation', event.error.message);
            } else {
                displayError.textContent = '';
            }
        });

        // Handle form submission
        const form = document.getElementById('payment-form');
        form.addEventListener('submit', (event) => this.handlePayment(event));
    }

    async handlePayment(event) {
        event.preventDefault();
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        
        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';

            // Get selected plan details
            const planSelect = document.getElementById('plan-select');
            const selectedPlan = planSelect.options[planSelect.selectedIndex];
            const amount = parseInt(selectedPlan.getAttribute('data-amount'));
            const currency = selectedPlan.getAttribute('data-currency') || 'usd';
            const planId = selectedPlan.value;

            // Create payment intent
            const response = await fetch('/api/payment/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount,
                    currency,
                    planId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create payment intent');
            }

            const { clientSecret } = await response.json();

            // Confirm card payment
            const result = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: this.card,
                    billing_details: {
                        name: document.getElementById('name').value,
                        email: document.getElementById('email').value
                    }
                }
            });

            if (result.error) {
                // Handle payment error
                const errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
                analytics.trackFormError('payment-form', 'payment_confirmation', result.error.message);
            } else {
                // Payment successful
                await this.handlePaymentSuccess(result.paymentIntent);
            }
        } catch (error) {
            console.error('Payment error:', error);
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = 'An error occurred while processing your payment. Please try again.';
            analytics.trackFormError('payment-form', 'payment_processing', error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Pay Now';
        }
    }

    async handlePaymentSuccess(paymentIntent) {
        try {
            // Notify backend of successful payment
            const response = await fetch('/api/payment/payment-success', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentIntentId: paymentIntent.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to process payment confirmation');
            }

            // Track successful payment
            analytics.trackPayment(
                paymentIntent.amount,
                paymentIntent.currency,
                'card'
            );

            // Show success message
            const successElement = document.getElementById('payment-success');
            successElement.classList.remove('hidden');
            
            // Hide payment form
            document.getElementById('payment-form').classList.add('hidden');

            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } catch (error) {
            console.error('Payment confirmation error:', error);
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = 'Payment was successful but there was an error updating your account. Please contact support.';
        }
    }

    // Handle subscription creation
    async createSubscription(priceId) {
        try {
            // Get payment method ID
            const { paymentMethod } = await this.stripe.createPaymentMethod({
                type: 'card',
                card: this.card,
                billing_details: {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value
                }
            });

            // Create subscription
            const response = await fetch('/api/payment/create-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    priceId
                })
            });

            const subscription = await response.json();

            if (subscription.error) {
                throw new Error(subscription.error);
            }

            // Handle subscription activation
            const { latest_invoice } = subscription;
            const { payment_intent } = latest_invoice;

            if (payment_intent) {
                const { client_secret, status } = payment_intent;

                if (status === 'requires_action') {
                    // Handle 3D Secure authentication
                    const result = await this.stripe.confirmCardPayment(client_secret);
                    if (result.error) {
                        throw new Error(result.error.message);
                    }
                }
            }

            // Track successful subscription
            analytics.trackPayment(
                latest_invoice.amount_paid,
                latest_invoice.currency,
                'subscription'
            );

            return { success: true };
        } catch (error) {
            console.error('Subscription error:', error);
            return { error: error.message };
        }
    }

    // Handle subscription cancellation
    async cancelSubscription(subscriptionId) {
        try {
            const response = await fetch('/api/payment/cancel-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subscriptionId })
            });

            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }

            return { success: true };
        } catch (error) {
            console.error('Subscription cancellation error:', error);
            return { error: error.message };
        }
    }
}

// Initialize payment handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.paymentHandler = new PaymentHandler();
}); 