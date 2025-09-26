import { FileTextIcon, ImageIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useFilePicker } from "use-file-picker";
import {
  FileAmountLimitValidator,
  FileSizeValidator,
  FileTypeValidator,
} from "use-file-picker/validators";
import { getPersonaById } from "@/config/personas";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/UnifiedAuthProvider";
import getTextFromPdf from "@/utils/getTextFromPdf";
import PersonaSelector from "../PersonaSelector";
import type { IChatInputProps } from "./types";

const ChatInput: React.FC<IChatInputProps> = ({
  onSendMessage,
  isLoading,
  placeholder = "What do you want to ask?",
}) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { setSelectedPersona, hasMessages, selectedPersona } = useApp();

  // Detect current theme
  const getCurrentTheme = () => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("theme-dark-blue")
      ? "dark-blue"
      : document.documentElement.classList.contains("theme-dark-sepia")
        ? "dark-sepia"
        : "light";
  };

  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [wasLoading, setWasLoading] = useState(false);
  const [pdfTextContent, setPdfTextContent] = useState<string | null>(null);

  const {
    openFilePicker: openImagePicker,
    filesContent: imageContent,
    loading: isLoadingImagePicker,
    clear: clearPickedImage,
  } = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator([
        "jpg",
        "png",
        "jpeg",
        "webp",
        "heic",
        "heif",
        "bmp",
      ]),
      new FileSizeValidator({ maxFileSize: 5 * 1024 * 1024 }), // 5MB
    ],
    onFilesRejected: ({ errors }) => {
      const isFileSizeError = errors.some(
        (error) => error.name === "FileSizeError",
      );

      if (isFileSizeError) {
        toast.warning("We currently support images up to 5MB only");
      } else {
        toast.warning("Please select a valid single image file");
      }
    },
  });

  const {
    openFilePicker: openPdfPicker,
    filesContent: pdfContent,
    loading: isLoadingPdfPicker,
    clear: clearPickedPdf,
  } = useFilePicker({
    readAs: "ArrayBuffer",
    accept: "application/pdf",
    multiple: false,
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator(["pdf"]),
      new FileSizeValidator({ maxFileSize: 10 * 1024 * 1024 }), // 10MB
    ],
    onFilesRejected: ({ errors }) => {
      const isFileSizeError = errors.some(
        (error) => error.name === "FileSizeError",
      );

      if (isFileSizeError) {
        toast.warning("We currently support files up to 10MB only");
      } else {
        toast.warning("Please select a valid single PDF file");
      }
    },
  });

  // Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint (768px)
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Focus textarea when loading finishes
  useEffect(() => {
    if (wasLoading && !isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
    setWasLoading(isLoading);
  }, [isLoading, wasLoading]);

  useEffect(() => {
    if (pdfContent.length > 0) {
      getTextFromPdf(pdfContent[0].content)
        .then((text) => setPdfTextContent(text))
        .catch((error) => {
          toast.error("Could not parse PDF, please try again");
          console.error("Error getting text from pdf:", error);
          handleClearPickedPdf();
        });
    }
  }, [pdfContent]);

  // Word count function
  const countWords = (text: string): number => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const wordCount = countWords(input);
  const isOverLimit = wordCount > 600;

  const handlePersonaChange = (personaId: string) => {
    setSelectedPersona(personaId);
    window.umami.track("Mode Changed", {
      from: getPersonaById(selectedPersona)?.name,
      to: getPersonaById(personaId)?.name,
    });
  };

  const handleClearPickedPdf = () => {
    setPdfTextContent(null);
    clearPickedPdf();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isAuthenticated || isOverLimit) return;

    onSendMessage({
      content: input,
      attachmentData: {
        imageDataUrl: imageContent?.[0]?.content,
        pdfTextContent,
      },
    });
    setInput("");
    clearPickedImage();
    handleClearPickedPdf();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // On mobile, Enter creates new line; only submit on desktop
    if (e.key === "Enter" && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const areFilePickersLoading =
    isLoading || isLoadingImagePicker || isLoadingPdfPicker || !isAuthenticated;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative flex flex-col">
        <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-4 pb-2">
          {imageContent.length > 0 && (
            <div className="mb-2 relative flex self-end w-fit">
              <Image
                src={imageContent[0].content}
                width={100}
                height={100}
                alt=""
                className="w-auto h-auto max-h-12 object-contain opacity-80 rounded-sm max-w-36"
              />
              <button
                type="button"
                onClick={clearPickedImage}
                className="outline-none p-0.5 cursor-pointer rounded-full bg-neutral-200 absolute -top-1 -right-1 items-center"
              >
                <XIcon size={12} />
              </button>
            </div>
          )}
          {pdfTextContent && (
            <div className="mb-2 relative flex self-end w-fit">
              <div className="flex flex-col items-center gap-2 relative">
                <FileTextIcon size={24} className="text-[var(--foreground)]" />
                <span className="text-[6px] font-bold font-mono text-black bg-white absolute bottom-0 mx-auto">
                  PDF
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearPickedPdf}
                className="outline-none p-0.5 cursor-pointer rounded-full bg-neutral-200 absolute -top-2 -right-2.5 items-center"
              >
                <XIcon size={12} />
              </button>
            </div>
          )}
          <div className="mb-2">
            <textarea
              ref={textareaRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isAuthenticated ? placeholder : "Please sign in to chat."
              }
              className="w-full bg-transparent text-[var(--foreground)] placeholder-[var(--muted-foreground)] resize-none focus:outline-none text-base leading-6 min-h-[36px] max-h-32 overflow-y-auto"
              style={{
                scrollbarWidth: "none",
                height: "auto",
                minHeight: "36px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.max(
                  36,
                  Math.min(target.scrollHeight, 128),
                )}px`;
              }}
              disabled={isLoading || !isAuthenticated}
            />
            <style jsx>{`
              textarea::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openImagePicker}
                disabled={areFilePickersLoading || pdfContent?.length > 0}
                className="outline-none p-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ImageIcon size={18} className="text-[var(--foreground)]" />
              </button>
              <button
                type="button"
                onClick={openPdfPicker}
                disabled={areFilePickersLoading || imageContent?.length > 0}
                className="outline-none p-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center flex-col relative"
              >
                <FileTextIcon size={18} className="text-[var(--foreground)]" />
                <span className="text-[6px] font-bold font-mono text-black bg-white absolute bottom-0 right-0 left-0">
                  PDF
                </span>
              </button>
            </div>

            {/* Right section - PersonaSelector + Send button */}
            <div className="flex items-center gap-1">
              <PersonaSelector
                onPersonaChange={handlePersonaChange}
                disabled={hasMessages}
              />
              <button
                name="submitButton"
                type="submit"
                disabled={
                  isLoading || !input.trim() || !isAuthenticated || isOverLimit
                }
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                  input.trim() && !isOverLimit && isAuthenticated
                    ? getCurrentTheme() === "light"
                      ? "bg-neutral-800 text-yellow-400 hover:bg-neutral-700"
                      : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/80"
                    : getCurrentTheme() === "light"
                      ? "bg-neutral-300 text-neutral-500"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transform"
                >
                  <path
                    d="M7 11L12 6L17 11M12 18V7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isOverLimit && (
          <div className="mt-2 px-1">
            <p className="text-sm text-red-500">
              Reached 600 word limit. Please shorten your message to send.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
