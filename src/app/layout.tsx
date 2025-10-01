import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getTranslations } from "next-intl/server";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import { LOCALE } from "@/lib/const/environments";
import { AppProvider } from "@/providers/AppProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { getTokens } from "@/lib/const/cookies";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { accessToken, refreshToken, rememberToken } = await getTokens();

  // Determine which token is available for refreshing: refreshToken or rememberToken
  const tokenKey = refreshToken
    ? "refreshToken"
    : rememberToken
    ? "rememberToken"
    : null;

  return (
    <html lang={LOCALE} suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
      </head>
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
          {" "}
          <NextIntlClientProvider>
            <AppProvider>
              <AuthProvider accessToken={accessToken} tokenKey={tokenKey}>
                {children}
              </AuthProvider>
            </AppProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
