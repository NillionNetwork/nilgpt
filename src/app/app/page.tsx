"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import StreamingChatArea from "@/components/chat/StreamingChatArea";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/UnifiedAuthProvider";
import { captureAndStoreUTMParameters } from "@/utils/utmTracking";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { selectedPersona } = useApp();
  const { user } = useAuth();

  // Capture UTM parameters when landing on app page (e.g., from email confirmation)
  useEffect(() => {
    const utmParams = captureAndStoreUTMParameters();
    if (Object.keys(utmParams).length > 0) {
      console.log("UTM parameters captured on app page:", utmParams);
    }
  }, []);

  useEffect(() => {
    if (!user?.isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }
    // Only run on first visit to '/app'
    if (typeof window !== "undefined" && window.location.pathname === "/app") {
      const createAndRedirect = async () => {
        const newChatId = uuidv4();
        window.location.href = `/app/chat/${newChatId}`;
      };

      createAndRedirect();
    } else {
      setLoading(false);
    }
  }, [router, user]);

  return (
    <div className="flex flex-col h-full">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : (
        <StreamingChatArea model={selectedPersona} />
      )}
    </div>
  );
}
