import emailjs from 'emailjs-com';

// Initialize EmailJS with your public API key
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';

if (EMAILJS_PUBLIC_KEY && SERVICE_ID && TEMPLATE_ID) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export const sendVerificationEmail = async (email: string, confirmationCode: string): Promise<boolean> => {
  try {
    if (!EMAILJS_PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
      console.warn('EmailJS credentials not configured. Skipping email.');
      return false;
    }

    const templateParams = {
      to_email: email,
      user_email: email,
      confirmation_code: confirmationCode,
      subject: 'BISB Lost & Found - Email Verification',
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
};
