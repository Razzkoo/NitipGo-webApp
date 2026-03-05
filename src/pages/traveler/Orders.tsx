import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  CheckCircle,
  XCircle,
  Phone,
  Clock,
  Loader2,
  Truck,
  CheckCheck,
  Ban,
  MapPin,
  Weight,
  DollarSign,
  ChevronRight,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// ----------------------
// TYPES
// ----------------------
export type OrderStatus = StatusType;

export interface Order {
  id: string;
  customer: string;
  phone: string;
  item: string;
  weight: string;
  price: string;
  status: OrderStatus;
  deliveryStep?: "received" | "on_route" | "delivered";
  pickup: string;
  rejectReason?: string;
  assignedTravelerId?: string;
  assignedTravelerName?: string;
}

// ----------------------
// MOCK DATA
// ----------------------
const mockOrders: Order[] = [
  { id: "ORD-101", customer: "Budi Santoso", phone: "0812-xxxx-1234", item: "Sepatu Sneakers", weight: "1.5 kg", price: "Rp 45.000", status: "pending", pickup: "Stasiun Gambir" },
  { id: "ORD-102", customer: "Rina Kusuma", phone: "0813-xxxx-5678", item: "Buku Koleksi", weight: "2 kg", price: "Rp 50.000", status: "pending", pickup: "Halte Harmoni" },
  { id: "ORD-103", customer: "Maya Putri", phone: "0814-xxxx-9012", item: "Tas Branded", weight: "1.5 kg", price: "Rp 60.000", status: "processing", pickup: "Stasiun Gambir" },
  { id: "ORD-104", customer: "Ahmad Fauzi", phone: "0815-xxxx-3456", item: "Handphone", weight: "0.5 kg", price: "Rp 2.500.000", status: "in_progress", deliveryStep: "on_route", pickup: "Stasiun Senen" },
  { id: "ORD-105", customer: "Dewi Anggraeni", phone: "0816-xxxx-7890", item: "Laptop", weight: "2.5 kg", price: "Rp 12.000.000", status: "pending", pickup: "Mall Central" },
  { id: "ORD-106", customer: "Fajar Nugroho", phone: "0817-xxxx-2345", item: "Jam Tangan", weight: "0.3 kg", price: "Rp 1.500.000", status: "in_progress", deliveryStep: "received", pickup: "Stasiun Kota" },
  { id: "ORD-107", customer: "Siti Nurhaliza", phone: "0818-xxxx-6789", item: "Kamera", weight: "1 kg", price: "Rp 3.000.000", status: "completed", pickup: "Stasiun Gambir" },
  { id: "ORD-108", customer: "Rizky Pratama", phone: "0819-xxxx-0123", item: "Peralatan Dapur", weight: "3 kg", price: "Rp 750.000", status: "processing", pickup: "Pasar Senen" },
];

// ----------------------
// TAB CONFIG
// ----------------------
const tabs = [
  { key: "pending",     label: "Menunggu",        icon: Clock,      color: "text-amber-500",   bg: "bg-amber-50",   activeBg: "bg-amber-500"   },
  { key: "processing",  label: "Diproses",         icon: Loader2,    color: "text-violet-500",  bg: "bg-violet-50",  activeBg: "bg-violet-500"  },
  { key: "in_progress", label: "Dalam Perjalanan", icon: Truck,      color: "text-sky-500",     bg: "bg-sky-50",     activeBg: "bg-sky-500"     },
  { key: "completed",   label: "Selesai",          icon: CheckCheck, color: "text-emerald-500", bg: "bg-emerald-50", activeBg: "bg-emerald-500" },
  { key: "cancelled",   label: "Ditolak",          icon: Ban,        color: "text-rose-500",    bg: "bg-rose-50",    activeBg: "bg-rose-500"    },
] as const;

// ----------------------
// DELIVERY STEP INDICATOR
// ----------------------
const steps = ["received", "on_route", "delivered"];
const stepLabels = ["Barang Diterima", "Dalam Perjalanan", "Terkirim"];

function DeliveryProgress({ step }: { step?: string }) {
  const currentIndex = step ? steps.indexOf(step) : -1;
  return (
    <div className="flex items-center gap-1 mt-3 mb-1">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1 flex-1">
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentIndex ? "bg-sky-500" : "bg-gray-100"}`} />
          {i === steps.length - 1 && null}
        </div>
      ))}
    </div>
  );
}

// ----------------------
// ORDER CARD
// ----------------------
function OrderCard({
  order,
  onAccept,
  onReject,
  onDelete,
  onUpdateStep,
}: {
  order: Order;
  onAccept: (o: Order) => void;
  onReject: (o: Order) => void;
  onDelete: (o: Order) => void;
  onUpdateStep: (id: string) => void;
}) {
  const tab = tabs.find((t) => t.key === order.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${tab?.activeBg ?? "bg-gray-200"}`} />

      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg ${tab?.bg} flex items-center justify-center shrink-0`}>
              {tab && <tab.icon className={`h-4 w-4 ${tab.color}`} />}
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{order.id}</span>
              <p className="text-sm font-semibold text-gray-800 leading-tight">{order.customer}</p>
            </div>
          </div>
          <StatusBadge status={order.status} size="sm" pulse={order.status === "pending"} />
        </div>

        {/* Item Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">{order.item}</h3>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{order.pickup}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Weight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span>{order.weight}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <DollarSign className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="text-sm font-semibold text-emerald-600">{order.price}</span>
          </div>
        </div>

        {/* Delivery Progress */}
        {order.status === "in_progress" && (
          <div className="mb-3">
            <DeliveryProgress step={order.deliveryStep} />
            <p className="text-xs text-sky-600 font-medium mt-1">
              {order.deliveryStep === "received" && "Barang sudah diterima"}
              {order.deliveryStep === "on_route" && "Sedang dalam perjalanan"}
              {order.deliveryStep === "delivered" && "Sudah terkirim"}
            </p>
          </div>
        )}

        {/* Reject Reason */}
        {order.status === "cancelled" && order.rejectReason && (
          <div className="mb-3 flex items-start gap-2 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 text-xs text-rose-700">
            <XCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span><span className="font-semibold">Alasan: </span>{order.rejectReason}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-50 my-3" />

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {order.status === "pending" && (
            <>
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-8 px-3 rounded-lg"
                onClick={() => onAccept(order)}
              >
                <CheckCircle className="h-3.5 w-3.5" /> Terima
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="gap-1.5 text-xs h-8 px-3 rounded-lg"
                onClick={() => onReject(order)}
              >
                <XCircle className="h-3.5 w-3.5" /> Tolak
              </Button>
            </>
          )}

          {order.status === "processing" && (
            <Button
              size="sm"
              className="gap-1.5 bg-violet-500 hover:bg-violet-600 text-white text-xs h-8 px-3 rounded-lg"
              onClick={() => onUpdateStep(order.id)}
            >
              <Truck className="h-3.5 w-3.5" />
              {!order.deliveryStep ? "Barang Diterima" : "Lanjut ke Perjalanan"}
            </Button>
          )}

          {order.status === "in_progress" && (
            <Button
              size="sm"
              className="gap-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs h-8 px-3 rounded-lg"
              onClick={() => onUpdateStep(order.id)}
            >
              <CheckCheck className="h-3.5 w-3.5" /> Selesai
            </Button>
          )}

          {order.status === "cancelled" && (
            <Button
              size="sm"
              variant="destructive"
              className="gap-1.5 text-xs h-8 px-3 rounded-lg opacity-80"
              onClick={() => onDelete(order)}
            >
              <XCircle className="h-3.5 w-3.5" /> Hapus
            </Button>
          )}

          {/* Secondary actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-gray-700" asChild>
              <a href={`tel:${order.phone}`} title="Telepon">
                <Phone className="h-3.5 w-3.5" />
              </a>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1 px-3 rounded-lg text-xs text-gray-500 hover:text-gray-800"
              asChild
            >
              <Link to={`/traveler/order/${order.id}`}>
                Detail <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------
// MAIN COMPONENT
// ----------------------
export default function TravelerOrders() {
  const { toast } = useToast();

  const currentTraveler = { id: "TRV-001", name: "Nael Traveler" };

  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<Order["status"]>("pending");
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: "accept" | "reject" | "delete";
    order: Order | null;
  }>({ open: false, action: "accept", order: null });
  const [rejectReason, setRejectReason] = useState("");

  const filteredOrders = orders.filter((o) => o.status === activeTab);

  // ----------------------
  // HANDLERS
  // ----------------------
  const handleOrderAction = (action: "accept" | "reject", order: Order) =>
    setActionDialog({ open: true, action, order });

  const handleDeleteOrder = (order: Order) =>
    setActionDialog({ open: true, action: "delete", order });

  const confirmAction = () => {
    if (!actionDialog.order) return;
    const { order, action } = actionDialog;

    if (action === "reject" && !rejectReason.trim()) {
      toast({ title: "Alasan wajib diisi", description: "Harap isi alasan sebelum menolak order", variant: "destructive" });
      return;
    }

    if (action === "delete") {
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      toast({ title: "Order Dihapus", description: `Order ${order.id} berhasil dihapus.` });
      setActionDialog({ open: false, action: "accept", order: null });
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? action === "accept"
            ? { ...o, status: "processing", deliveryStep: undefined, assignedTravelerId: currentTraveler.id, assignedTravelerName: currentTraveler.name }
            : { ...o, status: "cancelled", rejectReason, deliveryStep: undefined }
          : o
      )
    );

    toast({ title: action === "accept" ? "Order Diterima" : "Order Ditolak", description: `Order ${order.id} telah ${action === "accept" ? "diterima" : "ditolak"}.` });
    setActionDialog({ open: false, action: "accept", order: null });
    setRejectReason("");
  };

  const updateDeliveryStep = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (!o.deliveryStep) return { ...o, deliveryStep: "received" };
        if (o.deliveryStep === "received") return { ...o, deliveryStep: "on_route", status: "in_progress" };
        if (o.status === "in_progress") return { ...o, deliveryStep: "delivered", status: "completed" };
        return o;
      })
    );
  };

  // ----------------------
  // RENDER
  // ----------------------
  return (
    <DashboardLayout role="traveler">
      <div className="min-h-screen bg-gray-50/60 p-6 md:p-8 lg:p-10">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Order</h1>
              <p className="text-sm text-gray-400">Kelola seluruh order pengiriman Anda</p>
            </div>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(({ key, label, icon: Icon, color, bg, activeBg }) => {
            const count = orders.filter((o) => o.status === key).length;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key as Order["status"])}
                className={`
                  relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-200 border
                  ${isActive
                    ? `${activeBg} text-white border-transparent shadow-md`
                    : `bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-700`
                  }
                `}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : color}`} />
                <span>{label}</span>
                <span className={`
                  ml-0.5 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center
                  ${isActive ? "bg-white/20 text-white" : `${bg} ${color}`}
                `}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          {filteredOrders.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                icon={Package}
                title="Tidak ada order"
                description="Order akan muncul di sini"
                variant="compact"
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-2"
            >
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAccept={(o) => handleOrderAction("accept", o)}
                  onReject={(o) => handleOrderAction("reject", o)}
                  onDelete={handleDeleteOrder}
                  onUpdateStep={updateDeliveryStep}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Action Dialog ── */}
        <Dialog
          open={actionDialog.open}
          onOpenChange={() => {
            setActionDialog({ open: false, action: "accept", order: null });
            setRejectReason("");
          }}
        >
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader className="space-y-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                actionDialog.action === "accept" ? "bg-emerald-50" :
                actionDialog.action === "reject" ? "bg-rose-50" : "bg-gray-100"
              }`}>
                {actionDialog.action === "accept"
                  ? <CheckCircle className="h-5 w-5 text-emerald-500" />
                  : actionDialog.action === "reject"
                  ? <XCircle className="h-5 w-5 text-rose-500" />
                  : <Ban className="h-5 w-5 text-gray-500" />
                }
              </div>
              <DialogTitle className="text-lg font-bold text-gray-900">
                {actionDialog.action === "accept" ? "Terima Order" :
                 actionDialog.action === "reject" ? "Tolak Order" : "Hapus Order"}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-400">
                {actionDialog.action === "accept"
                  ? `Konfirmasi penerimaan order ${actionDialog.order?.id}. Order akan masuk ke tahap diproses.`
                  : actionDialog.action === "reject"
                  ? `Tolak order ${actionDialog.order?.id} dengan menyertakan alasan penolakan.`
                  : `Order ${actionDialog.order?.id} akan dihapus secara permanen dan tidak dapat dikembalikan.`}
              </DialogDescription>
            </DialogHeader>

            {actionDialog.action === "reject" && (
              <div className="space-y-1.5 mt-1">
                <label className="text-sm font-semibold text-gray-700">Alasan penolakan</label>
                <textarea
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 resize-none"
                  rows={3}
                  placeholder="Contoh: Jadwal bentrok / rute tidak sesuai"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            )}

            <DialogFooter className="flex gap-2 mt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-gray-200 text-gray-600"
                onClick={() => setActionDialog({ open: false, action: "accept", order: null })}
              >
                Batal
              </Button>
              <Button
                className={`flex-1 rounded-xl ${
                  actionDialog.action === "accept"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-rose-500 hover:bg-rose-600 text-white"
                }`}
                onClick={confirmAction}
              >
                {actionDialog.action === "accept" ? "Ya, Terima"
                  : actionDialog.action === "reject" ? "Ya, Tolak"
                  : "Hapus Sekarang"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
}