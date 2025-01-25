"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

import { AppSidebar } from "@/components/ui/app-sidebar";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/globals/store/user";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore();
  const router = useRouter();
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {
    if (user !== undefined) {
      setIsUserLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (isUserLoaded && !user?.accessToken) {
      router.push("/");
    }
  }, [isUserLoaded, user?.accessToken, router]);

  return (
    <>
      {user && (
        <SidebarProvider>
          <AppSidebar />
          <main
            className="w-full h-full p-6"
          >
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      )}
      {!user && (
        <div className="p-6">{children}</div>
      )}
    </>
  );
}
