import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Percent, Save, RotateCcw, Shield, Settings,
  Zap, Wallet, Info, Package, PackageOpen, Layers,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Settings {
  commissionRate: number;
  minWithdrawal: number;
  autoVerifyTraveler: boolean;
  maintenanceMode: boolean;
  expressPriceSmall: number;
  expressPriceMedium: number;
  expressPriceLarge: number;
  expressMaxDays: number;
  expressEnabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  commissionRate: 10,
  minWithdrawal: 50000,
  autoVerifyTraveler: false,
  maintenanceMode: false,
  expressPriceSmall: 15000,
  expressPriceMedium: 25000,
  expressPriceLarge: 40000,
  expressMaxDays: 2,
  expressEnabled: true,
};

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: d } }),
};

// ─── Section Card wrapper ─────────────────────────────────────────────────────

function SectionCard({
  children, delay = 0, className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="show"
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      className={`rounded-2xl bg-card border border-border/60 shadow-card hover:shadow-card-hover transition-shadow overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function CardHeader({
  icon: Icon, iconBg, iconColor, title, sub, tag,
}: {
  icon: React.ElementType; iconBg: string; iconColor: string;
  title: string; sub: string; tag?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-5 border-b border-border/50 flex items-center gap-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} shrink-0`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {tag}
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  id, label, hint, children,
}: { id?: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">
        {label}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ─── Toggle Row ───────────────────────────────────────────────────────────────

function ToggleRow({
  label, sub, checked, onCheckedChange,
}: { label: string; sub: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <motion.div
      whileHover={{ x: 3, transition: { duration: 0.16 } }}
      className="flex items-center justify-between gap-4 rounded-xl bg-muted/30 border border-border/40 px-4 py-3.5 hover:bg-muted/50 transition-colors"
    >
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </motion.div>
  );
}

// ─── Express price tier card ──────────────────────────────────────────────────

function PriceTier({
  label, icon: Icon, iconBg, iconColor, id, value, onChange, delay,
}: {
  label: string; icon: React.ElementType; iconBg: string; iconColor: string; id: string;
  value: number; onChange: (v: number) => void; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-xl border border-border/50 bg-muted/20 p-4 hover:border-primary/25 hover:bg-muted/40 transition-all group"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 h-px bg-primary/40 origin-left"
      />
      <div className="flex items-center gap-2 mb-3">
        <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        </div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">Rp</span>
        <Input
          id={id}
          type="number"
          min={0}
          step={1000}
          value={value}
          onChange={e => onChange(parseInt(e.target.value) || 0)}
          className="pl-9 font-semibold text-foreground"
        />
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5">per titipan</p>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    toast({ title: "Pengaturan Disimpan", description: "Perubahan telah berhasil diterapkan." });
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(false);
    toast({ title: "Pengaturan Direset", description: "Kembali ke nilai default." });
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-4 sm:p-6 md:p-8 space-y-6">

        {/* ── HEADER ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-primary/10 p-2 shrink-0">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
                Pengaturan Platform
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Konfigurasi komisi, transaksi, dan layanan express NitipGo
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                >
                  <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges}
              className="gap-2"
            >
              <Save className="h-3.5 w-3.5" />
              Simpan Perubahan
            </Button>
          </div>
        </motion.div>

        {/* ── UNSAVED CHANGES BANNER ───────────────────────── */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -6, height: 0 }}
              transition={{ duration: 0.22 }}
              className="flex items-center gap-2.5 rounded-xl bg-primary/8 border border-primary/20 px-4 py-3"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              <p className="text-xs text-primary font-medium">
                Ada perubahan yang belum disimpan — klik <span className="font-bold">Simpan Perubahan</span> untuk menerapkan.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MAIN GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT COLUMN (2/3) ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Komisi & Transaksi */}
            <SectionCard delay={0.05}>
              <CardHeader
                icon={Percent} iconBg="bg-primary/10" iconColor="text-primary"
                title="Komisi & Transaksi"
                sub="Atur persentase komisi dan batas minimum penarikan dana"
              />
              <div className="px-6 py-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="commission" label="Komisi Platform" hint="Persentase dipotong dari setiap transaksi">
                    <div className="relative">
                      <Input
                        id="commission"
                        type="number" min={0} max={50}
                        value={settings.commissionRate}
                        onChange={e => handleChange("commissionRate", parseInt(e.target.value) || 0)}
                        className="pr-8 font-semibold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">%</span>
                    </div>
                  </Field>

                  <Field id="minWithdrawal" label="Min. Penarikan" hint="Minimum saldo yang bisa ditarik traveler">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">Rp</span>
                      <Input
                        id="minWithdrawal"
                        type="number" min={10000} step={10000}
                        value={settings.minWithdrawal}
                        onChange={e => handleChange("minWithdrawal", parseInt(e.target.value) || 0)}
                        className="pl-9 font-semibold"
                      />
                    </div>
                  </Field>
                </div>

                {/* Preview row */}
                <div className="rounded-xl bg-muted/30 border border-border/40 px-4 py-3 flex flex-wrap gap-x-6 gap-y-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Komisi aktif</p>
                    <p className="text-sm font-bold text-primary">{settings.commissionRate}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Min. tarik</p>
                    <p className="text-sm font-bold text-foreground">Rp {settings.minWithdrawal.toLocaleString("id-ID")}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Contoh (Rp 500.000)</p>
                    <p className="text-sm font-bold text-foreground">
                      Komisi: Rp {(500000 * settings.commissionRate / 100).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Express Pricing */}
            <SectionCard delay={0.1}>
              <CardHeader
                icon={Zap} iconBg="bg-amber-50" iconColor="text-amber-500"
                title="Harga Layanan Express"
                sub="Tentukan tarif tambahan untuk pengiriman express berdasarkan ukuran paket"
                tag={
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    settings.expressEnabled
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-muted text-muted-foreground border-border"
                  }`}>
                    {settings.expressEnabled ? "Aktif" : "Nonaktif"}
                  </span>
                }
              />
              <div className="px-6 py-5 space-y-4">
                {/* Enable toggle */}
                <ToggleRow
                  label="Aktifkan Layanan Express"
                  sub="Traveler dapat menawarkan opsi express ke customer"
                  checked={settings.expressEnabled}
                  onCheckedChange={v => handleChange("expressEnabled", v)}
                />

                {/* Price tiers */}
                <PriceTier label="Kecil" icon={Package} iconBg="bg-primary/10" iconColor="text-primary"
                id="exSmall" value={settings.expressPriceSmall}
                onChange={v => handleChange("expressPriceSmall", v)} delay={0.18} />

                <PriceTier label="Sedang" icon={PackageOpen} iconBg="bg-amber-50" iconColor="text-amber-500"
                id="exMedium" value={settings.expressPriceMedium}
                onChange={v => handleChange("expressPriceMedium", v)} delay={0.24} />

                <PriceTier label="Besar" icon={Layers} iconBg="bg-emerald-50" iconColor="text-emerald-600"
                id="exLarge" value={settings.expressPriceLarge}
                onChange={v => handleChange("expressPriceLarge", v)} delay={0.30} />

                {/* Max days */}
                <div className={`transition-opacity duration-300 ${!settings.expressEnabled ? "opacity-40 pointer-events-none" : ""}`}>
                  <Field id="expressMaxDays" label="Batas Waktu Express (hari)"
                    hint="Paket express harus sampai dalam batas hari ini sejak order dibuat">
                    <div className="relative max-w-[160px]">
                      <Input
                        id="expressMaxDays"
                        type="number" min={1} max={7}
                        value={settings.expressMaxDays}
                        onChange={e => handleChange("expressMaxDays", parseInt(e.target.value) || 1)}
                        className="pr-10 font-semibold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">hari</span>
                    </div>
                  </Field>
                </div>

                {/* Info note */}
                <div className="flex items-start gap-2.5 rounded-xl bg-amber-50/60 border border-amber-100 px-3.5 py-3">
                  <Info className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Harga express adalah biaya tambahan di atas tarif normal. Traveler akan mendapat seluruh biaya express sebagai insentif.
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* ── RIGHT COLUMN (1/3) ── */}
          <div className="space-y-5">

            {/* Sistem */}
            <SectionCard delay={0.12}>
              <CardHeader
                icon={Shield} iconBg="bg-primary/10" iconColor="text-primary"
                title="Pengaturan Sistem"
                sub="Kontrol verifikasi dan status platform"
              />
              <div className="px-5 py-5 space-y-3">
                <ToggleRow
                  label="Auto Verifikasi Traveler"
                  sub="Otomatis verifikasi akun traveler baru"
                  checked={settings.autoVerifyTraveler}
                  onCheckedChange={v => handleChange("autoVerifyTraveler", v)}
                />
                <ToggleRow
                  label="Mode Maintenance"
                  sub="Nonaktifkan platform sementara untuk user"
                  checked={settings.maintenanceMode}
                  onCheckedChange={v => handleChange("maintenanceMode", v)}
                />

                {/* Maintenance warning */}
                <AnimatePresence>
                  {settings.maintenanceMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="flex items-start gap-2.5 rounded-xl bg-destructive/8 border border-destructive/20 px-3.5 py-3"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse mt-1 shrink-0" />
                      <p className="text-[11px] text-destructive leading-relaxed font-medium">
                        Platform sedang dalam mode maintenance. User tidak bisa mengakses layanan.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionCard>

            {/* Summary card */}
            <SectionCard delay={0.18}>
              <CardHeader
                icon={Wallet} iconBg="bg-emerald-50" iconColor="text-emerald-600"
                title="Ringkasan Konfigurasi"
                sub="Nilai aktif saat ini"
              />
              <div className="px-5 py-4 space-y-0 divide-y divide-border/40">
                {[
                  { label: "Komisi",          value: `${settings.commissionRate}%` },
                  { label: "Min. Penarikan",  value: `Rp ${settings.minWithdrawal.toLocaleString("id-ID")}` },
                  { label: "Express Kecil",   value: `Rp ${settings.expressPriceSmall.toLocaleString("id-ID")}` },
                  { label: "Express Sedang",  value: `Rp ${settings.expressPriceMedium.toLocaleString("id-ID")}` },
                  { label: "Express Besar",   value: `Rp ${settings.expressPriceLarge.toLocaleString("id-ID")}` },
                  { label: "Batas Express",   value: `${settings.expressMaxDays} hari` },
                  { label: "Express",         value: settings.expressEnabled ? "Aktif" : "Nonaktif", highlight: settings.expressEnabled },
                  { label: "Auto Verifikasi", value: settings.autoVerifyTraveler ? "Ya" : "Tidak" },
                  { label: "Maintenance",     value: settings.maintenanceMode ? "Aktif" : "Normal", danger: settings.maintenanceMode },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-muted-foreground">{row.label}</span>
                    <span className={`text-xs font-semibold ${
                      row.danger     ? "text-destructive" :
                      row.highlight  ? "text-emerald-600" :
                      "text-foreground"
                    }`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}