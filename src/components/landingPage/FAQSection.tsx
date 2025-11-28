"use client";

import { type ReactNode, useState } from "react";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs: { question: string; answer: ReactNode }[] = [
    {
      question:
        "Where does my chat history get stored and can anyone see my chat history?",
      answer: (
        <>
          No. Your chats are stored in nilDB, a decentralised set of nodes, run
          by distinct entities, where data can be secret-shared and stored under
          Multi-Party Computation (MPC). The MPC storage ensures that no single
          node can reconstruct the data; each only holds a meaningless share of
          the conversation. Even if multiple nodes are compromised, the
          cryptographic properties ensure data remains protected. If one (or
          more) nodes are fully exposed, no user conversations are made public.
          A user’s chats are only ever reconstructed when the user is logged
          into the app.
          <br />
          <br />
          You can read more about the architecture of nilDB{" "}
          <a
            href="https://x.com/davtbutler/status/1950546294574825755"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            here
          </a>
          .
        </>
      ),
    },
    {
      question:
        "What’s the difference between nilGPT and other private AI providers?",
      answer:
        "nilGPT offers provable privacy, not just promises. Many other providers rely on trust-based policies or opaque encryption claims, nilGPT runs inference inside a Trusted Execution Environment (TEE) using nilAI and stores chats in nilDB, a decentralised MPC-secured database.",
    },
    {
      question: "What AI models are used in nilGPT?",
      answer:
        "Currently the gpt-oss-20b and gemma-3-27b-it models are used in nilGPT, however we are continuously evaluating which models provide the best accuracy and latency.",
    },
    {
      question: "Is my data used to train the models?",
      answer:
        "No. Your data is not used to train nilGPT’s models. Your data is only visible to you in the frontend of the app and is always stored under MPC across nilDB nodes.",
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
