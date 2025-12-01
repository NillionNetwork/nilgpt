"use client";

/* eslint-disable react/no-unescaped-entities */

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ContentPolicy() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="relative z-50 bg-cream-50/80 backdrop-blur-sm border-b-4 border-navy-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="font-display font-black text-2xl text-navy-900">
              nilGPT
            </div>

            <Link
              href="/"
              className="bg-navy-900 text-cream-50 px-4 md:px-6 py-2 md:py-3 font-bold brutalist-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 rounded-lg text-sm md:text-base flex items-center gap-2 dark:hidden"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="font-display font-black text-4xl lg:text-6xl text-navy-900">
              Content Policy
            </h1>
            <p className="text-lg text-navy-600">Last updated: 17 July 2025</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white border-4 border-navy-900 brutalist-shadow p-8 space-y-8">
              <section>
                <p className="text-navy-700 leading-relaxed mb-4">
                  Our Content Policy is intended to promote the safe and
                  responsible use of nilGPT products and services, application
                  programming interfaces ("APIs"), software, or other materials
                  ("nilGPT Technology"). Our technology is created for use by
                  adults, and as such, you must be 18 years of age to use nilGPT
                  Technology.
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  If you access, use, or distribute any nilGPT Technology, you
                  agree to this Acceptable Use Policy ("Policy"). This includes
                  non-commercial, research, and commercial uses of nilGPT AI
                  Technology. If we learn that you have violated this Policy, we
                  may suspend or terminate your access to our products and
                  services.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  We Prohibit Violations of Law or Others' Rights
                </h2>
                <p className="text-navy-700 leading-relaxed mb-4">
                  This includes using nilGPT Technology to facilitate:
                </p>
                <ul className="list-disc list-inside text-navy-700 space-y-2 mb-4">
                  <li>
                    violations of law or others' rights, including intellectual
                    property and privacy rights.
                  </li>
                  <li>
                    using subliminal, manipulative, or deceptive techniques that
                    can distort a person's ability to make informed decisions
                    and is likely to cause harm.
                  </li>
                  <li>
                    exploiting vulnerabilities due to age, disability, or
                    socio-economic situations.
                  </li>
                  <li>
                    evaluating or classifying persons based on their social
                    behavior, personal characteristics, or the use of social
                    scoring leading to detrimental or unfavorable treatment.
                  </li>
                  <li>
                    assessing or predicting the risk of a person committing a
                    crime, based solely on profiling or personal traits.
                  </li>
                  <li>
                    creating or expanding facial recognition databases without
                    consent.
                  </li>
                  <li>
                    inferring emotions in the workplace or education
                    institution, except for medical or safety reasons.
                  </li>
                  <li>
                    categorizing people based on their biometric data to infer
                    their race, political opinion, trade union membership,
                    religious or philosophical beliefs, sex life or sexual
                    orientation.
                  </li>
                  <li>
                    using real-time biometric identification systems in public
                    spaces for law enforcement purposes.
                  </li>
                  <li>sharing of personal information without consent.</li>
                  <li>
                    provision of advice on essential services, including in the
                    medical or health field, without review by a qualified
                    professional and disclosure of the use of AI assistance and
                    its potential limitations.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  We Prohibit Harm to or Exploitation against Children
                </h2>
                <p className="text-navy-700 leading-relaxed mb-4">
                  This includes using nilGPT Technology to facilitate:
                </p>
                <ul className="list-disc list-inside text-navy-700 space-y-2 mb-4">
                  <li>
                    child sexual abuse material (CSAM), sexual exploitation,
                    grooming, or trafficking of minors.
                  </li>
                  <li>
                    exploiting or abusing minors, including sextortion or any
                    impersonation or enticement of minors for exploitative
                    purposes.
                  </li>
                  <li>
                    pedophilic behavior, such as through suggestive depictions
                    of minors.
                  </li>
                </ul>
                <p className="text-navy-700 leading-relaxed mb-4">
                  <strong>
                    We will report CSAM to the appropriate authorities.
                  </strong>
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  We Prohibit Sexually Explicit Content
                </h2>
                <p className="text-navy-700 leading-relaxed mb-4">
                  This includes using nilGPT Technology to facilitate:
                </p>
                <ul className="list-disc list-inside text-navy-700 space-y-2 mb-4">
                  <li>non-consensual intimate imagery (NCII).</li>
                  <li>illegal pornographic content.</li>
                  <li>
                    content relating to sexual intercourse, sexual acts, or
                    sexual violence.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  We Prohibit Emotional or Physical Harm to Others or Self
                </h2>
                <p className="text-navy-700 leading-relaxed mb-4">
                  This includes using nilGPT Technology to facilitate:
                </p>
                <ul className="list-disc list-inside text-navy-700 space-y-2 mb-4">
                  <li>
                    encouragement or instructions related to self harm or harm
                    to others.
                  </li>
                  <li>
                    discrimination, threats, or promotion of violence or hateful
                    content based on protected attributes.
                  </li>
                  <li>
                    support for organizations or individuals associated with
                    terrorism or hate.
                  </li>
                  <li>
                    content relating to human trafficking or exploitation.
                  </li>
                  <li>
                    extreme gore, such as content involving bodily destruction,
                    mutilation, torture or animal abuse.
                  </li>
                  <li>
                    the development or manufacturing of any illegal or regulated
                    weapons.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  We Prohibit Circumvention of Our Safeguards
                </h2>
                <p className="text-navy-700 leading-relaxed mb-4">
                  This includes facilitating any of the following:
                </p>
                <ul className="list-disc list-inside text-navy-700 space-y-2 mb-4">
                  <li>
                    intentional bypassing of product safeguards or restrictions
                    established within nilGPT Technology.
                  </li>
                  <li>
                    intentional bypassing of an account ban, such as by creating
                    new accounts.
                  </li>
                  <li>
                    malicious code, malware, computer viruses, or any activity
                    that could interfere with the integrity of a website or
                    system.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  We Prohibit Deceiving or Misleading Others
                </h2>
                <p className="text-navy-700 leading-relaxed mb-4">
                  This includes using nilGPT Technology to facilitate:
                </p>
                <ul className="list-disc list-inside text-navy-700 space-y-2 mb-4">
                  <li>misinformation or disinformation.</li>
                  <li>
                    impersonation of others without consent or legal right,
                    including defamatory content.
                  </li>
                  <li>
                    misleading end users about the nature of outputs from nilGPT
                    AI Technology (such as pretending it was made by a human) or
                    failing to appropriately disclose when someone is
                    interacting with AI where it is not apparent.
                  </li>
                  <li>
                    content that may disrupt democratic or judicial processes,
                    including content that discourages participation in
                    elections.
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
