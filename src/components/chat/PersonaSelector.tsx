import { ChevronDown, Loader2, PlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { TbCheck } from "react-icons/tb";
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
      <HoverCard openDelay={500}>
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
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                disabled ? "opacity-50" : ""
              }`}
            >
              <span className="text-sm font-medium truncate max-w-[160px] sm:max-w-[180px] dark:text-white">
                {selectedPersona.name}
              </span>
              <ChevronDown
                className={`transition-transform text-neutral-600 dark:text-gray-300 ${isOpen ? "rotate-180" : ""}`}
                size={18}
              />
            </button>
          </div>
        </HoverCardTrigger>
        {disabled && (
          <HoverCardContent className="w-auto p-4">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-neutral-500 dark:text-gray-300">
                Create a new chat to change mode
              </p>
              <button
                type="button"
                className="bg-[#000201] hover:bg-[#000201]/80 transition-colors rounded-md px-4 py-2 flex items-center gap-2 justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  createChat();
                }}
                disabled={isCreatingChat}
              >
                {isCreatingChat ? (
                  <Loader2 className="animate-spin text-white" size={16} />
                ) : (
                  <>
                    <span className="text-sm text-white">New Chat</span>
                    <PlusIcon className="text-[#FFC971]" size={16} />
                  </>
                )}
              </button>
            </div>
          </HoverCardContent>
        )}
      </HoverCard>

      {isOpen && !disabled && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-lg bg-white dark:bg-[#2A2A2A] shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-10 focus:outline-none">
          <div className="py-1 max-h-64 overflow-y-auto">
            {personas.map((persona) => (
              <button
                key={persona.id}
                className={`block w-full text-left px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 ${
                  currentPersonaId === persona.id
                    ? "text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-700"
                    : "text-neutral-700 dark:text-gray-200"
                }`}
                onClick={() => handlePersonaChange(persona)}
              >
                <div className="flex justify-between items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{persona.name}</div>
                    <div className="text-xs text-neutral-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {persona.description}
                    </div>
                  </div>
                  {currentPersonaId === persona.id && (
                    <TbCheck size={16} className="dark:text-white" />
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
