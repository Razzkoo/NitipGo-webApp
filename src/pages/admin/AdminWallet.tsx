import { motion } from "framer-motion";
import {
  Wallet,
  Lock,
  CheckCircle,
  TrendingUp,
  Percent,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// =====================
// Dummy Data (Bulanan)
// =====================
const saldoSummary = {
  total: 12500000,
  available: 8500000,
  hold: 4000000,
};

const saldoMovement = [
  { label: "Deposit Masuk", amount: 3500000, type: "plus" },
  { label: "Pembayaran Keluar", amount: 1500000, type: "minus" },
  { label: "Refund Dana", amount: 500000, type: "minus" },
  { label: "Penyesuaian Saldo", amount: 200000, type: "plus" },
];

const platformCommission = {
  total: 750000,
  percent: 10,
};

const travelerWithdrawals = [
  { name: "Rina Setiawan", amount: 500000, status: "success", date: "10 Apr 2024" },
  { name: "Budi Pratama", amount: 800000, status: "pending", date: "12 Apr 2024" },
  { name: "Dewi Anggraini", amount: 350000, status: "rejected", date: "15 Apr 2024" },
];

// =====================
// Helpers
// =====================
const formatRupiah = (value: number) =>
  `Rp ${value.toLocaleString("id-ID")}`;

const statusBadge = (status: string) => {
  switch (status) {
    case "success":
      return <Badge className="bg-success/20 text-success">Sukses</Badge>;
    case "pending":
      return <Badge className="bg-warning/20 text-warning">Menunggu</Badge>;
    case "rejected":
      return <Badge className="bg-destructive/20 text-destructive">Ditolak</Badge>;
    default:
      return null;
  }
};

// =====================
// Component
// =====================
export default function WalletAdmin() {
  return (
    <DashboardLayout role="admin">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="space-y-6 p-6 md:p-8"
      >
        <div className="flex items-start justify-between mb-6">
  <div className="flex items-start gap-3">
    <div className="mt-1 rounded-lg bg-primary/10 p-2">
      <Wallet className="h-5 w-5 text-primary" />
    </div>

    <div>
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        Saldo & Keuangan Platform
      </h1>
      <p className="text-sm text-muted-foreground">
        Monitoring saldo sistem, komisi, dan pergerakan dana
      </p>
    </div>
  </div>
</div>

<div className="h-px w-full bg-border mb-6" />

        {/* ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Total Saldo */}
  <Card>
    <CardHeader className="flex flex-row items-center gap-2">
      <Wallet className="w-5 h-5 text-primary" />
      <CardTitle>Total Saldo Platform</CardTitle>
    </CardHeader>

    <CardContent className="pt-0">
      <div className="mt-3 rounded-lg bg-muted/40 px-4 py-3">
        <p className="text-xs text-muted-foreground mb-1">
          Akumulasi saldo sistem
        </p>

        <p className="text-2xl font-bold">
          {formatRupiah(saldoSummary.total)}
        </p>

        <div className="mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-primary to-primary/30" />
      </div>
    </CardContent>
  </Card>

  {/* Saldo Tersedia */}
  <Card>
    <CardHeader className="flex flex-row items-center gap-2">
      <CheckCircle className="w-5 h-5 text-green-600" />
      <CardTitle>Saldo Tersedia</CardTitle>
    </CardHeader>

    <CardContent className="pt-0">
      <div className="mt-3 rounded-lg bg-green-500/10 px-4 py-3">
        <p className="text-xs text-muted-foreground mb-1">
          Dapat digunakan & dicairkan
        </p>

        <p className="text-2xl font-bold text-green-600">
          {formatRupiah(saldoSummary.available)}
        </p>

        <div className="mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-green-600 to-green-400/30" />
      </div>
    </CardContent>
  </Card>

  {/* Saldo Ditahan */}
  <Card>
    <CardHeader className="flex flex-row items-center gap-2">
      <Lock className="w-5 h-5 text-orange-500" />
      <CardTitle>Saldo Ditahan</CardTitle>
    </CardHeader>

    <CardContent className="pt-0">
      <div className="mt-3 rounded-lg bg-orange-500/10 px-4 py-3">
        <p className="text-xs text-muted-foreground mb-1">
          Menunggu penyelesaian transaksi
        </p>

        <p className="text-2xl font-bold text-orange-500">
          {formatRupiah(saldoSummary.hold)}
        </p>

        <div className="mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-400/30" />
      </div>
    </CardContent>
  </Card>
</div>

        {/* ===================== */}
        {/* Middle Section */}
        {/* ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Saldo Movement */}
          <Card className="md:col-span-2">
  <CardHeader className="flex items-center justify-between flex-row pb-3">
    <div>
      <CardTitle className="text-base font-semibold">
        Ringkasan Pergerakan Saldo
      </CardTitle>
      <p className="text-xs text-muted-foreground">
        Akumulasi transaksi bulan berjalan
      </p>
    </div>

    <Button variant="outline" size="sm" className="h-8 text-xs">
      Lihat Detail
    </Button>
  </CardHeader>

  <CardContent className="space-y-3">
    {saldoMovement.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <div
            className={`h-2 w-2 rounded-full ${
              item.type === "plus"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          <span className="text-sm font-medium">
            {item.label}
          </span>
        </div>

        <span
          className={`text-sm font-semibold ${
            item.type === "plus"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {item.type === "plus" ? "+" : "-"}{" "}
          {formatRupiah(item.amount)}
        </span>
      </motion.div>
    ))}
  </CardContent>
</Card>

          {/* Commission */}
          <Card>
  <CardHeader className="pb-3">
    <div className="flex items-center gap-2">
      <TrendingUp className="w-5 h-5 text-primary" />
      <CardTitle className="text-base font-semibold">
        Komisi Platform
      </CardTitle>
    </div>
    <p className="text-xs text-muted-foreground">
      Pendapatan platform dari setiap transaksi
    </p>
  </CardHeader>

  <CardContent className="space-y-5">
    {/* Total Komisi */}
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl bg-primary/5 px-4 py-3"
    >
      <p className="text-xs text-muted-foreground mb-1">
        Total Komisi Terkumpul
      </p>
      <p className="text-xl font-bold text-primary">
        {formatRupiah(platformCommission.total)}
      </p>
    </motion.div>

    {/* Persentase */}
    <div className="flex items-center justify-between rounded-lg border px-4 py-3">
      <span className="text-sm text-muted-foreground">
        Persentase Komisi
      </span>

      <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
        <Percent className="w-3.5 h-3.5" />
        {platformCommission.percent}%
      </div>
    </div>
  </CardContent>
</Card>
</div>

        {/* ===================== */}
        {/* Withdrawals */}
        {/* ===================== */}
        <Card>
  <CardHeader className="flex items-center justify-between flex-row pb-3">
    <div>
      <CardTitle className="text-base font-semibold">
        Penarikan Traveler
      </CardTitle>
      <p className="text-xs text-muted-foreground">
        Riwayat permintaan penarikan saldo oleh traveler
      </p>
    </div>

    <Button variant="outline" size="sm">
      Lihat Semua
    </Button>
  </CardHeader>

  <CardContent className="p-0">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-t bg-muted/40 text-muted-foreground">
          <th className="px-4 py-3 text-left font-medium">
            Traveler
          </th>
          <th className="px-4 py-3 text-left font-medium">
            Jumlah
          </th>
          <th className="px-4 py-3 text-left font-medium">
            Status
          </th>
          <th className="px-4 py-3 text-left font-medium">
            Tanggal
          </th>
        </tr>
      </thead>

      <tbody>
        {travelerWithdrawals.map((item, index) => (
          <motion.tr
            key={index}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="border-t hover:bg-muted/30"
          >
            <td className="px-4 py-3 font-medium">
              {item.name}
            </td>

            <td className="px-4 py-3">
              {formatRupiah(item.amount)}
            </td>

            <td className="px-4 py-3">
              {statusBadge(item.status)}
            </td>

            <td className="px-4 py-3 text-muted-foreground">
              {item.date}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </CardContent>
</Card>
      </motion.div>
    </DashboardLayout>
  );
}