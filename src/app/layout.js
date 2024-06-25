import { Inter } from "next/font/google";
import "./globals.css"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sistema de gestión del PPI",
  description: "Sistema de gestión del PPI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}> 
          {children} 
      </body>
    </html>
  );
}
