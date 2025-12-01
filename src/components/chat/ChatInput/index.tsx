import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TbFileTypePdf, TbPhoto, TbWorldSearch, TbX } from "react-icons/tb";
import { toast } from "sonner";
import { useFilePicker } from "use-file-picker";
import {
  FileAmountLimitValidator,
  FileSizeValidator,
  FileTypeValidator,
} from "use-file-picker/validators";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DEFAULT_MODEL, LLM } from "@/config/llm";
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

  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [wasLoading, setWasLoading] = useState(false);
  const [extractedPdfTextContent, setExtractedPdfTextContent] = useState<
    string | null
  >(null);
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);

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
    onFilesSuccessfullySelected: () => setIsWebSearchEnabled(false),
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
        .then((text) => setExtractedPdfTextContent(text))
        .catch((error) => {
          toast.error("Could not parse PDF, please try again");
          console.error("Error getting text from pdf:", error);
          clearPickedPdf();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isAuthenticated || isOverLimit) return;

    onSendMessage({
      content: input,
      model:
        imageContent?.[0]?.content || selectedPersona === "companion"
          ? LLM.gemma.model
          : DEFAULT_MODEL,
      shouldUseWebSearch: isWebSearchEnabled,
      attachmentData: {
        imageDataUrl: imageContent?.[0]?.content,
        pdfData: {
          useAsAttachedFile: pdfContent.length > 0,
          extractedTextContent: extractedPdfTextContent,
        },
      },
    });
    setInput("");
    setIsWebSearchEnabled(false);
    clearPickedImage();
    clearPickedPdf();
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
  const isWebSearchDisabled =
    isLoading || !isAuthenticated || imageContent.length > 0;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative flex flex-col">
        <div className="relative bg-white dark:bg-[#202020] border border-neutral-200 dark:border-white/[0.07] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-4 pb-2">
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
                className="outline-none p-0.5 cursor-pointer rounded-full bg-neutral-200 dark:bg-neutral-700 absolute -top-1 -right-1 items-center"
              >
                <TbX size={12} className="dark:text-white" />
              </button>
            </div>
          )}
          {pdfContent.length > 0 && extractedPdfTextContent && (
            <div className="mb-2 relative flex self-end w-fit">
              <TbFileTypePdf size={24} className="dark:text-white" />
              <button
                type="button"
                onClick={clearPickedPdf}
                className="outline-none p-0.5 cursor-pointer rounded-full bg-neutral-200 dark:bg-neutral-700 absolute -top-2 -right-2.5 items-center"
              >
                <TbX size={12} className="dark:text-white" />
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
              className="w-full bg-transparent text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 resize-none focus:outline-none text-base leading-6 min-h-[36px] max-h-32 overflow-y-auto"
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
                <TbPhoto size={18} className="dark:text-white" />
              </button>
              <button
                type="button"
                onClick={openPdfPicker}
                disabled={areFilePickersLoading || imageContent?.length > 0}
                className="outline-none p-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TbFileTypePdf size={18} className="dark:text-white" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <Tooltip delayDuration={100}>
                <TooltipTrigger
                  asChild
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <div
                    className={`flex items-center gap-0.5 ${
                      isWebSearchDisabled ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <label htmlFor="web-search-switch">
                      <TbWorldSearch
                        size={18}
                        className={`dark:text-white ${
                          isWebSearchDisabled
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }`}
                      />
                    </label>
                    <Switch
                      id="web-search-switch"
                      checked={isWebSearchEnabled}
                      onCheckedChange={setIsWebSearchEnabled}
                      disabled={isWebSearchDisabled}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-neutral-500 dark:text-neutral-300">
                  Web search
                </TooltipContent>
              </Tooltip>
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
                    ? "bg-neutral-800 dark:bg-neutral-700 text-yellow-400 hover:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-pink-400"
                    : "bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400"
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
            <p className="text-sm text-red-500 dark:text-red-400">
              Reached 600 word limit. Please shorten your message to send.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
