// EmailJS Configuration
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

// Initialize EmailJS
if (PUBLIC_KEY) {
    emailjs.init(PUBLIC_KEY);
}

export const sendOTPEmail = async (toEmail, toName, otp) => {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        throw new Error('EmailJS configuration is missing. Please check your .env file.');
    }

    // Calculate expiry time (15 minutes from now)
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 15);
    
    // Format time in a readable format (e.g., "Jan 24, 2026, 3:45 PM")
    const formattedTime = expiryTime.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    const templateParams = {
        to_name: toName || 'User',
        otp: otp,
        passcode: otp, // Template uses {{passcode}}
        time: formattedTime, // Template uses {{time}} for expiry
        to_email: toEmail,
        email: toEmail, // Support both {{to_email}} and {{email}} template variables
    };

    try {
        // Public key is already initialized via emailjs.init() above
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams
        );
        return response;
    } catch (error) {
        console.error('EmailJS Error:', error);
        throw new Error('Failed to send OTP email. Please try again.');
    }
};

export { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY };
