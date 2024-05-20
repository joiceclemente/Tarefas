import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Header } from "../components/header";
import Provider from "@/components/provider/page";

const roboto = Roboto({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Tarefas+",
  description: "Criação de um aplicativo de tarefas",
};

export default function RootLayout({
children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={roboto.className}>
          <Provider>
            <Header/>
            {children}
          </Provider>
      </body>
    </html>
  );
}
