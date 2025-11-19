import { useState } from 'react';
import { ContactCard } from './ui/contact-card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { contactFormSchema, validateFormData, type ContactFormData } from '@/lib/validation';
import { motion } from 'framer-motion';

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const validateForm = () => {
    const result = validateFormData(contactFormSchema, formData);
    setErrors(result.errors);
    return result.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive"
      });
      setStatusMessage({ type: 'error', message: 'Please resolve the highlighted validation issues.' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      // Check if response is ok before parsing JSON
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error('Server response error');
      }
      
      if (result.success) {
        toast({
          title: "Message Sent Successfully! ✨",
          description: "Thank you for reaching out! I'll get back to you soon.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        setStatusMessage({ type: 'success', message: "Thank you for your message! I'll get back to you within 24 hours." });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Unable to Send Message",
        description: "Please try again later or email me directly at helloamanawasthi@gmail.com",
        variant: "destructive"
      });
      setStatusMessage({
        type: 'error',
        message: 'Unable to send message at the moment. Please try again later or contact me directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="contact" className="relative py-24 px-4 md:px-8 lg:px-12 cv-auto scroll-mt-28">
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="section-heading">
              Let's Connect
            </h2>
            <div className="section-divider" aria-hidden="true"></div>
            <p className="section-description">
              Ready to discuss your next project? Let's create something exceptional together.
            </p>
        </motion.div>
          
        <motion.div variants={itemVariants}>
          <ContactCard
            title="Get in Touch"
            description="Have a project in mind or want to collaborate? Fill out the form and I'll get back to you within 24 hours. Let's build something amazing together!"
            contactInfo={[
              {
                icon: Mail,
                label: 'Email',
                value: 'helloamanawasthi@gmail.com',
              },
              {
                icon: Phone,
                label: 'Phone',
                value: '+91 XXXXXXXXXX',
              },
              {
                icon: MapPin,
                label: 'Location',
                value: 'Dehradun, Uttarakhand, India',
                className: 'col-span-2',
              }
            ]}
            className="professional-shadow"
          >
            {statusMessage && statusMessage.type === 'success' && (
              <div
                role="status"
                aria-live="polite"
                className="mb-4 rounded-lg border px-4 py-3 text-sm border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
              >
                {statusMessage.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={errors.name ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                />
                {errors.name && (
                  <p id="contact-name-error" className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={errors.email ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                />
                {errors.email && (
                  <p id="contact-email-error" className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-subject">Subject</Label>
                <Input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className={errors.subject ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                />
                {errors.subject && (
                  <p id="contact-subject-error" className="text-red-500 text-xs">{errors.subject}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className={errors.message ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                />
                {errors.message && (
                  <p id="contact-message-error" className="text-red-500 text-xs">{errors.message}</p>
                )}
              </div>
              <Button 
                className="w-full group" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </ContactCard>
        </motion.div>
      </motion.div>

    </section>
  );
};

export default Contact;
