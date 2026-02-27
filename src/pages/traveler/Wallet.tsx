import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wallet,
  CreditCard,
  Building2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  PlusCircle,
  History,
  ArrowRight,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CountUp } from "@/components/ui/CountUp";

const withdrawMethods = [
  { id: "bank", name: "Transfer Bank", icon: Building2, fee: "Rp 2.500" },
  { id: "ewallet", name: "E-Wallet", icon: CreditCard, fee: "Gratis" },
];

export default function TravelerWallet() {
  const navigate = useNavigate();
  const { toast } = useToast();
  type WithdrawStatus = "PENDING" | "APPROVED" | "REJECTED";

  const withdrawList = [
  {
    id: "WD-001",
    amount: 500000,
    method: "Transfer Bank",
    status: "PENDING" as WithdrawStatus,
    date: "18 Feb 2024",
  },
  {
    id: "WD-002",
    amount: 300000,
    method: "E-Wallet",
    status: "APPROVED" as WithdrawStatus,
    date: "10 Feb 2024",
  },
];

  const [selectedMethod, setSelectedMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [withdrawRequests, setWithdrawRequests] = useState(withdrawList);

 // ===== DUMMY DATA =====
const totalIncome = 5200000;
const totalWithdraw = 2700000;

// balance sekarang dihitung otomatis
const balance = totalIncome - totalWithdraw;

const incomeList = [
  { id: 1, title: "Order #1234", amount: 150000, date: "12 Feb 2024" },
  { id: 2, title: "Order #1233", amount: 75000, date: "11 Feb 2024" },
  { id: 3, title: "Order #1232", amount: 50000, date: "10 Feb 2024" },
];
// ======================

  const numAmount = Number(amount) || 0;
  const isValidAmount = numAmount >= 50000 && numAmount <= balance;

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const newWithdraw = {
    id: `WD-${Date.now()}`,
    amount: numAmount,
    method:
      selectedMethod === "bank" ? "Transfer Bank" : "E-Wallet",
    status: "PENDING" as WithdrawStatus,
    date: new Date().toLocaleDateString("id-ID"),
  };

  setWithdrawRequests((prev) => [newWithdraw, ...prev]);

  toast({
    title: "Permintaan Penarikan Dikirim",
    description: "Menunggu persetujuan admin.",
  });

  setSubmitted(true);
  setAmount("");
  setAccountNumber("");
};

  return (
    <DashboardLayout role="traveler">
      <div className="p-6 md:p-8 lg:p-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-6">
  <div className="flex items-start gap-3">
    <div className="mt-1 rounded-lg bg-primary/10 p-2">
      <Wallet className="h-5 w-5 text-primary" />
    </div>

    <div>
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        Saldo Saya
      </h1>
      <p className="text-sm text-muted-foreground">
        Kelola saldo dan riwayat transaksi Anda
      </p>
    </div>
  </div>
</div>
        </motion.div>

        <div className="max-w-7xl mx-auto space-y-6">
          {/* SALDO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl bg-gradient-to-br from-accent to-accent/80 p-6 text-accent-foreground relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <Wallet className="h-8 w-8" />
                <span className="text-lg font-medium">Saldo Anda</span>
              </div>

              <p className="text-4xl font-bold">
                Rp <CountUp end={balance} duration={1200} />
              </p>

              <p className="mt-2 text-sm flex items-center gap-1 text-accent-foreground/80">
                <TrendingUp className="h-4 w-4" />
                Tersedia untuk ditarik
              </p>
            </div>
          </motion.div>

          {/* RINGKASAN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-card p-4 shadow-card hover:shadow-lg transition">
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-lg bg-success/10 text-success">
      <TrendingUp className="h-4 w-4" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Total Pendapatan</p>
      <p className="font-semibold text-foreground">
        Rp {totalIncome.toLocaleString()}
      </p>
    </div>
  </div>
</div>

            <div className="rounded-xl bg-card p-4 shadow-card hover:shadow-lg transition">
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-lg bg-warning/10 text-warning">
      <History className="h-4 w-4" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Sudah Ditarik</p>
      <p className="font-semibold text-foreground">
        Rp {totalWithdraw.toLocaleString()}
      </p>
    </div>
  </div>
</div>

            <div className="rounded-xl bg-card p-4 shadow-card hover:shadow-lg transition">
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-lg bg-primary/10 text-primary">
      <Wallet className="h-4 w-4" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Saldo Tersedia</p>
      <p className="font-semibold text-foreground">
        Rp {balance.toLocaleString()}
      </p>
    </div>
  </div>
</div>
          </div>

          {/* BUTTON AKSI */}
<div className="grid grid-cols-2 gap-3">
  <Button
    variant="hero"
    size="lg"
    onClick={() => navigate("/traveler/tariksaldo")}
  >
    <PlusCircle className="h-5 w-5 mr-2" />
    Tarik Saldo
  </Button>

  <Button
    variant="outline"
    size="lg"
    onClick={() => navigate("/traveler/riwayatsaldo")}
  >
    <History className="h-5 w-5 mr-2" />
    Lihat Riwayat
  </Button>
</div>

{/* WRAPPER DESKTOP 2 KOLOM */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
{/* RIWAYAT PENARIKAN TERBARU */}
<div className="rounded-2xl bg-card p-6 shadow-card flex flex-col">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold">
      Penarikan Terakhir
    </h2>
    <button
  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition group"
  onClick={() => navigate("/traveler/riwayatsaldo", { state: { filter: "withdraw" } })}
>
  Lihat Semua
   <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
</button>
  </div>

  <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
    {withdrawRequests.length === 0 && (
  <p className="text-sm text-muted-foreground text-center py-8">
    Belum ada penarikan
  </p>
)}
    {withdrawRequests.slice(0, 3).map((wd) => (
      <div
        key={wd.id}
        className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted transition"
      >
        <div>
          <p className="font-medium">
            Rp {wd.amount.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {wd.method} • {wd.date}
          </p>
        </div>

        <span
  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
    wd.status === "PENDING"
      ? "bg-warning/15 text-warning"
      : wd.status === "APPROVED"
      ? "bg-success/15 text-success"
      : "bg-destructive/15 text-destructive"
  }`}
>
  {wd.status}
</span>
      </div>
    ))}
  </div>
</div>

          {/* PENDAPATAN TERBARU */}
<div className="rounded-2xl bg-card p-6 shadow-card flex flex-col">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-foreground">
      Pendapatan Terbaru
    </h2>
    <button
  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition group"
  onClick={() => navigate("/traveler/riwayatsaldo", { state: { filter: "income" } })}
>
  Lihat Semua
   <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
</button>
  </div>

            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {incomeList.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ x: 2 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted transition"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      + Rp {item.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.title}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.date}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
