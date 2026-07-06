import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ } from '../types';

interface FAQSectionProps {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={faq.id}
            className={`border border-slate-100 rounded-2xl bg-white transition-all duration-300 overflow-hidden ${
              isOpen ? 'shadow-md border-blue-200' : 'hover:border-slate-200 hover:shadow-xs'
            }`}
          >
            {/* Question Trigger */}
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-slate-800 text-sm md:text-base gap-4 cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="leading-tight">{faq.question}</span>
              </div>
              <div className={`p-1.5 rounded-lg bg-slate-50 transition-transform duration-300 ${isOpen ? 'bg-blue-50 text-blue-600 rotate-180' : 'text-slate-400'}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {/* Answer body (collapsible with transition) */}
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-60 border-t border-slate-100 p-5 bg-slate-50/50' : 'max-h-0'
              }`}
            >
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
