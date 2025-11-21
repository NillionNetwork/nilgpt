"use client";

import "@/app/globals.css";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";
import Sidebar from "@/components/chat/Sidebar";
import SidebarIcon from "@/components/chat/SidebarIcon";
import SignInButton from "@/components/chat/SignInButton";
import SignOutButton from "@/components/chat/SignOutButton";
import SignUpButton from "@/components/chat/SignUpButton";
import UserCreationHandler from "@/components/UserCreationHandler";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { UnifiedAuthProvider, useAuth } from "@/contexts/UnifiedAuthProvider";
import PrivyProvider from "@/providers/PrivyProvider";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null);
  const { user, signOut } = useAuth();

  const { isSidebarCollapsed, toggleSidebar } = useApp();

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <div
        className={`
              transition-all duration-300 ease-in-out
              ${isSidebarCollapsed ? "w-0" : "w-0 md:w-[280px]"}
              flex-shrink-0 overflow-hidden
            `}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} onClose={toggleSidebar} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-shrink-0 h-20 flex flex-row justify-between items-center px-4 py-4 bg-background z-10">
          <div className="flex items-center">
            <SidebarIcon
              isCollapsed={isSidebarCollapsed}
              onClick={toggleSidebar}
            />
          </div>

          <div>
            {user ? (
              <SignOutButton onSignOut={() => signOut()} />
            ) : (
              <>
                <SignInButton onSignIn={() => setAuthMode("signin")} />
                <SignUpButton onSignUp={() => setAuthMode("signup")} />
              </>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>

      {/* Mobile overlay */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {authMode && (
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
      )}

      {/* Handle automatic user creation in nilDB */}
      <UserCreationHandler />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider>
      <UnifiedAuthProvider>
        <AppProvider>
          <LayoutContent>{children}</LayoutContent>
        </AppProvider>
      </UnifiedAuthProvider>
    </PrivyProvider>
  );
}
