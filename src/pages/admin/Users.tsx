import { useState } from "react"; 
import { motion } from "framer-motion";
import {
  Search,
  Users,
  Eye,
  Pencil,
  Save,
  Trash2,
  Ban,
  CheckCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type UserStatus = "pending" | "active" | "suspended" | "cancelled";
type UserType = "customer" | "traveler" | "admin";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  status: UserStatus;
  joinDate: string;
  orders?: number;
  trips?: number;
}

const mockUsers: User[] = [
  { id: 1, name: "Budi Santoso", email: "budi@email.com", phone: "0812-3456-7890", type: "customer", status: "active" as const, joinDate: "10 Jan 2024", orders: 12 },
  { id: 2, name: "Andi Pratama", email: "andi@email.com", phone: "0813-4567-8901", type: "traveler", status: "active" as const, joinDate: "5 Jan 2024", trips: 45 },
  { id: 3, name: "Sari Dewi", email: "sari@email.com", phone: "0814-5678-9012", type: "traveler", status: "pending" as const, joinDate: "14 Feb 2024", trips: 0 },
  { id: 4, name: "Rina Kusuma", email: "rina@email.com", phone: "0815-6789-0123", type: "customer", status: "cancelled" as const, joinDate: "20 Dec 2023", orders: 3 },
  { id: 5, name: "Dimas Wijaya", email: "dimas@email.com", phone: "0816-7890-1234", type: "admin", status: "active" as const, joinDate: "1 Feb 2024", orders: 0 },
  { id: 6, name: "Putri Lestari", email: "putri@email.com", phone: "0817-2222-3333", type: "customer", status: "pending" as const, joinDate: "18 Feb 2024", orders: 0 },
  { id: 7, name: "Ahmad Fauzi", email: "ahmad@email.com", phone: "0818-4444-5555", type: "traveler", status: "cancelled" as const, joinDate: "22 Jan 2024", trips: 2 },
  { id: 8, name: "Nabila Rahma", email: "nabila@email.com", phone: "0819-6666-7777", type: "customer", status: "active" as const, joinDate: "11 Feb 2024", orders: 7 },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const staggerItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function AdminUsers() {

  const [users, setUsers] = useState<User[]>(mockUsers);
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
  "all" | "pending" | "suspended"
>("all");

const [statusRoleFilter, setStatusRoleFilter] = useState<
  "all" | "customer" | "traveler"
>("all");

  const [editingUser, setEditingUser] = useState<any>(null);
  const [detailUser, setDetailUser] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [suspendUser, setSuspendUser] = useState<any | null>(null);

  // ADD USER
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });

  // EDIT USER
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    role: "customer",
  });

  const filteredUsers = users.filter((user) => {
  const matchSearch =
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase());

  // FILTER ROLE NORMAL (all, admin, customer, traveler)
  const matchRole =
    filter === "all" || user.type === filter;

  // FILTER STATUS (pending / suspended)
  const matchStatus =
    statusFilter === "all" || user.status === statusFilter;

  // FILTER ROLE KHUSUS STATUS
  const matchStatusRole =
    statusRoleFilter === "all" || user.type === statusRoleFilter;

  return matchSearch && matchRole && matchStatus && matchStatusRole;
});

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      phone: user.phone || "",
      role: user.type,
    });
  };

  const handleSaveEdit = () => {
    toast({
      title: "Data Diperbarui",
      description: `Data ${editingUser.name} berhasil diperbarui.`,
    });
    setEditingUser(null);
  };

  const handleSuspendUser = (id: number) => {
  setUsers((prev) =>
    prev.map((user) =>
      user.id === id ? { ...user, status: "suspended" } : user
    )
  );

  toast({
    title: "User Disuspend",
    description: "Akun berhasil dinonaktifkan.",
  });
};

const handleActivateUser = (id: number) => {
  setUsers((prev) =>
    prev.map((user) =>
      user.id === id ? { ...user, status: "active" } : user
    )
  );

  toast({
    title: "User Diaktifkan",
    description: "Akun berhasil diaktifkan kembali.",
  });
};

  const handleAddUser = () => {
    toast({
      title: "User Ditambahkan",
      description: `User ${addFormData.name} berhasil ditambahkan.`,
    });
    setAddUserOpen(false);
    setAddFormData({ name: "", email: "", phone: "", password: "", role: "customer" });
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 md:p-8 lg:p-10">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
  <div className="flex items-start gap-3">
    <div className="mt-1 rounded-lg bg-primary/10 p-2">
      <Users className="h-5 w-5 text-primary" />
    </div>

    <div>
      <h1 className="text-2xl font-bold leading-tight">
        Manajemen user
      </h1>
      <p className="text-sm text-muted-foreground">
        Monitoring dan kontrol akun pengguna
      </p>
    </div>
  </div>

          <Button onClick={() => setAddUserOpen(true)}>
            + Tambah User
          </Button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">

  {["all", "admin", "customer", "traveler"].map((f) => (
    <Button
      key={f}
      size="sm"
      variant={filter === f ? "default" : "outline"}
      onClick={() => {
        setFilter(f);
        setStatusFilter("all");
        setStatusRoleFilter("all");
      }}
    >
      {f === "all"
        ? "Semua"
        : f.charAt(0).toUpperCase() + f.slice(1)}
    </Button>
  ))}
        <Select
  value={
    statusFilter === "pending" ? statusRoleFilter : "all"
  }
  onValueChange={(val) => {
    setFilter("all");
    setStatusFilter("pending");
    setStatusRoleFilter(val as any);
  }}
>
  <SelectTrigger className="
      h-10
      w-[160px]
      rounded-md
      border
      text-sm
      flex items-center justify-between
    "
  >
    <SelectValue placeholder="Pending" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Pending</SelectItem>
    <SelectItem value="customer">Customer</SelectItem>
    <SelectItem value="traveler">Traveler</SelectItem>
  </SelectContent>
</Select>

<Select
  value={
    statusFilter === "suspended" ? statusRoleFilter : "all"
  }
  onValueChange={(val) => {
    setFilter("all");
    setStatusFilter("suspended");
    setStatusRoleFilter(val as any);
  }}
>
  <SelectTrigger className="
      h-10
      w-[160px]
      rounded-md
      border
      text-sm
      flex items-center justify-between
    "
  >
    <SelectValue placeholder="Suspended" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Suspend</SelectItem>
    <SelectItem value="customer">Customer</SelectItem>
    <SelectItem value="traveler">Traveler</SelectItem>
  </SelectContent>
</Select>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-2xl bg-card shadow-card overflow-x-auto">
          {filteredUsers.length ? (
            <table className="w-full min-w-[720px] table-fixed">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 w-[22%] text-left">User</th>
                  <th className="p-4 w-[12%] text-center">Tipe</th>
                  <th className="p-4 w-[12%] text-center">Status</th>
                  <th className="p-4 w-[14%] text-center">Bergabung</th>
                  <th className="p-4 w-[12%] text-center">Aktivitas</th>
                  <th className="p-4 w-[18%] text-center">Aksi</th>
                </tr>
              </thead>

              <motion.tbody variants={staggerContainer} initial="hidden" animate="show">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    variants={staggerItem}
                    className="border-t hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </td>

                    <td className="p-4 text-center capitalize">{user.type}</td>

                    <td className="p-4">
                      <div className="flex justify-center">
                        <StatusBadge status={user.status} size="sm" />
                      </div>
                    </td>

                    <td className="p-4 text-center text-sm">{user.joinDate}</td>

                    <td className="p-4 text-center text-sm">
                      {user.type === "traveler"
                        ? `${user.trips} trip`
                        : `${user.orders} order`}
                    </td>
                    
                    <td className="p-4">
  <div className="flex justify-center gap-2">

    {user.status === "pending" ? (
  <>
    <Button
      size="sm"
      onClick={() => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, status: "active" } : u
          )
        );
        toast({
          title: "User Disetujui",
          description: `${user.name} berhasil di-approve.`,
        });
      }}
    >
      Approve
    </Button>

    <Button
      size="sm"
      variant="destructive"
      onClick={() => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, status: "cancelled" } : u
          )
        );
        toast({
          title: "User Ditolak",
          description: `${user.name} ditolak.`,
        });
      }}
    >
      Reject
    </Button>
  </>
) : user.status === "suspended" ? (
  <>
    <Button
      variant="ghost"
      size="icon"
      title="Aktifkan User"
      onClick={() => handleActivateUser(user.id)}
    >
      <CheckCircle className="h-4 w-4 text-success" />
    </Button>

    <Button variant="ghost" size="icon" onClick={() => setDetailUser(user)}>
      <Eye className="h-4 w-4" />
    </Button>
  </>
) : user.status === "active" ? (
  <>
    <Button variant="ghost" size="icon" onClick={() => setDetailUser(user)}>
      <Eye className="h-4 w-4" />
    </Button>

    <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}>
      <Pencil className="h-4 w-4" />
    </Button>

    <Button
  variant="ghost"
  size="icon"
  title={
    user.type === "admin"
      ? "Admin tidak bisa di-suspend"
      : "Suspend User"
  }
  disabled={user.type === "admin"}
  onClick={() => setSuspendUser(user)}
>
  <Ban className="h-4 w-4" />
    </Button>

    <Button variant="ghost" size="icon" onClick={() => setDeleteUser(user)}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  </>
) : (
  <Button
    variant="ghost"
    size="icon"
    title="Hapus User"
    onClick={() => setDeleteUser(user)}
  >
    <Trash2 className="h-4 w-4 text-destructive" />
  </Button>
)}

  </div>
</td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          ) : (
            <EmptyState
              icon={Users}
              title="Tidak ada user ditemukan"
              description="Coba ubah filter pencarian Anda"
            />
          )}
        </div>

        {/* DETAIL USER */}
        <Dialog open={!!detailUser} onOpenChange={() => setDetailUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detail User</DialogTitle>
              <DialogDescription>Informasi lengkap akun</DialogDescription>
            </DialogHeader>

            {detailUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                    {detailUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{detailUser.name}</p>
                    <p className="text-sm text-muted-foreground">{detailUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Role</p>
                    <p className="capitalize font-medium">{detailUser.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <StatusBadge status={detailUser.status} size="sm" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Telepon</p>
                    <p className="font-medium">{detailUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bergabung</p>
                    <p className="font-medium">{detailUser.joinDate}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ADD USER */}
        <Dialog open={addUserOpen} onOpenChange={() => setAddUserOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah User</DialogTitle>
              <DialogDescription>Isi data user baru</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Nama"
                value={addFormData.name}
                onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={addFormData.email}
                onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
              />
              <Input
                placeholder="No Telepon"
                value={addFormData.phone}
                onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
              />
              <Input
                placeholder="Password"
                type="password"
                value={addFormData.password}
                onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
              />
              <Select value={addFormData.role} onValueChange={(val) => setAddFormData({ ...addFormData, role: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="traveler">Traveler</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAddUserOpen(false)}>Batal</Button>
              <Button onClick={handleAddUser}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* EDIT USER */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Perbarui data user</DialogDescription>
            </DialogHeader>

            {editingUser && (
              <div className="space-y-4">
                <Input
                  placeholder="Nama"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={editingUser.email}
                  disabled
                />
                <Input
                  placeholder="No Telepon"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
                <Select value={editFormData.role} onValueChange={(val) => setEditFormData({ ...editFormData, role: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="traveler">Traveler</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingUser(null)}>Batal</Button>
              <Button onClick={handleSaveEdit}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* HAPUS USER */}
        <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Hapus User</DialogTitle>
              <DialogDescription>
                User <b>{deleteUser?.name}</b> akan dihapus permanen.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteUser(null)}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  toast({
                    title: "User Dihapus",
                    description: `${deleteUser.name} berhasil dihapus.`,
                  });
                  setDeleteUser(null);
                }}
              >
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* SUSPEND USER */}
        <Dialog open={!!suspendUser} onOpenChange={() => setSuspendUser(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Suspend User</DialogTitle>
              <DialogDescription>
                User <b>{suspendUser?.name}</b> akan dinonaktifkan.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSuspendUser(null)}>
                Batal
              </Button>
              <Button
  variant="destructive"
  onClick={() => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === suspendUser.id
          ? { ...u, status: "suspended" }
          : u
      )
    );

    toast({
      title: "User Dinonaktifkan",
      description: `${suspendUser.name} berhasil dinonaktifkan.`,
    });

    setSuspendUser(null);
  }}
>
  Suspend
</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
}
