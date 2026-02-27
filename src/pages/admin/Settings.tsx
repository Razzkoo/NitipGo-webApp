import { useState } from "react";
import { motion } from "framer-motion";
import { Percent, Save, RotateCcw, Shield, Settings } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
  commissionRate: 10,
  minWithdrawal: 50000,

  autoVerifyTraveler: false,
  maintenanceMode: false,

  // ===== C4 – EXPRESS SYSTEM =====
  financialSystemEnabled: true,
  maxPendingDays: 3,
  maintenanceMessage: "",
});
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log("Saving settings:", settings);
    toast({
      title: "Pengaturan Disimpan",
      description: "Perubahan telah berhasil diterapkan.",
    });
    setHasChanges(false);
  };

  const handleReset = () => {
  setSettings({
    commissionRate: 10,
    minWithdrawal: 50000,

    autoVerifyTraveler: false,
    maintenanceMode: false,

    financialSystemEnabled: true,
    maxPendingDays: 3,
    maintenanceMessage: "",
  });
    setHasChanges(false);
    toast({ title: "Pengaturan Direset", description: "Kembali ke nilai default." });
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 md:p-8 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div className="flex items-start justify-between mb-6">
  <div className="flex items-start gap-3">
    <div className="mt-1 rounded-lg bg-primary/10 p-2">
      <Settings className="h-5 w-5 text-primary" />
    </div>

    <div>
      <h1 className="text-2xl font-bold leading-tight">
        Pengaturan
      </h1>
      <p className="text-sm text-muted-foreground">
        Konfigurasi terkait komisi, transaksi, dan sistem finansial NitipGo
      </p>
    </div>
  </div>
</div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-2" />
              Simpan
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Commission Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="rounded-2xl bg-card p-6 shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"
              >
                <Percent className="h-5 w-5 text-primary" />
              </motion.div>
              <h2 className="text-lg font-semibold text-foreground">Komisi & Transaksi</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commission">Komisi Platform (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="50"
                    value={settings.commissionRate}
                    onChange={(e) => handleChange("commissionRate", parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">Persentase dari setiap transaksi</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minWithdrawal">Min. Penarikan (Rp)</Label>
                  <Input
                    id="minWithdrawal"
                    type="number"
                    min="10000"
                    step="10000"
                    value={settings.minWithdrawal}
                    onChange={(e) => handleChange("minWithdrawal", parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">Minimum saldo untuk ditarik</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Express System Management */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.15 }}
  whileHover={{ y: -2, transition: { duration: 0.2 } }}
  className="lg:col-span-1 sticky top-24 rounded-2xl bg-card p-6 shadow-card hover:shadow-card-hover transition-all border border-destructive/30"
>
  <div className="flex items-start gap-3 mb-6">
  <motion.div
    whileHover={{ scale: 1.1, rotate: -5 }}
    className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10"
  >
    <Shield className="h-5 w-5 text-destructive" />
  </motion.div>

  <div>
    <div className="flex items-center gap-2">
      <h2 className="text-lg font-semibold text-foreground">
        Express System
      </h2>
      <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
        Danger Zone
      </span>
    </div>
    <p className="text-sm text-muted-foreground">
      Kontrol cepat & darurat platform
    </p>
  </div>
</div>

  <div className="space-y-4">
    {/* Financial System Switch */}
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div>
        <p className="font-medium text-foreground">
          Sistem Finansial Aktif
        </p>
        <p className="text-sm text-muted-foreground">
          Matikan untuk menghentikan transaksi & penarikan
        </p>
      </div>
      <Switch
        checked={settings.financialSystemEnabled}
        onCheckedChange={(checked) =>
          handleChange("financialSystemEnabled", checked)
        }
      />
    </div>

    {/* Max Pending Days */}
    <div className="space-y-2">
      <Label htmlFor="maxPendingDays">
        Batas Pending Transaksi (hari)
      </Label>
      <Input
        id="maxPendingDays"
        type="number"
        min={1}
        value={settings.maxPendingDays}
        onChange={(e) =>
          handleChange("maxPendingDays", parseInt(e.target.value))
        }
      />
      <p className="text-xs text-muted-foreground">
        Transaksi lewat batas ini bisa otomatis disuspend / direfund
      </p>
    </div>

    {/* Maintenance Message */}
    <div className="space-y-2">
      <Label htmlFor="maintenanceMessage">
        Pesan Maintenance ke User
      </Label>
      <Input
        id="maintenanceMessage"
        placeholder="Contoh: Sistem sedang maintenance, coba lagi nanti."
        value={settings.maintenanceMessage}
        onChange={(e) =>
          handleChange("maintenanceMessage", e.target.value)
        }
      />
    </div>
  </div>
</motion.div>
        </div>
       
        

         {/* System Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="rounded-2xl bg-card p-6 shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10"
              >
                <Shield className="h-5 w-5 text-accent" />
              </motion.div>
              <h2 className="text-lg font-semibold text-foreground">Sistem</h2>
            </div>
            <div className="space-y-4">
              <motion.div 
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">Auto Verifikasi Traveler</p>
                  <p className="text-sm text-muted-foreground">Otomatis verifikasi traveler baru</p>
                </div>
                <Switch
                  checked={settings.autoVerifyTraveler}
                  onCheckedChange={(checked) => handleChange("autoVerifyTraveler", checked)}
                />
              </motion.div>
              <motion.div 
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">Mode Maintenance</p>
                  <p className="text-sm text-muted-foreground">Nonaktifkan platform sementara</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
                />
              </motion.div>
            </div>
            </motion.div>
            </div>
      </div>
    </DashboardLayout>
  );
}
