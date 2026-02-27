import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Package, MapPin, User, Phone } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import React from "react";
import { useOrders } from "../../context/OrderContext";

export default function CustomerOrders() {
  const { orders } = useOrders();
  const [filter, setFilter] = React.useState<
  "all" | "waiting_payment" | "pending" | "processing" | "in_progress"
>("all");
 const activeOrders = orders.filter((order) => {
  if (filter === "all") {
    return ["waiting_payment", "pending", "processing", "in_progress"].includes(order.status);
  }
  return order.status === filter;
});
/**
 * Order Aktif Customer
 * Status: pending / processing / in_progress
 * Link ke tracking page: /dashboard/customer/order/:id
 */
type OrderStatus =
  | "waiting_payment"
  | "pending"
  | "processing"
  | "in_progress";


  return (
    <DashboardLayout role="customer">
      <div className="p-6 md:p-8 lg:p-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-lg bg-primary/10 p-2">
                <Package className="h-5 w-5 text-primary" />
              </div>
          
              <div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  Order Aktif Saya
                </h1>
                <p className="text-sm text-muted-foreground">
                  Pantau status order yang sedang berjalan
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FILTER */}
<div className="flex flex-wrap gap-2 mb-6">
  <Button
    variant={filter === "all" ? "default" : "outline"}
    size="sm"
    onClick={() => setFilter("all")}
  >
    Semua
  </Button>

  <Button
    variant={filter === "waiting_payment" ? "default" : "outline"}
    size="sm"
    onClick={() => setFilter("waiting_payment")}
  >
    Belum Bayar
  </Button>

  <Button
    variant={filter === "pending" ? "default" : "outline"}
    size="sm"
    onClick={() => setFilter("pending")}
  >
    Menunggu
  </Button>

  <Button
    variant={filter === "processing" ? "default" : "outline"}
    size="sm"
    onClick={() => setFilter("processing")}
  >
    Diproses
  </Button>

  <Button
    variant={filter === "in_progress" ? "default" : "outline"}
    size="sm"
    onClick={() => setFilter("in_progress")}
  >
    Dalam Perjalanan
  </Button>
</div>

        {/* ORDERS LIST */}
        {activeOrders.length > 0 ? (
          <div className="space-y-4">
            {activeOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl bg-card p-5 shadow-card"
              >
                <div className="flex flex-col lg:flex-row gap-6 justify-between">
                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    {/* ID & STATUS */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {order.id}
                      </span>
                      <StatusBadge
                        status={order.status}
                        label={order.statusLabel}
                        pulse={order.status !== "pending"}
                        size="sm"
                      />
                    </div>
                    {order.status === "pending" && (
  <p className="text-xs text-muted-foreground mb-2">
    Menunggu traveler menerima pesanan
  </p>
)}

                    {/* ITEM */}
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      {order.item}
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                      {order.description}
                    </p>

                    {/* ROUTE */}
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{order.from}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{order.to}</span>
                    </div>

                    {/* MEETING POINT */}
                    <p className="text-sm text-muted-foreground mt-1">
                      Titik temu:{" "}
                      <span className="font-medium text-foreground">
                        {order.meetingPoint}
                      </span>
                    </p>

                    {/* TRAVELER */}
{order.traveler ? (
  <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium">{order.traveler.name}</span>
    </div>
    <div className="flex items-center gap-2 text-muted-foreground">
      <Phone className="h-4 w-4" />
      {order.traveler.phone}
    </div>
  </div>
) : (
  <p className="mt-3 text-sm italic text-muted-foreground">
    Traveler belum ditentukan
  </p>
)}
</div>

                  {/* RIGHT SIDE */}
<div className="flex flex-col items-start lg:items-end gap-3">
  <div className="text-left lg:text-right">
    <p className="text-sm text-muted-foreground">{order.date}</p>
    <p className="text-lg font-semibold text-primary">{order.price}</p>
  </div>

  {/* BUTTONS */}
{order.status === "waiting_payment" && (
  <Button asChild className="bg-warning text-primary-foreground">
    <Link to={`/order/${order.id}/payment`}>Bayar Sekarang</Link>
  </Button>
)}

{order.status === "pending" && (
  <Button asChild variant="outline">
    <Link to={`/order/${order.id}`}>Lihat Detail</Link>
  </Button>
)}

{order.status === "processing" && (
  <>
    <Button asChild variant="outline">
      <Link to={`/chat-traveler/${order.id}`}>Chat Traveler</Link>
    </Button>

    <Button asChild variant="outline">
      <Link to={`/order/${order.id}`}>Lihat Detail</Link>
    </Button>
  </>
)}

{order.status === "in_progress" && (
  <>
    <Button asChild>
      <Link to={`/order/${order.id}/tracking`}>Lihat Tracking</Link>
    </Button>

    <Button asChild variant="outline">
      <Link to={`/chat-traveler/${order.id}`}>Chat Traveler</Link>
    </Button>
  </>
)}
</div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="Tidak ada order aktif"
            description="Order yang sedang berjalan akan muncul di halaman ini"
          />
        )}
      </div>
    </DashboardLayout>
  );
}
