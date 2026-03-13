import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hackathon Pre-Exam | Bacancy",
  description: "Complete the pre-exam before participating in the hackathon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased min-h-screen bg-gray-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
