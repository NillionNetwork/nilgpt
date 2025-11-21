"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { setTheme } = useTheme();

  const handleGoToApp = () => {
    sessionStorage.setItem("themeVariant", "reskin");
    setTheme("dark");
    router.push("/app");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900">reskin</h1>
      <Button onClick={handleGoToApp}>Go to app</Button>
    </div>
  );
}
