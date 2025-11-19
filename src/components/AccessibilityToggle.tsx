import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';

const STORAGE_KEY = 'reduce-motion-enabled';

const AccessibilityToggle = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const isEnabled = stored === 'true';
    if (isEnabled) {
      document.documentElement.classList.add('reduce-motion');
      setEnabled(true);
    }
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    document.documentElement.classList.toggle('reduce-motion', next);
    // Inform listeners that motion preference changed
    window.dispatchEvent(new CustomEvent('reduced-motion-changed', { detail: { enabled: next } }));
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button variant="outline" size="sm" onClick={toggle} className="glass-effect">
        {enabled ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
        {enabled ? 'Enable Animations' : 'Pause Animations'}
      </Button>
    </div>
  );
};

export default AccessibilityToggle;
