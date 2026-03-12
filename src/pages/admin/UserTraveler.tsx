import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Eye, Pencil, Trash2, Ban, CheckCircle,
  X, UserPlus, Phone, Mail, Calendar, Activity, ShieldCheck,
  Home, CreditCard, MapPin, User, Plane, Camera, Image,
  Smartphone, AlertTriangle, FileText, BadgeCheck,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ─── Types ─────────────────────────────────────────────────────────────────────

type TravelerStatus = "pending" | "active" | "suspended" | "cancelled";

interface Traveler {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: TravelerStatus;
  joinDate: string;
  trips: number;
  gender: "male" | "female" | "";
  dob: string;
  city: string;
  province: string;
  address: string;
  ktp: string;
  // Documents (in real app these would be URLs)
  hasKtpPhoto: boolean;
  hasSelfieKtp: boolean;
  hasPasFoto: boolean;
  hasSimCard: boolean;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockTravelers: Traveler[] = [
  {
    id: 1, name: "Andi Pratama", email: "andi@email.com", phone: "0813-4567-8901",
    status: "active", joinDate: "5 Jan 2024", trips: 45,
    gender: "male", dob: "1988-03-12",
    city: "Jakarta", province: "DKI Jakarta",
    address: "Jl. Sudirman No. 55, Jakarta Pusat",
    ktp: "3171234567890001",
    hasKtpPhoto: true, hasSelfieKtp: true, hasPasFoto: true, hasSimCard: true,
  },
  {
    id: 2, name: "Sari Dewi", email: "sari@email.com", phone: "0814-5678-9012",
    status: "pending", joinDate: "14 Feb 2024", trips: 0,
    gender: "female", dob: "1995-07-22",
    city: "Bandung", province: "Jawa Barat",
    address: "Jl. Dago No. 22, Coblong, Bandung",
    ktp: "3273456789012345",
    hasKtpPhoto: true, hasSelfieKtp: true, hasPasFoto: false, hasSimCard: false,
  },
  {
    id: 3, name: "Ahmad Fauzi", email: "ahmad@email.com", phone: "0818-4444-5555",
    status: "cancelled", joinDate: "22 Jan 2024", trips: 2,
    gender: "male", dob: "1991-11-05",
    city: "Surabaya", province: "Jawa Timur",
    address: "Jl. Basuki Rahmat No. 90, Genteng, Surabaya",
    ktp: "3578901234567890",
    hasKtpPhoto: true, hasSelfieKtp: false, hasPasFoto: false, hasSimCard: false,
  },
  {
    id: 4, name: "Mega Wulandari", email: "mega@email.com", phone: "0821-1111-2222",
    status: "active", joinDate: "1 Mar 2024", trips: 18,
    gender: "female", dob: "1993-05-30",
    city: "Yogyakarta", province: "DI Yogyakarta",
    address: "Jl. Malioboro No. 10, Gedongtengen, Yogyakarta",
    ktp: "3471234560001234",
    hasKtpPhoto: true, hasSelfieKtp: true, hasPasFoto: true, hasSimCard: false,
  },
  {
    id: 5, name: "Rizky Hamdani", email: "rizky@email.com", phone: "0822-3333-4444",
    status: "pending", joinDate: "10 Mar 2024", trips: 0,
    gender: "male", dob: "1996-09-15",
    city: "Medan", province: "Sumatera Utara",
    address: "Jl. Gatot Subroto No. 88, Medan Baru",
    ktp: "1271234500990001",
    hasKtpPhoto: true, hasSelfieKtp: true, hasPasFoto: true, hasSimCard: true,
  },
  {
    id: 6, name: "Laila Nuraini", email: "laila@email.com", phone: "0823-5555-6666",
    status: "suspended", joinDate: "15 Dec 2023", trips: 7,
    gender: "female", dob: "1990-02-18",
    city: "Makassar", province: "Sulawesi Selatan",
    address: "Jl. Pengayoman No. 33, Rappocini, Makassar",
    ktp: "7371234500010002",
    hasKtpPhoto: true, hasSelfieKtp: true, hasPasFoto: true, hasSimCard: true,
  },
];

// ─── Animations ────────────────────────────────────────────────────────────────

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "h-14 w-14 text-lg" : size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return (
    <div className={`${sz} bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold shrink-0`}>
      {name.charAt(0)}
    </div>
  );
}

function FormField({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </label>
      {children}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 rounded-full px-4 text-xs font-semibold transition-all duration-150 border ${
        active
          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
          : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      {label}
    </button>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-zinc-500" />
      </div>
      <div>
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-sm font-semibold text-zinc-900">{value}</p>
      </div>
    </div>
  );
}

/** Small doc-status badge */
function DocBadge({ has, label, icon: Icon }: { has: boolean; label: string; icon: React.ElementType }) {
  return (
    <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border ${
      has
        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
        : "bg-zinc-50 text-zinc-400 border-zinc-100"
    }`}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{label}</span>
      {has
        ? <BadgeCheck className="h-3.5 w-3.5 ml-auto text-emerald-500" />
        : <X className="h-3 w-3 ml-auto text-zinc-300" />}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AdminTravelers() {
  const [travelers, setTravelers] = useState<Traveler[]>(mockTravelers);
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TravelerStatus>("all");

  const [detailTraveler, setDetailTraveler] = useState<Traveler | null>(null);
  const [editingTraveler, setEditingTraveler] = useState<Traveler | null>(null);
  const [deleteTraveler, setDeleteTraveler] = useState<Traveler | null>(null);
  const [suspendTraveler, setSuspendTraveler] = useState<Traveler | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const [addForm, setAddForm] = useState({
    name: "", email: "", phone: "", password: "",
    dob: "", gender: "", city: "", province: "", address: "", ktp: "",
  });
  const [editForm, setEditForm] = useState({
    name: "", phone: "", city: "", province: "", address: "",
  });

  // ── Derived ──
  const filtered = travelers.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const countByStatus = (s: TravelerStatus) => travelers.filter((t) => t.status === s).length;

  // ── Handlers ──
  const handleApprove = (t: Traveler) => {
    setTravelers((prev) => prev.map((x) => x.id === t.id ? { ...x, status: "active" } : x));
    toast({ title: "Traveler Disetujui", description: `${t.name} berhasil di-approve.` });
  };

  const handleReject = (t: Traveler) => {
    setTravelers((prev) => prev.map((x) => x.id === t.id ? { ...x, status: "cancelled" } : x));
    toast({ title: "Traveler Ditolak", description: `${t.name} ditolak.` });
  };

  const handleActivate = (t: Traveler) => {
    setTravelers((prev) => prev.map((x) => x.id === t.id ? { ...x, status: "active" } : x));
    toast({ title: "Traveler Diaktifkan", description: `${t.name} berhasil diaktifkan.` });
  };

  const handleConfirmSuspend = () => {
    if (!suspendTraveler) return;
    setTravelers((prev) => prev.map((x) => x.id === suspendTraveler.id ? { ...x, status: "suspended" } : x));
    toast({ title: "Traveler Disuspend", description: `${suspendTraveler.name} berhasil dinonaktifkan.` });
    setSuspendTraveler(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTraveler) return;
    setTravelers((prev) => prev.filter((x) => x.id !== deleteTraveler.id));
    toast({ title: "Traveler Dihapus", description: `${deleteTraveler.name} berhasil dihapus.` });
    setDeleteTraveler(null);
  };

  const handleEditClick = (t: Traveler) => {
    setEditingTraveler(t);
    setEditForm({ name: t.name, phone: t.phone, city: t.city, province: t.province, address: t.address });
  };

  const handleSaveEdit = () => {
    if (!editingTraveler) return;
    setTravelers((prev) => prev.map((x) =>
      x.id === editingTraveler.id
        ? { ...x, name: editForm.name, phone: editForm.phone, city: editForm.city, province: editForm.province, address: editForm.address }
        : x
    ));
    toast({ title: "Data Diperbarui", description: `Data ${editingTraveler.name} berhasil diperbarui.` });
    setEditingTraveler(null);
  };

  const handleAddTraveler = () => {
    const newTraveler: Traveler = {
      id: Date.now(),
      name: addForm.name,
      email: addForm.email,
      phone: addForm.phone,
      status: "pending",
      joinDate: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      trips: 0,
      gender: addForm.gender as "male" | "female" | "",
      dob: addForm.dob,
      city: addForm.city,
      province: addForm.province,
      address: addForm.address,
      ktp: addForm.ktp,
      hasKtpPhoto: false,
      hasSelfieKtp: false,
      hasPasFoto: false,
      hasSimCard: false,
    };
    setTravelers((prev) => [newTraveler, ...prev]);
    toast({ title: "Traveler Ditambahkan", description: `${addForm.name} berhasil ditambahkan dengan status pending.` });
    setAddOpen(false);
    setAddForm({ name: "", email: "", phone: "", password: "", dob: "", gender: "", city: "", province: "", address: "", ktp: "" });
  };

  const docCompleteness = (t: Traveler) => {
    const docs = [t.hasKtpPhoto, t.hasSelfieKtp, t.hasPasFoto];
    const done = docs.filter(Boolean).length;
    return { done, total: docs.length };
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 md:p-8 lg:p-10 space-y-6">

        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-emerald-100 p-2">
              <Plane className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">Manajemen Traveler</h1>
              <p className="text-sm text-muted-foreground">Verifikasi dan kontrol akun traveler</p>
            </div>
          </div>
          <Button onClick={() => setAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            + Tambah Traveler
          </Button>
        </div>

        {/* FILTER SECTION */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Cari nama atau email traveler..."
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

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
              <Activity className="h-3 w-3" /> Status
            </p>
            <div className="flex flex-wrap gap-2">
              <FilterChip label={`Semua (${travelers.length})`} active={statusFilter === "all"} onClick={() => setStatusFilter("all")} />
              <FilterChip label={`Aktif (${countByStatus("active")})`} active={statusFilter === "active"} onClick={() => setStatusFilter("active")} />
              <FilterChip label={`Pending (${countByStatus("pending")})`} active={statusFilter === "pending"} onClick={() => setStatusFilter("pending")} />
              <FilterChip label={`Suspend (${countByStatus("suspended")})`} active={statusFilter === "suspended"} onClick={() => setStatusFilter("suspended")} />
              <FilterChip label={`Ditolak (${countByStatus("cancelled")})`} active={statusFilter === "cancelled"} onClick={() => setStatusFilter("cancelled")} />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 bg-zinc-50/60">
            <p className="text-xs font-medium text-zinc-500">
              Menampilkan <span className="text-zinc-900 font-bold">{filtered.length}</span> dari {travelers.length} traveler
            </p>
          </div>

          {filtered.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wide w-[26%]">Traveler</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wide w-[14%]">Lokasi</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wide w-[12%]">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wide w-[12%]">Dokumen</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wide w-[10%]">Trip</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wide w-[10%]">Bergabung</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wide w-[16%]">Aksi</th>
                  </tr>
                </thead>
                <motion.tbody variants={staggerContainer} initial="hidden" animate="show">
                  {filtered.map((traveler) => {
                    const { done, total } = docCompleteness(traveler);
                    const docComplete = done === total;
                    return (
                      <motion.tr
                        key={traveler.id}
                        variants={staggerItem}
                        className="border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors"
                      >
                        {/* Traveler info */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={traveler.name} size="sm" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-zinc-900 truncate">{traveler.name}</p>
                              <p className="text-xs text-zinc-400 truncate">{traveler.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3.5 text-center">
                          <p className="text-xs font-medium text-zinc-700">{traveler.city}</p>
                          <p className="text-[10px] text-zinc-400">{traveler.province}</p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <div className="flex justify-center">
                            <StatusBadge status={traveler.status} size="sm" />
                          </div>
                        </td>

                        {/* Document completeness */}
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            docComplete
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {docComplete
                              ? <><BadgeCheck className="h-3.5 w-3.5" />Lengkap</>
                              : <><AlertTriangle className="h-3.5 w-3.5" />{done}/{total}</>}
                          </span>
                        </td>

                        {/* Trips */}
                        <td className="px-4 py-3.5 text-center">
                          <span className="text-xs font-medium text-zinc-700">{traveler.trips} trip</span>
                        </td>

                        {/* Join date */}
                        <td className="px-4 py-3.5 text-center text-xs text-zinc-500">{traveler.joinDate}</td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex justify-center gap-1">
                            {traveler.status === "pending" ? (
                              <>
                                <button
                                  onClick={() => handleApprove(traveler)}
                                  className="flex items-center gap-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white transition"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />Approve
                                </button>
                                <button
                                  onClick={() => handleReject(traveler)}
                                  className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition"
                                >
                                  <X className="h-3.5 w-3.5" />Tolak
                                </button>
                              </>
                            ) : traveler.status === "suspended" ? (
                              <>
                                <ActionBtn icon={CheckCircle} color="green" title="Aktifkan" onClick={() => handleActivate(traveler)} />
                                <ActionBtn icon={Eye} title="Detail" onClick={() => setDetailTraveler(traveler)} />
                              </>
                            ) : traveler.status === "active" ? (
                              <>
                                <ActionBtn icon={Eye} title="Detail" onClick={() => setDetailTraveler(traveler)} />
                                <ActionBtn icon={Pencil} title="Edit" onClick={() => handleEditClick(traveler)} />
                                <ActionBtn icon={Ban} title="Suspend" color="amber" onClick={() => setSuspendTraveler(traveler)} />
                                <ActionBtn icon={Trash2} title="Hapus" color="red" onClick={() => setDeleteTraveler(traveler)} />
                              </>
                            ) : (
                              <ActionBtn icon={Trash2} title="Hapus" color="red" onClick={() => setDeleteTraveler(traveler)} />
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </motion.tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={Plane} title="Tidak ada traveler ditemukan" description="Coba ubah filter pencarian Anda" />
          )}
        </div>

        {/* ── DETAIL TRAVELER DIALOG ── */}
        <Dialog open={!!detailTraveler} onOpenChange={() => setDetailTraveler(null)}>
          <DialogContent className="max-w-lg p-0 overflow-hidden">
            {detailTraveler && (
              <>
                {/* Header */}
                <div className="px-6 pt-6 pb-4 bg-emerald-50">
                  <div className="flex items-center gap-4">
                    <Avatar name={detailTraveler.name} size="lg" />
                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg leading-tight">{detailTraveler.name}</h3>
                      <p className="text-sm text-zinc-500">{detailTraveler.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Traveler
                        </span>
                        <StatusBadge status={detailTraveler.status} size="sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">

                  {/* Personal Info */}
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Data Diri</p>
                    <div className="grid grid-cols-2 gap-3">
                      <InfoRow icon={Phone} label="Telepon" value={detailTraveler.phone} />
                      <InfoRow icon={User} label="Jenis Kelamin" value={detailTraveler.gender === "male" ? "Laki-laki" : "Perempuan"} />
                      <InfoRow icon={Calendar} label="Tanggal Lahir" value={detailTraveler.dob} />
                      <InfoRow icon={Activity} label="Total Trip" value={`${detailTraveler.trips} trip`} />
                      <InfoRow icon={Calendar} label="Bergabung" value={detailTraveler.joinDate} />
                      <InfoRow icon={ShieldCheck} label="ID Traveler" value={`#${detailTraveler.id.toString().padStart(4, "0")}`} />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Lokasi</p>
                    <div className="grid grid-cols-2 gap-3">
                      <InfoRow icon={MapPin} label="Kota" value={detailTraveler.city} />
                      <InfoRow icon={MapPin} label="Provinsi" value={detailTraveler.province} />
                    </div>
                    <div className="mt-3">
                      <InfoRow icon={Home} label="Alamat Lengkap" value={detailTraveler.address} />
                    </div>
                  </div>

                  {/* Identity */}
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Identitas</p>
                    <InfoRow icon={CreditCard} label="Nomor KTP / NIK" value={detailTraveler.ktp} />
                  </div>

                  {/* Documents */}
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Dokumen Verifikasi</p>
                    <div className="grid grid-cols-2 gap-2">
                      <DocBadge has={detailTraveler.hasKtpPhoto} label="Foto KTP" icon={CreditCard} />
                      <DocBadge has={detailTraveler.hasSelfieKtp} label="Selfie + KTP" icon={Camera} />
                      <DocBadge has={detailTraveler.hasPasFoto} label="Pas Foto" icon={Image} />
                      <DocBadge has={detailTraveler.hasSimCard} label="Kartu SIM" icon={Smartphone} />
                    </div>
                    {(!detailTraveler.hasSelfieKtp || !detailTraveler.hasKtpPhoto) && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">
                          Dokumen wajib belum lengkap. Approve hanya jika Foto KTP dan Selfie+KTP sudah diverifikasi.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="px-6 pb-5 flex gap-2">
                  {detailTraveler.status === "pending" && (
                    <>
                      <Button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => { handleApprove(detailTraveler); setDetailTraveler(null); }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1.5" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => { handleReject(detailTraveler); setDetailTraveler(null); }}
                      >
                        <X className="h-4 w-4 mr-1.5" /> Tolak
                      </Button>
                    </>
                  )}
                  {detailTraveler.status !== "pending" && (
                    <Button variant="outline" className="w-full" onClick={() => setDetailTraveler(null)}>Tutup</Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ── ADD TRAVELER DIALOG ── */}
        <Dialog open={addOpen} onOpenChange={() => setAddOpen(false)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <UserPlus className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <DialogTitle>Tambah Traveler Baru</DialogTitle>
                  <DialogDescription className="text-xs mt-0.5">Isi data lengkap calon traveler</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Data Diri */}
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Data Diri</p>
              <FormField label="Nama Lengkap (sesuai KTP)" icon={User}>
                <Input placeholder="Nama lengkap" value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="h-10 rounded-xl border-zinc-200" />
              </FormField>
              <FormField label="Email" icon={Mail}>
                <Input type="email" placeholder="contoh@email.com" value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="h-10 rounded-xl border-zinc-200" />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="No. Telepon" icon={Phone}>
                  <Input placeholder="08xxxxxxxxxx" value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    className="h-10 rounded-xl border-zinc-200" />
                </FormField>
                <FormField label="Tgl. Lahir" icon={Calendar}>
                  <Input type="date" value={addForm.dob}
                    onChange={(e) => setAddForm({ ...addForm, dob: e.target.value })}
                    className="h-10 rounded-xl border-zinc-200" />
                </FormField>
              </div>
              <FormField label="Jenis Kelamin" icon={User}>
                <Select value={addForm.gender} onValueChange={(val) => setAddForm({ ...addForm, gender: val })}>
                  <SelectTrigger className="h-10 rounded-xl border-zinc-200"><SelectValue placeholder="Pilih jenis kelamin" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Password" icon={ShieldCheck}>
                <Input type="password" placeholder="Min. 8 karakter" value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  className="h-10 rounded-xl border-zinc-200" />
              </FormField>

              {/* Lokasi */}
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest pt-2">Lokasi</p>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Kota" icon={MapPin}>
                  <Input placeholder="Nama kota" value={addForm.city}
                    onChange={(e) => setAddForm({ ...addForm, city: e.target.value })}
                    className="h-10 rounded-xl border-zinc-200" />
                </FormField>
                <FormField label="Provinsi" icon={MapPin}>
                  <Input placeholder="Nama provinsi" value={addForm.province}
                    onChange={(e) => setAddForm({ ...addForm, province: e.target.value })}
                    className="h-10 rounded-xl border-zinc-200" />
                </FormField>
              </div>
              <FormField label="Alamat Lengkap" icon={Home}>
                <textarea
                  placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan"
                  value={addForm.address}
                  onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                  rows={2}
                  className="flex w-full rounded-xl border border-zinc-200 bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </FormField>

              {/* Identitas */}
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest pt-2">Identitas</p>
              <FormField label="Nomor KTP / NIK" icon={CreditCard}>
                <Input placeholder="16 digit NIK" maxLength={16} value={addForm.ktp}
                  onChange={(e) => setAddForm({ ...addForm, ktp: e.target.value })}
                  className="h-10 rounded-xl border-zinc-200" />
              </FormField>

              {/* Info note */}
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Traveler yang ditambahkan manual akan berstatus <span className="font-bold">Pending</span> dan perlu upload dokumen (Foto KTP, Selfie+KTP, Pas Foto) sebelum bisa di-approve.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setAddOpen(false)} className="flex-1">Batal</Button>
              <Button
                onClick={handleAddTraveler}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!addForm.name || !addForm.email || !addForm.phone}
              >
                Tambah Traveler
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── EDIT TRAVELER DIALOG ── */}
        <Dialog open={!!editingTraveler} onOpenChange={() => setEditingTraveler(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                  <Pencil className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <DialogTitle>Edit Traveler</DialogTitle>
                  <DialogDescription className="text-xs mt-0.5">Perbarui data traveler</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {editingTraveler && (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-3 rounded-xl bg-zinc-50 border border-zinc-100 p-3">
                  <Avatar name={editingTraveler.name} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{editingTraveler.name}</p>
                    <p className="text-xs text-zinc-400">{editingTraveler.email}</p>
                  </div>
                </div>
                <FormField label="Nama Lengkap" icon={User}>
                  <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="h-10 rounded-xl border-zinc-200" />
                </FormField>
                <FormField label="Email" icon={Mail}>
                  <Input value={editingTraveler.email} disabled
                    className="h-10 rounded-xl border-zinc-200 bg-zinc-50 cursor-not-allowed text-zinc-400" />
                </FormField>
                <FormField label="No. Telepon" icon={Phone}>
                  <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="h-10 rounded-xl border-zinc-200" />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Kota" icon={MapPin}>
                    <Input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="h-10 rounded-xl border-zinc-200" />
                  </FormField>
                  <FormField label="Provinsi" icon={MapPin}>
                    <Input value={editForm.province} onChange={(e) => setEditForm({ ...editForm, province: e.target.value })}
                      className="h-10 rounded-xl border-zinc-200" />
                  </FormField>
                </div>
                <FormField label="Alamat Lengkap" icon={Home}>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    rows={2}
                    className="flex w-full rounded-xl border border-zinc-200 bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </FormField>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setEditingTraveler(null)} className="flex-1">Batal</Button>
              <Button onClick={handleSaveEdit} className="flex-1">Simpan Perubahan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── SUSPEND DIALOG ── */}
        <Dialog open={!!suspendTraveler} onOpenChange={() => setSuspendTraveler(null)}>
          <DialogContent className="max-w-sm">
            <div className="flex flex-col items-center text-center gap-4 py-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
                <Ban className="h-7 w-7 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 text-lg">Suspend Traveler?</h3>
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                  Akun <span className="font-semibold text-zinc-800">{suspendTraveler?.name}</span> akan dinonaktifkan.
                  Traveler tidak dapat menerima order hingga diaktifkan kembali.
                </p>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSuspendTraveler(null)} className="flex-1">Batal</Button>
              <Button onClick={handleConfirmSuspend} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                Ya, Suspend
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── DELETE DIALOG ── */}
        <Dialog open={!!deleteTraveler} onOpenChange={() => setDeleteTraveler(null)}>
          <DialogContent className="max-w-sm">
            <div className="flex flex-col items-center text-center gap-4 py-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 text-lg">Hapus Traveler?</h3>
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                  Akun <span className="font-semibold text-zinc-800">{deleteTraveler?.name}</span> dan seluruh data terkait akan dihapus secara permanen.
                </p>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDeleteTraveler(null)} className="flex-1">Batal</Button>
              <Button variant="destructive" onClick={handleConfirmDelete} className="flex-1">Ya, Hapus</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
}

// ─── Micro components ──────────────────────────────────────────────────────────

function ActionBtn({
  icon: Icon, title, onClick, disabled, color,
}: {
  icon: React.ElementType; title: string; onClick?: () => void;
  disabled?: boolean; color?: "red" | "green" | "amber";
}) {
  const colorMap = {
    red: "hover:bg-red-50 hover:text-red-600",
    green: "hover:bg-emerald-50 hover:text-emerald-600",
    amber: "hover:bg-amber-50 hover:text-amber-600",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-all
        ${disabled ? "cursor-not-allowed opacity-30" : color ? colorMap[color] : "hover:bg-zinc-100 hover:text-zinc-800"}
      `}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}