import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getTranslations } from "next-intl/server";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import { LOCALE } from "@/lib/const/environments";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const t = await getTranslations("ui.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang={LOCALE} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          
              <NextIntlClientProvider>{children}</NextIntlClientProvider>
           
        </ThemeProvider>
      </body>
    </html>
  );
}
