import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Edit2, Check, X, ArrowRight, Trash2, Route } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CountUp } from "@/components/ui/CountUp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Routes } from "react-router-dom";

const initialRoutes = [
  { id: 1, fromCity: "Jakarta", toCity: "Bandung", active: true, travelers: 245, orders: 1250 },
  { id: 2, fromCity: "Bandung", toCity: "Jakarta", active: true, travelers: 189, orders: 890 },
  { id: 3, fromCity: "Surabaya", toCity: "Malang", active: true, travelers: 156, orders: 720 },
  { id: 4, fromCity: "Yogyakarta", toCity: "Semarang", active: true, travelers: 134, orders: 650 },
  { id: 5, fromCity: "Semarang", toCity: "Solo", active: true, travelers: 98, orders: 420 },
  { id: 6, fromCity: "Malang", toCity: "Surabaya", active: true, travelers: 87, orders: 380 },
  { id: 7, fromCity: "Medan", toCity: "Padang", active: true, travelers: 76, orders: 310 },
  { id: 8, fromCity: "Bali", toCity: "Jakarta", active: true, travelers: 112, orders: 540 },
  { id: 9, fromCity: "Makassar", toCity: "Manado", active: false, travelers: 23, orders: 45 },
  { id: 10, fromCity: "Palembang", toCity: "Lampung", active: false, travelers: 18, orders: 32 },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function AdminRoutes() {
  const { toast } = useToast();
  const [routes, setRoutes] = useState(initialRoutes);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRoute, setNewRoute] = useState({ fromCity: "", toCity: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState({ fromCity: "", toCity: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleAddRoute = () => {
    if (newRoute.fromCity && newRoute.toCity) {
      setRoutes([...routes, {
        id: Date.now(),
        fromCity: newRoute.fromCity,
        toCity: newRoute.toCity,
        active: true,
        travelers: 0,
        orders: 0,
      }]);
      toast({ title: "Rute Ditambahkan", description: `Rute ${newRoute.fromCity} → ${newRoute.toCity} berhasil ditambahkan.` });
      setNewRoute({ fromCity: "", toCity: "" });
      setShowAddDialog(false);
    }
  };

  const handleToggleActive = (id: number) => {
    setRoutes(routes.map(route => 
      route.id === id ? { ...route, active: !route.active } : route
    ));
    const route = routes.find(r => r.id === id);
    toast({
      title: route?.active ? "Rute Dinonaktifkan" : "Rute Diaktifkan",
      description: `Rute ${route?.fromCity} → ${route?.toCity} telah ${route?.active ? "dinonaktifkan" : "diaktifkan"}.`,
    });
  };

  const handleEdit = (route: any) => {
    setEditingId(route.id);
    setEditValue({ fromCity: route.fromCity, toCity: route.toCity });
  };

  const handleSaveEdit = (id: number) => {
    setRoutes(routes.map(route =>
      route.id === id ? { ...route, ...editValue } : route
    ));
    toast({ title: "Rute Diperbarui" });
    setEditingId(null);
  };

  const handleDeleteRoute = () => {
  if (deleteId === null) return;

  const route = routes.find((r) => r.id === deleteId);

  setRoutes(routes.filter((r) => r.id !== deleteId));

  toast({
    title: "Rute Dihapus",
    description: `Rute ${route?.fromCity} → ${route?.toCity} berhasil dihapus.`,
    variant: "destructive",
  });

  setDeleteId(null);
};

  return (
    <DashboardLayout role="admin">
      <div className="p-6 md:p-8 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-lg bg-primary/10 p-2">
                <Route className="h-5 w-5 text-primary" />
              </div>
          
              <div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  Kelola Perjalanan
                </h1>
                <p className="text-sm text-muted-foreground">
                  Kelola rute perjalanan yang tersedia bagi traveler dan pelanggan.
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Rute
          </Button>
        </motion.div>

        {/* Stats */}
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
  className="grid gap-3 md:grid-cols-3 mb-6"
>
  {[
    {
      label: "Total Rute",
      value: routes.length,
      duration: 1000,
      icon: <Route className="h-4 w-4" />,
      suffix: "rute",
      delay: 0,
    },
    {
      label: "Rute Aktif",
      value: routes.filter(r => r.active).length,
      duration: 1000,
      icon: (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
      ),
      suffix: "aktif",
      delay: 0.06,
    },
    {
      label: "Total Traveler",
      value: routes.reduce((sum, r) => sum + r.travelers, 0),
      duration: 1500,
      icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      suffix: "orang",
      delay: 0.12,
    },
  ].map((stat, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: stat.delay + 0.15, duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl bg-card border border-border/60 p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 overflow-hidden"
    >
      {/* subtle top-left accent line */}
      <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
          {stat.label}
        </span>
        <span className="text-muted-foreground/50 group-hover:text-primary/60 transition-colors duration-300">
          {stat.icon}
        </span>
      </div>

      <div className="flex items-end gap-2">
        <p className="text-3xl font-semibold tracking-tight text-foreground leading-none">
          <CountUp end={stat.value} duration={stat.duration} />
        </p>
        <span className="text-xs text-muted-foreground mb-0.5 leading-none">{stat.suffix}</span>
      </div>

      {/* bottom fill bar - animates in on mount */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: stat.delay + 0.5, duration: 0.7, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 origin-left"
      />
    </motion.div>
  ))}
</motion.div>

        {/* Route List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden md:block rounded-2xl bg-card shadow-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
  <thead className="bg-muted/50">
    <tr>
      <th className="px-3 py-2 w-[18%] text-left font-medium text-muted-foreground">
        Kota Asal
      </th>
      <th className="px-3 py-2 w-[18%] text-left font-medium text-muted-foreground">
        Kota Tujuan
      </th>
      <th className="px-3 py-2 w-[12%] text-center font-medium text-muted-foreground">
        Traveler
      </th>
      <th className="px-3 py-2 w-[12%] text-center font-medium text-muted-foreground">
        Order
      </th>
      <th className="px-3 py-2 w-[12%] text-center font-medium text-muted-foreground">
        Status
      </th>
      <th className="px-3 py-2 w-[28%] text-center font-medium text-muted-foreground">
        Aksi
      </th>
    </tr>
  </thead>

  <motion.tbody variants={staggerContainer} initial="hidden" animate="show">
    {routes.map((route) => (
      <motion.tr
        key={route.id}
        variants={staggerItem}
        className="border-t border-border hover:bg-muted/30 transition-colors"
      >
        {/* KOTA ASAL */}
        <td className="p-4 text-left">
          {editingId === route.id ? (
            <Input
              value={editValue.fromCity}
              onChange={(e) =>
                setEditValue({ ...editValue, fromCity: e.target.value })
              }
              className="h-8"
            />
          ) : (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">
                {route.fromCity}
              </span>
            </div>
          )}
        </td>

        {/* KOTA TUJUAN */}
        <td className="p-4 text-left">
          {editingId === route.id ? (
            <Input
              value={editValue.toCity}
              onChange={(e) =>
                setEditValue({ ...editValue, toCity: e.target.value })
              }
              className="h-8"
            />
          ) : (
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">
                {route.toCity}
              </span>
            </div>
          )}
        </td>

        {/* TRAVELER */}
        <td className="p-4 text-center text-foreground">
          {route.travelers}
        </td>

        {/* ORDER */}
        <td className="p-4 text-center text-foreground">
          {route.orders}
        </td>

        {/* STATUS */}
        <td className="p-4 text-center">
          <div className="flex justify-center">
            <StatusBadge
              status={route.active ? "active" : "inactive"}
              size="sm"
            />
          </div>
        </td>

        {/* AKSI */}
        <td className="p-4 text-center">
          <div className="flex justify-center gap-2">
            {editingId === route.id ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSaveEdit(route.id)}
                >
                  <Check className="h-4 w-4 text-success" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingId(null)}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </>
            ) : (
             <>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => handleEdit(route)}
  >
    <Edit2 className="h-4 w-4" />
  </Button>

  <Button
    variant="ghost"
    size="sm"
    onClick={() => setDeleteId(route.id)}
  >
    <Trash2 className="h-4 w-4 text-destructive" />
  </Button>

  <Button
    variant="outline"
    size="sm"
    onClick={() => handleToggleActive(route.id)}
  >
    {route.active ? "Nonaktif" : "Aktif"}
  </Button>
</>
            )}
          </div>
        </td>
      </motion.tr>
    ))}
  </motion.tbody>
</table>
          </div>
        </motion.div>

        {/* Route List - MOBILE */}
<div className="md:hidden space-y-3">
  {routes.map((route) => (
    <div
      key={route.id}
      className="rounded-xl border border-border bg-card p-3"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
  {/* KIRI */}
  <div className="flex flex-col justify-center gap-1">
    <p className="font-medium text-foreground leading-tight">
      {route.fromCity} → {route.toCity}
    </p>

    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>{route.travelers} traveler</span>
      <span className="w-1 h-1 rounded-full bg-muted-foreground/60" />
      <span>{route.orders} order</span>
    </div>
  </div>

  {/* KANAN */}
  <StatusBadge
    status={route.active ? "active" : "inactive"}
    size="sm"
  />
</div>

      {/* ACTION */}
      <div className="flex justify-end gap-1 mt-3">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleEdit(route)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setDeleteId(route.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleToggleActive(route.id)}
        >
          {route.active ? "Off" : "On"}
        </Button>
      </div>
    </div>
  ))}
</div>

        {/* Add Route Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Rute Baru</DialogTitle>
              <DialogDescription>Tambahkan rute perjalanan baru ke dalam platform NitipGo</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="from-city">Kota Asal</Label>
                <Input
                  id="from-city"
                  placeholder="Contoh: Jakarta"
                  value={newRoute.fromCity}
                  onChange={(e) => setNewRoute({ ...newRoute, fromCity: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="to-city">Kota Tujuan</Label>
                <Input
                  id="to-city"
                  placeholder="Contoh: Bandung"
                  value={newRoute.toCity}
                  onChange={(e) => setNewRoute({ ...newRoute, toCity: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>
            <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Hapus Rute?</DialogTitle>
      <DialogDescription>
        Rute yang dihapus tidak bisa dikembalikan.
      </DialogDescription>
    </DialogHeader>

    <DialogFooter>
      <Button variant="outline" onClick={() => setDeleteId(null)}>
        Batal
      </Button>
      <Button variant="destructive" onClick={handleDeleteRoute}>
        Hapus
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Batal</Button>
              <Button onClick={handleAddRoute}>Tambah Rute</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
