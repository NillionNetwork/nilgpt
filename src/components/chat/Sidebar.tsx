"use client";

import {
  CheckIcon,
  EditIcon,
  EllipsisVertical,
  LogOut,
  Shield,
  ShieldCheck,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/UnifiedAuthProvider";
import useCreateChat from "@/hooks/useCreateChat";
import { useEncryption } from "@/hooks/useEncryption";
import { LocalStorageService } from "@/services/LocalStorage";
import type { IChatItem } from "@/types/chat";
import { getPersonaFromUTM } from "@/utils/utmPersonaMapping";
import { getStoredUTMParameters } from "@/utils/utmTracking";
import AttestationModal from "../AttestationModal";
import { PassphraseModal } from "../auth/PassphraseModal";
import { Dialog } from "../ui/dialog";

interface SidebarProps {
  isCollapsed: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentChatId = pathname?.match(/\/app\/chat\/(.+)/)?.[1];

  const { user, signOut } = useAuth();
  const { decrypt, encrypt, hasSecretKey } = useEncryption();
  const { createChat, isCreatingChat } = useCreateChat();
  const {
    setUserSecretKeySeed,
    setSelectedPersona,
    setChatHistory,
    chatHistory,
  } = useApp();

  const [loading, setLoading] = useState(true);
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showSecretKeyModal, setShowSecretKeyModal] = useState(false);
  const [contextMenuChatId, setContextMenuChatId] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const staleChatsRef = useRef(false);

  // Utility function to truncate wallet address
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get display name based on auth provider
  const userName = (() => {
    if (!user) return "Anonymous";

    if (user.authProvider === "privy" && user.walletAddress) {
      return truncateAddress(user.walletAddress);
    }

    if (user.authProvider === "supabase") {
      return user.name || user.email || "Anonymous";
    }

    return user.name || "Anonymous";
  })();
  const initials = (() => {
    if (userName === "Anonymous") return "AN";

    // For wallet addresses (0x...), use first 2 characters after 0x
    if (userName.startsWith("0x")) {
      return userName.slice(2, 4).toUpperCase();
    }

    // For regular names, use first letters of words
    return userName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  })();

  useEffect(() => {
    const getChats = async () => {
      setLoading(true);
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        const res = await fetch("/api/getChats", {
          method: "GET",
          headers,
        });
        if (!res.ok) {
          console.error("Failed to fetch chats:", res.statusText);
          setChatHistory([]);
          setLoading(false);
          return;
        }
        const data = await res.json();

        setChatHistory((prev) => {
          const rawChats = (data.content.result || [])
            .map((chat: IChatItem) => {
              // Handle case where title might be an object (e.g., { '%allot': 'actual title' })
              let actualTitle = chat.title;
              if (typeof chat.title === "object" && chat.title !== null) {
                if (chat.title["%allot"]) {
                  actualTitle = chat.title["%allot"];
                } else {
                  // Handle other possible object formats
                  const keys = Object.keys(chat.title);
                  if (keys.length === 1) {
                    actualTitle = chat.title[keys[0]];
                  }
                }
              }

              return {
                ...chat,
                title: actualTitle,
              };
            })
            .filter(
              (c: IChatItem) => c.title && c.title !== "null" && c.title !== "",
            );

          // Decrypt chat titles if user has secret key
          const processChats = async () => {
            if (hasSecretKey && rawChats.length > 0) {
              const decryptedChats = await Promise.all(
                rawChats.map(async (chat: IChatItem) => {
                  try {
                    const decryptedTitle = await decrypt(chat.title);
                    return {
                      ...chat,
                      title: decryptedTitle,
                    };
                  } catch (error) {
                    console.error("Error decrypting chat title:", error);
                    return chat;
                  }
                }),
              );
              return decryptedChats;
            } else {
              return rawChats;
            }
          };

          processChats().then((realChats) => {
            const realIds = new Set<string>(
              realChats.map((c: IChatItem) => c._id),
            );

            if (!staleChatsRef.current) {
              LocalStorageService.removeUntitledChatsNotIn(realIds);
              staleChatsRef.current = true;
            }

            setChatHistory(() => {
              const localChats = LocalStorageService.getChatHistory();
              const optimistic = localChats.filter(
                (c: IChatItem) =>
                  !realIds.has(c._id) && c.title === "Untitled Chat",
              );

              const finalChats = [...optimistic, ...realChats];

              if (!currentChatId) {
                // Check if there's a UTM-based persona selection first (higher priority)
                const utmParams = getStoredUTMParameters();
                const personaFromUTM = getPersonaFromUTM(utmParams);

                if (personaFromUTM) {
                  console.log(
                    `UTM campaign detected, skipping latest chat persona selection`,
                  );
                } else {
                  // Extract the latest persona from the most recent chat (fallback)
                  if (finalChats.length > 0) {
                    const latestChat = finalChats[0]; // First chat is the most recent
                    if (latestChat.persona) {
                      // Set the persona in AppContext
                      setSelectedPersona(latestChat.persona);
                    }
                  }
                }
              }

              return finalChats;
            });
          });

          return prev;
        });
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChatHistory([]);
      } finally {
        setLoading(false);
      }
    };

    if (user && hasSecretKey) {
      getChats();
    } else {
      setLoading(false);
      setChatHistory([]);
      return;
    }

    const handleSidebarRefresh = () => {
      if (isCreatingChat) {
        return;
      }

      LocalStorageService.removeUntitledChats();

      getChats();
    };
    window.addEventListener("sidebar:refresh", handleSidebarRefresh);
    return () => {
      window.removeEventListener("sidebar:refresh", handleSidebarRefresh);
    };
  }, [user, hasSecretKey, decrypt, isCreatingChat]); // Added hasSecretKey dependency

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (_event: MouseEvent) => {
      if (contextMenuChatId) {
        setContextMenuChatId(null);
      }
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    if (contextMenuChatId || isUserMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenuChatId, isUserMenuOpen]);

  const handleDeleteChat = async (chatId: string) => {
    if (isDeleting) return;

    setIsDeleting(true);
    setContextMenuChatId(null);

    try {
      const response = await fetch("/api/deleteChat", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });

      if (response.ok) {
        // Remove from local state
        setChatHistory((prev) => prev.filter((chat) => chat._id !== chatId));

        // Remove from localStorage
        LocalStorageService.removeChatFromHistory(chatId);

        // If we're currently viewing the deleted chat, redirect to home
        if (currentChatId === chatId) {
          router.push("/app");
        }
      } else {
        console.error("Failed to delete chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRenameChat = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
    setContextMenuChatId(null);
  };

  const handleSaveRename = async (chatId: string) => {
    if (isRenaming || !editingTitle.trim()) return;

    // Check if title exceeds 50 character limit
    if (editingTitle.trim().length > 50) {
      console.warn(
        "Title exceeds 50 character limit:",
        editingTitle.trim().length,
      );
      return;
    }

    setIsRenaming(true);

    try {
      // Sanitize the title before encryption
      const sanitizedTitle = editingTitle
        .trim()
        .replace(/[<>]/g, "") // Remove potential HTML tags
        .replace(/[\r\n\t]/g, " "); // Replace line breaks and tabs with spaces

      // Encrypt the title if user has secret key
      let titleToSend = sanitizedTitle;
      if (hasSecretKey) {
        try {
          titleToSend = await encrypt(sanitizedTitle);
        } catch (error) {
          console.error("Error encrypting title for rename:", error);
          // Continue with unencrypted title if encryption fails
        }
      }

      const response = await fetch("/api/updateChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: chatId,
          title: titleToSend,
        }),
      });

      if (response.ok) {
        // Update local state with the sanitized (unencrypted) title for display
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat._id === chatId ? { ...chat, title: sanitizedTitle } : chat,
          ),
        );

        // Update localStorage with the sanitized title
        LocalStorageService.updateChatTitle(chatId, sanitizedTitle);
      } else {
        console.error("Failed to rename chat");
      }
    } catch (error) {
      console.error("Error renaming chat:", error);
    } finally {
      setIsRenaming(false);
      setEditingChatId(null);
      setEditingTitle("");
    }
  };

  const handleCancelRename = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  // User menu handlers
  const handleChangePassphrase = () => {
    // Clear the current passphrase from both context and session storage
    setUserSecretKeySeed("");
    sessionStorage.removeItem("userSecretKeySeed");
    // Open the modal
    setShowSecretKeyModal(true);
    setIsUserMenuOpen(false);
  };

  const handleViewAttestation = () => {
    setIsAttestationModalOpen(true);
    setIsUserMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <div
      className={`
        h-full w-[280px]
        bg-[#000201] flex flex-col
        fixed inset-y-0 left-0 z-40
        md:relative md:inset-auto md:left-auto
        overflow-hidden
        ${isCollapsed ? "hidden" : "block"}
      `}
    >
      <div className="w-full flex flex-col h-full">
        <div className="flex items-center justify-between md:border-neutral-200 shrink-0 px-4 py-8 ">
          <Link href="/app">
            <div className="flex flex-row ">
              <Image
                src="/img/white_logo.svg"
                alt="nilGPT Logo"
                width={24}
                height={24}
                className="dark:hidden"
              />
              <Image
                src="/img/reskin_logo.svg"
                alt="nilGPT Logo"
                width={24}
                height={24}
                className="hidden dark:block"
              />
              <Image
                className="ml-2 dark:hidden"
                src="/img/nilGPT_whiteText.svg"
                alt="nilGPT Logo"
                width={65}
                height={25}
              />
            </div>
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden hover:bg-[#333534] rounded-lg p-2 transition-colors"
            aria-label="Close sidebar"
          >
            <XIcon size={20} className="text-white" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto overflow-x-hidden px-2">
          <button
            data-umami-event="New Chat Clicked"
            disabled={!user}
            className={`w-full text-sm font-medium text-white transition-colors text-left px-4 py-1 rounded-lg plausible-event-name=New+Chat+Clicked+-+Nilia
              ${
                !user
                  ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                  : "hover:bg-[#333534]"
              }`}
            onClick={() => createChat()}
          >
            <div className="flex flex-row justify-between items-center  ">
              <div className="text-white text-center text-md ">New Chat</div>
              <div className="font-normal text-3xl text-[#FFC971] dark:text-white p-0 m-0">
                +
              </div>
            </div>
          </button>
          <div className="pt-8">
            <span className="text-md font-medium text-white px-4 opacity-50">
              Your chats
            </span>
          </div>
          <div className="space-y-0.5">
            {loading ? (
              <div className="px-4 space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-[#333534] rounded-md animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              chatHistory.map((chat) => {
                const isActive = currentChatId === chat._id;
                const showContextMenu = contextMenuChatId === chat._id;
                const isEditing = editingChatId === chat._id;
                const displayTitle =
                  !chat.title || chat.title === "null"
                    ? "Untitled"
                    : chat.title;

                return (
                  <div
                    key={chat._id}
                    className={`w-full flex items-center justify-between text-left px-4 py-2 text-md rounded-md group relative ${
                      isActive
                        ? "bg-[#333534] text-white"
                        : "text-white hover:bg-[#333534]"
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveRename(chat._id);
                              } else if (e.key === "Escape") {
                                handleCancelRename();
                              }
                            }}
                            className="flex-1 bg-transparent text-white border border-[#555] rounded px-2 py-1 text-sm focus:outline-none focus:border-[#FFC971] w-full"
                            maxLength={50}
                            autoFocus
                          />
                          <div className="flex items-center ml-1">
                            <button
                              onClick={() => handleSaveRename(chat._id)}
                              disabled={isRenaming || editingTitle.length > 50}
                              className="disabled:opacity-50 p-0.5"
                            >
                              <CheckIcon
                                size={14}
                                className="text-green-500 hover:text-green-300"
                              />
                            </button>
                            <button
                              onClick={handleCancelRename}
                              className="p-0.5 ml-0.5"
                            >
                              <XIcon
                                size={14}
                                className="text-gray-400 hover:text-gray-300 "
                              />
                            </button>
                          </div>
                        </div>
                        <div
                          className={`text-xs mt-1 ${editingTitle.length > 50 ? "text-red-400" : "text-gray-400"}`}
                        >
                          {editingTitle.length}/50
                          {editingTitle.length > 50 && (
                            <span className="ml-1 text-red-400">
                              (Too long)
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <Link
                          href={`/app/chat/${chat._id}`}
                          className="flex-1 truncate"
                        >
                          {displayTitle}
                        </Link>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setContextMenuChatId(
                              showContextMenu ? null : chat._id,
                            );
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#444] rounded"
                        >
                          <EllipsisVertical
                            size={14}
                            className="text-gray-300"
                          />
                        </button>

                        {showContextMenu && (
                          <div className="absolute right-0 top-full mt-1 w-32 bg-[#2a2a2a] border border-[#444] rounded-lg shadow-lg z-50">
                            <button
                              onClick={() =>
                                handleRenameChat(chat._id, displayTitle)
                              }
                              disabled={isRenaming}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-[#333] rounded-lg transition-colors disabled:opacity-50"
                            >
                              <EditIcon size={14} />
                              Rename
                            </button>
                            <button
                              onClick={() => handleDeleteChat(chat._id)}
                              disabled={isDeleting}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[#333] rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Trash2Icon className="text-red-400" size={14} />
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <Dialog
          open={isAttestationModalOpen}
          onOpenChange={setIsAttestationModalOpen}
        >
          {/* TODO: Add back in when we allow logged out users to expand sidebar */}
          {/* <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="self-center bg-[#FFC971] rounded-full w-fit gap-2 px-4 my-4 hover:bg-[#FFC971]/90"
              data-umami-event="View Attestation Clicked"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span className="text-sm text-black">View Attestation</span>
            </Button>
          </DialogTrigger> */}
          <AttestationModal />
        </Dialog>

        <div className="border-t border-neutral-600 shrink-0 py-3 p-4 relative">
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsUserMenuOpen(!isUserMenuOpen);
              }}
              className="w-8 h-8 rounded-full bg-[#FFC971] dark:bg-[#F7C5FF] flex items-center justify-center text-sm font-medium text-black shrink-0 hover:bg-[#FFD584] dark:hover:bg-[#FEF9FF] transition-colors"
            >
              {initials}
            </button>
            <span className="text-md text-white truncate">{userName}</span>
          </div>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#2a2a2a] border border-[#444] rounded-lg shadow-lg z-50">
              <button
                onClick={handleChangePassphrase}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[#333] rounded-t-lg transition-colors"
                data-umami-event="Change Passphrase Clicked"
              >
                <Shield size={16} />
                Change Passphrase
              </button>
              <button
                onClick={handleViewAttestation}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[#333] transition-colors"
                data-umami-event="View Attestation Clicked"
              >
                <ShieldCheck size={16} />
                View Attestation
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-[#333] rounded-b-lg transition-colors plausible-event-name=Sign+Out+Clicked+-+Nilia"
                data-umami-event="Sign Out Clicked"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Secret Key Modal */}
      <PassphraseModal
        isOpen={showSecretKeyModal}
        onClose={() => setShowSecretKeyModal(false)}
      />
    </div>
  );
};

export default Sidebar;
