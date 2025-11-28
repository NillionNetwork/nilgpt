"use client";

import Image from "next/image";
import { useState } from "react";

const testimonials = [
  {
    name: "Amy, ",
    persona: "the Confider",
    initial: "A",
    img: "/img/testimonials/amy.png",
    quote: "I talk to nilGPT about things I wouldn’t tell my best friend.",
    description:
      "Amy uses AI to work through personal struggles, emotional trauma, and relationship issues. With NilGPT, she finally gets judgment-free advice—without her thoughts being stored, analyzed, or logged.",
  },
  {
    name: "Tina, ",
    persona: "the High Performer",
    initial: "T",
    img: "/img/testimonials/tina.png",
    quote: "I use nilGPT to supercharge my productivity on sensitive work.",
    description:
      "Tina’s job involves time consuming analysis of sensitive legal documents. nilGPT supercharges her productivity by automating basic analysis and repetitive work where previously she was not able to use AI due to company policy.",
  },
  {
    name: "Zayn, ",
    persona: "the Lover of Life",
    initial: "Z",
    img: "/img/testimonials/zayn.png",
    quote: "nilGPT is always there to talk to, laugh with or just hang out.",
    description:
      "Zayn’s life is packed - meetings, workouts, late-night flights. But it’s not always full of people. With nilGPT, he has a private, always-on companion to chat with. No soul-searching, just real moments when you want company without the noise.",
  },
];

const TestimonialSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const currentTestimonial = testimonials[currentSlide];

  return (
    <section className="py-20 bg-[#1b1b1b]" id="testimonials">
      <h2 className="font-display text-5xl lg:text-6xl font-normal text-white text-center mb-10">
        nilGPT is for everyone.
      </h2>
      <div className="max-w-8xl mx-auto px-8 md:px-48">
        <div className="bg-black rounded-3xl p-12 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-start relative">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-transparent border-[2.5px] border-[#FFC971] dark:border-white rounded-full flex items-center justify-center">
                  <Image
                    src={currentTestimonial.img}
                    alt={`${currentTestimonial.name} profile picture`}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
                <div className="font-medium text-white text-xl md:text-2xl">
                  <span className="text-[#FFC971] dark:text-white">
                    {currentTestimonial.name}
                  </span>
                  {currentTestimonial.persona}
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-normal text-white">
                Uses nilGPT
              </h2>

              <blockquote className="text-3xl lg:text-3xl font-normal text-white leading-relaxed py-10">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </blockquote>

              {/* Navigation arrows */}
              <div className="flex items-center gap-4">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 border-[2px] border-[#FFC971] dark:border-white rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 border-[2px] border-[#FFC971] dark:border-white rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Vertical divider */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-600 transform -translate-x-1/2"></div>

            <div className="hidden lg:flex flex-col justify-center items-center h-full px-10">
              <div className="space-y-6">
                <p className="text-gray-300 text-xl leading-relaxed space-y-4">
                  {currentTestimonial.description
                    .split(". ")
                    .map((sentence, idx, arr) => (
                      <span className="block" key={idx}>
                        {sentence}
                        {idx < arr.length - 1 ? "." : ""}
                      </span>
                    ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
