import { useState } from 'react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  onOpenBookCall: () => void;
}

export default function FaqSection({ onOpenBookCall }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'What is the typical engagement timeline for a full commission?',
      answer:
        'A comprehensive brand architecture and interaction design project typically spans 8 to 14 weeks. We restrict our active client roster to a maximum of three concurrent projects to guarantee senior partner involvement at every keyframe.',
    },
    {
      id: 'faq-2',
      question: 'How does KINETIC structure project deliverables and source code?',
      answer:
        'All commissions include fully documented, production-ready code repositories, bespoke typography licenses, physical asset guidelines, and componentized design tokens. You retain 100% intellectual property ownership.',
    },
    {
      id: 'faq-3',
      question: 'Do you offer ongoing retainer partnerships after launch?',
      answer:
        'Yes. Following initial launch, we offer selective quarter-by-quarter retainers for continuous spatial refinement, design system maintenance, and strategic visual evolution.',
    },
    {
      id: 'faq-4',
      question: 'How are physical card scrolling and WebGL motion performance maintained on mobile?',
      answer:
        'Our animation engines are custom-engineered using hardware-accelerated CSS matrix transforms and requestAnimationFrame loops. On mobile devices, layout parameters automatically scale down touch inertia to ensure fluid 60 FPS performance without battery drain.',
    },
    {
      id: 'faq-5',
      question: 'What is required to initiate a project discussion?',
      answer:
        'Simply submit our commission inquiry form with high-level details regarding your scope, timeline, and goals. We will arrange a private 30-minute discovery consultation.',
    },
  ];

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="section-faq"
      className="relative w-full min-h-screen py-24 px-6 sm:px-16 bg-[#050505] flex flex-col justify-between space-y-20"
    >
      {/* FAQ Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="font-outfit text-3xl sm:text-5xl md:text-6xl font-light text-[#f3f3f3] tracking-tight">
          Frequently <span className="text-[#E6A800]">Asked Questions</span>
        </h2>
        <p className="font-inter text-base sm:text-lg text-[#9a9a9e] max-w-xl mx-auto leading-relaxed">
          Clear answers regarding our engagement methodology, timelines, and technical standards.
        </p>
      </div>

      {/* Editorial Accordion List */}
      <div className="max-w-4xl mx-auto w-full space-y-4 my-auto">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="border border-white/10 hover:border-white/20 rounded-2xl bg-[#0a0a0c] overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-6 sm:px-8 py-6 flex items-center justify-between text-left focus:outline-none cursor-pointer"
              >
                <span className="font-outfit text-lg sm:text-xl text-[#f3f3f3] font-light pr-4">
                  {faq.question}
                </span>
                {/* Subtle Expand Indicator - No heavy icons */}
                <span
                  className={`font-inter text-lg text-[#c5a880] transition-transform duration-300 transform ${
                    isOpen ? 'rotate-45' : 'rotate-0'
                  }`}
                >
                  +
                </span>
              </button>

              {/* Smooth Opening Animation */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100 pb-6 px-6 sm:px-8' : 'grid-rows-[0fr] opacity-0 px-6 sm:px-8'
                }`}
              >
                <div className="overflow-hidden font-inter text-sm sm:text-base text-[#9a9a9e] leading-relaxed border-t border-white/5 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
