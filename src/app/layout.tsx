import type { Metadata } from "next";
import { Inter, Geist, Lora } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/src/components/providers/session-provider";
import { ThemeProvider, THEME_STORAGE_KEY } from "@/src/components/providers/theme-provider";
import { Toaster } from "@/src/components/ui/toaster";
import { cn } from "@/src/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MSSN UI Library",
  description: "Muslim Students Society of Nigeria, University of Ibadan — Digital Library",
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var theme = stored === "light" || stored === "dark" ? stored : "system";
    var resolved = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;
    var root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable, lora.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthSessionProvider>
            {children}
            <Toaster />
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
