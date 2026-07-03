import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Bifrost - Compartilhamento de Conhecimento e Ensinamentos',
  description: 'Uma plataforma nórdica de compartilhamento de todo tipo de conhecimento, artigos e revisões assistidas com Inteligência Artificial.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#F3F6F9] text-[#0b2046] antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}

