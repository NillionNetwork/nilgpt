import Image from "next/image";
import Link from "next/link";

const Footer = () => (
  <footer className="p-4">
    <div
      className="bg-black rounded-xl py-6 px-6 shadow-lg backdrop-blur-sm border border-gray-800/20"
      style={{
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="flex items-start justify-between gap-4 max-w-7xl mx-auto max-md:flex-col-reverse max-md:items-center max-md:gap-10">
        <div className="flex flex-col items-start gap-3 max-md:items-center">
          <div className="flex flex-col gap-2 max-md:items-center max-md:gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/img/yellow_logo.png"
                alt="nilGPT Logo"
                width={24}
                height={24}
              />
              <div className="font-display font-medium text-xl text-white">
                nilGPT
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} nilGPTAI. All rights reserved.
            </p>
          </div>
          <div className="flex items-center text-sm gap-3 max-md:gap-2 max-md:text-xs">
            <a
              href="https://nillion.notion.site/nilGPT-Terms-of-Service-2261827799b4805bb956e7dbb828310c"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors underline"
            >
              Terms of Service
            </a>
            <a
              href="https://nillion.notion.site/nilGPT-Privacy-Policy-2261827799b48083b211d957d127d911"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors underline"
            >
              Privacy Policy
            </a>
            <Link
              href="/content-policy"
              className="text-gray-400 hover:text-white transition-colors underline"
            >
              Content Policy
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-3 items-start">
            <Link
              href="/blog"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <Image
                src="/img/white_logo.svg"
                alt="Blog"
                width={16}
                height={16}
              />
              Blog
            </Link>
            <a
              href="https://x.com/nilgpt_"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
              rel="noopener"
            >
              <Image
                src="/img/twitter_logo.svg"
                alt="X"
                width={12}
                height={12}
              />
              (Twitter)
            </a>
            <a
              href="https://github.com/NillionNetwork/nilgpt"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
              rel="noopener"
            >
              <Image
                src="/img/github_logo.svg"
                alt="GitHub"
                width={16}
                height={16}
              />
              nilGPT
            </a>
          </div>

          <div className="flex flex-col gap-3 items-start">
            <a
              href="https://github.com/NillionNetwork/nilai"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
              rel="noopener"
            >
              <Image
                src="/img/github_logo.svg"
                alt="GitHub"
                width={16}
                height={16}
              />
              nilAI
            </a>
            <a
              href="https://github.com/NillionNetwork/nildb"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
              rel="noopener"
            >
              <Image
                src="/img/github_logo.svg"
                alt="GitHub"
                width={16}
                height={16}
              />
              nilDB
            </a>
            <a
              href="https://github.com/NillionNetwork/nilcc"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
              rel="noopener"
            >
              <Image
                src="/img/github_logo.svg"
                alt="GitHub"
                width={16}
                height={16}
              />
              nilcc
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
