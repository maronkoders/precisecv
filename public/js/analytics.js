// Analytics and tracking functionality
class Analytics {
    constructor() {
        this.initialized = false;
        this.userLocation = null;
    }

    async init() {
        if (this.initialized) return;

        try {
            // Get user's location if they consent
            await this.requestLocationPermission();
            
            // Set up interaction tracking
            this.setupInteractionTracking();
            
            // Track page view
            this.trackEvent('PAGE_VIEW', {
                path: window.location.pathname,
                referrer: document.referrer
            });

            this.initialized = true;
        } catch (error) {
            console.error('Analytics initialization failed:', error);
        }
    }

    async requestLocationPermission() {
        try {
            if ('geolocation' in navigator) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    });
                });

                this.userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                // Get city and country using reverse geocoding
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.userLocation.latitude}&lon=${this.userLocation.longitude}`);
                const data = await response.json();
                
                this.userLocation.city = data.address.city || data.address.town;
                this.userLocation.country = data.address.country;

                // Update user's location in the backend
                await fetch('/api/user/location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.userLocation)
                });
            }
        } catch (error) {
            console.log('Location access denied or error occurred');
        }
    }

    setupInteractionTracking() {
        // Track form interactions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                this.trackEvent('FORM_SUBMISSION', {
                    formId: form.id,
                    action: 'submit'
                });
            });
        });

        // Track section visibility
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.trackEvent('SECTION_INTERACTION', {
                        section: entry.target.id,
                        action: 'view'
                    });
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('section, [data-track-view]').forEach(section => {
            observer.observe(section);
        });

        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            const trackable = e.target.closest('[data-track-click]');
            if (trackable) {
                this.trackEvent('SECTION_INTERACTION', {
                    section: trackable.id || trackable.getAttribute('data-track-click'),
                    action: 'click'
                });
            }
        });

        // Track errors
        window.addEventListener('error', (e) => {
            this.trackEvent('ERROR', {
                message: e.message,
                source: e.filename,
                line: e.lineno,
                column: e.colno,
                stack: e.error?.stack
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.trackEvent('ERROR', {
                message: e.reason.message,
                stack: e.reason.stack,
                type: 'unhandled_promise_rejection'
            });
        });
    }

    async trackEvent(eventType, details = {}) {
        try {
            const eventData = {
                eventType,
                details,
                location: this.userLocation,
                timestamp: new Date().toISOString()
            };

            const response = await fetch('/api/analytics/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error('Failed to track event');
            }
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    // Track CV downloads
    trackDownload(cvId) {
        this.trackEvent('DOWNLOAD', {
            cvId,
            action: 'download'
        });
    }

    // Track form errors
    trackFormError(formId, errorType, errorMessage) {
        this.trackEvent('ERROR', {
            formId,
            errorType,
            errorMessage,
            action: 'form_error'
        });
    }

    // Track successful payments
    trackPayment(amount, currency, paymentMethod) {
        this.trackEvent('PAYMENT', {
            amount,
            currency,
            paymentMethod,
            action: 'payment_success'
        });
    }
}

// Initialize analytics
const analytics = new Analytics();
analytics.init();

// Export for use in other scripts
export default analytics; 