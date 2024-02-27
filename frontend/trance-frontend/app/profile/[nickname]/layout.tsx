import LayoutClinet from "@/app/ui/layoutClient"
import { Metadata } from "next";
import { ContextFriendProvider } from "@/app/context/profileContext";

export const metadata : Metadata = {
  title: 'Profile',
  description: 'Pong Platform Profile Page',
  icons: ''
}

export const viewport = {
  content: 'width=device-width, initial-scale=1'
}

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex bg-[#D4F1F4] flex-col md:flex-row h-screen overflow-y-auto styled-scrollbar">
      <LayoutClinet>
        <ContextFriendProvider>
          {children}
        </ContextFriendProvider>
      </LayoutClinet>
    </div>
  );
}