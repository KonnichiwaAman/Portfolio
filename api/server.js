import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { z } from 'zod';
import { Resend } from 'resend';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://amaniaxportfolio.netlify.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Reject non-JSON payloads for state-changing routes
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      return res.status(415).json({
        success: false,
        message: 'Unsupported Media Type. Please use application/json requests.'
      });
    }
  }
  next();
});

// Rate limiting
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again later.'
  }
});

const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
});

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject must be less than 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

// Input sanitization
const sanitizeInput = (text) => {
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Contact form endpoint
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    // Validate input
    const validationResult = contactSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    const { name, email, subject, message } = validationResult.data;
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: email.toLowerCase().trim(),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
    };

    // Log submission for monitoring
    console.log('Contact form submission:', {
      ...sanitizedData,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Send email using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        // Send notification to yourself
        await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>', // Use your verified domain
          to: process.env.CONTACT_EMAIL || 'your-email@example.com',
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
            <p>I've received your message and will get back to you within 24 hours.</p>
            <h3>Your message:</h3>
            <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
            <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
            <p>Best regards,<br>Your Name</p>
          `,
        });

        console.log('✅ Emails sent successfully');
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        // Continue even if email fails - don't expose the error to client
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY not configured - email not sent');
    }
    
    res.status(200).json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you within 24 hours.',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
});

// Analytics endpoint
app.post('/api/analytics', analyticsLimiter, (req, res) => {
  const { event, page, timestamp } = req.body;
  
  console.log('Analytics event:', {
    event,
    page,
    timestamp: timestamp || new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.status(200).json({ success: true });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 API server running on port ${PORT}`);
    console.log(`📧 Contact endpoint: http://localhost:${PORT}/api/contact`);
    console.log(`📊 Analytics endpoint: http://localhost:${PORT}/api/analytics`);
    console.log(`🔑 Resend configured: ${process.env.RESEND_API_KEY ? 'Yes' : 'No'}`);
  });
}

export default app;