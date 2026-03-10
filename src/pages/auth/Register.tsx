import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight,
  Users, MapPin, Calendar, Home, Camera, Upload, CreditCard,
  Smartphone, ChevronRight, CheckCircle2, Image, X, FileText,
  ShieldCheck, Zap, Wallet, Plane, ClipboardList, BadgeCheck,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type UserRole = "customer" | "traveler";
type Gender = "male" | "female" | "";

// ─── Reusable File Upload ────────────────────────────────────────────────────
interface FileUploadProps {
  id: string;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  accent?: boolean;
  required?: boolean;
}

function FileUpload({ id, label, hint, icon, accent, required }: FileUploadProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    if (ref.current) ref.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <input
        ref={ref}
        id={id}
        type="file"
        accept="image/*"
        onChange={handleFile}
        required={required}
        className="hidden"
      />
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => ref.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 cursor-pointer transition-all min-h-[90px]",
          accent
            ? "border-accent/50 bg-accent/5 hover:border-accent hover:bg-accent/10"
            : "border-primary/40 bg-primary/5 hover:border-primary hover:bg-primary/10"
        )}
      >
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full"
            >
              <img
                src={preview}
                alt="preview"
                className="mx-auto h-28 w-auto rounded-lg object-cover shadow"
              />
              <button
                type="button"
                onClick={clear}
                className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-white shadow"
              >
                <X className="h-3 w-3" />
              </button>
              <p className="mt-1 text-center text-xs text-muted-foreground truncate max-w-[160px] mx-auto">
                {file?.name}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1 text-muted-foreground"
            >
              {icon ?? <Upload className="h-6 w-6 opacity-60" />}
              <span className="text-xs font-medium">Klik untuk upload</span>
              {hint && <span className="text-[10px] text-center opacity-70">{hint}</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-1 mb-6">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-1">
          <motion.div
            animate={{
              scale: i === current ? 1.1 : 1,
              backgroundColor: i < current ? "#22c55e" : i === current ? "var(--primary)" : "#e5e7eb",
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
          >
            {i < current ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </motion.div>
          <span className={cn("text-[10px] hidden sm:inline", i === current ? "text-foreground font-semibold" : "text-muted-foreground")}>
            {label}
          </span>
          {i < steps.length - 1 && (
            <div className={cn("h-px w-4 mx-0.5", i < current ? "bg-green-500" : "bg-border")} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Customer Form ───────────────────────────────────────────────────────────
function CustomerForm({ onSuccess }: { onSuccess: () => void }) {
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "", email: "", dob: "", phone: "", address: "", password: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData({ ...data, [k]: e.target.value });

  const steps = ["Data Diri", "Keamanan & Foto"];

  const fieldVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <div>
      <StepIndicator steps={steps} current={step} />

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial="hidden" animate="visible" exit="exit" className="space-y-4">
            {/* Name */}
            <motion.div custom={0} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="c-name">Nama Lengkap <span className="text-destructive">*</span></Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="c-name" placeholder="Nama lengkap Anda" value={data.name} onChange={set("name")} className="pl-10 h-11" required />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div custom={1} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="c-email">Email <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="c-email" type="email" placeholder="nama@email.com" value={data.email} onChange={set("email")} className="pl-10 h-11" required />
              </div>
            </motion.div>

            {/* DOB */}
            <motion.div custom={2} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="c-dob">Tanggal Lahir <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="c-dob" type="date" value={data.dob} onChange={set("dob")} className="pl-10 h-11" required />
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div custom={3} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="c-phone">Nomor HP <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="c-phone" type="tel" placeholder="08xxxxxxxxxx" value={data.phone} onChange={set("phone")} className="pl-10 h-11" required />
              </div>
            </motion.div>

            {/* Address */}
            <motion.div custom={4} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="c-address">Alamat <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  id="c-address"
                  placeholder="Jl. Contoh No. 123, Kota"
                  value={data.address}
                  onChange={set("address")}
                  rows={2}
                  required
                  className="flex w-full rounded-md border border-input bg-background pl-10 pr-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
              </div>
            </motion.div>

            <motion.div custom={5} variants={fieldVariants}>
              <Button
                type="button"
                variant="hero"
                size="lg"
                className="w-full"
                onClick={() => setStep(1)}
                disabled={!data.name || !data.email || !data.dob || !data.phone || !data.address}
              >
                Lanjut <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial="hidden" animate="visible" exit="exit" className="space-y-4">
            {/* Password */}
            <motion.div custom={0} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="c-password">Password <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="c-password"
                  type={showPw ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  value={data.password}
                  onChange={set("password")}
                  className="pl-10 pr-10 h-11"
                  required
                  minLength={8}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            {/* Selfie */}
            <motion.div custom={1} variants={fieldVariants}>
              <FileUpload
                id="c-selfie"
                label="Foto Selfie"
                hint="Upload foto wajah yang jelas (JPG / PNG)"
                icon={<Camera className="h-6 w-6 opacity-60" />}
                required
              />
            </motion.div>

            <motion.div custom={2} variants={fieldVariants} className="flex gap-2">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(0)}>
                ← Kembali
              </Button>
              <Button
                type="button"
                variant="hero"
                size="lg"
                className="flex-1"
                onClick={onSuccess}
                disabled={!data.password}
              >
                Daftar <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Traveler Form ───────────────────────────────────────────────────────────
function TravelerForm({ onSuccess }: { onSuccess: () => void }) {
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<Gender>("");
  const [data, setData] = useState({
    name: "", email: "", password: "", phone: "", city: "", province: "",
    address: "", dob: "", ktp: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData({ ...data, [k]: e.target.value });

  const steps = ["Data Diri", "Lokasi & Identitas", "Dokumen"];

  const fieldVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <div>
      <StepIndicator steps={steps} current={step} />

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial="hidden" animate="visible" exit="exit" className="space-y-4">
            <motion.div custom={0} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="t-name">Nama Lengkap <span className="text-destructive">*</span></Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="t-name" placeholder="Sesuai KTP" value={data.name} onChange={set("name")} className="pl-10 h-11" required />
              </div>
            </motion.div>

            <motion.div custom={1} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="t-email">Email <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="t-email" type="email" placeholder="nama@email.com" value={data.email} onChange={set("email")} className="pl-10 h-11" required />
              </div>
            </motion.div>

            <motion.div custom={2} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="t-password">Password <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="t-password"
                  type={showPw ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  value={data.password}
                  onChange={set("password")}
                  className="pl-10 pr-10 h-11"
                  required
                  minLength={8}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div custom={3} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="t-phone">Nomor HP <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="t-phone" type="tel" placeholder="08xxxxxxxxxx" value={data.phone} onChange={set("phone")} className="pl-10 h-11" required />
              </div>
            </motion.div>

            <motion.div custom={4} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="t-dob">Tanggal Lahir <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="t-dob" type="date" value={data.dob} onChange={set("dob")} className="pl-10 h-11" required />
              </div>
            </motion.div>

            {/* Gender */}
            <motion.div custom={5} variants={fieldVariants} className="space-y-1.5">
              <Label>Jenis Kelamin <span className="text-destructive">*</span></Label>
              <div className="grid grid-cols-2 gap-2">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-semibold transition-all",
                      gender === g
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-muted-foreground hover:border-accent/50"
                    )}
                  >
                    {g === "male" ? (<><User className="h-4 w-4" /><span>Laki-laki</span></>) : (<><User className="h-4 w-4" /><span>Perempuan</span></>)}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div custom={6} variants={fieldVariants}>
              <Button
                type="button"
                className="w-full bg-gradient-to-r from-accent to-accent/90 text-white h-11"
                onClick={() => setStep(1)}
                disabled={!data.name || !data.email || !data.password || !data.phone || !data.dob || !gender}
              >
                Lanjut <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial="hidden" animate="visible" exit="exit" className="space-y-4">
            <motion.div custom={0} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="t-city">Kota <span className="text-destructive">*</span></Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="t-city" placeholder="Nama kota" value={data.city} onChange={set("city")} className="pl-10 h-11" required />
              </div>
            </motion.div>

            <motion.div custom={1} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="t-province">Provinsi <span className="text-destructive">*</span></Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="t-province" placeholder="Nama provinsi" value={data.province} onChange={set("province")} className="pl-10 h-11" required />
              </div>
            </motion.div>

            <motion.div custom={2} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="t-address">Alamat Lengkap <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  id="t-address"
                  placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan"
                  value={data.address}
                  onChange={set("address")}
                  rows={2}
                  required
                  className="flex w-full rounded-md border border-input bg-background pl-10 pr-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
              </div>
            </motion.div>

            <motion.div custom={3} variants={fieldVariants} className="space-y-1.5">
              <Label htmlFor="t-ktp">Nomor KTP <span className="text-destructive">*</span></Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="t-ktp"
                  placeholder="16 digit NIK"
                  value={data.ktp}
                  onChange={set("ktp")}
                  className="pl-10 h-11"
                  maxLength={16}
                  required
                />
              </div>
            </motion.div>

            <motion.div custom={4} variants={fieldVariants} className="flex gap-2">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(0)}>
                ← Kembali
              </Button>
              <Button
                type="button"
                className="flex-1 bg-gradient-to-r from-accent to-accent/90 text-white h-11"
                onClick={() => setStep(2)}
                disabled={!data.city || !data.province || !data.address || !data.ktp}
              >
                Lanjut <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial="hidden" animate="visible" exit="exit" className="space-y-4">
            {/* KTP Photo */}
            <motion.div custom={0} variants={fieldVariants}>
              <FileUpload
                id="t-foto-ktp"
                label="Foto KTP"
                hint="Pastikan foto jelas, tidak blur & terpotong"
                icon={<CreditCard className="h-6 w-6 opacity-60" />}
                accent
                required
              />
            </motion.div>

            {/* Selfie with KTP — highlighted */}
            <motion.div custom={1} variants={fieldVariants}>
              <div className="rounded-xl border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 mb-1">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Selfie dengan KTP — Wajib!</p>
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                      Pegang KTP di samping wajah Anda. Pastikan wajah & tulisan KTP terbaca jelas.
                      Foto ini digunakan untuk verifikasi identitas Anda.
                    </p>
                  </div>
                </div>
              </div>
              <FileUpload
                id="t-selfie-ktp"
                label="Foto Selfie + KTP"
                hint="Wajah & KTP harus terlihat jelas dalam satu foto"
                icon={<Camera className="h-6 w-6 text-amber-500 opacity-80" />}
                accent
                required
              />
            </motion.div>

            {/* Pas Foto */}
            <motion.div custom={2} variants={fieldVariants}>
              <FileUpload
                id="t-pasfoto"
                label="Pas Foto"
                hint="Latar putih / merah, tampak depan (3×4 atau 4×6)"
                icon={<Image className="h-6 w-6 opacity-60" />}
                accent
                required
              />
            </motion.div>

            {/* SIM Card */}
            <motion.div custom={3} variants={fieldVariants}>
              <FileUpload
                id="t-sim"
                label="Kartu SIM (opsional)"
                hint="Foto kartu SIM untuk verifikasi nomor HP"
                icon={<Smartphone className="h-6 w-6 opacity-60" />}
                accent
              />
            </motion.div>

            <motion.div custom={4} variants={fieldVariants} className="flex gap-2">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
                ← Kembali
              </Button>
              <Button
                type="button"
                className="flex-1 bg-gradient-to-r from-accent to-accent/90 text-white h-11"
                onClick={onSuccess}
              >
                Daftar <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Register Page ──────────────────────────────────────────────────────
export default function Register() {
  const [role, setRole] = useState<UserRole>("customer");
  const [done, setDone] = useState(false);

  const handleSuccess = () => setDone(true);

  return (
    <div className="min-h-screen flex">
      {/* Left side – Form */}
      <div className="flex-1 flex items-start justify-center overflow-y-auto p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-4"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Nitip<span className="text-primary">Go</span>
            </span>
          </Link>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className={cn(
                    "flex h-20 w-20 items-center justify-center rounded-full",
                    role === "customer" ? "bg-primary/15" : "bg-accent/15"
                  )}
                >
                  <CheckCircle2 className={cn("h-10 w-10", role === "customer" ? "text-primary" : "text-accent")} />
                </motion.div>
                <h2 className="text-2xl font-bold">Pendaftaran Berhasil!</h2>
                <p className="text-muted-foreground text-sm max-w-xs">
                  {role === "traveler"
                    ? "Akun Anda sedang diverifikasi. Kami akan menghubungi Anda dalam 1×24 jam."
                    : "Selamat datang di NitipGo! Silakan masuk ke akun Anda."}
                </p>
                <Link to="/login">
                  <Button variant={role === "customer" ? "hero" : "default"} size="lg" className={cn(role === "traveler" && "bg-gradient-to-r from-accent to-accent/90")}>
                    Masuk Sekarang <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">Buat Akun Baru</h1>
                <p className="mt-1 mb-5 text-muted-foreground text-sm">
                  Daftar dan mulai gunakan layanan NitipGo
                </p>

                {/* Role Toggle */}
                <div className="mb-6 grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setRole("customer")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all",
                      role === "customer"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    <Users className="h-5 w-5" />
                    <span className="font-semibold">Customer</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setRole("traveler")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all",
                      role === "traveler"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-muted-foreground hover:border-accent/50"
                    )}
                  >
                    <MapPin className="h-5 w-5" />
                    <span className="font-semibold">Traveler</span>
                  </motion.button>
                </div>

                {/* Role-specific description */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={role}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className={cn(
                      "mb-5 rounded-xl px-4 py-2.5 text-xs font-medium",
                      role === "customer"
                        ? "bg-primary/8 text-primary"
                        : "bg-accent/8 text-accent"
                    )}
                  >
                    {role === "customer" ? (
                        <span className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5 inline" /> Daftar sebagai Customer untuk mengirim &amp; titip beli barang.</span>
                      ) : (
                        <span className="flex items-center gap-1.5"><Plane className="h-3.5 w-3.5 inline" /> Daftar sebagai Traveler untuk membawa barang &amp; mendapat penghasilan tambahan. Verifikasi identitas diperlukan.</span>
                      )}
                  </motion.p>
                </AnimatePresence>

                {/* Animated form switch */}
                <AnimatePresence mode="wait">
                  {role === "customer" ? (
                    <motion.div
                      key="customer-form"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CustomerForm onSuccess={handleSuccess} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="traveler-form"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TravelerForm onSuccess={handleSuccess} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-5 text-center text-xs text-muted-foreground">
                  Dengan mendaftar, Anda menyetujui{" "}
                  <Link to="/syarat-ketentuan" className="text-primary hover:underline">Syarat & Ketentuan</Link>{" "}
                  dan{" "}
                  <Link to="/privasi" className="text-primary hover:underline">Kebijakan Privasi</Link> kami.
                </p>
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  Sudah punya akun?{" "}
                  <Link to="/login" className="text-primary font-semibold hover:underline">Masuk</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right side – Illustration (sticky) */}
      <div className={cn(
        "hidden lg:flex sticky top-0 h-screen flex-1 items-center justify-center p-12 transition-all duration-500",
        role === "customer" ? "bg-gradient-primary" : "bg-gradient-to-br from-accent to-accent/80"
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-center text-primary-foreground max-w-md"
          >
            {role === "customer" ? (
              <>
                {/* Floating icons animation */}
                <div className="relative h-28 w-28 mx-auto mb-6">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex h-28 w-28 items-center justify-center rounded-full bg-white/20"
                  >
                    <Users className="h-14 w-14 text-white" />
                  </motion.div>
                  {[Package, Home, Phone].map((Icon, i) => (
                    <motion.div
                      key={i}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: i * 1.5 }}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transformOrigin: `${56 + i * 8}px 0px`,
                        marginTop: `-${56 + i * 8}px`,
                        marginLeft: "-12px",
                      }}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/30 p-1">
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <h2 className="text-3xl font-bold mb-3">Kirim Barang Lebih Mudah</h2>
                <p className="text-white/75 text-sm leading-relaxed">
                  Daftar sebagai customer dan nikmati kemudahan mengirim atau titip beli barang ke berbagai kota dengan harga terjangkau.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                  {([
                    { icon: Package, label: "Mudah" },
                    { icon: Wallet, label: "Terjangkau" },
                    { icon: Zap, label: "Cepat" },
                  ] as const).map(({ icon: Icon, label }) => (
                    <motion.div
                      key={label}
                      whileHover={{ scale: 1.08 }}
                      className="rounded-xl bg-white/15 p-3"
                    >
                      <div className="flex justify-center mb-1"><Icon className="h-5 w-5 text-white/90" /></div>
                      <div className="text-xs font-semibold text-white/90 mt-1">{label}</div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="relative h-28 w-28 mx-auto mb-6">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex h-28 w-28 items-center justify-center rounded-full bg-white/20"
                  >
                    <MapPin className="h-14 w-14 text-white" />
                  </motion.div>
                </div>
                <h2 className="text-3xl font-bold mb-3">Dapat Penghasilan Tambahan</h2>
                <p className="text-white/75 text-sm leading-relaxed">
                  Jadikan perjalanan Anda lebih produktif. Bawa barang sekalian jalan dan dapatkan penghasilan tambahan yang menarik.
                </p>
                {/* Steps */}
                <div className="mt-8 space-y-3 text-left">
                  {([
                    { icon: Plane, text: "Buat jadwal perjalanan Anda" },
                    { icon: ClipboardList, text: "Terima order dari customer" },
                    { icon: Wallet, text: "Dapatkan komisi tiap pengiriman" },
                  ] as const).map(({ icon: Icon, text }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                      className="flex items-center gap-3 rounded-xl bg-white/15 px-4 py-3"
                    >
                      <Icon className="h-5 w-5 flex-shrink-0 text-white/80" />
                      <span className="text-sm text-white/90">{text}</span>
                    </motion.div>
                  ))}
                </div>
                {/* Verification note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-amber-400/25 px-4 py-3 text-left"
                >
                  <FileText className="h-4 w-4 flex-shrink-0 text-amber-300" />
                  <p className="text-xs text-amber-200">
                    Verifikasi KTP & selfie diperlukan untuk keamanan semua pengguna.
                  </p>
                </motion.div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}