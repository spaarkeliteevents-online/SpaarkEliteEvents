import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { faqAPI, FAQ } from '../lib/api';
import emailjs from '@emailjs/browser';

const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberName, setSubscriberName] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const subscribeFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
        const data = await faqAPI.getAll();
        setFaqs(data || []);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('Failed to load FAQs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    setSubscribeError(null);
    if (!subscribeFormRef.current) return;
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setSubscribeError('Email service is not configured. Please try again later.');
      setIsSubscribing(false);
      return;
    }
    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        subscribeFormRef.current,
        PUBLIC_KEY
      );
      setSubscribed(true);
      setSubscriberName('');
      setSubscriberEmail('');
    } catch (err) {
      setSubscribeError('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="py-20 min-h-screen bg-white" aria-label="FAQ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 reveal animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-700" style={{ fontFamily: 'Playfair Display, serif' }}>
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl mb-8 dark-blue-hero-text" style={{ fontFamily: 'Playfair Display, serif' }}>
            Everything You Need to Know
          </p>
          <p className="text-lg mb-12 leading-relaxed max-w-3xl mx-auto text-gray-600">
            Find answers to common questions about our services, planning process, and how we can help make your event extraordinary.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <p className="text-gray-400 mt-4">Loading FAQs...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-100 border border-red-300 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 futuristic-btn bg-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* No FAQs State */}
        {!isLoading && !error && faqs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No FAQs available at the moment.</p>
            <p className="text-gray-300 mt-2">Check back soon for more information!</p>
          </div>
        )}

        {/* FAQ Accordion - only show when data is loaded */}
        {!isLoading && !error && faqs.length > 0 && (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id || index}
              className="border border-cyan-200 rounded-lg overflow-hidden hover:border-cyan-500 transition-colors duration-300 bg-white shadow-md reveal animate-fade-in-up"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-cyan-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-cyan-700 pr-4">
                  {faq.question}
                </h3>
                {openFAQ === index ? (
                  <ChevronDown className="h-5 w-5 text-cyan-500 flex-shrink-0 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-cyan-500 flex-shrink-0 transition-transform duration-200" />
                )}
              </button>
              {openFAQ === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        )}

        {/* Still Have Questions Section */}
        <div className="mt-16 p-12 rounded-lg border border-cyan-200 text-center bg-white shadow-md reveal animate-fade-in-up">
          <h2 className="text-3xl font-bold text-cyan-700 mb-6">Still Have Questions?</h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            We're here to help! Contact us for personalized answers to your specific questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=spaarkeliteevents@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="futuristic-btn bg-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cyan-400 transition-all duration-300 hover:scale-105"
            >
              Email Us
            </a>
            <a
              href="https://wa.me/919391833475"
              target="_blank"
              rel="noopener noreferrer"
              className="futuristic-btn border-2 border-cyan-500 text-cyan-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:scale-105"
            >
              WhatsApp Chat
            </a>
          </div>
          {/* Subscribe Form */}
          <div className="mt-8">
            {subscribed ? (
              <div className="text-green-700 text-lg font-semibold py-4">Thank you for subscribing!</div>
            ) : (
              <form ref={subscribeFormRef} onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <input
                  type="text"
                  name="subscriber_name"
                  required
                  value={subscriberName}
                  onChange={e => setSubscriberName(e.target.value)}
                  className="modern-input text-lg px-4 py-2 rounded border border-cyan-300 focus:border-cyan-500"
                  placeholder="Enter your name"
                />
                <input
                  type="email"
                  name="subscriber_email"
                  required
                  value={subscriberEmail}
                  onChange={e => setSubscriberEmail(e.target.value)}
                  className="modern-input text-lg px-4 py-2 rounded border border-cyan-300 focus:border-cyan-500"
                  placeholder="Enter your Phone Number"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="futuristic-btn bg-green-500 text-white px-6 py-2 rounded-lg font-semibold text-lg hover:bg-green-400 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
            {subscribeError && (
              <div className="text-red-600 text-sm mt-2">{subscribeError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;