// ============================================
// EazyViza Landing Page JavaScript
// ============================================

// ===== MOBILE MENU TOGGLE =====
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all FAQ items
        faqItems.forEach(faq => {
            faq.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== FORM VALIDATION & SUBMISSION =====

// Phone number validation
function validatePhone(phone) {
    // Allow international format: +, digits, spaces, hyphens, parentheses
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generic form submission handler
async function handleFormSubmission(form, successElement) {
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        visa_type: formData.get('visa_type'),
        travel_date: formData.get('travel_date') || null,
        submission_date: new Date().toISOString(),
        source: 'Landing Page'
    };

    // Validation
    if (!data.name || data.name.trim().length < 2) {
        alert('Please enter a valid name (at least 2 characters)');
        return false;
    }

    if (!validateEmail(data.email)) {
        alert('Please enter a valid email address');
        return false;
    }

    if (!validatePhone(data.phone)) {
        alert('Please enter a valid phone number');
        return false;
    }

    if (!data.country) {
        alert('Please select your country');
        return false;
    }

    if (!data.visa_type) {
        alert('Please select a visa type');
        return false;
    }

    try {
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Submitting...</span>';

        // Submit to API
        const response = await fetch('https://n8n.srv1068626.hstgr.cloud/webhook/77d3ac2d-5bac-4922-8e44-e03fc4370c78', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Submission failed');
        }

        const result = await response.json();
        console.log('Lead submitted successfully:', result);

        // Hide form and show success message
        form.style.display = 'none';
        successElement.style.display = 'block';

        // Scroll to success message
        successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // TODO: Trigger email with visa guide PDF
        // You can integrate with email service (SendGrid, Mailgun, etc.)
        // Example webhook call:
        // await fetch('/send-guide', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         email: data.email,
        //         name: data.name,
        //         phone: data.phone,
        //         guide_url: 'https://travel.eazyviza.com/guides/australia-visa-guide.pdf'
        //     })
        // });

        // Track conversion (you can integrate with Meta Pixel here)
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Visa Guide Download',
                content_category: 'Australian Visa',
                value: 0,
                currency: 'USD'
            });
        }

        // Optional: Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead', {
                'event_category': 'Lead Form',
                'event_label': data.visa_type
            });
        }

        return true;
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Sorry, there was an error submitting your form. Please try again or contact us directly.');

        // Reset button
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;

        return false;
    }
}

// Quick Lead Form (Hero)
const quickLeadForm = document.getElementById('quickLeadForm');
const quickFormSuccess = document.getElementById('quickFormSuccess');

if (quickLeadForm) {
    quickLeadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleFormSubmission(quickLeadForm, quickFormSuccess);
    });
}

// Main Lead Form (Bottom)
const mainLeadForm = document.getElementById('mainLeadForm');
const mainFormSuccess = document.getElementById('mainFormSuccess');

if (mainLeadForm) {
    mainLeadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleFormSubmission(mainLeadForm, mainFormSuccess);
    });
}

// ===== HEADER SCROLL EFFECT =====
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
    }

    lastScroll = currentScroll;
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll('.benefit-card, .step-card, .testimonial-card, .stat-item');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ===== COUNTDOWN TIMER (Optional - for urgency) =====
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    let timeLeft = 3600; // 1 hour in seconds

    const updateCountdown = () => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft > 0) {
            timeLeft--;
        } else {
            timeLeft = 3600; // Reset
        }
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Start countdown if element exists
startCountdown();

// ===== FORM INPUT ENHANCEMENTS =====
const formInputs = document.querySelectorAll('input, select');

formInputs.forEach(input => {
    // Add focus effects
    input.addEventListener('focus', (e) => {
        const formGroup = e.target.closest('.form-group');
        if (formGroup) {
            formGroup.style.transform = 'translateY(-2px)';
        }
    });

    input.addEventListener('blur', (e) => {
        const formGroup = e.target.closest('.form-group');
        if (formGroup) {
            formGroup.style.transform = 'translateY(0)';
        }
    });
});

// ===== WHATSAPP BUTTON PULSE ANIMATION =====
const whatsappButton = document.querySelector('.whatsapp-float');
if (whatsappButton) {
    setInterval(() => {
        whatsappButton.style.animation = 'none';
        setTimeout(() => {
            whatsappButton.style.animation = 'pulse 2s ease-in-out';
        }, 10);
    }, 5000);
}

// Add pulse animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// ===== PAGE LOAD ANALYTICS =====
window.addEventListener('load', () => {
    console.log('EazyViza Landing Page Loaded');

    // Track page view (integrate with your analytics)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'PageView');
    }

    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': 'EazyViza Landing Page',
            'page_location': window.location.href
        });
    }
});

// ===== EXIT INTENT POPUP (Optional) =====
let exitIntentShown = false;

document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 0 && !exitIntentShown) {
        exitIntentShown = true;
        // You can show a modal or popup here
        console.log('User showing exit intent - consider showing special offer');

        // Example: Scroll to application form
        const applySection = document.getElementById('apply');
        if (applySection && confirm('Wait! Get a FREE visa eligibility check before you go?')) {
            applySection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ===== REAL-TIME FORM FEEDBACK =====
const emailInputs = document.querySelectorAll('input[type="email"]');
emailInputs.forEach(input => {
    input.addEventListener('blur', (e) => {
        if (e.target.value && !validateEmail(e.target.value)) {
            e.target.style.borderColor = '#DC3545';
            // You can add error message here
        } else if (e.target.value) {
            e.target.style.borderColor = '#198754';
        }
    });
});

const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('blur', (e) => {
        if (e.target.value && !validatePhone(e.target.value)) {
            e.target.style.borderColor = '#DC3545';
        } else if (e.target.value) {
            e.target.style.borderColor = '#198754';
        }
    });
});

// ===== CONSOLE BRANDING =====
console.log('%c🛫 EazyViza - Australian Visa Made Easy', 'font-size: 20px; font-weight: bold; color: #0F5132;');
console.log('%cBuilt for high conversion rates and optimal user experience', 'font-size: 12px; color: #6C757D;');