import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Package,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Home,
  Clock,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const guestNavLinks = [
  { name: "Beranda", href: "/" },
  { name: "Cara Kerja", href: "/cara-kerja" },
  { name: "Perjalanan", href: "/perjalanan" },
  { name: "FAQ", href: "/faq" },
];

const customerNavLinks = [
  { name: "Beranda", href: "/", icon: Home },
  { name: "Order", href: "/orders", icon: Package },
  { name: "History", href: "/history", icon: Clock },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
];

// Mock user — ganti dengan auth context kamu
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
};

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Nitip<span className="text-primary">Go</span>
          </span>
        </Link>

        {/* ── GUEST: Desktop Nav ── */}
        {!isLoggedIn && (
          <nav className="hidden items-center gap-1 md:flex">
            {guestNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive(link.href)
                    ? "text-primary bg-primary-light"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}

        {/* ── CUSTOMER: Desktop Nav ── */}
        {isLoggedIn && (
          <nav className="hidden items-center gap-1 md:flex">
            {customerNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive(link.href)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            ))}
          </nav>
        )}

        {/* ── GUEST: Auth Buttons ── */}
        {!isLoggedIn && (
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" asChild>
              <Link to="/login">Masuk</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/register">Daftar Sekarang</Link>
            </Button>
          </div>
        )}

        {/* ── CUSTOMER: Notif + Profile ── */}
        {isLoggedIn && (
          <div className="hidden items-center gap-2 md:flex">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
              </Link>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-colors">
                  <img
                    src={mockUser.avatar}
                    alt={mockUser.name}
                    className="h-8 w-8 rounded-full bg-muted"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {mockUser.name}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/20 text-primary">
                      Customer
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
        )}

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── GUEST: Mobile Menu ── */}
      {!isLoggedIn && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border/50 bg-card md:hidden"
            >
              <nav className="container flex flex-col gap-2 py-4">
                {guestNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive(link.href)
                        ? "text-primary bg-primary-light"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="my-2 border-border" />
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Masuk
                </Link>
                <Button variant="hero" className="mx-4" asChild>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    Daftar Sekarang
                  </Link>
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── CUSTOMER: Mobile Bottom Nav (rendered outside header flow) ── */}
      {isLoggedIn && (
        <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-card/90 backdrop-blur-lg border-t border-border">
          <div className="flex items-center justify-around h-16 px-2">
            {customerNavLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative"
                >
                  {active && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute top-0 inset-x-2 h-0.5 bg-primary rounded-full"
                    />
                  )}
                  <link.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-colors",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}