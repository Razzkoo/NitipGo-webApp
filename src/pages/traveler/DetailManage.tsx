import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MessageSquare, Phone, Search, Package, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// -------------------------
// TYPES
// -------------------------
export type OrderStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface Order {
  id: string;
  customer: string;
  phone: string;
  orderType: "titip-beli" | "kirim";
  itemName: string;
  itemDescription: string;
  weight: string;
  photo?: string;
  originCity: string;
  destinationCity: string;
  originAddress: string;
  destinationAddress: string;
  travelDate: string;
  traveler?: {
    id: string;
    name: string;
    route: string;
    rating: number;
    reviews: number;
    departureTime: string;
    estimatedArrival: string;
    distance: string;
    capacityLeft: string;
  };
  pickupPoint: { name: string; address: string };
  notes?: string;
  price: string;
  status: OrderStatus;
  chat?: { from: "customer" | "traveler"; message: string; time: string }[];
  unreadChat?: number;
}

// -------------------------
// MOCK DATA
// -------------------------
const mockOrders: Order[] = [
  {
    id: "ORD-101",
    customer: "Budi Santoso",
    phone: "0812-xxxx-1234",
    orderType: "titip-beli",
    itemName: "Sepatu Sneakers",
    itemDescription: "Nike Air Max, warna putih, size 42",
    weight: "1.5",
    photo: "/images/sample-shoes.jpg",
    originCity: "Jakarta",
    destinationCity: "Batam",
    originAddress: "Jl. Kaliurang KM 7, Sleman, Yogyakarta",
    destinationAddress: "Jl. Ahmad Yani No. 12",
    travelDate: "2026-02-18",
    traveler: {
      id: "t1",
      name: "Andi Pratama",
      route: "Jakarta → Batam",
      rating: 4.8,
      reviews: 120,
      departureTime: "08:30",
      estimatedArrival: "18:00",
      distance: "5km",
      capacityLeft: "5 kg",
    },
    pickupPoint: { name: "Mitra Pos Cikini", address: "Jl. Cikini Raya No. 45" },
    notes: "Tolong bungkus rapi",
    price: "Rp 45.000",
    status: "pending",
    chat: [
      { from: "customer", message: "Halo, bisa cek kondisi barang ya?", time: "10:05" },
      { from: "traveler", message: "Siap, nanti saya update.", time: "10:10" },
    ],
    unreadChat: 1,
  },
];

// -------------------------
// COMPONENT
// -------------------------
export default function DetailManage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [chatDialog, setChatDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [photoOpen, setPhotoOpen] = useState(false);

  useEffect(() => {
    const found = mockOrders.find((o) => o.id === id);
    setOrder(found || null);
  }, [id]);

  if (!order) {
    return (
      <DashboardLayout role="traveler">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Detail Order</h1>
          <p className="text-muted-foreground">Order tidak ditemukan.</p>
          <Button className="mt-4" asChild>
            <Link to="/traveler/orders">Kembali ke Orders</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const sendMessage = () => {
    if (!message.trim()) return;
    order.chat = order.chat || [];
    order.chat.push({ from: "traveler", message, time: new Date().toLocaleTimeString() });
    setMessage("");
    toast({ title: "Pesan Terkirim", description: `Pesan berhasil dikirim ke ${order.customer}` });
  };

  return (
    <DashboardLayout role="traveler">
      <div className="p-6 md:p-8 lg:p-10 max-w-3xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap gap-2 sticky top-0 bg-background z-10 py-2">
          <div>
            <h1 className="text-2xl font-bold">{order.itemName}</h1>
            <p className="text-sm text-muted-foreground">{order.customer} • {order.weight} kg</p>
          </div>
          <StatusBadge status={order.status} />
        </div>


        {/* DETAIL ORDER */}
        <div className="rounded-2xl bg-primary/5 p-6 shadow-card space-y-6">
        {/* FOTO + INFO UTAMA */}
<div className="flex items-start justify-between gap-4">
  {/* INFO */}
  <div className="space-y-3">
    <div>
      <Label>Jenis Order</Label>
      <p>{order.orderType === "titip-beli" ? "Titip Beli" : "Kirim"}</p>
    </div>

    <div>
      <Label>Harga</Label>
      <p>{order.price}</p>
    </div>
  </div>

  {/* FOTO */}
  {order.photo && (
    <div
      className="relative w-16 h-16 shrink-0 cursor-pointer"
      onClick={() => setPhotoOpen(true)}
    >
        <Search className="absolute inset-0 m-auto h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition" />

      <img
        src={order.photo}
        alt={order.itemName}
        className="w-full h-full rounded-lg object-cover"
      />
    </div>
  )}
</div>
          <div>
            <Label>Deskripsi Barang</Label>
            <p>{order.itemDescription}</p>
          </div>

          {order.traveler && (
            <div>
              <Label>Mitra Traveler</Label>
              <p>{order.traveler.name} • {order.traveler.route}</p>
              <p className="text-sm text-muted-foreground">Rating: {order.traveler.rating} ({order.traveler.reviews})</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Alamat Asal</Label>
              <p>{order.originAddress} • {order.originCity}</p>
            </div>
            <div>
              <Label>Alamat Tujuan</Label>
              <p>{order.destinationAddress} • {order.destinationCity}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tanggal Perjalanan</Label>
              <p>{order.travelDate}</p>
            </div>
            <div>
              <Label>Titik Pickup</Label>
              <p>{order.pickupPoint.name}</p>
              <p className="text-sm text-muted-foreground">{order.pickupPoint.address}</p>
            </div>
          </div>

          {order.notes && (
            <div>
              <Label>Catatan Customer</Label>
              <p>{order.notes}</p>
            </div>
          )}
        </div>

        {/* FLOATING CHAT BUTTON */}
        <div className="fixed bottom-6 right-6 md:right-10 z-50">
          <Button
            className="flex items-center gap-2"
            onClick={() => setChatDialog(true)}
          >
            <MessageSquare className="h-5 w-5" />
            Chat {order.unreadChat ? `(${order.unreadChat})` : ""}
          </Button>
        </div>

        {/* CHAT MODAL */}
        <Dialog open={chatDialog} onOpenChange={setChatDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chat dengan {order.customer}</DialogTitle>
              <DialogDescription>Kirim pesan ke customer</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-2 max-h-96 overflow-y-auto">
              {(order.chat || []).map((c, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg max-w-xs ${
                    c.from === "customer"
                      ? "bg-primary/20 self-start"
                      : "bg-secondary/20 self-end"
                  }`}
                >
                  <p className="text-sm">{c.message}</p>
                  <p className="text-xs text-muted-foreground text-right">{c.time}</p>
                </div>
              ))}
            </div>
            <Textarea
              rows={4}
              placeholder="Tulis pesan..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-3"
            />
            <Button className="w-full mt-2" onClick={sendMessage} disabled={!message.trim()}>
              <MessageSquare className="h-4 w-4 mr-2" /> Kirim Pesan
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={photoOpen} onOpenChange={setPhotoOpen}>
  <DialogContent className="max-w-3xl p-0 overflow-hidden">
    <img
      src={order.photo}
      alt={order.itemName}
      className="w-full h-full object-contain"
    />
  </DialogContent>
</Dialog>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 flex-wrap">
          <Button variant="ghost" size="sm" asChild>
            <a href={`tel:${order.phone}`}>
              <Phone className="h-4 w-4 mr-1" /> Telepon
            </a>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link to="/traveler/orders">Kembali</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
