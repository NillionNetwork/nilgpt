"use client";

import Image from "next/image";

const testimonial = {
  name: "Tina",
  persona: "The Confider, uses nilGPT",
  initial: "T",
  img: "/img/testimonials/tina.png",
  quote:
    "I finally have a place to be honest about everything — school stress, relationships, career fears — without feeling watched or judged.",
  description:
    "Tina uses nilGPT to work through personal struggles and everyday life decisions. With nilGPT, she finally gets judgment-free clarity — without her thoughts being saved, analyzed, or turned into fuel for advertisements.",
  bulletPoints: [
    "Built for women who value boundaries",
    "Nothing saved, nothing shared",
    "A safe space for vulnerable moments",
  ],
};

const NiliaTestimonialSection = () => {
  return (
    <section className="py-20 bg-[#1b1b1b]" id="testimonials">
      <h2 className="font-display text-5xl lg:text-6xl font-normal text-white text-center mb-10">
        nilGPT is for everyone.
      </h2>
      <div className="max-w-8xl mx-auto px-8 md:px-48">
        <div className="bg-black rounded-3xl p-12 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-start relative">
            <div className="flex flex-col space-y-8">
              {/* Person info - shown first on mobile, after quote on desktop */}
              <div className="flex items-center gap-4 order-1 lg:order-2">
                <div className="w-12 h-12 bg-transparent border-[2.5px] border-[#FFC971] dark:border-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Image
                    src={testimonial.img}
                    alt={`${testimonial.name} profile picture`}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
                <div className="font-medium text-white text-xl md:text-2xl">
                  <span className="text-[#FFC971] dark:text-white">
                    {testimonial.name}
                  </span>
                  <span className="text-white/70">, The Confider, </span>
                  <span className="inline-flex items-center gap-1 text-white/70">
                    {" "}
                    uses
                    <Image
                      src="/img/reskin_logo.svg"
                      alt="nilGPT Logo"
                      width={20}
                      height={20}
                      className="inline"
                    />{" "}
                    nilGPT
                  </span>
                </div>
              </div>

              {/* Quote - shown after person on mobile, first on desktop */}
              <blockquote className="text-3xl lg:text-3xl font-normal text-white leading-relaxed py-10 order-2 lg:order-1">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
            </div>

            {/* Vertical divider */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-600 transform -translate-x-1/2"></div>

            <div className="flex flex-col justify-center items-start h-full px-0 lg:px-10 mt-8 lg:mt-0">
              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-white mb-4">
                  Why she loves it:
                </h3>
                <p className="text-gray-300 text-xl leading-relaxed mb-6">
                  {testimonial.description}
                </p>
                <ul className="space-y-3">
                  {testimonial.bulletPoints.map((point, idx) => (
                    <li
                      key={idx}
                      className="text-gray-300 text-xl flex items-start gap-3"
                    >
                      <Image
                        src="/img/white_logo.svg"
                        alt="nilGPT Logo"
                        width={16}
                        height={16}
                        className="mt-1.5 flex-shrink-0"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NiliaTestimonialSection;
