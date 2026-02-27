import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Camera, Save, Star, Route, Package, Wallet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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

const mockProfile = {
  name: "Andi Traveler",
  email: "andi@example.com",
  phone: "0813-4567-8901",
  address: "Bandung, Indonesia",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=andi",
  joinDate: "Desember 2023",
  rating: 4.9,
  totalTrips: 127,
};

const stats = [
  { label: "Total Trip", value: 127, icon: Route },
  { label: "Order Selesai", value: 342, icon: Package },
  { label: "Pendapatan", value: 15.5, suffix: "jt", icon: Wallet },
  { label: "Rating", value: 4.9, decimals: 1, icon: Star },
];

const favoriteRoutes = [
  { from: "Jakarta", to: "Bandung", count: 45 },
  { from: "Bandung", to: "Jakarta", count: 42 },
  { from: "Surabaya", to: "Malang", count: 20 },
];

const recentReviews = [
  { user: "Sarah M.", rating: 5, text: "Sangat ramah dan barang sampai dengan aman!", date: "2 hari lalu" },
  { user: "Budi S.", rating: 5, text: "Pengiriman cepat, traveler sangat profesional", date: "5 hari lalu" },
  { user: "Dewi A.", rating: 4, text: "Barang sampai tepat waktu, terima kasih!", date: "1 minggu lalu" },
];

export default function TravelerProfile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);


  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profil Disimpan",
      description: "Data profil Anda berhasil diperbarui.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Permintaan Hapus Akun",
      description: "Permintaan Anda akan diproses dalam 24 jam.",
      variant: "destructive",
    });
    setShowDeleteDialog(false);
  };

  const handleToggleAccount = () => {
  if (isActive) {
    setShowDeactivateDialog(true);
  } else {
    setIsActive(true);
    toast({
      title: "Akun Diaktifkan",
      description: "Akun traveler Anda kembali aktif.",
    });
  }
};

const handleDeactivateConfirm = () => {
  setIsActive(false);
  setShowDeactivateDialog(false);
  toast({
    title: "Akun Dinonaktifkan",
    description: "Akun Anda sementara dinonaktifkan dan tidak akan menerima order.",
    variant: "destructive",
  });
};

const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);
  setProfile({ ...profile, avatar: previewUrl });
};

  return (
    <DashboardLayout role="traveler">
      <div className="p-6 md:p-8 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-6">
  <div className="flex items-start gap-3">
    <div className="mt-1 rounded-lg bg-primary/10 p-2">
      <User className="h-5 w-5 text-primary" />
    </div>

    <div>
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        Profil Saya
      </h1>
      <p className="text-sm text-muted-foreground">
        Kelola informasi akun, preferensi, dan pengaturan profil traveler Anda.
      </p>
    </div>
  </div>
</div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 rounded-2xl bg-card p-6 shadow-card"
          >
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="relative">
  <img
    src={profile.avatar}
    alt={profile.name}
    className="h-24 w-24 rounded-full bg-muted object-cover"
  />

  {/* INPUT FILE (HIDDEN) */}
  <input
    type="file"
    accept="image/*"
    id="traveler-avatar-upload"
    hidden
    onChange={handleAvatarChange}
  />

  {/* BUTTON CAMERA */}
  <button
    type="button"
    onClick={() =>
      document.getElementById("traveler-avatar-upload")?.click()
    }
    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:bg-accent/90 transition-colors"
  >
    <Camera className="h-4 w-4" />
  </button>
</div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/20">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-sm font-medium text-warning">{profile.rating}</span>
                  </div>
                </div>
                <p className="text-muted-foreground">Traveler sejak {profile.joinDate}</p>
                <span className="inline-flex mt-2 px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
                  Mitra Traveler
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
      ${isActive
        ? "bg-emerald-100 text-emerald-700"
        : "bg-muted text-muted-foreground"
      }`}
  >
    {isActive ? "Akun Aktif" : "Akun Nonaktif"}
  </span>

  <button
    onClick={handleToggleAccount}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
      ${isActive ? "bg-emerald-500" : "bg-muted"}
    `}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
        ${isActive ? "translate-x-6" : "translate-x-1"}
      `}
    />
  </button>
</div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={profile.email}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Email tidak dapat diubah</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Alamat</Label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {isEditing ? (
                <>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Batal
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profil
                  </Button>
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus Akun
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl bg-card p-4 shadow-card flex items-center gap-4"
              >
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">
                    <CountUp end={stat.value} suffix={stat.suffix} decimals={stat.decimals} duration={1500} />
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Favorite Routes & Reviews */}
        <div className="grid gap-6 lg:grid-cols-2 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card p-6 shadow-card"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Rute Favorit</h3>
            <div className="space-y-3">
              {favoriteRoutes.map((route, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Route className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{route.from}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-foreground">{route.to}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{route.count}x</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-card p-6 shadow-card"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Ulasan Terbaru</h3>
            <div className="space-y-4">
              {recentReviews.map((review, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{review.user}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-warning text-warning" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Delete Account Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Akun Traveler</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus akun traveler ini? Saldo yang belum ditarik akan hangus dan tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="h-4 w-4 mr-2" />
                Ya, Hapus Akun
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Nonaktif Account Dialog */}
        <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Nonaktifkan Akun?</DialogTitle>
      <DialogDescription>
        Akun Anda akan disembunyikan sementara dan tidak bisa menerima order.
        Anda dapat mengaktifkannya kembali kapan saja.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setShowDeactivateDialog(false)}>
        Batal
      </Button>
      <Button variant="destructive" onClick={handleDeactivateConfirm}>
        Nonaktifkan
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
      </div>
    </DashboardLayout>
  );
}
