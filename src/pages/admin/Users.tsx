import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Users, Eye, Pencil, Trash2, Ban, CheckCircle,
  X, UserPlus, Phone, Mail, Calendar, Activity, ShieldCheck,
  Home, User,
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

type UserStatus = "pending" | "active" | "suspended" | "cancelled";
type UserType = "customer" | "admin";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  status: UserStatus;
  joinDate: string;
  orders: number;
  // Customer-specific
  dob?: string;
  address?: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockUsers: User[] = [
  {
    id: 1, name: "Budi Santoso", email: "budi@email.com", phone: "0812-3456-7890",
    type: "customer", status: "active", joinDate: "10 Jan 2024", orders: 12,
    dob: "1990-05-14", address: "Jl. Merdeka No. 10, Surabaya",
  },
  {
    id: 2, name: "Rina Kusuma", email: "rina@email.com", phone: "0815-6789-0123",
    type: "customer", status: "cancelled", joinDate: "20 Dec 2023", orders: 3,
    dob: "1995-11-02", address: "Jl. Pahlawan No. 7, Malang",
  },
  {
    id: 3, name: "Dimas Wijaya", email: "dimas@email.com", phone: "0816-7890-1234",
    type: "admin", status: "active", joinDate: "1 Feb 2024", orders: 0,
  },
  {
    id: 4, name: "Putri Lestari", email: "putri@email.com", phone: "0817-2222-3333",
    type: "customer", status: "pending", joinDate: "18 Feb 2024", orders: 0,
    dob: "2000-03-20", address: "Jl. Kenanga No. 15, Yogyakarta",
  },
  {
    id: 5, name: "Nabila Rahma", email: "nabila@email.com", phone: "0819-6666-7777",
    type: "customer", status: "active", joinDate: "11 Feb 2024", orders: 7,
    dob: "1993-07-08", address: "Jl. Raya Darmo No. 3, Surabaya",
  },
  {
    id: 6, name: "Sandi Kurniawan", email: "sandi@email.com", phone: "0821-8888-9999",
    type: "admin", status: "active", joinDate: "5 Mar 2024", orders: 0,
  },
  {
    id: 7, name: "Dewi Anggraini", email: "dewi@email.com", phone: "0822-1111-2222",
    type: "customer", status: "suspended", joinDate: "2 Jan 2024", orders: 5,
    dob: "1988-12-01", address: "Jl. Diponegoro No. 45, Semarang",
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

const roleColors: Record<UserType, string> = {
  customer: "bg-blue-50 text-blue-700 border border-blue-100",
  admin:    "bg-purple-50 text-purple-700 border border-purple-100",
};

const avatarColors: Record<UserType, string> = {
  customer: "bg-blue-100 text-blue-700",
  admin:    "bg-purple-100 text-purple-700",
};

function Avatar({ name, type, size = "md" }: { name: string; type: UserType; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "h-14 w-14 text-lg" : size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return (
    <div className={`${sz} ${avatarColors[type]} rounded-full flex items-center justify-center font-bold shrink-0`}>
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
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
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

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const { toast } = useToast();

  const [search, setSearch]             = useState("");
  const [roleFilter, setRoleFilter]     = useState<"all" | UserType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");

  const [detailUser, setDetailUser]   = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser]   = useState<User | null>(null);
  const [suspendUser, setSuspendUser] = useState<User | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);

  const [addFormData, setAddFormData]   = useState({ name: "", email: "", phone: "", password: "", role: "customer" });
  const [editFormData, setEditFormData] = useState({ name: "", phone: "", role: "customer" as string });

  // ── Derived ──
  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === "all" || u.type === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const countByStatus = (s: UserStatus) => users.filter((u) => u.status === s).length;
  const countByRole   = (r: UserType)   => users.filter((u) => u.type === r).length;

  // ── Handlers ──
  const handleApprove = (user: User) => {
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: "active" } : u));
    toast({ title: "User Disetujui", description: `${user.name} berhasil di-approve.` });
  };

  const handleReject = (user: User) => {
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: "cancelled" } : u));
    toast({ title: "User Ditolak", description: `${user.name} ditolak.` });
  };

  const handleActivate = (user: User) => {
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: "active" } : u));
    toast({ title: "User Diaktifkan", description: `${user.name} berhasil diaktifkan.` });
  };

  const handleConfirmSuspend = () => {
    if (!suspendUser) return;
    setUsers((prev) => prev.map((u) => u.id === suspendUser.id ? { ...u, status: "suspended" } : u));
    toast({ title: "User Disuspend", description: `${suspendUser.name} berhasil dinonaktifkan.` });
    setSuspendUser(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
    toast({ title: "User Dihapus", description: `${deleteUser.name} berhasil dihapus.` });
    setDeleteUser(null);
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditFormData({ name: user.name, phone: user.phone, role: user.type });
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    setUsers((prev) => prev.map((u) =>
      u.id === editingUser.id
        ? { ...u, name: editFormData.name, phone: editFormData.phone, type: editFormData.role as UserType }
        : u
    ));
    toast({ title: "Data Diperbarui", description: `Data ${editingUser.name} berhasil diperbarui.` });
    setEditingUser(null);
  };

  const handleAddUser = () => {
    const newUser: User = {
      id: Date.now(),
      name: addFormData.name,
      email: addFormData.email,
      phone: addFormData.phone,
      type: addFormData.role as UserType,
      status: "active",
      joinDate: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      orders: 0,
    };
    setUsers((prev) => [newUser, ...prev]);
    toast({ title: "User Ditambahkan", description: `${addFormData.name} berhasil ditambahkan.` });
    setAddUserOpen(false);
    setAddFormData({ name: "", email: "", phone: "", password: "", role: "customer" });
  };

  const activeFilterCount = (roleFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  return (
    <DashboardLayout role="admin">
      <div className="p-6 md:p-8 lg:p-10 space-y-6">

        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-primary/10 p-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">Manajemen User</h1>
              <p className="text-sm text-muted-foreground">Monitoring dan kontrol akun pengguna</p>
            </div>
          </div>
          <Button onClick={() => setAddUserOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Tambah User
          </Button>
        </div>

        {/* FILTER SECTION */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Cari nama atau email pengguna..."
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
            {/* Role */}
            <div className="space-y-1.5 flex-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                <Users className="h-3 w-3" /> Role
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip label={`Semua (${users.length})`}               active={roleFilter === "all"}      onClick={() => setRoleFilter("all")} />
                <FilterChip label={`Customer (${countByRole("customer")})`} active={roleFilter === "customer"} onClick={() => setRoleFilter("customer")} />
                <FilterChip label={`Admin (${countByRole("admin")})`}       active={roleFilter === "admin"}    onClick={() => setRoleFilter("admin")} />
              </div>
            </div>

            <div className="hidden sm:block w-px bg-zinc-100" />

            {/* Status */}
            <div className="space-y-1.5 flex-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                <Activity className="h-3 w-3" /> Status
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip label="Semua"                                      active={statusFilter === "all"}       onClick={() => setStatusFilter("all")} />
                <FilterChip label={`Aktif (${countByStatus("active")})`}       active={statusFilter === "active"}    onClick={() => setStatusFilter("active")} />
                <FilterChip label={`Pending (${countByStatus("pending")})`}    active={statusFilter === "pending"}   onClick={() => setStatusFilter("pending")} />
                <FilterChip label={`Suspend (${countByStatus("suspended")})`}  active={statusFilter === "suspended"} onClick={() => setStatusFilter("suspended")} />
                <FilterChip label={`Ditolak (${countByStatus("cancelled")})`}  active={statusFilter === "cancelled"} onClick={() => setStatusFilter("cancelled")} />
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
              <span className="text-xs text-zinc-400">Filter aktif:</span>
              {roleFilter !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {roleFilter}
                  <button onClick={() => setRoleFilter("all")}><X className="h-3 w-3" /></button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {statusFilter}
                  <button onClick={() => setStatusFilter("all")}><X className="h-3 w-3" /></button>
                </span>
              )}
              <button
                onClick={() => { setRoleFilter("all"); setStatusFilter("all"); }}
                className="ml-auto text-xs text-zinc-400 hover:text-zinc-700 transition"
              >
                Reset semua
              </button>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center px-5 py-3 border-b border-zinc-100 bg-zinc-50/60">
            <p className="text-xs font-medium text-zinc-500">
              Menampilkan <span className="text-zinc-900 font-bold">{filteredUsers.length}</span> dari {users.length} user
            </p>
          </div>

          {filteredUsers.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="px-5 py-3 text-left   text-xs font-semibold text-zinc-400 uppercase tracking-wide w-[32%]">Pengguna</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wide w-[12%]">Role</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wide w-[13%]">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wide w-[14%]">Bergabung</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wide w-[11%]">Order</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wide w-[18%]">Aksi</th>
                  </tr>
                </thead>
                <motion.tbody variants={staggerContainer} initial="hidden" animate="show">
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      variants={staggerItem}
                      className="border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors"
                    >
                      {/* Pengguna */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} type={user.type} size="sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-900 truncate">{user.name}</p>
                            <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleColors[user.type]}`}>
                          {user.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <div className="flex justify-center">
                          <StatusBadge status={user.status} size="sm" />
                        </div>
                      </td>

                      {/* Join */}
                      <td className="px-4 py-3.5 text-center text-xs text-zinc-500">{user.joinDate}</td>

                      {/* Orders */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-xs font-medium text-zinc-700">
                          {user.type === "admin" ? "–" : `${user.orders} order`}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex justify-center gap-1">
                          {user.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(user)}
                                className="flex items-center gap-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white transition"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />Approve
                              </button>
                              <button
                                onClick={() => handleReject(user)}
                                className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition"
                              >
                                <X className="h-3.5 w-3.5" />Tolak
                              </button>
                            </>
                          )}
                          {user.status === "suspended" && (
                            <>
                              <ActionBtn icon={CheckCircle} color="green" title="Aktifkan" onClick={() => handleActivate(user)} />
                              <ActionBtn icon={Eye} title="Detail" onClick={() => setDetailUser(user)} />
                            </>
                          )}
                          {user.status === "active" && (
                            <>
                              <ActionBtn icon={Eye} title="Detail" onClick={() => setDetailUser(user)} />
                              <ActionBtn icon={Pencil} title="Edit" onClick={() => handleEditClick(user)} />
                              <ActionBtn
                                icon={Ban}
                                title={user.type === "admin" ? "Admin tidak bisa di-suspend" : "Suspend"}
                                disabled={user.type === "admin"}
                                color="amber"
                                onClick={() => setSuspendUser(user)}
                              />
                              <ActionBtn icon={Trash2} title="Hapus" color="red" onClick={() => setDeleteUser(user)} />
                            </>
                          )}
                          {user.status === "cancelled" && (
                            <ActionBtn icon={Trash2} title="Hapus" color="red" onClick={() => setDeleteUser(user)} />
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={Users} title="Tidak ada user ditemukan" description="Coba ubah filter pencarian Anda" />
          )}
        </div>

        {/* ── DETAIL USER DIALOG ── */}
        <Dialog open={!!detailUser} onOpenChange={() => setDetailUser(null)}>
          <DialogContent className="max-w-md p-0 overflow-hidden">
            {detailUser && (
              <>
                <div
                  className="px-6 pt-6 pb-4"
                  style={{ background: detailUser.type === "admin" ? "rgb(245,243,255)" : "rgb(239,246,255)" }}
                >
                  <div className="flex items-center gap-4">
                    <Avatar name={detailUser.name} type={detailUser.type} size="lg" />
                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg leading-tight">{detailUser.name}</h3>
                      <p className="text-sm text-zinc-500">{detailUser.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleColors[detailUser.type]}`}>
                          {detailUser.type}
                        </span>
                        <StatusBadge status={detailUser.status} size="sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                  {/* Admin */}
                  {detailUser.type === "admin" && (
                    <div className="grid grid-cols-2 gap-4">
                      <InfoRow icon={Phone}       label="Telepon"   value={detailUser.phone} />
                      <InfoRow icon={Calendar}    label="Bergabung" value={detailUser.joinDate} />
                      <InfoRow icon={ShieldCheck} label="ID User"   value={`#${detailUser.id.toString().padStart(4, "0")}`} />
                    </div>
                  )}

                  {/* Customer */}
                  {detailUser.type === "customer" && (
                    <div className="grid grid-cols-2 gap-4">
                      <InfoRow icon={Phone}       label="Telepon"     value={detailUser.phone} />
                      <InfoRow icon={Calendar}    label="Tgl Lahir"   value={detailUser.dob ?? "-"} />
                      <InfoRow icon={Home}        label="Alamat"      value={detailUser.address ?? "-"} />
                      <InfoRow icon={Calendar}    label="Bergabung"   value={detailUser.joinDate} />
                      <InfoRow icon={Activity}    label="Total Order" value={`${detailUser.orders} order`} />
                      <InfoRow icon={ShieldCheck} label="ID User"     value={`#${detailUser.id.toString().padStart(4, "0")}`} />
                    </div>
                  )}
                </div>

                <DialogFooter className="px-6 pb-5">
                  <Button variant="outline" className="w-full" onClick={() => setDetailUser(null)}>Tutup</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ── ADD USER DIALOG ── */}
        <Dialog open={addUserOpen} onOpenChange={() => setAddUserOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle>Tambah User Baru</DialogTitle>
                  <DialogDescription className="text-xs mt-0.5">Isi data lengkap pengguna baru</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <FormField label="Nama Lengkap" icon={User}>
                <Input placeholder="Masukkan nama lengkap" value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  className="h-10 rounded-xl border-zinc-200" />
              </FormField>
              <FormField label="Email" icon={Mail}>
                <Input type="email" placeholder="contoh@email.com" value={addFormData.email}
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  className="h-10 rounded-xl border-zinc-200" />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="No. Telepon" icon={Phone}>
                  <Input placeholder="0812-xxxx-xxxx" value={addFormData.phone}
                    onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                    className="h-10 rounded-xl border-zinc-200" />
                </FormField>
                <FormField label="Role" icon={ShieldCheck}>
                  <Select value={addFormData.role} onValueChange={(val) => setAddFormData({ ...addFormData, role: val })}>
                    <SelectTrigger className="h-10 rounded-xl border-zinc-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <FormField label="Password" icon={ShieldCheck}>
                <Input type="password" placeholder="Min. 8 karakter" value={addFormData.password}
                  onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                  className="h-10 rounded-xl border-zinc-200" />
              </FormField>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setAddUserOpen(false)} className="flex-1">Batal</Button>
              <Button onClick={handleAddUser} className="flex-1" disabled={!addFormData.name || !addFormData.email}>
                Tambah User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── EDIT USER DIALOG ── */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                  <Pencil className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription className="text-xs mt-0.5">Perbarui data pengguna</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {editingUser && (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-3 rounded-xl bg-zinc-50 border border-zinc-100 p-3">
                  <Avatar name={editingUser.name} type={editingUser.type} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{editingUser.name}</p>
                    <p className="text-xs text-zinc-400">{editingUser.email}</p>
                  </div>
                </div>
                <FormField label="Nama Lengkap" icon={User}>
                  <Input value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="h-10 rounded-xl border-zinc-200" />
                </FormField>
                <FormField label="Email" icon={Mail}>
                  <Input value={editingUser.email} disabled
                    className="h-10 rounded-xl border-zinc-200 bg-zinc-50 cursor-not-allowed text-zinc-400" />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="No. Telepon" icon={Phone}>
                    <Input value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="h-10 rounded-xl border-zinc-200" />
                  </FormField>
                  <FormField label="Role" icon={ShieldCheck}>
                    <Select value={editFormData.role} onValueChange={(val) => setEditFormData({ ...editFormData, role: val })}>
                      <SelectTrigger className="h-10 rounded-xl border-zinc-200"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setEditingUser(null)} className="flex-1">Batal</Button>
              <Button onClick={handleSaveEdit} className="flex-1">Simpan Perubahan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── SUSPEND DIALOG ── */}
        <Dialog open={!!suspendUser} onOpenChange={() => setSuspendUser(null)}>
          <DialogContent className="max-w-sm">
            <div className="flex flex-col items-center text-center gap-4 py-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
                <Ban className="h-7 w-7 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 text-lg">Suspend User?</h3>
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                  Akun <span className="font-semibold text-zinc-800">{suspendUser?.name}</span> akan dinonaktifkan.
                  User tidak dapat login hingga diaktifkan kembali.
                </p>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSuspendUser(null)} className="flex-1">Batal</Button>
              <Button onClick={handleConfirmSuspend} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                Ya, Suspend
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── DELETE DIALOG ── */}
        <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
          <DialogContent className="max-w-sm">
            <div className="flex flex-col items-center text-center gap-4 py-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 text-lg">Hapus User?</h3>
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                  Akun <span className="font-semibold text-zinc-800">{deleteUser?.name}</span> akan dihapus secara permanen dan tidak dapat dipulihkan.
                </p>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDeleteUser(null)} className="flex-1">Batal</Button>
              <Button variant="destructive" onClick={handleConfirmDelete} className="flex-1">Ya, Hapus</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
}

// ─── Micro components ──────────────────────────────────────────────────────────

function ActionBtn({ icon: Icon, title, onClick, disabled, color }: {
  icon: React.ElementType; title: string; onClick?: () => void;
  disabled?: boolean; color?: "red" | "green" | "amber";
}) {
  const colorMap = {
    red:   "hover:bg-red-50 hover:text-red-600",
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