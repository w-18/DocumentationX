import type { Metadata } from "next";
import { Noto_Sans} from "next/font/google";
import "./globals.css";
import Background from "@/components/Background"
import { SessionProvider } from "@/context/session-context-provider";
const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "700"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "DocX",
  description: "Make your own documentation site in clicks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
      <body
        className={`${notoSans.variable} antialiased`}
      >
        <Background>
          {children}
        </Background>
      </body>
      </SessionProvider>
    </html>
  );
}
