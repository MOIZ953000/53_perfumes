import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
      }, 500);
    }
  };

  return (
    <section className="py-20 sm:py-24 theme-bg-card border-t theme-border relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full theme-bg-secondary border theme-border-gold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#87692A]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#87692A] font-bold font-serif">
            Private Gazette
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold theme-text-primary tracking-tight">
          Stay in the <span className="italic font-normal text-[#87692A]">Collection</span>
        </h2>

        <p className="theme-text-secondary text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed">
          Receive confidential allocations of vintage Dehenal Oud harvests, royal seasonal coffrets, and Jazeera Airways in-flight updates.
        </p>

        {submitted ? (
          <div className="p-6 rounded-xs theme-bg-secondary border theme-border-gold max-w-md mx-auto flex items-center justify-center space-x-3 theme-text-primary animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-[#87692A]" />
            <span className="font-serif text-xs uppercase tracking-wider font-semibold">
              You are now enrolled in the Treppan Private Gazette.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full theme-bg-primary border theme-border focus:border-[#87692A] px-4 py-3.5 pl-10 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-hidden rounded-xs transition-colors font-sans"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              className="px-7 py-3.5 bg-[#141416] hover:bg-[#87692A] text-white text-xs font-serif uppercase tracking-[0.2em] font-semibold transition-all duration-300 rounded-xs shadow-md flex items-center justify-center space-x-2 group flex-shrink-0"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#DFC27D] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        )}

        <p className="text-[10px] theme-text-muted font-sans tracking-wider">
          By enrolling, you accept receipt of occasional royal releases. Unsubscribe anytime.
        </p>

      </div>
    </section>
  );
};
