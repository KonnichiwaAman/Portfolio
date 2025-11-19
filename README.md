# 🚀 Aman Awasthi - Full Stack Developer Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/amaniaxportfolio/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Performance: A+](https://img.shields.io/badge/Performance-A+-green.svg)](https://web.dev/measure/)
[![Accessibility: 100](https://img.shields.io/badge/Accessibility-100-brightgreen.svg)](https://web.dev/accessibility/)

A modern, high-performance portfolio website built with React, TypeScript, and cutting-edge web technologies. Features real-time analytics, comprehensive SEO optimization, and enterprise-grade security.

## 🌟 **Live Demo**

**🔗 [View Portfolio](https://amaniaxportfolio.netlify.app)**

## ✨ **Key Features**

### 🎨 **User Experience**
- **Responsive Design**: Mobile-first approach with seamless cross-device experience
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Progressive Loading**: Skeleton loaders and optimized image loading
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation

### 🚀 **Performance & Optimization**
- **Core Web Vitals**: Optimized for Google's performance metrics
- **Bundle Splitting**: Intelligent code splitting with lazy loading
- **Image Optimization**: WebP/AVIF support with responsive images
- **Compression**: Brotli and Gzip compression for faster loading
- **Caching Strategy**: Service worker implementation for offline support

### 🔒 **Security & Reliability**
- **Security Headers**: Comprehensive CSP, HSTS, and XSS protection
- **Input Validation**: Zod-powered schema validation
- **Rate Limiting**: Advanced rate limiting for API endpoints
- **Error Boundaries**: Graceful error handling with user-friendly fallbacks
- **Request Sanitization**: XSS and injection attack prevention

### 📊 **Analytics & Monitoring**
- **Google Analytics 4**: Enhanced e-commerce and engagement tracking
- **Performance Monitoring**: Real-time Core Web Vitals tracking
- **Error Tracking**: Comprehensive error logging and reporting
- **User Behavior**: Scroll depth, time on page, and interaction tracking

### 🛠 **Developer Experience**
- **TypeScript**: Full type safety throughout the codebase
- **ESLint + Prettier**: Consistent code formatting and quality
- **Comprehensive Testing**: Unit, integration, and E2E test suites
- **CI/CD Pipeline**: Automated testing and deployment workflows
- **Component Library**: Reusable UI components with Storybook documentation

## 🏗 **Tech Stack**

### **Frontend**
- **Framework**: React 18 with TypeScript 5.8
- **Build Tool**: Vite 5 for lightning-fast development
- **Styling**: Tailwind CSS 3.4 with shadcn/ui components
- **Animations**: Framer Motion for smooth interactions
- **State Management**: React Query for server state
- **Form Handling**: React Hook Form with Zod validation

### **Backend & API**
- **Runtime**: Node.js with Express.js
- **Validation**: Zod schema validation
- **Security**: Helmet.js, rate limiting, CORS configuration
- **Email Service**: Integration ready for SendGrid/Mailgun

### **DevOps & Deployment**
- **Hosting**: Netlify with CDN optimization
- **Analytics**: Google Analytics 4, Google Tag Manager
- **Monitoring**: Custom performance and error tracking
- **Security**: CSP headers, HTTPS enforcement

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- Git for version control

### **Installation**

```bash
# Clone the repository
git clone https://github.com/aman-awasthi/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Start API server (in separate terminal)
npm run api:dev
```

### **Development Scripts**

```bash
# Development
npm run dev          # Start Vite dev server
npm run api:dev      # Start Express API server

# Testing
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Build & Deploy
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📁 **Project Structure**

```
portfolio/
├── api/                    # Express.js API server
│   └── server.js          # Main API server file
├── public/                # Static assets
│   ├── images/           # Optimized images
│   ├── manifest.json     # PWA manifest
│   └── robots.txt        # SEO robots file
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── __tests__/   # Component tests
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── middleware/      # Security middleware
│   ├── pages/           # Page components
│   └── styles/          # Global styles
├── tests/               # Test configuration
└── docs/               # Documentation
```

## 🔧 **Configuration**

### **Environment Variables**

Create a `.env` file in the root directory:

```env
# Analytics
VITE_GA_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX

# API Configuration
VITE_API_URL=http://localhost:3001

# Contact Form (Backend)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
ALLOWED_ORIGINS=https://your-domain.com,http://localhost:8080
```

### **Customization**

1. **Personal Information**: Update `src/data/personal.ts`
2. **Projects**: Modify `src/data/projects.ts`
3. **Skills**: Edit `src/data/skills.ts`
4. **Theme Colors**: Adjust `tailwind.config.ts`
5. **SEO Data**: Update `src/components/SEO.tsx`

## 📊 **Performance Metrics**

- **Lighthouse Score**: 98+ Performance, 100 Accessibility, 100 Best Practices, 100 SEO
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🧪 **Testing**

### **Unit Tests**
```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### **E2E Tests**
```bash
npx cypress open        # Open Cypress UI
npx cypress run         # Run headless tests
```

## 🚀 **Deployment**

### **Netlify (Recommended)**

1. **Connect Repository**: Link your GitHub repo to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables**: Add your environment variables in Netlify dashboard
4. **Custom Domain**: Configure your custom domain in Netlify settings

### **Manual Deployment**

```bash
# Build for production
npm run build

# Deploy to your hosting provider
# Upload the 'dist' folder contents
```

### **Environment-Specific Builds**

```bash
npm run build:dev       # Development build with debugging
npm run build           # Production build (optimized)
```

## 🔐 **Security Features**

- **Content Security Policy**: Prevents XSS and code injection
- **HTTPS Enforcement**: All traffic redirected to HTTPS
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Secure error responses without data leakage

## 🎯 **SEO Optimization**

- **Meta Tags**: Comprehensive Open Graph and Twitter Cards
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: Automatically generated XML sitemap
- **Robots.txt**: Search engine crawling instructions
- **Canonical URLs**: Prevent duplicate content issues

## 🤝 **Contributing**

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Design Inspiration**: Modern portfolio trends and best practices
- **Icons**: Lucide React and React Icons
- **UI Components**: shadcn/ui component library
- **Animations**: Framer Motion community examples
- **Performance**: Web.dev optimization guidelines

## 📞 **Contact**

**Aman Awasthi** - Full Stack Developer

- **Email**: [aman.awasthi.dev@gmail.com](mailto:aman.awasthi.dev@gmail.com)
- **LinkedIn**: [linkedin.com/in/aman-awasthi-dev](https://linkedin.com/in/aman-awasthi-dev)
- **GitHub**: [github.com/aman-awasthi](https://github.com/aman-awasthi)
- **Portfolio**: [amaniaxportfolio.netlify.app](https://amaniaxportfolio.netlify.app)

---

⭐ **If you found this project helpful, please give it a star!** ⭐
