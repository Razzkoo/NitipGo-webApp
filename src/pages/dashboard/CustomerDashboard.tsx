import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Plus,
  Clock,
  CheckCircle,
  MapPin,
  ArrowRight,
  ShoppingBag,
  HelpCircle,
  MessageCircle,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CountUp } from "@/components/ui/CountUp";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Mock data
const recentOrders = [
  {
    id: "ORD-001",
    item: "Sepatu Nike Air Max",
    from: "Jakarta",
    to: "Bandung",
    status: "in_progress" as const,
    traveler: "Andi Pratama",
    date: "15 Feb 2024",
  },
  {
    id: "ORD-002",
    item: "Oleh-oleh Jogja",
    from: "Yogyakarta",
    to: "Jakarta",
    status: "completed" as const,
    traveler: "Sari Dewi",
    date: "10 Feb 2024",
  },
];

const stats = [
  { label: "Total Order", value: 12, icon: Package, color: "text-primary", bgColor: "bg-primary/10" },
  { label: "Dalam Proses", value: 2, icon: Clock, color: "text-warning", bgColor: "bg-warning/10" },
  { label: "Selesai", value: 10, icon: CheckCircle, color: "text-success", bgColor: "bg-success/10" },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CustomerDashboard() {
  const { toast } = useToast();
  const [showOrderModal, setShowOrderModal] = useState(false);

  return (
    <DashboardLayout role="customer">
      <div className="p-6 md:p-8 lg:p-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-lg bg-primary/10 p-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
              </div>
          
              <div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  Dashboard Customer
                </h1>
                <p className="text-sm text-muted-foreground">
                  Selamat Datang Kembali!, Kelola order dan perjalananmu dengan mudah di sini
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-3 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-card p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">
                    <CountUp end={stat.value} duration={1500} />
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid gap-4 md:grid-cols-2 mb-8 max-w-3xl mx-auto"
        >
          <motion.div className="rounded-2xl bg-gradient-primary p-6 text-primary-foreground">
            <Link to="/order/new?type=titip-beli" className="block text-center">
              <Package className="h-10 w-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Titip Beli Barang</h3>
              <p className="opacity-80 mb-4">
                Minta traveler membelikan barang dari kota lain
              </p>
              <Button variant="white">
                Mulai <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div className="rounded-2xl bg-gradient-to-br from-accent to-accent/80 p-6 text-accent-foreground">
            <Link to="/order/new?type=kirim" className="block text-center">
              <MapPin className="h-10 w-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Kirim Barang</h3>
              <p className="opacity-80 mb-4">
                Titipkan barang Anda ke traveler yang bepergian
              </p>
              <Button variant="white">
                Mulai <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-card p-6 shadow-card"
        >
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">Order Terbaru</h2>
            <Button variant="ghost" asChild>
              <Link to="/history">Lihat Semua</Link>
            </Button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="p-4 rounded-xl bg-muted/50 flex flex-col md:flex-row gap-4"
                >
                  <div className="flex-1">
                    <div className="flex gap-2 mb-1">
                      <span className="text-sm text-muted-foreground">{order.id}</span>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                    <p className="font-semibold">{order.item}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/order/${order.id}`}>Detail</Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ShoppingBag}
              title="Belum ada order"
              description="Mulai buat order pertama Anda"
              actionLabel="Buat Order"
              actionHref="/order/new"
            />
          )}
        </motion.div>

        {/* Help Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="rounded-2xl border p-6 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Butuh Bantuan?</h3>
                <p className="text-sm text-muted-foreground">
                  Jika order kamu bermasalah atau dibatalkan, kami siap membantu.
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/help">
                <MessageCircle className="h-4 w-4 mr-2" />
                Pusat Bantuan
              </Link>
            </Button>
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
