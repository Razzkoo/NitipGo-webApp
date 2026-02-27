import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Eye, ArrowRight, Banknote } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CountUp } from "@/components/ui/CountUp";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ====== TAMBAH TYPE STATUS ======
type OrderStatus = "pending" | "in_progress" | "completed" | "cancelled";
type MoneyStatus = "HOLD" | "SPLIT" | "WITHDRAWN";

const mockTransactions = [
  {
    id: "TRX-001",
    orderId: "ORD-001",
    customer: "Budi Santoso",
    traveler: "Andi Pratama",
    route: "Jakarta → Bandung",
    amount: "Rp 45.000",
    commission: "Rp 4.500",
    orderStatus: "completed" as OrderStatus,
    moneyStatus: "SPLIT" as MoneyStatus,
    date: "15 Feb 2024",
  },
  {
    id: "TRX-002",
    orderId: "ORD-002",
    customer: "Rina Kusuma",
    traveler: "Sari Dewi",
    route: "Yogyakarta → Jakarta",
    amount: "Rp 50.000",
    commission: "Rp 5.000",
    orderStatus: "completed",
    moneyStatus: "WITHDRAWN",
    date: "14 Feb 2024",
  },
  {
    id: "TRX-003",
    orderId: "ORD-003",
    customer: "Maya Putri",
    traveler: "Dimas Wijaya",
    route: "Surabaya → Malang",
    amount: "Rp 30.000",
    commission: "Rp 3.000",
    orderStatus: "in_progress",
    moneyStatus: "SPLIT",
    date: "15 Feb 2024",
  },
  {
    id: "TRX-004",
    orderId: "ORD-004",
    customer: "Ahmad Fauzi",
    traveler: "Andi Pratama",
    route: "Jakarta → Semarang",
    amount: "Rp 75.000",
    commission: "Rp 7.500",
    orderStatus: "pending",
    moneyStatus: "HOLD",
    date: "15 Feb 2024",
  },
  {
    id: "TRX-005",
    orderId: "ORD-005",
    customer: "Dewi Lestari",
    traveler: "Budi Santoso",
    route: "Bandung → Jakarta",
    amount: "Rp 35.000",
    commission: "Rp 3.500",
    orderStatus: "cancelled",
    moneyStatus: "HOLD",
    date: "13 Feb 2024",
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const staggerItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function AdminTransactions() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState<MoneyStatus | "all">("all");
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const filteredTx = mockTransactions.filter((tx) => {
  const matchSearch =
    tx.id.toLowerCase().includes(search.toLowerCase()) ||
    tx.customer.toLowerCase().includes(search.toLowerCase()) ||
    tx.traveler.toLowerCase().includes(search.toLowerCase());

  const matchOrder =
    filter === "all" || tx.orderStatus === filter;

  const matchPayment =
    paymentFilter === "all" || tx.moneyStatus === paymentFilter;

  return matchSearch && matchOrder && matchPayment;
});

  const totalAmount = mockTransactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/\D/g, "")), 0);

  const totalCommission = mockTransactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + parseInt(t.commission.replace(/\D/g, "")), 0);

  return (
    <DashboardLayout role="admin">
      <div className="p-6 md:p-8 lg:p-10">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-primary/10 p-2">
              <Banknote className="h-5 w-5 text-primary" />
            </div>
        
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                Transaksi
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitoring transaksi pelanggan dan traveler secara real-time
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-xl bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">Total Transaksi</p>
            <p className="text-2xl font-bold text-foreground">
              <CountUp end={mockTransactions.length} duration={1000} />
            </p>
          </div>
          <div className="rounded-xl bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">Total Volume</p>
            <p className="text-2xl font-bold text-primary">
              Rp <CountUp end={totalAmount} duration={1500} />
            </p>
          </div>
          <div className="rounded-xl bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">Total Komisi</p>
            <p className="text-2xl font-bold text-success">
              Rp <CountUp end={totalCommission} duration={1500} />
            </p>
          </div>
        </div>

        {/* FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari ID transaksi atau nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "in_progress", "completed", "cancelled"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === "all"
                  ? "Semua"
                  : f === "pending"
                  ? "Pending"
                  : f === "in_progress"
                  ? "Diproses"
                  : f === "completed"
                  ? "Selesai"
                  : "Dibatalkan"}
              </Button>
            ))}
          </div>
         <div className="flex items-center gap-2">
  <span className="text-xs text-muted-foreground whitespace-nowrap">
    Payment
  </span>

  <Select
    value={paymentFilter}
    onValueChange={(value) =>
      setPaymentFilter(value as MoneyStatus | "all")
    }
  >
    <SelectTrigger className="h-9 w-[160px]">
      <SelectValue placeholder="Semua Payment" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="all">Semua</SelectItem>
      <SelectItem value="HOLD">Hold (Ditahan)</SelectItem>
      <SelectItem value="SPLIT">Split (Dibagi)</SelectItem>
      <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
    </SelectContent>
  </Select>
</div>
<Button
  variant="ghost"
  size="sm"
  onClick={() => {
    setFilter("all");
    setPaymentFilter("all");
    setSearch("");
  }}
>
  Reset
</Button>
        </div>

        {/* TABLE */}
        <div className="rounded-2xl bg-card shadow-card overflow-hidden">
          {filteredTx.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-center">Rute</th>
                    <th className="p-4 text-center">Customer</th>
                    <th className="p-4 text-center">Traveler</th>
                    <th className="p-4 text-center">Amount</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <motion.tbody variants={staggerContainer} initial="hidden" animate="show">
                  {filteredTx.map((tx) => (
                    <motion.tr key={tx.id} variants={staggerItem} className="border-t">
                      <td className="p-4 text-left">
                        <p className="font-medium">{tx.id}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </td>
                      <td className="p-4 text-center">{tx.route}</td>
                      <td className="p-4 text-center">{tx.customer}</td>
                      <td className="p-4 text-center">{tx.traveler}</td>
                      <td className="p-4 text-center">
                        <p className="font-medium">{tx.amount}</p>
                        <p className="text-xs text-success">+{tx.commission}</p>
                        <p className="text-[11px] text-muted-foreground">
                             {tx.moneyStatus}
                                </p>
                      </td>
                      <td className="p-4 text-center">
                        <StatusBadge
                            status={tx.orderStatus}
                            pulse={tx.orderStatus === "in_progress"}
                            size="sm"
                            />
                      </td>
                      <td className="p-4 text-center">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTx(tx)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="Tidak ada transaksi ditemukan"
              description="Coba ubah filter pencarian Anda"
            />
          )}
        </div>

        {/* DETAIL */}
        <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
          <DialogContent className="max-w-lg">
  <DialogHeader>
    <DialogTitle>Detail Transaksi</DialogTitle>
  </DialogHeader>

  {selectedTx && (
    <div className="space-y-4">
      {/* ID + Status */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
        <div>
          <p className="text-xs text-muted-foreground">Transaction ID</p>
          <p className="font-semibold">{selectedTx.id}</p>
        </div>
        <StatusBadge status={selectedTx.orderStatus} />
      </div>
      <div className="p-3 rounded-lg bg-muted/40 text-sm">
  <p className="text-muted-foreground">Status Uang</p>
  <p className="font-semibold"> {selectedTx.moneyStatus}</p>
</div>

      {/* Route */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
        <div className="flex-1 text-center">
          <p className="text-xs text-muted-foreground">Dari</p>
          <p className="font-semibold">
            {selectedTx.route.split(" → ")[0]}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-primary" />
        <div className="flex-1 text-center">
          <p className="text-xs text-muted-foreground">Ke</p>
          <p className="font-semibold">
            {selectedTx.route.split(" → ")[1]}
          </p>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Customer</p>
          <p className="font-medium">{selectedTx.customer}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Traveler</p>
          <p className="font-medium">{selectedTx.traveler}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Total Transaksi</p>
          <p className="font-medium text-primary">{selectedTx.amount}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Komisi Platform</p>
          <p className="font-medium text-success">
            {selectedTx.commission}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Tanggal</p>
          <p className="font-medium">{selectedTx.date}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Order ID</p>
          <p className="font-medium">{selectedTx.orderId}</p>
        </div>
      </div>
    </div>
  )}
</DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
