import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "康德研究图谱",
  description: "围绕康德研究问题、进路、学者与论文关系的探索型网站。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
