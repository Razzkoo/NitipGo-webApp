import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Filter
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* =====================
   TYPES & DATA STRUCTURE
===================== */

type TxType = "income" | "withdraw";

interface Transaction {
  id: string;
  type: "income" | "withdraw";
  title: string;
  date: string;
  amount: number;
  status: "success" | "processing";
  method?: "bank" | "E-Wallet";
}

/* NOTE:
   Data ini STRUKTURNYA REAL,
   tinggal ganti ke API nanti
*/
const transactions: Transaction[] = [
  {
    id: "tx-1",
    type: "income",
    title: "Pendapatan perjalanan Jakarta → Bandung",
    date: "12 Feb 2026 • 14:32",
    amount: 350000,
    status: "success",
  },
  {
    id: "tx-2",
    type: "withdraw",
    title: "Penarikan ke E-Wallet",
    date: "10 Feb 2026 • 09:10",
    amount: 500000,
    status: "success",
    method: "E-Wallet"
  },
  {
    id: "tx-3",
    type: "income",
    title: "Pendapatan titip beli",
    date: "8 Feb 2026 • 18:45",
    amount: 200000,
    status: "success",
  },
  {
    id: "tx-4",
    type: "withdraw",
    title: "Penarikan ke Rekening Bank",
    date: "5 Feb 2026 • 11:02",
    amount: 750000,
    status: "processing",
    method: "bank"
  },
];

export default function RiwayatSaldo() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialFilter = (location.state as any)?.filter || "all";
  const [filter, setFilter] = useState<"all" | "income" | "withdraw">(initialFilter);
// state transaksi supaya bisa diupdate dari frontend
const [transactionsState, setTransactionsState] = useState<Transaction[]>(transactions);

// mock saldo (frontend-only)
const [saldoTersedia, setSaldoTersedia] = useState(1250000);

 const filteredTx =
  filter === "all"
    ? transactionsState
    : transactionsState.filter((tx) => tx.type === filter);

    // fungsi ini bisa dipanggil dari TarikSaldo nanti (frontend mock)
function addWithdrawTransaction(amount: number, method: "bank" | "E-Wallet") {
  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    type: "withdraw",
    title: method === "bank" ? "Penarikan ke Rekening Bank" : "Penarikan ke E-Wallet",
    date: new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
    amount: amount,
    status: "processing",
    method: method
  };

  // update transaksi
  setTransactionsState(prev => [newTx, ...prev]);

  // update saldo frontend
  setSaldoTersedia(prev => prev - amount);

  // animasi status: Diproses → Berhasil setelah 2 detik
  setTimeout(() => {
    setTransactionsState(prev =>
      prev.map(tx => tx.id === newTx.id ? { ...tx, status: "success" } : tx)
    );
  }, 2000);
}

  return (
    <DashboardLayout role="traveler">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* BACK */}
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Riwayat Saldo</h1>
              <p className="text-muted-foreground">
                Pantau pendapatan dan penarikan saldo kamu
              </p>
            </div>
          </div>
        </motion.div>

        {/* FILTER */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "Semua" },
            { key: "income", label: "Pendapatan" },
            { key: "withdraw", label: "Penarikan" },
          ].map((tab) => (
            <Button
              key={tab.key}
              size="sm"
              variant={filter === tab.key ? "hero" : "outline"}
              onClick={() => setFilter(tab.key as any)}
              className="rounded-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* LIST */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTx.map((tx) => {
  const isIncome = tx.type === "income";
  
  return (
    <motion.div
      key={tx.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="rounded-2xl border bg-card p-5 flex items-center justify-between hover:shadow-md transition"
    >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center",
                        isIncome
                          ? "bg-success/15 text-success"
                          : "bg-warning/15 text-warning"
                      )}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="h-6 w-6" />
                      ) : (
                        <ArrowUpRight className="h-6 w-6" />
                      )}
                    </div>

                    <div>
                      <p className="font-medium">{tx.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.date}
                      </p>
                      {tx.type === "withdraw" && tx.method && (
  <p className="text-xs text-muted-foreground mt-0.5">
    Ke {tx.method === "bank" ? "Rekening Bank" : "E-Wallet"}
  </p>
)}
                      <span
                        className={cn(
                          "inline-block mt-1 text-xs font-medium px-2 py-1 rounded-full",
                          tx.status === "success"
                            ? "bg-success/15 text-success"
                            : "bg-warning/15 text-warning"
                        )}
                      >
                        {tx.status === "success"
                          ? "Berhasil"
                          : "Diproses"}
                      </span>
                    </div>
                  </div>

                  <p
                    className={cn(
                      "text-lg font-semibold",
                      isIncome ? "text-success" : "text-warning"
                    )}
                  >
                    {isIncome ? "+" : "-"} Rp{" "}
                    {tx.amount.toLocaleString("id-ID")}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredTx.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Tidak ada transaksi untuk filter ini
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
