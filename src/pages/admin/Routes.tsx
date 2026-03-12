import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Package, Search, Eye, MapPin, AlertTriangle, Ban,
  CheckCircle, Clock, Truck, ShoppingBag, X,
  ArrowRight, Star, Flag, Calendar,
  DollarSign, AlertCircle,
  RefreshCw, Download, Bell, Shield, Zap,
  Navigation, Hash, Weight, CreditCard, FileText,
  UserX, Info, Route,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CountUp } from "@/components/ui/CountUp";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ─────────────────────────────────────────────────────────────────────

type OrderStatus = "pending" | "in_transit" | "completed" | "problematic" | "cancelled";
type OrderType   = "titip_beli" | "kirim_barang";
type PayStatus   = "paid" | "held" | "refunded" | "pending";

type Order = {
  id: string;
  type: OrderType;
  status: OrderStatus;
  priority: string;
  createdAt: string;
  estimatedDelivery: string;
  customer: { name: string; phone: string; rating: number; totalOrders: number; avatar: string };
  traveler: { name: string; phone: string; rating: number; totalTrips: number; verified: boolean; avatar: string };
  route: { from: string; to: string };
  items: { name: string; qty: number; price: number; weight: string; note: string }[];
  totalValue: number;
  serviceFee: number;
  paymentStatus: PayStatus;
  paymentMethod: string;
  tracking: { time: string; status: string; location: string; done: boolean; warning?: boolean; cancelled?: boolean }[];
  reportHistory: { date: string; type: string; message: string; reportedBy: string }[];
  notes: string;
  flagged?: boolean;
  cancelReason?: string;
  customerRating?: number;
  customerReview?: string;
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockOrders: Order[] = [
  {
    id: "ORD-2024-0891", type: "titip_beli", status: "in_transit", priority: "normal",
    createdAt: "2024-12-10 08:30", estimatedDelivery: "2024-12-12",
    customer: { name: "Rina Kusuma", phone: "0812-3456-7890", rating: 4.8, totalOrders: 23, avatar: "RK" },
    traveler: { name: "Budi Santoso", phone: "0857-9012-3456", rating: 4.9, totalTrips: 87, verified: true, avatar: "BS" },
    route: { from: "Jakarta", to: "Bandung" },
    items: [
      { name: "Sepatu Nike Air Max 270", qty: 1, price: 1450000, weight: "0.8 kg", note: "Size 42, warna putih" },
      { name: "Kaos Polos Uniqlo", qty: 3, price: 299000, weight: "0.3 kg", note: "Warna hitam, putih, abu" },
    ],
    totalValue: 1749000, serviceFee: 87450,
    paymentStatus: "paid", paymentMethod: "Transfer Bank",
    tracking: [
      { time: "08:30", status: "Order dibuat", location: "Jakarta", done: true },
      { time: "09:15", status: "Traveler menerima order", location: "Jakarta", done: true },
      { time: "11:00", status: "Barang dibeli oleh traveler", location: "Jakarta - Grand Indonesia", done: true },
      { time: "14:30", status: "Dalam perjalanan ke Bandung", location: "Tol Jakarta-Bandung", done: true },
      { time: "—", status: "Tiba di Bandung", location: "Bandung", done: false },
      { time: "—", status: "Barang diterima customer", location: "Bandung", done: false },
    ],
    reportHistory: [], notes: "Tolong beliin yang ada diskon ya kak",
  },
  {
    id: "ORD-2024-0890", type: "kirim_barang", status: "pending", priority: "high",
    createdAt: "2024-12-10 07:45", estimatedDelivery: "2024-12-11",
    customer: { name: "Dewi Rahayu", phone: "0821-5678-9012", rating: 4.5, totalOrders: 8, avatar: "DR" },
    traveler: { name: "Sari Wulandari", phone: "0878-3456-7890", rating: 4.7, totalTrips: 42, verified: true, avatar: "SW" },
    route: { from: "Surabaya", to: "Malang" },
    items: [{ name: "Kue Ulang Tahun", qty: 1, price: 350000, weight: "2.5 kg", note: "FRAGILE - handle with care" }],
    totalValue: 350000, serviceFee: 52500,
    paymentStatus: "paid", paymentMethod: "GoPay",
    tracking: [
      { time: "07:45", status: "Order dibuat", location: "Surabaya", done: true },
      { time: "08:00", status: "Menunggu traveler", location: "Surabaya", done: true },
      { time: "—", status: "Traveler menerima order", location: "Surabaya", done: false },
      { time: "—", status: "Barang diambil dari pengirim", location: "Surabaya", done: false },
      { time: "—", status: "Dalam perjalanan ke Malang", location: "", done: false },
      { time: "—", status: "Barang diterima penerima", location: "Malang", done: false },
    ],
    reportHistory: [], notes: "Tolong hati-hati, barangnya sangat mudah pecah",
  },
  {
    id: "ORD-2024-0889", type: "titip_beli", status: "completed", priority: "normal",
    createdAt: "2024-12-09 10:00", estimatedDelivery: "2024-12-10",
    customer: { name: "Agus Hermawan", phone: "0813-2345-6789", rating: 4.2, totalOrders: 5, avatar: "AH" },
    traveler: { name: "Citra Dewi", phone: "0852-6789-0123", rating: 4.6, totalTrips: 31, verified: false, avatar: "CD" },
    route: { from: "Yogyakarta", to: "Semarang" },
    items: [
      { name: "Batik Tulis Malioboro", qty: 2, price: 275000, weight: "0.5 kg", note: "Motif parang, ukuran XL" },
      { name: "Gudeg Kaleng Yu Djum", qty: 5, price: 45000, weight: "1.2 kg", note: "" },
    ],
    totalValue: 775000, serviceFee: 38750,
    paymentStatus: "paid", paymentMethod: "OVO",
    tracking: [
      { time: "10:00", status: "Order dibuat", location: "Yogyakarta", done: true },
      { time: "10:30", status: "Traveler menerima order", location: "Yogyakarta", done: true },
      { time: "12:00", status: "Barang dibeli", location: "Malioboro, Yogyakarta", done: true },
      { time: "15:00", status: "Dalam perjalanan", location: "Tol Yogya-Semarang", done: true },
      { time: "18:30", status: "Tiba di Semarang", location: "Semarang", done: true },
      { time: "19:00", status: "Barang diterima customer", location: "Semarang", done: true },
    ],
    reportHistory: [], notes: "",
    customerRating: 5, customerReview: "Travelernya ramah dan barangnya aman sampai!",
  },
  {
    id: "ORD-2024-0888", type: "kirim_barang", status: "problematic", priority: "urgent",
    createdAt: "2024-12-08 09:00", estimatedDelivery: "2024-12-09",
    customer: { name: "Hendra Wijaya", phone: "0819-8765-4321", rating: 3.9, totalOrders: 12, avatar: "HW" },
    traveler: { name: "Reza Pratama", phone: "0856-1234-5678", rating: 2.1, totalTrips: 15, verified: true, avatar: "RP" },
    route: { from: "Medan", to: "Padang" },
    items: [{ name: "Laptop Asus ROG", qty: 1, price: 15000000, weight: "3.2 kg", note: "Barang elektronik mahal" }],
    totalValue: 15000000, serviceFee: 750000,
    paymentStatus: "held", paymentMethod: "Transfer Bank",
    tracking: [
      { time: "09:00", status: "Order dibuat", location: "Medan", done: true },
      { time: "09:30", status: "Traveler menerima order", location: "Medan", done: true },
      { time: "11:00", status: "Barang diambil", location: "Medan", done: true },
      { time: "—", status: "Dalam perjalanan (tidak ada kabar)", location: "?", done: false, warning: true },
      { time: "—", status: "Tiba di Padang", location: "Padang", done: false },
      { time: "—", status: "Barang diterima", location: "Padang", done: false },
    ],
    reportHistory: [
      { date: "2024-12-09 10:00", type: "customer_report", message: "Traveler tidak bisa dihubungi sejak kemarin sore. Barang laptop senilai 15 juta belum sampai.", reportedBy: "Customer" },
    ],
    notes: "HIGH VALUE - butuh perhatian khusus", flagged: true,
  },
  {
    id: "ORD-2024-0887", type: "titip_beli", status: "cancelled", priority: "normal",
    createdAt: "2024-12-07 14:00", estimatedDelivery: "2024-12-09",
    customer: { name: "Lia Amelia", phone: "0822-3456-7890", rating: 4.7, totalOrders: 31, avatar: "LA" },
    traveler: { name: "Anton Sugiarto", phone: "0813-7890-1234", rating: 4.3, totalTrips: 58, verified: true, avatar: "AS" },
    route: { from: "Bali", to: "Jakarta" },
    items: [{ name: "Kopi Kintamani 1kg", qty: 2, price: 85000, weight: "1.1 kg", note: "" }],
    totalValue: 170000, serviceFee: 0,
    paymentStatus: "refunded", paymentMethod: "Dana",
    tracking: [
      { time: "14:00", status: "Order dibuat", location: "Bali", done: true },
      { time: "14:15", status: "Traveler menerima order", location: "Bali", done: true },
      { time: "15:00", status: "Order dibatalkan oleh traveler", location: "Bali", done: true, cancelled: true },
    ],
    reportHistory: [], notes: "Traveler mendadak cancel karena penerbangan batal",
    cancelReason: "Penerbangan traveler dibatalkan maskapai",
  },
  {
    id: "ORD-2024-0886", type: "kirim_barang", status: "in_transit", priority: "normal",
    createdAt: "2024-12-10 06:00", estimatedDelivery: "2024-12-10",
    customer: { name: "Tono Prasetyo", phone: "0817-6543-2109", rating: 4.6, totalOrders: 17, avatar: "TP" },
    traveler: { name: "Maya Sari", phone: "0859-2345-6789", rating: 4.8, totalTrips: 63, verified: true, avatar: "MS" },
    route: { from: "Semarang", to: "Solo" },
    items: [{ name: "Dokumen Penting & Kontrak", qty: 1, price: 0, weight: "0.2 kg", note: "RAHASIA - jangan dibuka" }],
    totalValue: 0, serviceFee: 75000,
    paymentStatus: "paid", paymentMethod: "Transfer Bank",
    tracking: [
      { time: "06:00", status: "Order dibuat", location: "Semarang", done: true },
      { time: "06:30", status: "Dokumen diambil traveler", location: "Semarang", done: true },
      { time: "07:45", status: "Dalam perjalanan ke Solo", location: "Jalan Solo-Semarang", done: true },
      { time: "—", status: "Tiba di Solo", location: "Solo", done: false },
      { time: "—", status: "Dokumen diserahkan", location: "Solo", done: false },
    ],
    reportHistory: [], notes: "",
  },
];

// ─── Config ────────────────────────────────────────────────────────────────────

const statusConfig: Record<OrderStatus, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  pending:     { label: "Menunggu",         color: "bg-amber-50 text-amber-700 border border-amber-200",   dot: "bg-amber-500",   icon: Clock },
  in_transit:  { label: "Dalam Perjalanan", color: "bg-blue-50 text-blue-700 border border-blue-200",     dot: "bg-blue-500",    icon: Truck },
  completed:   { label: "Selesai",          color: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500", icon: CheckCircle },
  problematic: { label: "Bermasalah",       color: "bg-red-50 text-red-700 border border-red-200",        dot: "bg-red-500",     icon: AlertTriangle },
  cancelled:   { label: "Dibatalkan",       color: "bg-zinc-100 text-zinc-500 border border-zinc-200",    dot: "bg-zinc-400",    icon: X },
};

const typeConfig: Record<OrderType, { label: string; color: string; icon: React.ElementType }> = {
  titip_beli:   { label: "Titip Beli",   color: "bg-violet-50 text-violet-700", icon: ShoppingBag },
  kirim_barang: { label: "Kirim Barang", color: "bg-cyan-50 text-cyan-700",     icon: Package },
};

const paymentConfig: Record<string, { label: string; color: string }> = {
  paid:     { label: "Lunas",          color: "text-emerald-600" },
  held:     { label: "Ditahan",        color: "text-amber-600" },
  refunded: { label: "Dikembalikan",   color: "text-zinc-500" },
  pending:  { label: "Belum Bayar",    color: "text-red-500" },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const avatarPalette = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-amber-500","bg-rose-500","bg-cyan-500","bg-indigo-500","bg-pink-500"];
const getAvatarColor = (s: string) => avatarPalette[s.charCodeAt(0) % avatarPalette.length];

// ─── Animations ────────────────────────────────────────────────────────────────

const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const staggerItem      = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.2 } } };

// ─── Micro Components ──────────────────────────────────────────────────────────

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-11 h-11 text-base" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} ${getAvatarColor(initials)} rounded-full flex items-center justify-center text-white font-bold shrink-0`}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function TypeBadge({ type }: { type: OrderType }) {
  const cfg = typeConfig[type];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function FilterChip({ label, active, onClick, activeClass }: {
  label: string; active: boolean; onClick: () => void; activeClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-8 rounded-full px-4 text-xs font-semibold transition-all duration-150 border ${
        active
          ? (activeClass ?? "bg-primary text-primary-foreground border-primary shadow-sm")
          : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      {label}
    </button>
  );
}

function SummaryCard({ icon: Icon, label, value, fmtValue, color, bg }: {
  icon: React.ElementType; label: string; value?: number; fmtValue?: string; color: string; bg: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">{label}</p>
        <div className={`${bg} p-1.5 rounded-lg`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
      <p className={`text-2xl font-bold ${color}`}>
        {fmtValue ?? <CountUp end={value ?? 0} duration={1000} />}
      </p>
    </div>
  );
}

// ─── Tracking Modal ────────────────────────────────────────────────────────────

function TrackingModal({ order, onClose }: { order: Order | null; onClose: () => void }) {
  if (!order) return null;
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Navigation className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Lacak Order — {order.id}</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {order.route.from} → {order.route.to} · {typeConfig[order.type].label}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Route bar */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
          <div className="text-center flex-1">
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Asal</p>
            <p className="font-semibold text-sm">{order.route.from}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-1 justify-center">
            <div className="h-px flex-1 bg-zinc-200" />
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
              <Truck className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>
          <div className="text-center flex-1">
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Tujuan</p>
            <p className="font-semibold text-sm">{order.route.to}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-0 mt-1">
          {order.tracking.map((step, i) => {
            const isLast   = i === order.tracking.length - 1;
            const isActive = !step.done && (i === 0 || order.tracking[i - 1].done);
            return (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 z-10 ${
                    step.cancelled ? "border-red-300 bg-red-50" :
                    step.warning   ? "border-amber-300 bg-amber-50 animate-pulse" :
                    step.done      ? "border-emerald-300 bg-emerald-50" :
                    isActive       ? "border-primary bg-primary/10 animate-pulse" :
                    "border-zinc-200 bg-zinc-50"
                  }`}>
                    {step.cancelled ? <X className="w-3.5 h-3.5 text-red-500" /> :
                     step.warning   ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> :
                     step.done      ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> :
                     isActive       ? <Zap className="w-3.5 h-3.5 text-primary" /> :
                     <div className="w-2 h-2 rounded-full bg-zinc-300" />}
                  </div>
                  {!isLast && (
                    <div className={`w-px flex-1 my-1 ${step.done ? "bg-emerald-200" : "bg-zinc-100"}`} style={{ minHeight: 24 }} />
                  )}
                </div>
                <div className={`pb-4 flex-1 ${isLast ? "pb-0" : ""}`}>
                  <p className={`text-sm font-medium ${
                    step.cancelled ? "text-red-600" :
                    step.done      ? "text-zinc-900" :
                    "text-zinc-400"
                  }`}>
                    {step.status}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {step.location && (
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{step.location}
                      </span>
                    )}
                    {step.time !== "—" && (
                      <span className="text-xs text-zinc-400">{step.time}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-100">
          {[
            { label: "Customer", person: order.customer },
            { label: "Traveler", person: order.traveler },
          ].map(({ label, person }) => (
            <div key={label} className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wide mb-2">{label}</p>
              <div className="flex items-center gap-2">
                <Avatar initials={person.avatar} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{person.name}</p>
                  <p className="text-xs text-zinc-400">{person.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" className="w-full" onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Detail Modal ──────────────────────────────────────────────────────────────

function DetailModal({ order, onClose, onReport }: {
  order: Order | null; onClose: () => void; onReport: (o: Order) => void;
}) {
  if (!order) return null;
  const pay = paymentConfig[order.paymentStatus];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Hash className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-lg">{order.id}</DialogTitle>
                {order.flagged && (
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-200 font-semibold">
                    ⚑ Bermasalah
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <TypeBadge type={order.type} />
                <StatusBadge status={order.status} />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Items table */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1.5 mb-2.5">
              <Package className="w-3.5 h-3.5" /> Detail Barang
            </p>
            <div className="rounded-xl border border-zinc-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="text-left px-3 py-2 text-xs text-zinc-400 font-semibold">Barang</th>
                    <th className="text-center px-3 py-2 text-xs text-zinc-400 font-semibold">Qty</th>
                    <th className="text-center px-3 py-2 text-xs text-zinc-400 font-semibold">Berat</th>
                    <th className="text-right px-3 py-2 text-xs text-zinc-400 font-semibold">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i} className="border-t border-zinc-50">
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-zinc-900">{item.name}</p>
                        {item.note && <p className="text-xs text-amber-600 mt-0.5">{item.note}</p>}
                      </td>
                      <td className="px-3 py-2.5 text-center text-zinc-500">{item.qty}</td>
                      <td className="px-3 py-2.5 text-center text-zinc-500">{item.weight}</td>
                      <td className="px-3 py-2.5 text-right font-medium">{fmt(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-zinc-50 border-t border-zinc-100">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-xs text-zinc-400">Nilai Barang</td>
                    <td className="px-3 py-2 text-right font-semibold text-sm">{fmt(order.totalValue)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-xs text-zinc-400">Biaya Jasa (5%)</td>
                    <td className="px-3 py-2 text-right font-semibold text-sm">{fmt(order.serviceFee)}</td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td colSpan={3} className="px-3 py-2.5 text-sm font-bold text-zinc-900">Total</td>
                    <td className="px-3 py-2.5 text-right font-bold text-primary">{fmt(order.totalValue + order.serviceFee)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment + Route */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Pembayaran
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-zinc-400">Metode</span><span className="font-medium text-zinc-900">{order.paymentMethod}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Status</span><span className={`font-semibold ${pay.color}`}>{pay.label}</span></div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
                <Route className="w-3.5 h-3.5" /> Rute
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-900">{order.route.from}</span>
                <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-semibold text-primary">{order.route.to}</span>
              </div>
              <p className="text-xs text-zinc-400">Est. {order.estimatedDelivery}</p>
            </div>
          </div>

          {/* People */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Customer", person: order.customer, meta: `${order.customer.totalOrders} order` },
              { label: "Traveler", person: order.traveler, meta: `${order.traveler.totalTrips} trip` },
            ].map(({ label, person, meta }) => (
              <div key={label} className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-3">{label}</p>
                <div className="flex items-center gap-2.5 mb-2">
                  <Avatar initials={person.avatar} size="md" />
                  <div>
                    <p className="font-semibold text-sm text-zinc-900">{person.name}</p>
                    <p className="text-xs text-zinc-400">{person.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {person.rating}
                  </span>
                  <span>{meta}</span>
                  {"verified" in person && person.verified && (
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <Shield className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="flex gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">{order.notes}</p>
            </div>
          )}

          {/* Customer review */}
          {order.customerReview && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <p className="text-xs text-emerald-600 font-semibold mb-1.5 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-emerald-500" /> Ulasan Customer
              </p>
              <div className="flex items-center gap-0.5 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < (order.customerRating ?? 0) ? "fill-amber-400 text-amber-400" : "text-zinc-200"}`} />
                ))}
              </div>
              <p className="text-sm text-emerald-700 italic">"{order.customerReview}"</p>
            </div>
          )}

          {/* Report history */}
          {order.reportHistory.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5" /> Riwayat Laporan
              </p>
              {order.reportHistory.map((rep, i) => (
                <div key={i} className="p-3 rounded-xl bg-red-50 border border-red-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-red-600">{rep.reportedBy} melaporkan</span>
                    <span className="text-xs text-zinc-400">{rep.date}</span>
                  </div>
                  <p className="text-sm text-red-700">{rep.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Tutup</Button>
          {order.status !== "completed" && order.status !== "cancelled" && (
            <Button variant="destructive" onClick={() => { onClose(); onReport(order); }} className="flex-1 gap-2">
              <Flag className="w-4 h-4" /> Laporkan Masalah
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Report Modal ──────────────────────────────────────────────────────────────

const reportReasons = [
  "Traveler tidak bisa dihubungi",
  "Barang tidak sampai",
  "Barang rusak / tidak sesuai deskripsi",
  "Traveler meminta uang lebih diluar kesepakatan",
  "Traveler tidak jujur tentang kondisi barang",
  "Penipuan / Fraud",
  "Traveler mengancam customer",
  "Lainnya",
];

function ReportModal({ order, onClose, onSubmit }: {
  order: Order | null;
  onClose: () => void;
  onSubmit: (data: { order: Order; reason: string; action: string; notes: string; holdPayment: boolean }) => void;
}) {
  const [reason, setReason]           = useState("");
  const [customReason, setCustomReason] = useState("");
  const [action, setAction]           = useState("warning");
  const [notes, setNotes]             = useState("");
  const [holdPayment, setHoldPayment] = useState(false);

  if (!order) return null;

  const handleSubmit = () => {
    onSubmit({ order, reason: reason === "Lainnya" ? customReason : reason, action, notes, holdPayment });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <Flag className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-red-600">Laporkan Masalah</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">{order.id} — laporan ditinjau sesuai kebijakan platform</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Traveler info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
          <Avatar initials={order.traveler.avatar} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-zinc-900">{order.traveler.name}</p>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              {order.traveler.rating}
              <span>·</span>
              <span>{order.traveler.totalTrips} trip</span>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            order.traveler.rating < 3 ? "bg-red-50 text-red-600 border border-red-200" : "bg-zinc-100 text-zinc-500"
          }`}>
            {order.traveler.rating < 3 ? "Risiko Tinggi" : "Normal"}
          </span>
        </div>

        <div className="space-y-4">
          {/* Reason */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Alasan Laporan *</p>
            <div className="space-y-1.5">
              {reportReasons.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${
                    reason === r
                      ? "border-red-300 bg-red-50 text-red-700 font-medium"
                      : "border-zinc-200 hover:border-zinc-300 text-zinc-700"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {reason === "Lainnya" && (
              <Input
                className="mt-2 h-10 rounded-xl border-zinc-200"
                placeholder="Jelaskan alasan lainnya..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}
          </div>

          {/* Action */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Tindakan yang Direkomendasikan *</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "warning", label: "Peringatan", icon: AlertCircle, sel: "border-amber-300 bg-amber-50 text-amber-700" },
                { value: "suspend", label: "Suspend",    icon: UserX,       sel: "border-orange-300 bg-orange-50 text-orange-700" },
                { value: "ban",     label: "Ban Permanen", icon: Ban,        sel: "border-red-300 bg-red-50 text-red-700" },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAction(opt.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                      action === opt.value ? opt.sel : "border-zinc-200 text-zinc-400 hover:border-zinc-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hold payment toggle */}
          <button
            onClick={() => setHoldPayment(!holdPayment)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              holdPayment ? "border-amber-300 bg-amber-50" : "border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
              holdPayment ? "border-amber-500 bg-amber-500" : "border-zinc-300"
            }`}>
              {holdPayment && <CheckCircle className="w-3.5 h-3.5 text-white" />}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900">Tahan Pembayaran</p>
              <p className="text-xs text-zinc-400">Dana traveler ditahan hingga kasus selesai</p>
            </div>
          </button>

          {/* Notes */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Catatan Tambahan</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan detail atau bukti yang relevan..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
          <Button
            variant="destructive"
            disabled={!reason || (reason === "Lainnya" && !customReason)}
            onClick={handleSubmit}
            className="flex-1 gap-2"
          >
            <Flag className="w-4 h-4" />
            Kirim Laporan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminRoutes() {
  const { toast } = useToast();
  const [orders, setOrders]           = useState<Order[]>(mockOrders);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | OrderStatus>("all");
  const [filterType, setFilterType]   = useState<"all" | OrderType>("all");
  const [sortBy, setSortBy]           = useState("newest");

  const [detailOrder, setDetailOrder]     = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [reportOrder, setReportOrder]     = useState<Order | null>(null);

  // ── Stats ──
  const stats = useMemo(() => ({
    total:       orders.length,
    inTransit:   orders.filter((o) => o.status === "in_transit").length,
    completed:   orders.filter((o) => o.status === "completed").length,
    problematic: orders.filter((o) => o.status === "problematic").length,
    revenue:     orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.serviceFee, 0),
  }), [orders]);

  // ── Filtered & sorted ──
  const filtered = useMemo(() => {
    let r = [...orders];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.traveler.name.toLowerCase().includes(q) ||
        o.route.from.toLowerCase().includes(q) ||
        o.route.to.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== "all") r = r.filter((o) => o.status === filterStatus);
    if (filterType   !== "all") r = r.filter((o) => o.type   === filterType);
    if (sortBy === "newest")      r.sort((a, b) => b.id.localeCompare(a.id));
    if (sortBy === "highest")     r.sort((a, b) => b.totalValue - a.totalValue);
    if (sortBy === "problematic") r.sort((a, b) => (b.status === "problematic" ? 1 : 0) - (a.status === "problematic" ? 1 : 0));
    return r;
  }, [orders, search, filterStatus, filterType, sortBy]);

  const handleReport = (order: Order) => { setDetailOrder(null); setReportOrder(order); };

  const handleSubmitReport = ({ order, reason, action, notes, holdPayment }: {
    order: Order; reason: string; action: string; notes: string; holdPayment: boolean;
  }) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== order.id) return o;
      return {
        ...o,
        status: action === "ban" || action === "suspend" ? "problematic" : o.status,
        paymentStatus: holdPayment ? "held" : o.paymentStatus,
        flagged: true,
        reportHistory: [...(o.reportHistory ?? []), {
          date: new Date().toLocaleString("id-ID"),
          type: "admin_action",
          message: `${reason}. Tindakan: ${action === "warning" ? "Peringatan" : action === "suspend" ? "Suspend" : "Ban Permanen"}. ${notes}`,
          reportedBy: "Admin",
        }],
      };
    }));

    const actionLabel = action === "warning" ? "Peringatan diberikan" : action === "suspend" ? "Traveler disuspend" : "Traveler dibanned";
    toast({
      title: `Laporan Diproses — ${actionLabel}`,
      description: `Order ${order.id}: ${reason}${holdPayment ? " · Pembayaran ditahan." : ""}`,
      variant: action === "ban" ? "destructive" : "default",
    });
  };

  const countByStatus = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  return (
    <DashboardLayout role="admin">
      <div className="p-6 md:p-8 lg:p-10 space-y-6">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-primary/10 p-2">
              <Route className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">Kelola Perjalanan</h1>
              <p className="text-sm text-muted-foreground">Monitor dan kelola semua order titip beli & kirim barang</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Data diperbarui" })}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* ── SUMMARY CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <SummaryCard icon={Package}       label="Total Order"      value={stats.total}       color="text-primary"       bg="bg-primary/10" />
          <SummaryCard icon={Truck}         label="Dalam Perjalanan" value={stats.inTransit}   color="text-blue-600"      bg="bg-blue-50" />
          <SummaryCard icon={CheckCircle}   label="Selesai"          value={stats.completed}   color="text-emerald-600"   bg="bg-emerald-50" />
          <SummaryCard icon={AlertTriangle} label="Bermasalah"       value={stats.problematic} color="text-red-600"       bg="bg-red-50" />
          <SummaryCard icon={DollarSign}    label="Pendapatan Jasa"  fmtValue={fmt(stats.revenue)} color="text-violet-600" bg="bg-violet-50" />
        </div>

        {/* ── FILTERS ── */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Cari ID order, nama customer/traveler, atau kota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status chips */}
            <div className="space-y-1.5 flex-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Status</p>
              <div className="flex flex-wrap gap-2">
                <FilterChip label={`Semua (${orders.length})`}                                 active={filterStatus === "all"}         onClick={() => setFilterStatus("all")} />
                <FilterChip label={`Menunggu (${countByStatus("pending")})`}                   active={filterStatus === "pending"}     onClick={() => setFilterStatus("pending")}     activeClass="bg-amber-500 text-white border-amber-500" />
                <FilterChip label={`Perjalanan (${countByStatus("in_transit")})`}              active={filterStatus === "in_transit"}  onClick={() => setFilterStatus("in_transit")}  activeClass="bg-blue-600 text-white border-blue-600" />
                <FilterChip label={`Selesai (${countByStatus("completed")})`}                  active={filterStatus === "completed"}   onClick={() => setFilterStatus("completed")}   activeClass="bg-emerald-600 text-white border-emerald-600" />
                <FilterChip label={`Bermasalah (${countByStatus("problematic")})`}             active={filterStatus === "problematic"} onClick={() => setFilterStatus("problematic")} activeClass="bg-red-500 text-white border-red-500" />
                <FilterChip label={`Dibatalkan (${countByStatus("cancelled")})`}               active={filterStatus === "cancelled"}   onClick={() => setFilterStatus("cancelled")}   activeClass="bg-zinc-600 text-white border-zinc-600" />
              </div>
            </div>

            <div className="hidden sm:block w-px bg-zinc-100" />

            {/* Type + Sort */}
            <div className="flex flex-col gap-3 sm:w-56">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Tipe Order</p>
                <div className="flex gap-2">
                  <FilterChip label="Semua"       active={filterType === "all"}          onClick={() => setFilterType("all")} />
                  <FilterChip label="Titip Beli"  active={filterType === "titip_beli"}   onClick={() => setFilterType("titip_beli")} />
                  <FilterChip label="Kirim"       active={filterType === "kirim_barang"} onClick={() => setFilterType("kirim_barang")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Urutan</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-8 px-3 text-xs rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="newest">Terbaru</option>
                  <option value="highest">Nilai Tertinggi</option>
                  <option value="problematic">Bermasalah Dulu</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 bg-zinc-50/60">
            <p className="text-xs font-medium text-zinc-500">
              Menampilkan <span className="text-zinc-900 font-bold">{filtered.length}</span> dari {orders.length} order
            </p>
            {filtered.some((o) => o.flagged) && (
              <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-3 h-3" />
                {filtered.filter((o) => o.flagged).length} order bermasalah
              </span>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            {filtered.length > 0 ? (
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {["Order ID", "Tipe", "Customer & Traveler", "Rute", "Nilai", "Status", "Aksi"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wide first:pl-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <motion.tbody variants={staggerContainer} initial="hidden" animate="show">
                  {filtered.map((order) => (
                    <motion.tr
                      key={order.id}
                      variants={staggerItem}
                      className={`border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors ${
                        order.flagged ? "bg-red-50/40" : ""
                      }`}
                    >
                      {/* ID */}
                      <td className="pl-5 pr-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {order.flagged && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                          <div>
                            <p className="font-mono text-sm font-semibold text-zinc-900">{order.id}</p>
                            <p className="text-xs text-zinc-400">{order.createdAt}</p>
                          </div>
                        </div>
                      </td>
                      {/* Type */}
                      <td className="px-4 py-3.5"><TypeBadge type={order.type} /></td>
                      {/* People */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <Avatar initials={order.customer.avatar} size="sm" />
                            <div className="text-xs">
                              <span className="font-medium text-zinc-900">{order.customer.name}</span>
                              <span className="text-zinc-400 ml-1">(cust)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Avatar initials={order.traveler.avatar} size="sm" />
                            <div className="text-xs">
                              <span className="font-medium text-zinc-900">{order.traveler.name}</span>
                              <span className="text-zinc-400 ml-1">(traveler)</span>
                              {order.traveler.rating < 3 && <span className="text-red-500 ml-1 font-bold">!</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Route */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="font-medium text-zinc-900">{order.route.from}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="font-medium text-primary">{order.route.to}</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">Est. {order.estimatedDelivery}</p>
                      </td>
                      {/* Value */}
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-zinc-900">{fmt(order.totalValue + order.serviceFee)}</p>
                        <p className={`text-xs font-medium ${paymentConfig[order.paymentStatus].color}`}>
                          {paymentConfig[order.paymentStatus].label}
                        </p>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3.5"><StatusBadge status={order.status} /></td>
                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setDetailOrder(order)}
                            className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition"
                          >
                            <Eye className="w-3.5 h-3.5" /> Detail
                          </button>
                          <button
                            onClick={() => setTrackingOrder(order)}
                            className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
                          >
                            <Navigation className="w-3.5 h-3.5" /> Lacak
                          </button>
                          {order.status !== "completed" && order.status !== "cancelled" && (
                            <button
                              onClick={() => setReportOrder(order)}
                              className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                            >
                              <Flag className="w-3.5 h-3.5" /> Lapor
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            ) : (
              <div className="text-center py-16 text-zinc-400">
                <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-sm">Tidak ada order ditemukan</p>
                <p className="text-xs mt-1">Coba ubah filter atau kata kunci pencarian</p>
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-zinc-50">
            {filtered.map((order) => (
              <div
                key={order.id}
                className={`p-4 ${order.flagged ? "bg-red-50/30" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {order.flagged && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                      <span className="font-mono text-sm font-bold text-zinc-900">{order.id}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{order.createdAt}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <TypeBadge type={order.type} />
                  <div className="flex items-center gap-1 text-sm">
                    <span className="font-medium text-zinc-900">{order.route.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    <span className="font-medium text-primary">{order.route.to}</span>
                  </div>
                </div>
                <div className="flex gap-3 mb-3">
                  <div className="flex items-center gap-1.5 text-xs flex-1 min-w-0">
                    <Avatar initials={order.customer.avatar} size="sm" />
                    <span className="text-zinc-500 truncate">{order.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs flex-1 min-w-0">
                    <Avatar initials={order.traveler.avatar} size="sm" />
                    <span className="text-zinc-500 truncate">{order.traveler.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-zinc-900">{fmt(order.totalValue + order.serviceFee)}</span>
                  <span className={`text-xs font-semibold ${paymentConfig[order.paymentStatus].color}`}>
                    {paymentConfig[order.paymentStatus].label}
                  </span>
                </div>
                <div className="flex gap-2 pt-3 border-t border-zinc-100">
                  <button onClick={() => setDetailOrder(order)} className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition">
                    <Eye className="w-3.5 h-3.5" /> Detail
                  </button>
                  <button onClick={() => setTrackingOrder(order)} className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-blue-200 text-xs font-medium text-blue-600 hover:bg-blue-50 transition">
                    <Navigation className="w-3.5 h-3.5" /> Lacak
                  </button>
                  {order.status !== "completed" && order.status !== "cancelled" && (
                    <button onClick={() => setReportOrder(order)} className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition">
                      <Flag className="w-3.5 h-3.5" /> Lapor
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ALERT BANNER — problematic orders ── */}
        {orders.some((o) => o.status === "problematic") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200"
          >
            <Bell className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">
                {orders.filter((o) => o.status === "problematic").length} Order Membutuhkan Perhatian Segera
              </p>
              <p className="text-xs text-red-500 mt-0.5">
                Terdapat order bermasalah yang perlu ditangani hari ini. Klik "Lapor" pada order terkait untuk mengambil tindakan.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterStatus("problematic")}
              className="border-red-300 text-red-600 hover:bg-red-100 shrink-0 text-xs"
            >
              Lihat Semua
            </Button>
          </motion.div>
        )}

      </div>

      {/* Modals */}
      <DetailModal   order={detailOrder}   onClose={() => setDetailOrder(null)}   onReport={handleReport} />
      <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />
      <ReportModal   order={reportOrder}   onClose={() => setReportOrder(null)}   onSubmit={handleSubmitReport} />
    </DashboardLayout>
  );
}