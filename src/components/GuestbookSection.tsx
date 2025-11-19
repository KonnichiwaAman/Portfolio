import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, User, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const guestbookSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters').max(500, 'Message must be less than 500 characters'),
});

type GuestbookForm = z.infer<typeof guestbookSchema>;

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  email?: string;
}

const GuestbookSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<GuestbookForm>({
    resolver: zodResolver(guestbookSchema),
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Load entries from localStorage
    const savedEntries = localStorage.getItem('guestbookEntries');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error('Failed to load guestbook entries:', error);
      }
    }

    return () => observer.disconnect();
  }, []);

  const onSubmit = async (data: GuestbookForm) => {
    setIsSubmitting(true);
    try {
      const newEntry: GuestbookEntry = {
        id: Date.now().toString(),
        name: data.name,
        message: data.message,
        email: data.email,
        timestamp: new Date().toISOString(),
      };

      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      localStorage.setItem('guestbookEntries', JSON.stringify(updatedEntries));

      toast({
        title: 'Thank you!',
        description: 'Your message has been added to the guestbook.',
      });

      reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit your message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };


  return (
    <section id="guestbook" ref={sectionRef} className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 ${isVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-20">
            <h2 className="section-heading">
              <MessageSquare className="inline-block mr-3 mb-1" size={40} />
              Guestbook
            </h2>
            <div className="section-divider" aria-hidden="true"></div>
            <p className="section-description">
              Leave a message and let me know you were here!
            </p>
          </div>
          
          {/* Sign the Guestbook Form */}
          <Card className="glass-effect mb-12 professional-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Sign the Guestbook</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                      <User size={16} />
                      Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      {...register('name')}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                      <Mail size={16} />
                      Email <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register('email')}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare size={16} />
                    Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Leave your message here... (10-500 characters)"
                    rows={4}
                    {...register('message')}
                    className={errors.message ? 'border-destructive' : ''}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? 'Submitting...' : 'Sign Guestbook'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Guestbook Entries */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center mb-8">
              Recent Messages ({entries.length})
            </h3>
            
            {entries.length === 0 ? (
              <Card className="glass-effect text-center p-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-muted-foreground text-lg">
                  No messages yet. Be the first to sign the guestbook!
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {entries.map((entry) => (
                  <Card key={entry.id} className="glass-effect hover:bg-card/60 transition-all professional-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <User size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{entry.name}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(entry.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-foreground/90 leading-relaxed ml-13">
                        {entry.message}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuestbookSection;
