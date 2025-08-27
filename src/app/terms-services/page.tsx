"use client";

/* eslint-disable react/no-unescaped-entities */

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
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
              className="bg-navy-900 text-cream-50 px-4 md:px-6 py-2 md:py-3 font-bold brutalist-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 rounded-lg text-sm md:text-base flex items-center gap-2"
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
              Terms of Service
            </h1>
            <p className="text-lg text-navy-600">Last updated: 3 July 2025</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white border-4 border-navy-900 brutalist-shadow p-8 space-y-8">
              <section>
                <p className="text-navy-700 leading-relaxed mb-4">
                  These terms of service (<strong>Terms</strong>) are entered
                  into between Nillion Labs Limited, a company established under
                  the laws of Ireland and domiciled in Penthouse Floor, 5 Lapp's
                  Quay, Cork, Ireland (<strong>Nillion</strong>,{" "}
                  <strong>we</strong> or <strong>us</strong>) and the users (
                  <strong>User</strong>, <strong>you</strong> or{" "}
                  <strong>your</strong>).
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  The following Terms, together with any documents incorporated
                  by reference herein, govern your access to and use of the
                  Services, as defined in Section 1, of the nilGPT dApp (
                  <strong>dApp</strong>), consisting of the user interface
                  accessible on https://nil-gpt.vercel.app/ and all related
                  tools, components, applications, smart contracts, and
                  application programming interfaces (APIs) made available by
                  us. By accessing or using the dApp and the Services, you agree
                  to be bound by the terms and conditions set forth below.
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  We reserve the right to modify these Terms at any time at its
                  sole discretion. In this case, we will provide notice by
                  changing the "last updated" date above. By continuing to
                  access or use the dApp and the Services, you confirm that you
                  accept these updated Terms, and all documents incorporated
                  therein by reference. If you do not agree with these Terms,
                  please immediately cease all use of the dApp and the Services.
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  Other terms outside of these Terms may apply to you (vis-à-vis
                  the respective third-parties) if you use and access other
                  websites linked on the App. Such other terms apply separately
                  or in addition to these Terms (vis-à-vis the respective
                  third-parties). We are not responsible and/or liable for any
                  aspect of and/or for any damages arising out of or related to
                  any kind of products or services provided by third-parties.
                </p>
                <p className="text-navy-700 leading-relaxed">
                  The accuracy, completeness, or usefulness of information
                  presented on the dApp is not guaranteed and we disclaim any
                  liability and warranty with respect to the same.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  1. Our Services
                </h2>
                <h3 className="font-display font-bold text-lg text-navy-900 mb-3">
                  1.1. Overview
                </h3>
                <p className="text-navy-700 leading-relaxed mb-4">
                  We offer to you the following services through the dApp
                  (collectively, the <strong>Services</strong>):
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  As a user of the dApp, you may interact via nilAI with various
                  large language models (LLMs) stored in a trusted execution
                  environment (<strong>TEE</strong>) through a unified interface
                  that enables you to:
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  i) submit prompts or inputs for processing by one or more
                  LLMs;
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  ii) receive text-based or other format responses generated by
                  those models; and
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  iii) access content made available by us via the dApp,
                  including but not limited to, model outputs, preconfigured
                  prompts, templates, metrics, interactive tools, and other
                  associated materials (collectively, the{" "}
                  <strong>Content</strong>).
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  The Content provided through the Services is for informational
                  and general use purposes only and may include AI-generated
                  material that is not reviewed or verified by human oversight.
                  You acknowledge and accept the risks associated with relying
                  on or using such Content.
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  The LLMs deployed in nilAI are:
                </p>
                <ol className="list-decimal list-inside text-navy-700 space-y-2 mb-4">
                  <li>
                    meta-llama/Llama-3.2-3B:
                    https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct
                  </li>
                  <li>
                    meta-llama/Llama-3.1-8B:
                    https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct
                  </li>
                  <li>
                    Deepseek-R1-Distill-Qwen-14B:
                    https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-14B
                  </li>
                  <li>
                    openai/gpt-oss-20b:
                    https://huggingface.co/openai/gpt-oss-20b
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  2. Eligibility and Restricted Jurisdictions
                </h2>
                <p className="text-navy-700 leading-relaxed mb-4">
                  By accessing, using the Services, you represent and warrant
                  that you:
                </p>
                <ol className="list-decimal list-inside text-navy-700 space-y-2 mb-4">
                  <li>
                    have the right, authority, and legal capacity to accept
                    these Terms and that you are of the legal majority age in
                    your country or jurisdiction of residence;
                  </li>
                  <li>
                    will not access and/or use the Services if the laws of your
                    countries of residency and/or citizenship prohibit you from
                    doing so in accordance with these Terms;
                  </li>
                  <li>
                    are not subject to personal sanctions issued by the UN, US,
                    EU or Switzerland;
                  </li>
                  <li>
                    only access or use the Services for your own personal use;
                  </li>
                  <li>
                    are not accessing or using the Services from, and are not a
                    resident of, nor an entity organized, incorporated or doing
                    business in any country or jurisdiction to which the Swiss
                    State Secretariat for Economic Affairs (SECO), the United
                    States, the United Kingdom, the European Union or any of its
                    member states, or the United Nations has imposed embargoes
                    or sanctions, including, but not limited to: Belarus,
                    Burundi, Central African Republic, Congo, DPRK (North
                    Korea), Guinea, Guinea-Bissau, Iran, Iraq, Lebanon, Libya,
                    Mali, Myanmar (Burma), Republic of South Sudan, Russia,
                    Somalia, Sudan, Syria, Ukraine (Donbas region), Venezuela,
                    Yemen, or Zimbabwe (
                    <strong>Restricted Jurisdictions</strong>); and
                  </li>
                  <li>
                    you will not attempt to circumvent any restrictions on
                    access to or availability of the Services.
                  </li>
                </ol>
                <p className="text-navy-700 leading-relaxed">
                  We reserve the right to exclude you from the Services if you
                  violate these Terms. We may also take appropriate action and
                  technically restrict access based on your geographic location.
                  Additionally, we reserve the right, at our sole discretion, to
                  review, moderate, remove, or restrict any Content for any
                  reason, including violations of these Terms, applicable law,
                  or our content policies.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  3. Access to Services
                </h2>
                <p className="text-navy-700 leading-relaxed mb-4">
                  Access may be provided on a free or paid basis and may be
                  subject to limitations, including usage caps, subscription
                  tiers, or model-specific restrictions.
                </p>
                <p className="text-navy-700 leading-relaxed">
                  We do not guarantee uninterrupted or error-free access to the
                  Services and may suspend, restrict, or modify access to any
                  part of the Services at our discretion, including for
                  maintenance, security, compliance with law, or improvements.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  4. Data Storage
                </h2>
                <p className="text-navy-700 leading-relaxed">
                  When you upload or submit inputs and receive outputs through
                  the Services ("User Content"), this is automatically stored in
                  nilDB via our encrypted API. User Content is secret shared
                  among the nilDB nodes of the Nillion Network and in its
                  current beta state Nillion operates all nodes. Your content is
                  not used for model training, analytics, or any other secondary
                  processing. Where we can access User Content we treat this as
                  confidential and do not by default inspect the content of your
                  prompts or files. No date is stored in a TEE after processing.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  5. Subscription Plans
                </h2>
                <p className="text-navy-700 leading-relaxed mb-4">
                  Access to certain features or usage of the Services may
                  require a paid subscription. We may offer various subscription
                  plans, each with specific usage limits, access to different
                  large language models (LLMs), support levels, or other
                  functionality (each, a "Subscription"). The scope and pricing
                  of Subscriptions are set out on the platform and may be
                  updated from time to time.
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  By purchasing a Subscription, you agree to pay all applicable
                  fees and charges associated with the selected plan, in
                  accordance with the terms disclosed at the time of purchase.
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  You may cancel your Subscription at any time through your
                  account settings. Cancellation will take effect at the end of
                  the then-current billing period, and you will not be charged
                  for subsequent periods.
                </p>
                <p className="text-navy-700 leading-relaxed">
                  We reserve the right to modify the pricing, features, or
                  availability of Subscription plans at any time. Any changes to
                  pricing or material changes to features will take effect in
                  the next billing cycle and will be communicated to you in
                  advance. Continued use of the Services after such changes
                  become effective constitutes your agreement to the updated
                  terms.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  6. Restrictions
                </h2>
                <p className="text-navy-700 leading-relaxed mb-4">
                  You may not:
                </p>
                <ul className="list-disc list-inside text-navy-700 space-y-2">
                  <li>Use the Services for illegal purposes.</li>
                  <li>Allow others to access your Subscription.</li>
                  <li>
                    Circumvent, reverse-engineer, disable, or tamper with
                    security features.
                  </li>
                  <li>Access Subscriptions via unauthorized means.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  7. Refunds
                </h2>
                <p className="text-navy-700 leading-relaxed">
                  Refunds are generally not provided, except as required by
                  applicable law or where we determine, at our discretion, that
                  exceptional circumstances apply.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  8. Suspension
                </h2>
                <p className="text-navy-700 leading-relaxed">
                  We may terminate your access or Subscriptions at any time, at
                  our sole discretion.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  9. Suspension of Services and Termination
                </h2>
                <p className="text-navy-700 leading-relaxed mb-4">
                  We have the right to terminate these Terms and to suspend the
                  Services at any time with immediate effect (without prior
                  notice) at our sole discretion and for any reason.
                </p>
                <p className="text-navy-700 leading-relaxed">
                  As a User, you may terminate these Terms at any time without
                  prior notice. Termination does not entitle you to a refund of
                  any paid Subscriptions.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  10. Third Party Links
                </h2>
                <p className="text-navy-700 leading-relaxed">
                  The Service may contain links to websites and content that is
                  controlled or operated by third parties (
                  <strong>Third Party Links</strong>). We are providing these
                  Third Party Links to you only for convenience and the
                  inclusion of any Third Party Links does not imply any
                  endorsement by us of the Third Party Links and/or their
                  operators. We are not responsible for any content contained in
                  or associated with the Third Party Links.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  11. Warranty Disclaimer
                </h2>
                <p className="text-navy-700 leading-relaxed mb-4">
                  You acknowledge and agree that Services are offered in a
                  closed beta state and your access to and use of the Services
                  is entirely at your own discretion and risk. We offer the
                  Services for optional use, and you may choose whether or not
                  to access, utilize, or purchase any aspect of the Services.
                  Accordingly, and except as expressly stated in these Terms, we
                  make no representations or warranties of any kind, express or
                  implied, in relation to the Services or any content provided
                  through or in connection with the Services.
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  You accept and agree that any use of the outputs from our
                  service is at your own sole risk and you will not rely on
                  output as a sole source of truth or factual information, or as
                  a substitute for professional advice.
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  To the fullest extent permitted by applicable law, the
                  Services and all related content, outputs, responses, data,
                  software, features, and functionalities (collectively, the{" "}
                  <strong>Content</strong>) are provided on an{" "}
                  <strong>as is</strong> and <strong>as available</strong>{" "}
                  basis, without warranties of any kind, whether express,
                  implied, statutory, or otherwise.
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  We expressly disclaim all warranties and conditions,
                  including, without limitation:
                </p>
                <ul className="list-disc list-inside text-navy-700 space-y-2 mb-4">
                  <li>
                    any implied warranties of merchantability, fitness for a
                    particular purpose, title, quiet enjoyment, accuracy, or
                    non-infringement.
                  </li>
                  <li>
                    any warranties arising out of course of dealing, usage, or
                    trade; and
                  </li>
                  <li>
                    any warranties that the Services or Content will be
                    uninterrupted, timely, secure, reliable, error-free, or free
                    from viruses or other harmful components.
                  </li>
                </ul>
                <p className="text-navy-700 leading-relaxed mb-4">
                  Without limiting the foregoing, we make no warranties or
                  guarantees regarding:
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  i) the performance, accuracy, quality, reliability,
                  usefulness, security or completeness of any Content or outputs
                  generated by artificial intelligence models or other
                  technologies accessed through the Services;
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  ii) the availability, compatibility, or fitness of any
                  particular large language model or feature;
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  iii) whether the Services or Content will meet your specific
                  needs or expectations; or
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  iiii) the correction of any defects, errors, or omissions.
                </p>
                <p className="text-navy-700 leading-relaxed">
                  You are solely responsible for evaluating and, where
                  appropriate, verifying any output or Content obtained from or
                  through the Services prior to relying on or using it for any
                  purpose. You assume full responsibility for any damage to your
                  systems, devices, software, data, or loss resulting from your
                  use of the Services or any Content obtained therefrom.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  12. Limitation of Liability
                </h2>
                <p className="text-navy-700 leading-relaxed">
                  Our liability is limited to direct damages arising out of acts
                  of intent and gross negligence. Any liability for indirect
                  damages or consequential damages, including loss of profit,
                  and/or damages arising out of negligent conduct, to the
                  maximum extent permitted by applicable law, is expressly
                  excluded. We do not assume any responsibility for the use of
                  the Services and shall not be liable for any damages arising
                  out of or related to your access and/use of the Services.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  13. Indemnification
                </h2>
                <p className="text-navy-700 leading-relaxed">
                  You agree to indemnify, and hold us harmless, against all
                  liabilities, damages, costs, expenses and claims (including
                  third party claims) arising out of or in connection with your
                  breach of the Terms.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  14. Personal Data
                </h2>
                <p className="text-navy-700 leading-relaxed">
                  For information about how we handle your personal information,
                  please see our privacy policy at{" "}
                  <a
                    href="https://www.notion.so/nillion/nilGPT-Privacy-Policy-2261827799b48083b211d957d127d911"
                    className="text-navy-900 underline"
                  >
                    https://www.notion.so/nillion/nilGPT-Privacy-Policy-2261827799b48083b211d957d127d911
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  15. Intellectual Property Rights
                </h2>
                <p className="text-navy-700 leading-relaxed">
                  You are only entitled to the rights of use defined in these
                  Terms. All other rights, in particular intellectual property
                  rights (such as copyrights, trademarks, designs, patents, in
                  each case whether registered or not) as well as all other
                  rights that are not expressly granted to you hereunder, (in
                  particular, regarding the dApp) shall remain exclusively with
                  us. The dApp contain information, ideas, concepts and
                  processes, to the extent protectable under applicable
                  intellectual property law.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  16. Contact Details
                </h2>
                <div className="bg-navy-100 p-4 rounded border">
                  <p className="text-navy-800">
                    <strong>Nillion Labs Limited</strong>
                    <br />
                    Penthouse Floor,
                    <br />5 Lapp's Quay, Cork, Ireland.
                    <br />
                    T12 RW7D
                    <br />
                    <strong>Email:</strong> legal@nillion.org
                    <br />
                    <strong>Languages of communication:</strong> English.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-display font-bold text-2xl text-navy-900 mb-4">
                  17. Miscellaneous
                </h2>
                <h3 className="font-display font-bold text-lg text-navy-900 mb-3">
                  17.1. User Feedback
                </h3>
                <p className="text-navy-700 leading-relaxed mb-4">
                  We appreciate and encourage you to provide feedback to the
                  User Interface. If you provide feedback, you agree that we are
                  free to use it and may permit others to use it without any
                  restriction or compensation to you.
                </p>
                <h3 className="font-display font-bold text-lg text-navy-900 mb-3">
                  17.2. Taxes
                </h3>
                <p className="text-navy-700 leading-relaxed mb-4">
                  It is your sole responsibility to seek relevant tax advice to
                  comply with any applicable tax obligations in whichever
                  jurisdiction and to measure the tax impact of the use of the
                  Service and the dApp.
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  If any taxes, fees, or other charges are levied in connection
                  with the use of the Service in any jurisdiction, it is your
                  solely responsible for bearing and paying such taxes, fees, or
                  charges. You agree to comply with all applicable tax laws and
                  regulations related to the use of the Service and to indemnify
                  and hold us harmless from any liability arising from its
                  failure to pay such taxes, fees, or charges.
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  The Access Rewards and Access Fees are exclusive of VAT. It is
                  within the full discretion of us or any party levying the
                  Access Rewards and Access Fees to decide whether VAT is due on
                  such payment and whether VAT is added to the corresponding
                  amount.
                </p>
                <h3 className="font-display font-bold text-lg text-navy-900 mb-3">
                  17.3. No Assignment
                </h3>
                <p className="text-navy-700 leading-relaxed mb-4">
                  You shall not assign, transfer or otherwise deal with all or
                  any of its rights or obligations under this Agreement without
                  our prior written consent.
                </p>
                <h3 className="font-display font-bold text-lg text-navy-900 mb-3">
                  17.4. Entire Agreement and Severability
                </h3>
                <p className="text-navy-700 leading-relaxed mb-4">
                  These Terms contain the entire agreement between us and you
                  regarding the subject matter hereof and supersedes all
                  understandings and agreements whether written or oral. If any
                  provision of these Terms is invalid, illegal, or unenforceable
                  in any jurisdiction, such invalidity, illegality, or
                  unenforceability shall not affect any other provision of these
                  Terms or invalidate or render unenforceable such provision in
                  any other jurisdiction. Upon such determination that any
                  provision is invalid, illegal, or unenforceable, these Terms
                  shall be modified to effectuate the original intent of the
                  parties as closely as possible.
                </p>
                <h3 className="font-display font-bold text-lg text-navy-900 mb-3">
                  17.5. Governing Law and Jurisdiction
                </h3>
                <p className="text-navy-700 leading-relaxed mb-4">
                  These Terms shall be governed by and construed in accordance
                  with the laws of Ireland. The parties hereby submit to the
                  exclusive jurisdiction of the Irish courts in relation to any
                  dispute arising out of or in connection with this Agreement.
                </p>
                <h3 className="font-display font-bold text-lg text-navy-900 mb-3">
                  17.6. Important Regulatory Notice
                </h3>
                <p className="text-navy-700 leading-relaxed mb-4">
                  For the avoidance of doubt, and in accordance with EU AI Act,
                  we act solely as a distributor of general-purpose AI models
                  made available by third-party providers. We do not develop,
                  fine-tune, or substantially modify the large language models
                  accessed via the Services, nor do we place such models on the
                  market in our own name or under our own brand. Consequently,
                  we are not classified as a "provider" of AI systems or
                  general-purpose AI models under the EU AI Act, and any
                  obligations associated with the development, performance, or
                  compliance of such models remain the sole responsibility of
                  their respective providers.
                </p>
                <p className="text-navy-700 leading-relaxed mb-4">
                  You are solely responsible for evaluating and, where
                  appropriate, verifying any output or Content obtained from or
                  through the Services prior to relying on or using it for any
                  purpose. You assume full responsibility for any damage to your
                  systems, devices, software, data, or loss resulting from your
                  use of the Services or any Content obtained therefrom.
                </p>
                <h3 className="font-display font-bold text-lg text-navy-900 mb-3">
                  17.7. Class Action Waiver
                </h3>
                <p className="text-navy-700 leading-relaxed mb-4">
                  To the fullest extent permitted by any applicable law, you
                  waive your right to participate in a class action lawsuit or a
                  class-wide arbitration against us or any individual or entity
                  involved in the provision of the Service.
                </p>
                <h3 className="font-display font-bold text-lg text-navy-900 mb-3">
                  17.8 Force Majeure
                </h3>
                <p className="text-navy-700 leading-relaxed">
                  Neither party shall be liable for delays or failure to perform
                  resulting from causes outside its reasonable control,
                  including acts of God, war, strikes, internet outages, or
                  legal restrictions.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
