import { ChevronDown, Loader2, PlusIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { personas } from "@/config/personas";
import { useApp } from "@/contexts/AppContext";
import useCreateChat from "@/hooks/useCreateChat";

interface PersonaOption {
  id: string;
  name: string;
  description: string;
}

interface PersonaSelectorProps {
  onPersonaChange?: (personaId: string) => void;
  disabled?: boolean;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  onPersonaChange,
  disabled = false,
}) => {
  const {
    selectedPersona: selectedPersonaId,
    setSelectedPersona,
    chatHistory,
  } = useApp();
  const { createChat, isCreatingChat } = useCreateChat();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  // Get current chat ID from pathname
  const currentChatId = pathname?.match(/\/app\/chat\/(.+)/)?.[1];

  // Determine which persona to show
  const getCurrentPersona = () => {
    // If we're in an existing chat, find the current chat's persona
    if (currentChatId) {
      const currentChat = chatHistory.find(
        (chat) => chat._id === currentChatId,
      );
      if (currentChat?.persona) {
        return currentChat.persona;
      }
    }
    // Fall back to the selected persona from AppContext (for new chats)
    return selectedPersonaId;
  };

  const currentPersonaId = getCurrentPersona();
  const selectedPersona =
    personas.find((persona) => persona.id === currentPersonaId) || personas[0];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkTheme = () => {
      const isDark =
        document.documentElement.classList.contains("theme-dark-blue") ||
        document.documentElement.classList.contains("theme-dark-sepia");
      console.log("PersonaSelector theme check:", {
        classes: document.documentElement.className,
        isDark,
      });
      setIsDarkMode(isDark);
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handlePersonaChange = (persona: PersonaOption) => {
    if (disabled) return;
    setSelectedPersona(persona.id);
    setIsOpen(false);
    if (onPersonaChange) {
      onPersonaChange(persona.id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <HoverCard openDelay={100}>
        <HoverCardTrigger tabIndex={0} asChild>
          <div className="relative group">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (disabled) {
                  return;
                }
                setIsOpen(!isOpen);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[var(--accent)] transition-colors text-[var(--foreground)] ${
                disabled ? "opacity-50" : ""
              }`}
            >
              <span className="text-sm font-medium truncate max-w-[160px] sm:max-w-[180px]">
                {selectedPersona.name}
              </span>
              <ChevronDown
                className={`transition-transform text-[var(--muted-foreground)] ${isOpen ? "rotate-180" : ""}`}
                size={18}
              />
            </button>
          </div>
        </HoverCardTrigger>
        {disabled && (
          <HoverCardContent className="w-auto p-4 bg-[var(--popover)] text-[var(--popover-foreground)] border-[var(--border)]">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-[var(--muted-foreground)]">
                Create a new chat to change mode
              </p>
              <button
                type="button"
                className="bg-[var(--primary)] hover:bg-[var(--primary)]/80 transition-colors rounded-md px-4 py-2 flex items-center gap-2 justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  createChat();
                }}
                disabled={isCreatingChat}
              >
                {isCreatingChat ? (
                  <Loader2
                    className="animate-spin text-[var(--primary-foreground)]"
                    size={16}
                  />
                ) : (
                  <>
                    <span className="text-sm text-[var(--primary-foreground)]">
                      New Chat
                    </span>
                    <PlusIcon className="text-[#FFC971]" size={16} />
                  </>
                )}
              </button>
            </div>
          </HoverCardContent>
        )}
      </HoverCard>

      {isOpen && !disabled && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-lg bg-[var(--card)] shadow-lg ring-1 ring-[var(--border)] focus:outline-none">
          <div className="py-1 max-h-64 overflow-y-auto">
            {personas.map((persona) => (
              <button
                key={persona.id}
                className={`block w-full text-left px-4 py-3 text-sm ${
                  isDarkMode ? "hover:bg-gray-600" : "hover:bg-[var(--accent)]"
                } ${
                  currentPersonaId === persona.id
                    ? "text-[var(--foreground)] bg-[var(--accent)]"
                    : "text-[var(--foreground)]"
                }`}
                onClick={() => {
                  console.log("PersonaSelector button clicked:", {
                    isDarkMode,
                    persona: persona.name,
                  });
                  handlePersonaChange(persona);
                }}
              >
                <div className="flex justify-between items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{persona.name}</div>
                    <div className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">
                      {persona.description}
                    </div>
                  </div>
                  {currentPersonaId === persona.id && (
                    <Image
                      src="/img/tick_icon.svg"
                      alt="Selected"
                      width={16}
                      height={16}
                      className="flex-shrink-0"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonaSelector;
