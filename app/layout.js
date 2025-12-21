import "./globals.css";

export const metadata = {
  title: "মুফতি আনিছুর রহমান | Mufti Anisur Rahman",
  description: "ইসলামী দাওয়াহ ও শিক্ষামূলক ব্লগ - বাংলাদেশ। কুরআন ও সুন্নাহর আলোকে জীবন গঠনের পথনির্দেশ।",
  keywords: "মুফতি আনিছুর রহমান, ইসলাম, দাওয়াহ, বাংলাদেশ, Islamic, Dawah, Mufti Anisur Rahman",
  authors: [{ name: "Mufti Anisur Rahman" }],
  openGraph: {
    title: "মুফতি আনিছুর রহমান | Mufti Anisur Rahman",
    description: "ইসলামী দাওয়াহ ও শিক্ষামূলক ব্লগ",
    type: "website",
    locale: "bn_BD",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
