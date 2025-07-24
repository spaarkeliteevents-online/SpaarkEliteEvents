import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { faqAPI, FAQ } from '../lib/api';

const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="py-20 min-h-screen bg-white" aria-label="FAQ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 reveal animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-black" style={{ fontFamily: 'Playfair Display, Inter, Arial, sans-serif' }}>
            SPAARK ELITE EVENTS
          </h1>
          <p className="text-2xl md:text-3xl italic mb-8 text-black" style={{ fontFamily: 'Playfair Display, Inter, Arial, sans-serif' }}>
            Luxury. Celebration. Perfection.
          </p>
          <h2 className="text-3xl md:text-4xl mb-8 font-light dark-blue-hero-text">
            Where Your Vision Becomes a Masterpiece
          </h2>
          <p className="text-xl mb-12 leading-relaxed max-w-3xl mx-auto dark-blue-hero-text">
            Welcome to Spaark Elite Events, your trusted partner in crafting unforgettable moments. 
            We specialize in designing and executing luxury events that reflect your style, story, and dreams.
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:spaarkeliteevents@gmail.com"
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
        </div>
      </div>
    </div>
  );
};

export default FAQPage;