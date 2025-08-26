import Image from "next/image";
import Link from "next/link";

const FeaturesSection = () => (
  <section id="features" className="py-20 bg-[#F7F6F2]">
    <div className="max-w-7xl mx-auto px-4 md:px-10">
      <div className="text-center mb-10 md:mb-24">
        <h2 className="font-display text-5xl lg:text-6xl font-normal text-black mb-0 md:mb-6">
          Why You&apos;ll Love nilGPT
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-10 mb-20 w-full">
        {[
          {
            icon: (
              <div className="w-20 h-20 bg-[#EDEAE0] rounded-full flex items-center justify-center">
                <Image
                  src="/img/shield.png"
                  alt="Shield"
                  width={24}
                  height={24}
                />
              </div>
            ),
            title: "Data private by default",
            description:
              "Chat data securely split and stored among multiple nilDB nodes",
          },
          {
            icon: (
              <div className="w-20 h-20 bg-[#EDEAE0] rounded-full flex items-center justify-center">
                <Image
                  src="/img/private.png"
                  alt="Private"
                  width={24}
                  height={24}
                />
              </div>
            ),
            title: "Private AI",
            description:
              "All models run inside a secure enclave keeping your inputs private.",
          },
          {
            icon: (
              <div className="w-20 h-20 bg-[#EDEAE0] rounded-full flex items-center justify-center">
                <Image
                  src="/img/models.png"
                  alt="Models"
                  width={24}
                  height={24}
                />
              </div>
            ),
            title: "Multi Modes",
            description:
              "Access specialised modes like wellness assistant, personal assistant & companion.",
          },
        ].map((feature, index) => (
          <div key={index} className="text-center">
            <div className="mb-8 flex justify-center">{feature.icon}</div>

            <h3 className="font-display text-3xl font-normal text-black mb-4">
              {feature.title}
            </h3>

            <p className="text-gray-600 text-xl leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      <div className="flex text-center mt-16 space-y-6">
        <Link
          href="/app"
          className="bg-black text-[#FFC971] px-6 py-3 text-xl rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto w-fit"
        >
          <div className="w-2 h-2 bg-[#FFC971] rounded-full"></div>
          Chat Now
        </Link>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
