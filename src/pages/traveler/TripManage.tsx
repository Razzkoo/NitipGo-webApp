import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Package, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Mock trip data
const mockTripDetails: Record<string, any> = {
  "1": {
    id: 1,
    from: "Jakarta",
    to: "Bandung",
    date: "20 Feb 2024",
    time: "08:00 WIB",
    arrivalTime: "12:00 WIB",
    capacity: "10 kg",
    usedCapacity: "5 kg",
    status: "active",
    pickupPoints: ["Stasiun Gambir", "Halte Harmoni"],
    orders: [
      { 
        id: "ORD-101", 
        customer: "Budi Santoso", 
        phone: "0812-xxxx-1234",
        item: "Sepatu Sneakers", 
        weight: "1.5 kg", 
        price: "Rp 45.000",
        status: "pending" as const,
        pickup: "Stasiun Gambir"
      },
      { 
        id: "ORD-102", 
        customer: "Rina Kusuma", 
        phone: "0813-xxxx-5678",
        item: "Buku Koleksi", 
        weight: "2 kg", 
        price: "Rp 50.000",
        status: "pending" as const,
        pickup: "Halte Harmoni"
      },
      { 
        id: "ORD-103", 
        customer: "Maya Putri", 
        phone: "0814-xxxx-9012",
        item: "Tas Branded", 
        weight: "1.5 kg", 
        price: "Rp 60.000",
        status: "confirmed" as const,
        pickup: "Stasiun Gambir"
      },
    ]
  },
  "2": {
    id: 2,
    from: "Jakarta",
    to: "Surabaya",
    date: "25 Feb 2024",
    time: "06:00 WIB",
    arrivalTime: "14:00 WIB",
    capacity: "10 kg",
    usedCapacity: "2 kg",
    status: "active",
    pickupPoints: ["Bandara Soekarno-Hatta"],
    orders: [
      { 
        id: "ORD-201", 
        customer: "Ahmad Fauzi", 
        phone: "0815-xxxx-3456",
        item: "Dokumen Penting", 
        weight: "0.5 kg", 
        price: "Rp 100.000",
        status: "pending" as const,
        pickup: "Bandara Soekarno-Hatta"
      },
    ]
  },
};

const defaultTrip = {
  id: 0,
  from: "Kota Asal",
  to: "Kota Tujuan",
  date: "TBD",
  time: "TBD",
  arrivalTime: "TBD",
  capacity: "10 kg",
  usedCapacity: "0 kg",
  status: "active",
  pickupPoints: [],
  orders: []
};

export default function TripManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const trip = mockTripDetails[id || ""] || defaultTrip;
  const [tripStatus, setTripStatus] = useState(trip.status);
  const [deleteDialog, setDeleteDialog] = useState<null | "inactive" | "delete">(null);
  
  const [actionDialog, setActionDialog] = useState<{ open: boolean; action: string; order: any }>({
    open: false,
    action: "",
    order: null
  });
  const [chatDialog, setChatDialog] = useState<{ open: boolean; customer: any }>({
    open: false,
    customer: null
  });
  const [message, setMessage] = useState("");

  const handleOrderAction = (action: string, order: any) => {
    setActionDialog({ open: true, action, order });
  };

  const confirmAction = () => {
    const { action, order } = actionDialog;
    toast({
      title: action === "accept" ? "Order Diterima" : "Order Ditolak",
      description: `Order ${order.id} telah ${action === "accept" ? "diterima" : "ditolak"}.`,
    });
    setActionDialog({ open: false, action: "", order: null });
  };

  const handleChatCustomer = (order: any) => {
    setChatDialog({ open: true, customer: { name: order.customer, phone: order.phone, orderId: order.id } });
  };

  const sendMessage = () => {
    if (message.trim()) {
      toast({
        title: "Pesan Terkirim",
        description: `Pesan kepada ${chatDialog.customer?.name} telah terkirim.`,
      });
      setMessage("");
      setChatDialog({ open: false, customer: null });
    }
  };

  const pendingOrders = trip.orders.filter((o: any) => o.status === "pending");
  const confirmedOrders = trip.orders.filter((o: any) => o.status === "confirmed" || o.status === "in_progress");

  return (
    <DashboardLayout role="traveler">
      <div className="p-6 md:p-8 lg:p-10">
        {/* Header */}
<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
  
  {/* LEFT */}
  <div>
    <Button
      variant="ghost"
      size="sm"
      className="mb-2"
      onClick={() => navigate("/traveler/trip")}
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      Kembali ke Daftar Perjalanan
    </Button>

    <h1 className="text-2xl font-bold text-foreground md:text-3xl">
      Kelola Perjalanan
    </h1>

    <p className="text-muted-foreground mt-1">
      {trip.from} → {trip.to} • {trip.date} •
      <span
        className={
          tripStatus === "inactive"
            ? "text-destructive ml-1"
            : "text-success ml-1"
        }
      >
        {tripStatus === "inactive" ? "Nonaktif" : "Aktif"}
      </span>
    </p>
  </div>

  {/* RIGHT */}
  <div className="flex gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setDeleteDialog("inactive")}
    >
      Nonaktifkan
    </Button>

    <Button
      variant="destructive"
      size="sm"
      onClick={() => setDeleteDialog("delete")}
    >
      Hapus
    </Button>
  </div>
</div>
        {/* Trip Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card p-6 shadow-card mb-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rute</p>
                <p className="font-semibold text-foreground">{trip.from} → {trip.to}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tanggal</p>
                <p className="font-semibold text-foreground">{trip.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                <Clock className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Waktu</p>
                <p className="font-semibold text-foreground"><p className="font-semibold text-foreground">
  Berangkat {trip.time}
</p>
<p className="text-xs text-muted-foreground">
  Estimasi tiba {trip.arrivalTime}
</p>
</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
                <Package className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kapasitas</p>
                <p className="font-semibold text-foreground">{trip.usedCapacity} / {trip.capacity}</p>
              </div>
            </div>
          </div>

          {trip.pickupPoints.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Pos Pengambilan:</p>
              <div className="flex flex-wrap gap-2">
                {trip.pickupPoints.map((point: string, i: number) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-muted text-sm font-medium">
                    {point}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Order Menunggu</h2>
              <span className="px-2 py-1 rounded-full bg-warning/20 text-warning text-sm font-medium">
                {pendingOrders.length}
              </span>
            </div>

            {pendingOrders.length > 0 ? (
              <div className="space-y-3">
                {pendingOrders.map((order: any) => (
                  <div key={order.id} className="p-4 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">{order.id}</span>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                    <p className="font-semibold text-foreground">{order.item}</p>
                    <p className="text-sm text-muted-foreground">{order.customer} • {order.weight}</p>
                    <p className="text-xs text-muted-foreground mt-1"> {order.pickup}</p>
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={() => handleOrderAction("accept", order)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Terima
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOrderAction("reject", order)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Tolak
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleChatCustomer(order)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="Tidak ada order menunggu"
                description="Order baru akan muncul di sini"
                variant="compact"
              />
            )}
          </motion.div>

          {/* Confirmed Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-card p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Order Dikonfirmasi</h2>
              <span className="px-2 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
                {confirmedOrders.length}
              </span>
            </div>

            {confirmedOrders.length > 0 ? (
              <div className="space-y-3">
                {confirmedOrders.map((order: any) => (
                  <div key={order.id} className="p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">{order.id}</span>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                    <p className="font-semibold text-foreground">{order.item}</p>
                    <p className="text-sm text-muted-foreground">{order.customer} • {order.weight}</p>
                    <p className="text-xs text-muted-foreground mt-1">📍 {order.pickup}</p>
                    
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={() => handleChatCustomer(order)}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`tel:${order.phone}`}>
                          <Phone className="h-4 w-4 mr-1" />
                          Telepon
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CheckCircle}
                title="Belum ada order dikonfirmasi"
                description="Terima order untuk memulai"
                variant="compact"
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={() => setActionDialog({ open: false, action: "", order: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "accept" ? "Terima Order" : "Tolak Order"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === "accept"
                ? `Apakah Anda yakin ingin menerima order ${actionDialog.order?.id}?`
                : `Apakah Anda yakin ingin menolak order ${actionDialog.order?.id}?`
              }
            </DialogDescription>
          </DialogHeader>
          {actionDialog.order && (
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="font-semibold">{actionDialog.order.item}</p>
              <p className="text-sm text-muted-foreground">{actionDialog.order.customer} • {actionDialog.order.weight}</p>
              <p className="text-sm font-medium text-primary mt-1">{actionDialog.order.price}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, action: "", order: null })}>
              Batal
            </Button>
            <Button 
              variant={actionDialog.action === "accept" ? "default" : "destructive"}
              onClick={confirmAction}
            >
              {actionDialog.action === "accept" ? "Terima" : "Tolak"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Customer Dialog */}
      <Dialog open={chatDialog.open} onOpenChange={() => setChatDialog({ open: false, customer: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat dengan Customer</DialogTitle>
            <DialogDescription>
              Kirim pesan kepada {chatDialog.customer?.name}
            </DialogDescription>
          </DialogHeader>
          {chatDialog.customer && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{chatDialog.customer.name}</p>
                  <p className="text-sm text-muted-foreground">Order: {chatDialog.customer.orderId}</p>
                </div>
              </div>
              
              <Textarea
                placeholder="Tulis pesan Anda..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              
              <Button className="w-full" onClick={sendMessage} disabled={!message.trim()}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Kirim Pesan
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
  open={deleteDialog !== null}
  onOpenChange={() => setDeleteDialog(null)}
>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        {deleteDialog === "inactive" ? "Nonaktifkan Perjalanan" : "Hapus Perjalanan"}
      </DialogTitle>
      <DialogDescription>
        Perjalanan ini tidak akan bisa menerima order baru.
      </DialogDescription>
    </DialogHeader>

    <DialogFooter>
      <Button variant="outline" onClick={() => setDeleteDialog(null)}>
        Batal
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          setTripStatus("inactive");
          setDeleteDialog(null);
          toast({
            title: "Perjalanan Dinonaktifkan",
            description: "Perjalanan berhasil dinonaktifkan.",
          });
        }}  
      >
        Nonaktifkan
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </DashboardLayout>
  );
}
