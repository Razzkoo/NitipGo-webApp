import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Package, CheckCircle, XCircle, Phone } from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
  status: OrderStatus; // pending | processing | in_progress | completed | cancelled
  deliveryStep?: "received" | "on_route" | "delivered"; // hanya untuk in_progress
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
// COMPONENT
// ----------------------
export default function TravelerOrders() {
  const { toast } = useToast();

  const currentTraveler = {
  id: "TRV-001",
  name: "Nael Traveler",
};

  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<"pending" | "processing" | "in_progress" | "completed" | "cancelled">("pending");
  const [actionDialog, setActionDialog] = useState<{ open: boolean; action: "accept" | "reject" | "delete"; order: Order | null }>({ open: false, action: "accept", order: null });
  const [rejectReason, setRejectReason] = useState("");
  const filteredOrders = orders.filter(o => o.status === activeTab);

  // ----------------------
  // HANDLERS
  // ----------------------
  const handleOrderAction = (action: "accept" | "reject", order: Order) => {
    setActionDialog({ open: true, action, order });
  };

  const handleDeleteOrder = (order: Order) => {
  setActionDialog({ open: true, action: "delete", order });
  };

  const confirmAction = () => {
    if (!actionDialog.order) return;
    const { order, action } = actionDialog;

    if (action === "reject" && !rejectReason.trim()) {
  toast({
    title: "Alasan wajib diisi",
    description: "Harap isi alasan sebelum menolak order",
    variant: "destructive",
  });
  return;
}

    if (action === "delete") {
    setOrders(prev => prev.filter(o => o.id !== order.id));

    toast({
      title: "Order Dihapus",
      description: `Order ${order.id} berhasil dihapus.`,
    });

    setActionDialog({ open: false, action: "accept", order: null });
    return;
  }

setOrders(prev =>
  prev.map(o =>
    o.id === order.id
      ? action === "accept"
        ? {
            ...o,
            status: "processing",
            deliveryStep: undefined,

            // 🔒 STEP 3: LOCK KE TRAVELER
            assignedTravelerId: currentTraveler.id,
            assignedTravelerName: currentTraveler.name,
          }
        : {
            ...o,
            status: "cancelled",
            rejectReason: rejectReason,
            deliveryStep: undefined,
          }
      : o
  )
);

    toast({
      title: action === "accept" ? "Order Diterima" : "Order Ditolak",
      description: `Order ${order.id} telah ${action === "accept" ? "diterima" : "ditolak"}.`,
    });

    setActionDialog({ open: false, action: "accept", order: null });
    setRejectReason("");
  };

  const updateDeliveryStep = (orderId: string) => {
  setOrders(prev =>
    prev.map(o => {
      if (o.id !== orderId) return o;

      // STEP 1: barang diterima
      if (!o.deliveryStep) {
        return { ...o, deliveryStep: "received" };
      }

      // STEP 2: lanjut ke perjalanan
      if (o.deliveryStep === "received") {
        return { ...o, deliveryStep: "on_route", status: "in_progress" };
      }

      // STEP 3: selesai
      if (o.status === "in_progress") {
        return { ...o, deliveryStep: "delivered", status: "completed" };
      }

      return o;
    })
  );
};

  // ----------------------
  // RENDER
  // ----------------------
  return (
    <DashboardLayout role="traveler">
      <div className="p-6 md:p-8 lg:p-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
  <div className="flex items-start gap-3">
    <div className="mt-1 rounded-lg bg-primary/10 p-2">
      <Package className="h-5 w-5 text-primary" />
    </div>

    <div>
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        Orders
      </h1>
      <p className="text-sm text-muted-foreground">
        Kelola seluruh order pengiriman Anda
      </p>
    </div>
  </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4">
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium">Menunggu: {orders.filter(o => o.status==="pending").length}</span>
              <span className="px-3 py-1 rounded-full bg-purple/10 text-purple text-sm font-medium">Proses: {orders.filter(o => o.status==="processing").length}</span>
              <span className="px-3 py-1 rounded-full bg-info/10 text-info text-sm font-medium">Dalam Perjalanan: {orders.filter(o => o.status==="in_progress").length}</span>
              <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">Selesai: {orders.filter(o => o.status==="completed").length}</span>
              <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">Ditolak: {orders.filter(o => o.status==="cancelled").length}</span>

            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["pending","processing","in_progress","completed","cancelled"].map(tab => {
        const label =
        tab === "pending" ? "Menunggu" :
        tab === "processing" ? "Proses" :
        tab === "in_progress" ? "Dalam Perjalanan" :
        tab === "completed" ? "Selesai" :
        "Ditolak";
            const count = orders.filter(o => o.status===tab).length;
            return (
              <Button
                key={tab}
                size="sm"
                variant={activeTab===tab?"hero":"outline"}
                onClick={()=>setActiveTab(tab as any)}
                className="flex items-center gap-2 px-4"
              >
                {label}
                <span className="text-white bg-primary px-2 py-0.5 rounded-full text-xs font-medium">{count}</span>
              </Button>
            )
          })}
        </div>

        {/* Order Cards */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {filteredOrders.length===0?(
            <EmptyState
              icon={Package}
              title="Tidak ada order"
              description="Order akan muncul di sini"
              variant="compact"
            />
          ):(
            filteredOrders.map(order => (
              <motion.div
                key={order.id}
                whileHover={{scale:1.02, boxShadow:"0 12px 24px rgba(0,0,0,0.12)"}}
                className="bg-card p-6 rounded-2xl shadow-card relative min-h-[220px]"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{order.id}</span>
                  <StatusBadge status={order.status} size="sm" pulse={order.status==="pending"} />
                </div>
                <h3 className="font-semibold text-lg mt-1">{order.item}</h3>
                <p className="text-sm text-muted-foreground">{order.customer} • {order.weight}</p>
                <p className="text-xs text-muted-foreground mt-1">{order.pickup}</p>
                <p className="text-sm font-medium mt-1">{order.price}</p>
                {order.status === "cancelled" && order.rejectReason && (
  <div className="mt-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
    <span className="font-medium">Alasan ditolak:</span>{" "}
    {order.rejectReason}
  </div>
)}

                <div className="flex flex-wrap gap-2 mt-4">
                  {order.status==="pending" && (
                    <>
                      <Button size="sm" onClick={()=>handleOrderAction("accept",order)}><CheckCircle className="h-4 w-4 mr-1"/> Terima</Button>
                      <Button size="sm" variant="destructive" onClick={()=>handleOrderAction("reject",order)}><XCircle className="h-4 w-4 mr-1"/> Tolak</Button>
                    </>
                  )}

                  {order.status==="processing" && (
  <Button size="sm" variant="secondary" onClick={()=>updateDeliveryStep(order.id)}>
    {!order.deliveryStep
      ? "Barang Diterima"
      : "Lanjut ke Perjalanan"}
  </Button>
)}
                  {order.status==="in_progress" && (
  <Button size="sm" variant="success" onClick={()=>updateDeliveryStep(order.id)}>
    Selesai
  </Button>
)}
                  {order.status==="cancelled" && (
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteOrder(order)}>
                  <XCircle className="h-4 w-4 mr-1" />
                   Hapus
                  </Button>
                  )}

                  <Button size="sm" variant="ghost" asChild>
                    <a href={`tel:${order.phone}`}><Phone className="h-4 w-4 mr-1"/> Telepon</a>
                  </Button>
                  <Button size="sm" variant="secondary" asChild>
                    <Link to={`/traveler/order/${order.id}`}>Detail</Link>
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Action Dialog */}
       <Dialog
  open={actionDialog.open}
  onOpenChange={() => {
    setActionDialog({ open: false, action: "accept", order: null });
    setRejectReason("");
  }}
>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        {actionDialog.action==="accept"
          ? "Terima Order"
          : actionDialog.action==="reject"
          ? "Tolak Order"
          : "Hapus Order"}
      </DialogTitle>

      <DialogDescription>
        {actionDialog.action==="accept"
          ? `Apakah yakin ingin menerima order ${actionDialog.order?.id}?`
          : actionDialog.action==="reject"
          ? `Apakah yakin ingin menolak order ${actionDialog.order?.id}?`
          : `Order ${actionDialog.order?.id} akan dihapus permanen. Lanjutkan?`}
      </DialogDescription>
    </DialogHeader>

    {actionDialog.action === "reject" && (
  <div className="space-y-2">
    <label className="text-sm font-medium">Alasan penolakan</label>
    <textarea
      className="w-full rounded-md border p-2 text-sm"
      placeholder="Contoh: Jadwal bentrok / rute tidak sesuai"
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
    />
  </div>
)}

    <DialogFooter className="flex gap-2">
      <Button
        variant="outline"
        onClick={()=>setActionDialog({open:false, action:"accept", order:null})}
      >
        Batal
      </Button>

      <Button
        variant={
          actionDialog.action==="accept"
            ? "default"
            : "destructive"
        }
        onClick={confirmAction}
      >
        {actionDialog.action==="accept"
          ? "Terima"
          : actionDialog.action==="reject"
          ? "Tolak"
          : "Hapus"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      </div>
    </DashboardLayout>
  );
}
