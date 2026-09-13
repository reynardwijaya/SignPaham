import type { Metadata } from "next";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import OfflineOverlay from "@/components/ui/OfflineOverlay";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SignPaham - Belajar BISINDO Interaktif",
  description: "Platform edukasi interaktif untuk mempelajari Bahasa Isyarat Indonesia (BISINDO)",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SignPaham",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${fredoka.variable} ${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-cream text-text-primary">
        <AuthProvider>
          <ToastProvider>
            <AuthModalProvider>
              {children}
              <OfflineOverlay />
            </AuthModalProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
