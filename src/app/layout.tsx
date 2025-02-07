import type { Metadata } from "next";
import { Noto_Sans} from "next/font/google";
import "./globals.css";
import Background from "@/components/Background"
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
      <body
        className={`${notoSans.variable} antialiased`}
      >
        <Background>
          {children}
        </Background>
      </body>
    </html>
  );
}
