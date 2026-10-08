"use client";

import { type ReactNode, useState } from "react";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs: { question: string; answer: ReactNode }[] = [
    {
      question:
        "Where does my chat history get stored and can anyone see my chat history?",
      answer:
        "No. Your chats are stored only on your device, in your browser, and are encrypted with your passphrase before they are saved. Your passphrase never leaves your device, so nobody else, including Nillion, can read your chat history. Because chats live on your device, they don't sync between devices or browsers, and clearing your browser's site data deletes them.",
    },
    {
      question:
        "What’s the difference between nilGPT and other private AI providers?",
      answer:
        "nilGPT offers provable privacy, not just promises. Many other providers rely on trust-based policies or opaque encryption claims, nilGPT runs inference inside a Trusted Execution Environment (TEE) using nilAI, and your chats are encrypted with your passphrase and stored only on your device.",
    },
    {
      question: "What AI models are used in nilGPT?",
      answer:
        "Currently the google/gemma-4-26B-A4B-it model is used in nilGPT, however we are continuously evaluating which models provide the best accuracy and latency.",
    },
    {
      question: "Is my data used to train the models?",
      answer:
        "No. Your data is not used to train nilGPT’s models. Your data is only visible to you in the app, and your chats are stored encrypted on your device.",
    },
    {
      question: "Can the AI model see the questions I ask?",
      answer:
        "No. The AI model itself cannot see your questions. When you use nilGPT, your prompts are processed inside a secure hardware-protected environment (a Trusted Execution Environment, or TEE) via nilAI. This means your input is never exposed to the host system, operators, or any external observer. The model runs entirely within this private enclave, and only you ever see the input and output.",
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
                  <span className="text-gray-600 dark:text-white dark:text-opacity-70	 text-3xl font-light">
                    +
                  </span>
                </div>
              </button>
              {openFAQ === index && (
                <div className="pb-6 text-gray-600 dark:text-white dark:text-opacity-70	 text-lg leading-relaxed">
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

export default FAQSection;
