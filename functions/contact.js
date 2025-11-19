import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject must be less than 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

const sanitizeInput = (text) => {
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};

export const handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);

    // Validate input
    const validationResult = contactSchema.safeParse(body);
    
    if (!validationResult.success) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        }),
      };
    }

    const { name, email, subject, message } = validationResult.data;
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: email.toLowerCase().trim(),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
    };

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ success: false, message: 'Server configuration error' }),
      };
    }

    // Send notification to yourself
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Use your verified domain
      to: process.env.CONTACT_EMAIL || 'helloamanawasthi@gmail.com',
      replyTo: sanitizedData.email,
      subject: `Portfolio Contact: ${sanitizedData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${sanitizedData.name} (${sanitizedData.email})</p>
        <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Sent from your portfolio website at ${new Date().toLocaleString()}</small></p>
      `,
    });

    // Send confirmation to user
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>', // Use your verified domain
      to: sanitizedData.email,
      subject: 'Thanks for reaching out!',
      html: `
        <h2>Thank you for your message!</h2>
        <p>Hi ${sanitizedData.name},</p>
        <p>I've received your message regarding "${sanitizedData.subject}" and will get back to you as soon as possible.</p>
        <p>Best regards,<br>Aman Awasthi</p>
      `,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Message sent successfully' }),
    };

  } catch (error) {
    console.error('Contact form error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Failed to send message' }),
    };
  }
};
