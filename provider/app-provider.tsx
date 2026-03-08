"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { usePathname } from "next/navigation";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  const pathname = usePathname();

  const hideNavAndFooter = ["/auth/login", "/auth/signup"];

  return (
    <QueryClientProvider client={queryClient}>
      {!hideNavAndFooter.includes(pathname) && <Navbar />}
      {children}
      {!hideNavAndFooter.includes(pathname) && <Footer />}
    </QueryClientProvider>
  );
}
