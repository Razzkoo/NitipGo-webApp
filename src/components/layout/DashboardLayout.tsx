import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  LayoutDashboard, 
  Clock, 
  PlaneIcon,
  User, 
  Banknote,
  LogOut,
  Menu,
  X,
  Wallet,
  Rocket,
  Crown,
  Users,
  Settings,
  AlertTriangle,
  Route,
  ChevronDown,
  Bell,
  UserCheck,
  UserCog,
  Megaphone,
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

type UserRole = "traveler" | "admin";

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: { name: string; href: string; icon: React.ElementType }[];
}

const travelerNavItems: NavItem[] = [
  { name: "Dashboard", href: "/traveler", icon: LayoutDashboard },
  { name: "Perjalanan", href: "/traveler/trip", icon: PlaneIcon },
  { name: "Order", href: "/traveler/orders", icon: Package },
  { name: "Saldo", href: "/traveler/wallet", icon: Wallet },
];

const adminNavItems: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    children: [
      { name: "Customer", href: "/admin/users", icon: UserCheck },
      { name: "Traveler", href: "/admin/usertraveler", icon: UserCog },
    ],
  },
  { name: "Transaksi", href: "/admin/transactions", icon: Banknote },
  { name: "Kota & Rute", href: "/admin/routes", icon: Route },
  { name: "Dispute", href: "/admin/disputes", icon: AlertTriangle },
  { name: "Saldo", href: "/admin/wallet", icon: Wallet },
  { name: "Rating", href: "/admin/rating", icon: Crown },
  {
    name: "Langganan",
    href: "/admin/langganan",
    icon: Rocket,
    children: [
      { name: "Booster", href: "/admin/boosters", icon: Rocket },
      { name: "Iklan", href: "/admin/iklan", icon: Megaphone },
    ],
  },
];

const roleConfig = {
  traveler: {
    label: "Traveler",
    color: "bg-accent/20 text-accent",
    items: travelerNavItems,
  },
  admin: {
    label: "Admin",
    color: "bg-destructive/20 text-destructive",
    items: adminNavItems,
  },
};

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
};

// Komponen untuk nav item biasa
function SidebarNavItem({
  item,
  isActive,
  index,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={item.href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span>{item.name}</span>
      </Link>
    </motion.div>
  );
}

// Komponen untuk nav item dengan dropdown
function SidebarDropdownItem({
  item,
  isAnyChildActive,
  isOpen,
  onToggle,
  onLinkClick,
  index,
  isChildActive,
}: {
  item: NavItem;
  isAnyChildActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onLinkClick: () => void;
  index: number;
  isChildActive: (href: string) => boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Parent Button */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
          isAnyChildActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span className="flex-1 text-left">{item.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      {/* Children */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-3">
              {item.children!.map((child) => {
                const childActive = isChildActive(child.href);
                return (
                  <Link
                    key={child.href}
                    to={child.href}
                    onClick={onLinkClick}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      childActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <child.icon className="h-4 w-4 shrink-0" />
                    <span>{child.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const config = roleConfig[role];

  const isActiveLink = (href: string) => {
    if (href === "/traveler" || href === "/admin") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const isAnyChildActive = (item: NavItem) => {
    return item.children?.some((child) => isActiveLink(child.href)) ?? false;
  };

  const toggleDropdown = (href: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  // Auto-buka dropdown kalau salah satu child-nya aktif
  const isDropdownOpen = (item: NavItem) => {
    return openDropdowns[item.href] ?? isAnyChildActive(item);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Nitip<span className="text-primary">Go</span>
            </span>
          </Link>
          <button
            className="lg:hidden p-2 hover:bg-muted rounded-lg"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {config.items.map((item, i) => {
            // Item dengan dropdown
            if (item.children && item.children.length > 0) {
              return (
                <SidebarDropdownItem
                  key={item.href}
                  item={item}
                  index={i}
                  isAnyChildActive={isAnyChildActive(item)}
                  isOpen={isDropdownOpen(item)}
                  onToggle={() => toggleDropdown(item.href)}
                  onLinkClick={() => setSidebarOpen(false)}
                  isChildActive={isActiveLink}
                />
              );
            }

            // Item biasa
            return (
              <SidebarNavItem
                key={item.href}
                item={item}
                index={i}
                isActive={isActiveLink(item.href)}
                onClick={() => setSidebarOpen(false)}
              />
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            asChild
          >
            <Link to="/">
              <LogOut className="h-5 w-5" />
              <span>Keluar</span>
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="flex h-full items-center justify-between px-4 lg:px-6">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden lg:block" />

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link to={
                  role === "traveler" ? "/traveler/notifications" :
                  "/admin/notifications"
                }>
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                </Link>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors">
                    <img
                      src={mockUser.avatar}
                      alt={mockUser.name}
                      className="h-8 w-8 rounded-full bg-muted"
                    />
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-foreground">{mockUser.name}</p>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", config.color)}>
                        {config.label}
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
                    <Link to={
                      role === "traveler" ? "/traveler/profile" :
                      "/admin/profile"
                    } className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={
                      role === "traveler" ? "/traveler/settings" :
                      "/admin/settings"
                    } className="cursor-pointer">
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
          className="flex-1 overflow-auto"
        >
          {children}
        </motion.main>
      </div>
      </div>
  );
}