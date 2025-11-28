"use client";

import { type ReactNode, useState } from "react";

const NiliaFAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs: { question: string; answer: ReactNode }[] = [
    {
      question: "How does nilGPT keep my conversations private?",
      answer:
        "Everything runs inside an isolated environment that no one — including us — can access. Only you can view your own conversations.",
    },
    {
      question: "Is my data ever stored or used for training?",
      answer:
        "Never. nilGPT is built so your thoughts never become part of any dataset, model, or log.",
    },
    {
      question: "What makes nilGPT different from other AI assistants?",
      answer:
        "nilGPT is the only AI experience designed around emotional safety + absolute privacy. No tracking. No logging. No selling your data. Just a safe space to think, learn, and breathe.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-transparent px-4">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl lg:text-6xl font-normal text-black dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 dark:border-white/20 last:border-b-0"
            >
              <button
                className="w-full py-6 text-left hover:opacity-70 transition-opacity flex justify-between items-center"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <h3 className="font-display text-2xl font-normal text-black dark:text-white pr-8">
                  {faq.question}
                </h3>
                <div
                  className={`flex-shrink-0 transform transition-transform ${
                    openFAQ === index ? "rotate-45" : ""
                  }`}
                >
                  <span className="text-gray-600 dark:text-white dark:text-opacity-70 text-3xl font-light">
                    +
                  </span>
                </div>
              </button>
              {openFAQ === index && (
                <div className="pb-6 text-gray-600 dark:text-white dark:text-opacity-70 text-lg leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NiliaFAQSection;
