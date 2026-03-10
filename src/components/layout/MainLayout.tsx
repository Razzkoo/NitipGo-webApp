import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  isLoggedIn?: boolean;
}

export function MainLayout({
  children,
  showFooter = true,
  isLoggedIn = false,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn={isLoggedIn} />
      <main className={`flex-1 pt-16 md:pt-20 ${isLoggedIn ? "pb-16 md:pb-0" : ""}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}