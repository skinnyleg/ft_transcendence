import LayoutClinet from "@/app/ui/layoutClient"
import { Metadata } from "next";
import { ContextFriendProvider } from "@/app/context/profileContext";

export const metadata : Metadata = {
  title: 'Profile',
  description: 'Pong Platform Login Page',
  viewport: 'width=device-width, initial-scale=1',
  icons: ''
}

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex bg-main flex-col md:flex-row h-screen overflow-y-auto styled-scrollbar">
      <LayoutClinet>
        <ContextFriendProvider>
          {children}
        </ContextFriendProvider>
      </LayoutClinet>
    </div>
  );
}