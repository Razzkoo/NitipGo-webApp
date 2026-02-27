import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Wallet,
  CreditCard,
  Landmark,
  Info,
  Building2,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"; 
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const withdrawMethods = [
  { id: "bank", name: "Transfer Bank", icon: Building2, fee: "Rp 2.500" },
  { id: "ewallet", name: "E-Wallet", icon: CreditCard, fee: "Gratis" },
];

export default function TarikSaldo() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [method, setMethod] = useState<"bank" | "ewallet" | null>(null);
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const numericAmount = Number(amount) || 0;
  const selectedMethodObj = withdrawMethods.find(m => m.id === method);
  const fee = selectedMethodObj?.id === "bank" ? 2500 : 0;
  const saldoTersedia = 2500000;
  const receivedAmount = numericAmount - fee;
  const isValidAmount = numericAmount >= 50000 && numericAmount <= saldoTersedia;

  const handleWithdraw = () => {
  if (!method || !account || !isValidAmount) return;

  const newWithdraw = {
    id: `WD-${Date.now()}`,
    method: method === "bank" ? "Transfer Bank" : "E-Wallet",
    account,
    amount: numericAmount,
    received: receivedAmount,
    date: new Date().toLocaleString("id-ID"),
  };

  // Tambah ke riwayat
  setWithdrawHistory((prev) => [newWithdraw, ...prev]);

  // Update saldo
  setSaldo((prev) => prev - numericAmount);

  // Reset form
  setAccount("");
  setAmount("");
  setMethod(null);

  // Toast notif sukses
  toast({
    title: "Penarikan berhasil",
    description: `Rp ${numericAmount.toLocaleString("id-ID")} ditarik via ${newWithdraw.method}. Diterima: Rp ${receivedAmount.toLocaleString("id-ID")}`,
  });
};
const [saldo, setSaldo] = useState(saldoTersedia); // saldo dinamis
const [withdrawHistory, setWithdrawHistory] = useState<
  { id: string; method: string; account: string; amount: number; received: number; date: string }[]
>([]);

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
          <h1 className="text-2xl font-semibold">Tarik Saldo</h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Tarik saldo hasil perjalanan ke rekening bank atau e-wallet pilihanmu.
          </p>
        </motion.div>

        {/* SALDO */}
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/15 flex items-center justify-center">
              <Wallet className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm opacity-80">Saldo tersedia</p>
              <p className="text-3xl font-bold">
              Rp {saldo.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* METODE */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Pilih metode penarikan</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setMethod("bank");
                setAccount("");
              }}
              className={cn(
                "rounded-2xl border p-5 text-left transition",
                "hover:border-primary hover:bg-primary/5",
                method === "bank" && "border-primary bg-primary/10"
              )}
            >
              <div className="flex gap-3 items-center">
                <div className="h-11 w-11 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Landmark className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Rekening Bank</p>
                  <p className="text-sm text-muted-foreground">
                    Transfer ke rekening pribadi
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Biaya: Rp 2.500</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setMethod("ewallet");
                setAccount("");
              }}
              className={cn(
                "rounded-2xl border p-5 text-left transition",
                "hover:border-primary hover:bg-primary/5",
                method === "ewallet" && "border-primary bg-primary/10"
              )}
            >
              <div className="flex gap-3 items-center">
                <div className="h-11 w-11 rounded-xl bg-primary/15 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">E-Wallet</p>
                  <p className="text-sm text-muted-foreground">
                    Dana, OVO, GoPay, dll
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Biaya: Gratis</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* FORM → MUNCUL SETELAH PILIH METODE */}
        <AnimatePresence>
          {method && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="rounded-3xl border bg-card p-6 space-y-5"
            >
              {/* ACCOUNT */}
              <div>
                <label className="text-sm font-medium">
                  {method === "bank" ? "Nomor Rekening" : "Nomor E-Wallet"}
                </label>
                <Input
                  placeholder={
                    method === "bank"
                      ? "Masukkan nomor rekening"
                      : "08xxxxxxxxxx"
                  }
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
              </div>

              {/* AMOUNT */}
              <div>
                <label className="text-sm font-medium">Nominal Penarikan</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    type="number"
                    className="pl-10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* INFO */}
              <div className="flex gap-3 rounded-xl bg-muted/50 p-4 text-sm">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-muted-foreground">
                  <p>Minimal penarikan Rp50.000</p>
                  <p>Diproses maksimal 1x24 jam kerja</p>
                </div>
              </div>

              {/* CTA */}
             <Button
  variant="hero"
  size="lg"
  className="w-full"
  disabled={!account || !amount || !isValidAmount}
  onClick={handleWithdraw} // <-- tambahkan ini
>
  Lanjutkan Penarikan
  {method && isValidAmount && (
    <>
      (Diterima: Rp {receivedAmount.toLocaleString("id-ID")})
      <span className="ml-2 text-xs text-muted-foreground" title={`Biaya admin: Rp ${fee.toLocaleString()}`}>
      </span>
    </>
  )}
  <ArrowRight className="h-5 w-5 ml-2" />
</Button>
{withdrawHistory.length > 0 && (
  <div className="rounded-2xl bg-card p-6 shadow-card mt-6">
    <h2 className="text-lg font-semibold mb-4">Riwayat Penarikan Terbaru</h2>
    <div className="space-y-2">
      {withdrawHistory.map((wd) => (
        <div key={wd.id} className="flex justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium">{wd.method} • {wd.account}</p>
            <p className="text-xs text-muted-foreground">{wd.date}</p>
          </div>
          <p className="font-semibold">- Rp {wd.amount.toLocaleString("id-ID")}</p>
        </div>
      ))}
    </div>
  </div>
)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
