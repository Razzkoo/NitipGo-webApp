import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  LayoutDashboard,
  Clock,
  User,
  LogOut,
  Bell,
  Settings,
  ChevronDown,
  Home,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomerLayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const customerNavItems: NavItem[] = [
  { name: "Beranda", href: "/", icon: Home },
  { name: "Order", href: "/orders", icon: Package },
  { name: "Riwayat", href: "/history", icon: Clock },
  { name: "Profil", href: "/profile", icon: User },
];

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
};

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const location = useLocation();

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const activeItem = customerNavItems.find((item) => isActiveLink(item.href));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="flex h-full items-center justify-between px-4 max-w-5xl mx-auto w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Nitip<span className="text-primary">Go</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {customerNavItems.slice(0, 3).map((item) => {
              const isActive = isActiveLink(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Search - Desktop */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-colors">
                  <img
                    src={mockUser.avatar}
                    alt={mockUser.name}
                    className="h-8 w-8 rounded-full bg-muted"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {mockUser.name}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/20 text-primary">
                      Customer
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{mockUser.name}</p>
                  <p className="text-xs text-muted-foreground">{mockUser.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Pengaturan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
                  <Link to="/" className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Keluar
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto pb-20 md:pb-0"
      >
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          {children}
        </div>
      </motion.main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-card/90 backdrop-blur-lg border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {customerNavItems.map((item) => {
            const isActive = isActiveLink(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 inset-x-2 h-0.5 bg-primary rounded-full"
                  />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}