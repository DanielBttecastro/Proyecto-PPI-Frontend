import { Inter } from "next/font/google"; 
import Sidebar from "@/component/sidebar/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sistema de gestión del PPI",
  description: "Sistema de gestión del PPI",
};

export default function RootLayout({ children }) {
  return (
    <Sidebar>
      {children}
    </Sidebar>
  );
}
