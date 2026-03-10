import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Package, Search, Filter, Eye, MapPin, AlertTriangle, Ban,
  CheckCircle, Clock, Truck, ShoppingBag, ChevronDown, X,
  ArrowRight, Star, MessageSquare, Phone, User, Calendar,
  TrendingUp, DollarSign, AlertCircle, Flag, ChevronRight,
  MoreVertical, RefreshCw, Download, Bell, Shield, Zap,
  Navigation, Hash, Weight, CreditCard, Camera, FileText,
  ThumbsDown, UserX, ExternalLink, Info, ChevronUp, Route
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CountUp } from "@/components/ui/CountUp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Order = {
  id: string
  type: "titip_beli" | "kirim_barang"
  status: "pending" | "in_transit" | "completed" | "disputed" | "cancelled"
  priority: string
  createdAt: string
  estimatedDelivery: string

  customer: {
    name: string
    phone: string
    rating: number
    totalOrders: number
    avatar: string
  }

  traveler: {
    name: string
    phone: string
    rating: number
    totalTrips: number
    verified: boolean
    avatar: string
  }

  route: {
    from: string
    to: string
  }

  items: {
    name: string
    qty: number
    price: number
    weight: string
    note: string
  }[]

  totalValue: number
  serviceFee: number

  paymentStatus: "paid" | "held" | "refunded" | "pending"
  paymentMethod: string

  tracking: {
    time: string
    status: string
    location: string
    done: boolean
    warning?: boolean
    cancelled?: boolean
  }[]

  reportHistory: {
    date: string
    type: string
    message: string
    reportedBy: string
  }[]

  notes: string

  flagged?: boolean
  cancelReason?: string
  customerRating?: number
  customerReview?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockOrders: Order[] = [
  {
    id: "ORD-2024-0891",
    type: "titip_beli",
    status: "in_transit",
    priority: "normal",
    createdAt: "2024-12-10 08:30",
    estimatedDelivery: "2024-12-12",
    customer: { name: "Rina Kusuma", phone: "0812-3456-7890", rating: 4.8, totalOrders: 23, avatar: "RK" },
    traveler: { name: "Budi Santoso", phone: "0857-9012-3456", rating: 4.9, totalTrips: 87, verified: true, avatar: "BS" },
    route: { from: "Jakarta", to: "Bandung" },
    items: [
      { name: "Sepatu Nike Air Max 270", qty: 1, price: 1450000, weight: "0.8 kg", note: "Size 42, warna putih" },
      { name: "Kaos Polos Uniqlo", qty: 3, price: 299000, weight: "0.3 kg", note: "Warna hitam, putih, abu" },
    ],
    totalValue: 1749000,
    serviceFee: 87450,
    paymentStatus: "paid",
    paymentMethod: "Transfer Bank",
    tracking: [
      { time: "08:30", status: "Order dibuat", location: "Jakarta", done: true },
      { time: "09:15", status: "Traveler menerima order", location: "Jakarta", done: true },
      { time: "11:00", status: "Barang dibeli oleh traveler", location: "Jakarta - Grand Indonesia", done: true },
      { time: "14:30", status: "Dalam perjalanan ke Bandung", location: "Tol Jakarta-Bandung", done: true },
      { time: "—", status: "Tiba di Bandung", location: "Bandung", done: false },
      { time: "—", status: "Barang diterima customer", location: "Bandung", done: false },
    ],
    reportHistory: [],
    notes: "Tolong beliin yang ada diskon ya kak",
  },
  {
    id: "ORD-2024-0890",
    type: "kirim_barang",
    status: "pending",
    priority: "high",
    createdAt: "2024-12-10 07:45",
    estimatedDelivery: "2024-12-11",
    customer: { name: "Dewi Rahayu", phone: "0821-5678-9012", rating: 4.5, totalOrders: 8, avatar: "DR" },
    traveler: { name: "Sari Wulandari", phone: "0878-3456-7890", rating: 4.7, totalTrips: 42, verified: true, avatar: "SW" },
    route: { from: "Surabaya", to: "Malang" },
    items: [
      { name: "Kue Ulang Tahun", qty: 1, price: 350000, weight: "2.5 kg", note: "FRAGILE - handle with care" },
    ],
    totalValue: 350000,
    serviceFee: 52500,
    paymentStatus: "paid",
    paymentMethod: "GoPay",
    tracking: [
      { time: "07:45", status: "Order dibuat", location: "Surabaya", done: true },
      { time: "08:00", status: "Menunggu traveler", location: "Surabaya", done: true },
      { time: "—", status: "Traveler menerima order", location: "Surabaya", done: false },
      { time: "—", status: "Barang diambil dari pengirim", location: "Surabaya", done: false },
      { time: "—", status: "Dalam perjalanan ke Malang", location: "", done: false },
      { time: "—", status: "Barang diterima penerima", location: "Malang", done: false },
    ],
    reportHistory: [],
    notes: "Tolong hati-hati, barangnya sangat mudah pecah",
  },
  {
    id: "ORD-2024-0889",
    type: "titip_beli",
    status: "completed",
    priority: "normal",
    createdAt: "2024-12-09 10:00",
    estimatedDelivery: "2024-12-10",
    customer: { name: "Agus Hermawan", phone: "0813-2345-6789", rating: 4.2, totalOrders: 5, avatar: "AH" },
    traveler: { name: "Citra Dewi", phone: "0852-6789-0123", rating: 4.6, totalTrips: 31, verified: false, avatar: "CD" },
    route: { from: "Yogyakarta", to: "Semarang" },
    items: [
      { name: "Batik Tulis Malioboro", qty: 2, price: 275000, weight: "0.5 kg", note: "Motif parang, ukuran XL" },
      { name: "Gudeg Kaleng Yu Djum", qty: 5, price: 45000, weight: "1.2 kg", note: "" },
    ],
    totalValue: 775000,
    serviceFee: 38750,
    paymentStatus: "paid",
    paymentMethod: "OVO",
    tracking: [
      { time: "10:00", status: "Order dibuat", location: "Yogyakarta", done: true },
      { time: "10:30", status: "Traveler menerima order", location: "Yogyakarta", done: true },
      { time: "12:00", status: "Barang dibeli", location: "Malioboro, Yogyakarta", done: true },
      { time: "15:00", status: "Dalam perjalanan", location: "Tol Yogya-Semarang", done: true },
      { time: "18:30", status: "Tiba di Semarang", location: "Semarang", done: true },
      { time: "19:00", status: "Barang diterima customer", location: "Semarang", done: true },
    ],
    reportHistory: [],
    notes: "",
    customerRating: 5,
    customerReview: "Travelernya ramah dan barangnya aman sampai!",
  },
  {
    id: "ORD-2024-0888",
    type: "kirim_barang",
    status: "disputed",
    priority: "urgent",
    createdAt: "2024-12-08 09:00",
    estimatedDelivery: "2024-12-09",
    customer: { name: "Hendra Wijaya", phone: "0819-8765-4321", rating: 3.9, totalOrders: 12, avatar: "HW" },
    traveler: { name: "Reza Pratama", phone: "0856-1234-5678", rating: 2.1, totalTrips: 15, verified: true, avatar: "RP" },
    route: { from: "Medan", to: "Padang" },
    items: [
      { name: "Laptop Asus ROG", qty: 1, price: 15000000, weight: "3.2 kg", note: "Barang elektronik mahal" },
    ],
    totalValue: 15000000,
    serviceFee: 750000,
    paymentStatus: "held",
    paymentMethod: "Transfer Bank",
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
    notes: "HIGH VALUE - butuh perhatian khusus",
    flagged: true,
  },
  {
    id: "ORD-2024-0887",
    type: "titip_beli",
    status: "cancelled",
    priority: "normal",
    createdAt: "2024-12-07 14:00",
    estimatedDelivery: "2024-12-09",
    customer: { name: "Lia Amelia", phone: "0822-3456-7890", rating: 4.7, totalOrders: 31, avatar: "LA" },
    traveler: { name: "Anton Sugiarto", phone: "0813-7890-1234", rating: 4.3, totalTrips: 58, verified: true, avatar: "AS" },
    route: { from: "Bali", to: "Jakarta" },
    items: [
      { name: "Kopi Kintamani 1kg", qty: 2, price: 85000, weight: "1.1 kg", note: "" },
    ],
    totalValue: 170000,
    serviceFee: 0,
    paymentStatus: "refunded",
    paymentMethod: "Dana",
    tracking: [
      { time: "14:00", status: "Order dibuat", location: "Bali", done: true },
      { time: "14:15", status: "Traveler menerima order", location: "Bali", done: true },
      { time: "15:00", status: "Order dibatalkan oleh traveler", location: "Bali", done: true, cancelled: true },
    ],
    reportHistory: [],
    notes: "Traveler mendadak cancel karena penerbangan batal",
    cancelReason: "Penerbangan traveler dibatalkan maskapai",
  },
  {
    id: "ORD-2024-0886",
    type: "kirim_barang",
    status: "in_transit",
    priority: "normal",
    createdAt: "2024-12-10 06:00",
    estimatedDelivery: "2024-12-10",
    customer: { name: "Tono Prasetyo", phone: "0817-6543-2109", rating: 4.6, totalOrders: 17, avatar: "TP" },
    traveler: { name: "Maya Sari", phone: "0859-2345-6789", rating: 4.8, totalTrips: 63, verified: true, avatar: "MS" },
    route: { from: "Semarang", to: "Solo" },
    items: [
      { name: "Dokumen Penting & Kontrak", qty: 1, price: 0, weight: "0.2 kg", note: "RAHASIA - jangan dibuka" },
    ],
    totalValue: 0,
    serviceFee: 75000,
    paymentStatus: "paid",
    paymentMethod: "Transfer Bank",
    tracking: [
      { time: "06:00", status: "Order dibuat", location: "Semarang", done: true },
      { time: "06:30", status: "Dokumen diambil traveler", location: "Semarang", done: true },
      { time: "07:45", status: "Dalam perjalanan ke Solo", location: "Jalan Solo-Semarang", done: true },
      { time: "—", status: "Tiba di Solo", location: "Solo", done: false },
      { time: "—", status: "Dokumen diserahkan", location: "Solo", done: false },
    ],
    reportHistory: [],
    notes: "",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusConfig = {
  pending:     { label: "Menunggu", color: "bg-amber-500/15 text-amber-600 border-amber-500/30", dot: "bg-amber-500", icon: Clock },
  in_transit:  { label: "Dalam Perjalanan", color: "bg-blue-500/15 text-blue-600 border-blue-500/30", dot: "bg-blue-500", icon: Truck },
  completed:   { label: "Selesai", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", dot: "bg-emerald-500", icon: CheckCircle },
  disputed:    { label: "Sengketa", color: "bg-red-500/15 text-red-600 border-red-500/30", dot: "bg-red-500", icon: AlertTriangle },
  cancelled:   { label: "Dibatalkan", color: "bg-slate-400/15 text-slate-500 border-slate-400/30", dot: "bg-slate-400", icon: X },
};
const typeConfig = {
  titip_beli:   { label: "Titip Beli", color: "bg-violet-500/15 text-violet-600", icon: ShoppingBag },
  kirim_barang: { label: "Kirim Barang", color: "bg-cyan-500/15 text-cyan-600", icon: Package },
};
const paymentStatusConfig = {
  paid:     { label: "Lunas", color: "text-emerald-600" },
  held:     { label: "Ditahan", color: "text-amber-600" },
  refunded: { label: "Dikembalikan", color: "text-slate-500" },
  pending:  { label: "Belum Bayar", color: "text-red-500" },
};

const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const avatarColors = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-amber-500","bg-rose-500","bg-cyan-500","bg-indigo-500","bg-pink-500"];
const getAvatarColor = (str) => avatarColors[str.charCodeAt(0) % avatarColors.length];

// ─── Sub-components ───────────────────────────────────────────────────────────
function Avatar({ initials, size = "md" }) {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-11 h-11 text-base" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} ${getAvatarColor(initials)} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function StatusPill({ status }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      {Icon ? <Icon className="w-3 h-3" /> : <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
      {cfg.label}
    </span>
  );
}

function TypePill({ type }) {
  const cfg = typeConfig[type];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── Tracking Modal ───────────────────────────────────────────────────────────
function TrackingModal({ order, onClose }) {
  if (!order) return null;
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            Lacak Order — {order.id}
          </DialogTitle>
          <DialogDescription>
            {order.route.from} → {order.route.to} · {typeConfig[order.type].label}
          </DialogDescription>
        </DialogHeader>

        {/* Route Bar */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/60">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Asal</p>
            <p className="font-semibold text-sm">{order.route.from}</p>
          </div>
          <div className="flex-1 flex items-center gap-1">
            <div className="flex-1 h-px bg-border" />
            <Truck className="w-4 h-4 text-primary" />
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Tujuan</p>
            <p className="font-semibold text-sm">{order.route.to}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-0 mt-2">
          {order.tracking.map((step, i) => {
            const isLast = i === order.tracking.length - 1;
            const isActive = !step.done && (i === 0 || order.tracking[i - 1].done);
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 z-10 ${
                    step.cancelled ? "border-red-400 bg-red-50 dark:bg-red-950" :
                    step.warning ? "border-amber-400 bg-amber-50 dark:bg-amber-950 animate-pulse" :
                    step.done ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950" :
                    isActive ? "border-primary bg-primary/10 animate-pulse" :
                    "border-border bg-muted"
                  }`}>
                    {step.cancelled ? <X className="w-3.5 h-3.5 text-red-500" /> :
                     step.warning ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> :
                     step.done ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> :
                     isActive ? <Zap className="w-3.5 h-3.5 text-primary" /> :
                     <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
                  </div>
                  {!isLast && <div className={`w-px flex-1 my-1 ${step.done ? "bg-emerald-300" : "bg-border"}`} style={{minHeight:24}} />}
                </div>
                <div className={`pb-5 flex-1 ${isLast ? "pb-0" : ""}`}>
                  <p className={`text-sm font-medium ${step.cancelled ? "text-red-500" : step.done ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.status}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {step.location && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{step.location}
                      </span>
                    )}
                    {step.time !== "—" && (
                      <span className="text-xs text-muted-foreground">{step.time}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
          <div className="p-3 rounded-xl bg-muted/40">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Customer</p>
            <div className="flex items-center gap-2">
              <Avatar initials={order.customer.avatar} size="sm" />
              <div>
                <p className="text-sm font-semibold">{order.customer.name}</p>
                <p className="text-xs text-muted-foreground">{order.customer.phone}</p>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-muted/40">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Traveler</p>
            <div className="flex items-center gap-2">
              <Avatar initials={order.traveler.avatar} size="sm" />
              <div>
                <p className="text-sm font-semibold">{order.traveler.name}</p>
                <p className="text-xs text-muted-foreground">{order.traveler.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ order, onClose, onReport }) {
  if (!order) return null;
  const payStatus = paymentStatusConfig[order.paymentStatus];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Hash className="w-4 h-4 text-primary" />
                {order.id}
                {order.flagged && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200 ml-1">⚑ Flagged</span>}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1.5">
                <TypePill type={order.type} />
                <StatusPill status={order.status} />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Items */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" /> Detail Barang
            </h3>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-3 py-2 text-xs text-muted-foreground font-medium">Barang</th>
                    <th className="text-center px-3 py-2 text-xs text-muted-foreground font-medium">Qty</th>
                    <th className="text-center px-3 py-2 text-xs text-muted-foreground font-medium">Berat</th>
                    <th className="text-right px-3 py-2 text-xs text-muted-foreground font-medium">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i} className="border-t border-border/50">
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-foreground">{item.name}</p>
                        {item.note && <p className="text-xs text-amber-600 mt-0.5">📝 {item.note}</p>}
                      </td>
                      <td className="px-3 py-2.5 text-center text-muted-foreground">{item.qty}</td>
                      <td className="px-3 py-2.5 text-center text-muted-foreground">{item.weight}</td>
                      <td className="px-3 py-2.5 text-right font-medium">{fmt(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/30 border-t border-border">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-sm text-muted-foreground">Nilai Barang</td>
                    <td className="px-3 py-2 text-right font-semibold">{fmt(order.totalValue)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-sm text-muted-foreground">Biaya Jasa (5%)</td>
                    <td className="px-3 py-2 text-right font-semibold">{fmt(order.serviceFee)}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td colSpan={3} className="px-3 py-2.5 text-sm font-bold">Total Pembayaran</td>
                    <td className="px-3 py-2.5 text-right font-bold text-primary">{fmt(order.totalValue + order.serviceFee)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment & Route */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Pembayaran</h3>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Metode</span><span className="font-medium">{order.paymentMethod}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Status</span><span className={`font-semibold ${payStatus.color}`}>{payStatus.label}</span></div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"><Route className="w-3.5 h-3.5" /> Rute</h3>
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold">{order.route.from}</div>
                <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="text-sm font-semibold text-primary">{order.route.to}</div>
              </div>
              <div className="text-xs text-muted-foreground">Est. {order.estimatedDelivery}</div>
            </div>
          </div>

          {/* People */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Customer", person: order.customer, role: "customer" },
              { label: "Traveler", person: order.traveler, role: "traveler" },
            ].map(({ label, person, role }) => (
              <div key={role} className="p-4 rounded-xl bg-muted/40 border border-border/60">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{label}</p>
                <div className="flex items-center gap-2.5 mb-2">
                  <Avatar initials={person.avatar} size="md" />
                  <div>
                    <p className="font-semibold text-sm">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {person.rating}
                  </span>
                  <span>{role === "customer" ? `${person.totalOrders} order` : `${person.totalTrips} trip`}</span>
                  {role === "traveler" && person.verified && (
                    <span className="flex items-center gap-1 text-emerald-600"><Shield className="w-3 h-3" /> Verified</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="flex gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-400">{order.notes}</p>
            </div>
          )}

          {/* Customer Review */}
          {order.customerReview && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs text-emerald-600 font-semibold mb-1.5 flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-emerald-500" /> Ulasan Customer</p>
              <div className="flex items-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < order.customerRating ? "fill-amber-400 text-amber-400" : "text-border"}`} />)}
              </div>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 italic">"{order.customerReview}"</p>
            </div>
          )}

          {/* Dispute History */}
          {order.reportHistory.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Riwayat Laporan</h3>
              {order.reportHistory.map((rep, i) => (
                <div key={i} className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-red-600">{rep.reportedBy} melaporkan</span>
                    <span className="text-xs text-muted-foreground">{rep.date}</span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-400">{rep.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Tutup</Button>
          {order.status !== "completed" && order.status !== "cancelled" && (
            <Button variant="destructive" onClick={() => { onClose(); onReport(order); }} className="gap-2">
              <Flag className="w-4 h-4" /> Laporkan Masalah
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Report / Ban Modal ───────────────────────────────────────────────────────
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

function ReportModal({ order, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [action, setAction] = useState("warning");
  const [notes, setNotes] = useState("");
  const [holdPayment, setHoldPayment] = useState(false);

  const handleSubmit = () => {
    onSubmit({ order, reason: reason === "Lainnya" ? customReason : reason, action, notes, holdPayment });
    onClose();
  };

  if (!order) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Flag className="w-4 h-4" /> Laporkan Masalah — {order.id}
          </DialogTitle>
          <DialogDescription>
            Laporan ini akan ditinjau dan tindakan akan diambil sesuai kebijakan platform.
          </DialogDescription>
        </DialogHeader>

        {/* Traveler Info */}
        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-3">
          <Avatar initials={order.traveler.avatar} size="md" />
          <div className="flex-1">
            <p className="font-semibold text-sm">{order.traveler.name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{order.traveler.rating}
              <span>·</span><span>{order.traveler.totalTrips} trip</span>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${order.traveler.rating < 3 ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"}`}>
            {order.traveler.rating < 3 ? "⚠ Risiko Tinggi" : "Normal"}
          </span>
        </div>

        <div className="space-y-4">
          {/* Reason */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Alasan Laporan *</Label>
            <div className="grid grid-cols-1 gap-1.5">
              {reportReasons.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    reason === r
                      ? "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-medium"
                      : "border-border hover:border-muted-foreground/40 text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {reason === "Lainnya" && (
              <Input
                className="mt-2"
                placeholder="Jelaskan alasan lainnya..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}
          </div>

          {/* Action */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Tindakan yang Direkomendasikan *</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "warning", label: "Peringatan", icon: AlertCircle, color: "amber" },
                { value: "suspend", label: "Suspend", icon: UserX, color: "orange" },
                { value: "ban", label: "Ban Permanen", icon: Ban, color: "red" },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = action === opt.value;
                const baseClasses = "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all";
                const selectedClasses = {
                  warning: "border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400",
                  suspend: "border-orange-400 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400",
                  ban: "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400",
                };
                const unselectedClasses = "border-border hover:border-muted-foreground/40 text-muted-foreground";
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAction(opt.value)}
                    className={`${baseClasses} ${isSelected ? selectedClasses[opt.value] : unselectedClasses}`}
                  >
                    <Icon className="w-5 h-5" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hold Payment */}
          <div
            onClick={() => setHoldPayment(!holdPayment)}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              holdPayment ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30" : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${holdPayment ? "border-amber-500 bg-amber-500" : "border-muted-foreground/40"}`}>
              {holdPayment && <CheckCircle className="w-3.5 h-3.5 text-white" />}
            </div>
            <div>
              <p className="text-sm font-medium">Tahan Pembayaran</p>
              <p className="text-xs text-muted-foreground">Dana traveler akan ditahan hingga kasus selesai</p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-sm font-semibold mb-1.5 block">Catatan Tambahan</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan detail atau bukti yang relevan..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button
            variant="destructive"
            disabled={!reason || (reason === "Lainnya" && !customReason)}
            onClick={handleSubmit}
            className="gap-2"
          >
            <Flag className="w-4 h-4" />
            Kirim Laporan & Tindakan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Routes() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [reportOrder, setReportOrder] = useState<Order | null>(null);

  // Stats
  const stats = useMemo(() => ({
    total: orders.length,
    inTransit: orders.filter(o => o.status === "in_transit").length,
    disputed: orders.filter(o => o.status === "disputed").length,
    completed: orders.filter(o => o.status === "completed").length,
    revenue: orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.serviceFee, 0),
  }), [orders]);

  // Filtered & sorted
  const filtered = useMemo(() => {
    let result = [...orders];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.traveler.name.toLowerCase().includes(q) ||
        o.route.from.toLowerCase().includes(q) ||
        o.route.to.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== "all") result = result.filter(o => o.status === filterStatus);
    if (filterType !== "all") result = result.filter(o => o.type === filterType);
    if (sortBy === "newest") result.sort((a, b) => b.id.localeCompare(a.id));
    if (sortBy === "highest") result.sort((a, b) => b.totalValue - a.totalValue);
    if (sortBy === "disputed") result.sort((a, b) => (b.status === "disputed" ? 1 : 0) - (a.status === "disputed" ? 1 : 0));
    return result;
  }, [orders, search, filterStatus, filterType, sortBy]);

  const handleReport = (order: Order) => {
    setDetailOrder(null);
    setReportOrder(order);
  };

  const handleSubmitReport = ({ order, reason, action, notes, holdPayment }: { order: Order; reason: string; action: string; notes: string; holdPayment: boolean }) => {
    setOrders((prev: Order[]) => prev.map((o: Order) => {
      if (o.id !== order.id) return o;
      const newReport = {
        date: new Date().toLocaleString("id-ID"),
        type: "admin_action",
        message: `${reason}. Tindakan: ${action === "warning" ? "Peringatan" : action === "suspend" ? "Suspend" : "Ban Permanen"}. ${notes}`,
        reportedBy: "Admin",
      };
      return {
        ...o,
        status: action === "ban" || action === "suspend" ? "disputed" : o.status,
        paymentStatus: holdPayment ? "held" : o.paymentStatus,
        flagged: true,
        reportHistory: [...(o.reportHistory || []), newReport],
      };
    }));

    const actionLabel = action === "warning" ? "Peringatan diberikan" : action === "suspend" ? "Traveler disuspend" : "Traveler dibanned permanen";
    toast({
      title: `✓ Laporan Diproses — ${actionLabel}`,
      description: `Order ${order.id}: ${reason}${holdPayment ? " · Pembayaran ditahan." : ""}`,
      variant: action === "ban" ? "destructive" : "default",
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 md:p-8 lg:p-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-primary/10 p-2">
              <Route className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">Kelola Perjalanan</h1>
              <p className="text-sm text-muted-foreground">Monitor dan kelola semua orderan titip beli & kirim barang.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => toast({ title: "Data diperbarui" })}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6"
        >
          {[
            { label: "Total Order", value: stats.total, suffix: "order", icon: Package, color: "text-primary", bg: "bg-primary/10" },
            { label: "Dalam Perjalanan", value: stats.inTransit, suffix: "aktif", icon: Truck, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Selesai", value: stats.completed, suffix: "selesai", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Sengketa", value: stats.disputed, suffix: "kasus", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
            { label: "Pendapatan Jasa", value: null, fmtValue: fmt(stats.revenue), icon: DollarSign, color: "text-violet-500", bg: "bg-violet-500/10" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                whileHover={{ y: -2 }}
                className="relative rounded-2xl bg-card border border-border/60 p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all overflow-hidden"
              >
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <div className={`${stat.bg} p-1.5 rounded-lg`}>
                    <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.fmtValue ? stat.fmtValue : <CountUp end={stat.value} duration={1000} />}
                </p>
                {stat.suffix && <p className="text-xs text-muted-foreground mt-0.5">{stat.suffix}</p>}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mb-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID order, nama customer/traveler, atau kota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="all">Semua Status</option>
              {Object.entries(statusConfig).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="all">Semua Tipe</option>
              <option value="titip_beli">Titip Beli</option>
              <option value="kirim_barang">Kirim Barang</option>
            </select>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="highest">Nilai Tertinggi</option>
              <option value="disputed">Sengketa Dulu</option>
            </select>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> dari {orders.length} order
            {filterStatus !== "all" && <span> · Filter: <span className="font-medium">{statusConfig[filterStatus]?.label}</span></span>}
          </p>
          {filtered.some(o => o.flagged) && (
            <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="w-3 h-3" /> {filtered.filter(o => o.flagged).length} order bermasalah
            </span>
          )}
        </div>

        {/* Order Table — Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="hidden md:block rounded-2xl bg-card shadow-sm border border-border/60 overflow-hidden mb-4"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  {["Order ID", "Tipe", "Customer & Traveler", "Rute", "Nilai", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide first:pl-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.025 }}
                    className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${
                      order.flagged ? "bg-red-50/30 dark:bg-red-950/10" : ""
                    }`}
                  >
                      {/* ID */}
                      <td className="pl-5 pr-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {order.flagged && <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                          <div>
                            <p className="font-mono text-sm font-semibold text-foreground">{order.id}</p>
                            <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                          </div>
                        </div>
                      </td>
                      {/* Type */}
                      <td className="px-4 py-3.5">
                        <TypePill type={order.type} />
                      </td>
                      {/* People */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Avatar initials={order.customer.avatar} size="sm" />
                            <div>
                              <span className="font-medium text-foreground">{order.customer.name}</span>
                              <span className="text-muted-foreground ml-1">(cust)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <Avatar initials={order.traveler.avatar} size="sm" />
                            <div>
                              <span className="font-medium text-foreground">{order.traveler.name}</span>
                              <span className="text-muted-foreground ml-1">(traveler)</span>
                              {order.traveler.rating < 3 && <span className="text-red-500 ml-1">⚠</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Route */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="font-medium">{order.route.from}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="font-medium text-primary">{order.route.to}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Est. {order.estimatedDelivery}</p>
                      </td>
                      {/* Value */}
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold">{fmt(order.totalValue + order.serviceFee)}</p>
                        <p className={`text-xs font-medium ${paymentStatusConfig[order.paymentStatus].color}`}>
                          {paymentStatusConfig[order.paymentStatus].label}
                        </p>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusPill status={order.status} />
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDetailOrder(order)}
                            className="h-8 px-2.5 text-xs gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" /> Detail
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTrackingOrder(order)}
                            className="h-8 px-2.5 text-xs gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Navigation className="w-3.5 h-3.5" /> Lacak
                          </Button>
                          {order.status !== "completed" && order.status !== "cancelled" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReportOrder(order)}
                              className="h-8 px-2.5 text-xs gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Flag className="w-3.5 h-3.5" /> Lapor
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Tidak ada order ditemukan</p>
                <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Order Cards — Mobile */}
        <div className="md:hidden space-y-3">
          {filtered.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border bg-card p-4 ${order.flagged ? "border-red-300 dark:border-red-800" : "border-border"}`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    {order.flagged && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                    <span className="font-mono text-sm font-bold">{order.id}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.createdAt}</p>
                </div>
                <StatusPill status={order.status} />
              </div>
              {/* Type + Route */}
              <div className="flex items-center gap-2 mb-3">
                <TypePill type={order.type} />
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-medium">{order.route.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium text-primary">{order.route.to}</span>
                </div>
              </div>
              {/* People */}
              <div className="flex gap-3 mb-3">
                <div className="flex items-center gap-1.5 text-xs flex-1">
                  <Avatar initials={order.customer.avatar} size="sm" />
                  <span className="text-muted-foreground truncate">{order.customer.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs flex-1">
                  <Avatar initials={order.traveler.avatar} size="sm" />
                  <span className="text-muted-foreground truncate">{order.traveler.name}</span>
                </div>
              </div>
              {/* Value */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold">{fmt(order.totalValue + order.serviceFee)}</span>
                <span className={`text-xs font-semibold ${paymentStatusConfig[order.paymentStatus].color}`}>
                  {paymentStatusConfig[order.paymentStatus].label}
                </span>
              </div>
              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border/50">
                <Button variant="outline" size="sm" onClick={() => setDetailOrder(order)} className="flex-1 gap-1.5 text-xs">
                  <Eye className="w-3.5 h-3.5" /> Detail
                </Button>
                <Button variant="outline" size="sm" onClick={() => setTrackingOrder(order)} className="flex-1 gap-1.5 text-xs text-blue-600">
                  <Navigation className="w-3.5 h-3.5" /> Lacak
                </Button>
                {order.status !== "completed" && order.status !== "cancelled" && (
                  <Button variant="outline" size="sm" onClick={() => setReportOrder(order)} className="flex-1 gap-1.5 text-xs text-red-600">
                    <Flag className="w-3.5 h-3.5" /> Lapor
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disputed Alert Banner */}
        {orders.some(o => o.status === "disputed") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-start gap-3"
          >
            <Bell className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                {orders.filter(o => o.status === "disputed").length} Order Membutuhkan Perhatian Segera
              </p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
                Terdapat order dengan status sengketa yang perlu ditangani hari ini. Klik "Lapor" pada order terkait untuk mengambil tindakan.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterStatus("disputed")}
              className="border-red-300 text-red-600 hover:bg-red-100 flex-shrink-0 text-xs"
            >
              Lihat Semua
            </Button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <DetailModal order={detailOrder} onClose={() => setDetailOrder(null)} onReport={handleReport} />
      <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />
      <ReportModal order={reportOrder} onClose={() => setReportOrder(null)} onSubmit={handleSubmitReport} />
    </DashboardLayout>
  );
}