import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Express, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Security configuration
const SECURITY_CONFIG = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },
  
  strictRateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
      error: 'Too many attempts, please try again later.',
      code: 'STRICT_RATE_LIMIT_EXCEEDED'
    }
  },
  
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://amaniaxportfolio.netlify.app']
      : ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://*.sentry.io',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
      ],
      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com',
        'data:',
      ],
      imgSrc: [
        "'self'",
        'data:',
        'https:',
        'blob:',
      ],
      connectSrc: [
        "'self'",
        'https://www.google-analytics.com',
        'https://*.sentry.io',
        'https://api.netlify.com',
      ],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
};

// Input validation schemas
const contactFormSchema = z.object({
  name: z.string().min(2).max(50).regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email().max(100),
  subject: z.string().min(5).max(100),
  message: z.string().min(10).max(1000),
});

// Input sanitization
const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeString = (str: string): string => {
    return str
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .trim();
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    } else if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  next();
};

// Validation middleware
export const validateContactForm = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = contactFormSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input data',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

export const configureSecurity = (app: Express) => {
  // Enhanced helmet configuration with CSP
  app.use(helmet({
    contentSecurityPolicy: SECURITY_CONFIG.csp,
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    frameguard: { action: "deny" },
    xssFilter: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  }));

  // Input sanitization
  app.use(sanitizeInput);

  // Rate limiting
  const generalLimiter = rateLimit(SECURITY_CONFIG.rateLimit);
  const strictLimiter = rateLimit(SECURITY_CONFIG.strictRateLimit);

  app.use('/api/', generalLimiter);
  app.use('/api/contact', strictLimiter);

  // CORS configuration
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (SECURITY_CONFIG.cors.origin.includes(origin as string)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  // Request size limit
  app.use((req, res, next) => {
    const maxSize = 1024 * 1024; // 1MB
    let receivedSize = 0;
    
    req.on('data', (chunk) => {
      receivedSize += chunk.length;
      if (receivedSize > maxSize) {
        res.status(413).json({
          success: false,
          message: 'Request entity too large',
        });
        req.connection.destroy();
      }
    });
    
    next();
  });

  // Request logging with security context
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - UA: ${userAgent}`);
    next();
  });
};

export { contactFormSchema }; 