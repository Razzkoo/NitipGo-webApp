import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Package, Upload, ArrowRight, CheckCircle,
  AlertCircle, MapPin, Star, Zap, ChevronDown, Scale,
  CalendarDays, User, Phone, FileText, Tag, TrendingUp,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ─── Data ──────────────────────────────────────────────────────────────────────

const pickupPoints = [
  { id: "1", name: "Mitra Pos Cikini", address: "Jl. Cikini Raya No. 45", distance: "2.1 km" },
  { id: "2", name: "Mitra Pos Menteng", address: "Jl. Menteng Raya No. 12", distance: "4.3 km" },
  { id: "3", name: "Titik Temu Stasiun Gambir", address: "Lobi Utama Stasiun", distance: "6.8 km" },
];

const cities = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Batam", "Denpasar"];

const travelers = [
  {
    id: "t1", name: "Andi Pratama", route: "Jakarta → Batam",
    date: "2026-02-15", rating: 4.8, reviews: 120,
    capacityLeft: "5 kg", distance: "5km",
    departureTime: "08:30", estimatedArrival: "18:00",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=andi",
    pricePerKg: 25000, badge: "Top Rated",
  },
  {
    id: "t2", name: "Salsa Putri", route: "Bandung → Surabaya",
    date: "2026-02-18", rating: 4.7, reviews: 95,
    capacityLeft: "7 kg", distance: "12km",
    departureTime: "09:00", estimatedArrival: "20:00",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=salsa",
    pricePerKg: 15000, badge: "Termurah",
  },
  {
    id: "t3", name: "Rizky Mahendra", route: "Jakarta → Denpasar",
    date: "2026-02-20", rating: 4.5, reviews: 85,
    capacityLeft: "3 kg", distance: "18km",
    departureTime: "07:00", estimatedArrival: "19:00",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=rizky",
    pricePerKg: 35000, badge: null,
  },
];

const EXPRESS_FEE = 5000;
const isLoggedIn = true;

const userProfile = { address: "Jl. Kaliurang KM 7, Sleman, Yogyakarta" };

const STEPS = ["Detail Barang", "Pilih Traveler", "Titik COD", "Konfirmasi"];

// ─── Sub-components ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const s = i + 1;
        const done = s < current;
        const active = s === current;
        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold
                  transition-all duration-300
                  ${done ? "bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]" : ""}
                  ${active ? "bg-green-600 text-white shadow-[0_0_16px_rgba(22,163,74,0.45)] scale-110" : ""}
                  ${!done && !active ? "bg-zinc-100 text-zinc-400 border border-zinc-200" : ""}
                `}
              >
                {done ? <CheckCircle className="h-4 w-4" /> : s}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  active ? "text-green-600" : done ? "text-emerald-500" : "text-zinc-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 mb-4 h-[2px] w-12 sm:w-16 rounded-full transition-all duration-500 ${
                  s < current ? "bg-emerald-400" : "bg-zinc-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldLabel({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-1.5">
      {Icon && <Icon className="h-3.5 w-3.5 text-green-600" />}
      {children}
    </label>
  );
}

function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{children}</p>
  );
}

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
      {title && <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-5">{title}</h3>}
      {children}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function NewOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderTypeFromUrl = searchParams.get("type");

  const [step, setStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isExpress, setIsExpress] = useState(false);
  const [filters, setFilters] = useState({ minRating: "", minCapacity: "", maxPrice: "" });

  const [formData, setFormData] = useState({
    orderType: orderTypeFromUrl === "kirim" ? "kirim" : "titip-beli",
    itemName: "",
    itemDescription: "",
    recipientName: "",
    recipientPhone: "",
    weight: "",
    photo: null as File | null,
    pickupPoint: "",
    dropPoint: "",
    estimatedItemPrice: "",
    notes: "",
    originCity: "",
    destinationCity: "",
    travelDate: "",
    travelerId: "",
    originAddress: userProfile.address,
    destinationAddress: "",
  });

  const set = (key: string, value: unknown) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (orderTypeFromUrl === "titip-beli" || orderTypeFromUrl === "kirim") {
      set("orderType", orderTypeFromUrl);
    }
  }, [orderTypeFromUrl]);

  const selectedTraveler = travelers.find((t) => t.id === formData.travelerId);
  const weightNum = Number(formData.weight || 0);
  const itemPriceNum = Number(formData.estimatedItemPrice || 0);
  const deliveryFee = selectedTraveler ? weightNum * selectedTraveler.pricePerKg : 0;
  const totalPayment =
    (formData.orderType === "titip-beli" ? deliveryFee + itemPriceNum : deliveryFee) +
    (isExpress ? EXPRESS_FEE : 0);

  const filteredTravelers = travelers
    .filter((t) => {
      if (filters.minRating && t.rating < Number(filters.minRating)) return false;
      if (filters.minCapacity && parseInt(t.capacityLeft) < Number(filters.minCapacity)) return false;
      if (filters.maxPrice && t.pricePerKg > Number(filters.maxPrice)) return false;
      return true;
    })
    .sort((a, b) => a.pricePerKg - b.pricePerKg);

  const pickupLabel = (id: string) => {
    const p = pickupPoints.find((x) => x.id === id);
    return p ? `${p.name} – ${p.address}` : "-";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      setOrderNumber(`ORD-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
    }
  };

  // ── Guest gate ──
  if (!isLoggedIn) {
    return (
      <DashboardLayout role="customer">
        <div className="flex min-h-[70vh] items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm rounded-3xl border border-zinc-100 bg-white p-10 text-center shadow-xl"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">Login Diperlukan</h2>
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
              Silakan login sebagai customer untuk melanjutkan pembuatan order.
            </p>
            <div className="flex flex-col gap-3">
              <Button className="h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold" asChild>
                <Link to="/login">Login Sekarang</Link>
              </Button>
              <Button variant="outline" className="h-11 rounded-xl" asChild>
                <Link to="/register">Daftar Gratis</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Main form ──
  return (
    <DashboardLayout role="customer">
      {/* ── Success Modal ── */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              {/* Animated checkmark ring */}
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.15, opacity: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute inset-0 rounded-full bg-emerald-400"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50"
                >
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h2 className="text-2xl font-bold text-zinc-900 mb-1">Order Berhasil!</h2>
                <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                  Order Anda telah dikirim ke traveler.<br />Konfirmasi akan datang sebentar lagi.
                </p>

                <div className="rounded-2xl bg-zinc-50 border border-zinc-100 px-6 py-4 mb-6">
                  <p className="text-xs text-zinc-400 mb-1">Nomor Order</p>
                  <p className="text-lg font-bold tracking-widest text-green-600">{orderNumber}</p>
                </div>

                <Button
                  className="h-12 w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold gap-2 shadow-md shadow-green-100"
                  asChild
                >
                  <Link to="/dashboard">
                    <Package className="h-4 w-4" />
                    Ke Dashboard
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="min-h-screen bg-zinc-50/60 p-4 md:p-8 lg:p-10">
        {/* Back button */}
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {step > 1 ? "Langkah Sebelumnya" : "Kembali"}
        </button>

        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-900">Buat Order Baru</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {formData.orderType === "kirim" ? "Kirim / Titip Barang" : "Titip Beli Barang"}
            </p>
          </div>

          <StepIndicator current={step} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* ═══════════════════════════════════════════════ STEP 1 */}
                {step === 1 && (
                  <>
                    <SectionCard title="Informasi Barang">
                      <div className="space-y-5">

                        {/* Photo upload */}
                        <div>
                          <FieldLabel icon={Upload}>Foto Barang (Opsional)</FieldLabel>
                          <label className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-all duration-200">
                            <input
                              type="file"
                              accept="image/png,image/jpeg"
                              className="hidden"
                              onChange={(e) => set("photo", e.target.files?.[0] || null)}
                            />
                            {formData.photo ? (
                              <img
                                src={URL.createObjectURL(formData.photo)}
                                alt="Preview"
                                className="max-h-44 rounded-lg object-cover shadow-md"
                              />
                            ) : (
                              <>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm border border-zinc-100">
                                  <Upload className="h-5 w-5 text-indigo-500" />
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium text-zinc-700">Klik untuk upload foto</p>
                                  <p className="text-xs text-zinc-400 mt-0.5">PNG, JPG hingga 5MB</p>
                                </div>
                              </>
                            )}
                          </label>
                        </div>

                        {/* Order type (readonly) */}
                        <div>
                          <FieldLabel icon={Tag}>Jenis Order</FieldLabel>
                          <div className="flex h-11 items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium text-zinc-600 cursor-not-allowed">
                            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
                            {formData.orderType === "titip-beli" ? "Titip Beli Barang" : "Kirim / Titip Barang"}
                          </div>
                          <InfoNote>Ditentukan dari halaman sebelumnya</InfoNote>
                        </div>

                        {/* Cities */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <FieldLabel icon={MapPin}>Kota Asal</FieldLabel>
                            <Select value={formData.originCity} onValueChange={(v) => set("originCity", v)}>
                              <SelectTrigger className="h-11 rounded-xl border-zinc-200">
                                <SelectValue placeholder="Pilih kota" />
                              </SelectTrigger>
                              <SelectContent>
                                {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <FieldLabel icon={MapPin}>Kota Tujuan</FieldLabel>
                            <Select value={formData.destinationCity} onValueChange={(v) => set("destinationCity", v)}>
                              <SelectTrigger className="h-11 rounded-xl border-zinc-200">
                                <SelectValue placeholder="Pilih kota" />
                              </SelectTrigger>
                              <SelectContent>
                                {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Origin address */}
                        <div>
                          <FieldLabel icon={MapPin}>Alamat Asal</FieldLabel>
                          <Input value={formData.originAddress} readOnly className="h-11 rounded-xl border-zinc-200 bg-zinc-50 cursor-not-allowed text-zinc-500" />
                          <InfoNote>Diambil otomatis dari profil Anda</InfoNote>
                        </div>

                        {/* Recipient fields (kirim only) */}
                        {formData.orderType === "kirim" && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <FieldLabel icon={User}>Nama Penerima</FieldLabel>
                                <Input
                                  placeholder="Nama penerima"
                                  value={formData.recipientName}
                                  onChange={(e) => set("recipientName", e.target.value)}
                                  className="h-11 rounded-xl border-zinc-200"
                                  required
                                />
                              </div>
                              <div>
                                <FieldLabel icon={Phone}>No. Telepon</FieldLabel>
                                <Input
                                  type="tel"
                                  placeholder="08xxxxxxxxxx"
                                  value={formData.recipientPhone}
                                  onChange={(e) => set("recipientPhone", e.target.value)}
                                  className="h-11 rounded-xl border-zinc-200"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <FieldLabel icon={MapPin}>Alamat Tujuan</FieldLabel>
                              <Textarea
                                placeholder="Jl. Ahmad Yani No. 12, RT/RW ..."
                                rows={2}
                                value={formData.destinationAddress}
                                onChange={(e) => set("destinationAddress", e.target.value)}
                                className="rounded-xl border-zinc-200 resize-none"
                                required
                              />
                            </div>
                          </>
                        )}

                        {/* Travel date */}
                        <div>
                          <FieldLabel icon={CalendarDays}>Tanggal Perjalanan</FieldLabel>
                          <Input
                            type="date"
                            value={formData.travelDate}
                            onChange={(e) => set("travelDate", e.target.value)}
                            className="h-11 rounded-xl border-zinc-200"
                            required
                          />
                        </div>

                        {/* Item name */}
                        <div>
                          <FieldLabel icon={Package}>Nama Barang</FieldLabel>
                          <Input
                            placeholder="Contoh: Sepatu Nike Air Max"
                            value={formData.itemName}
                            onChange={(e) => set("itemName", e.target.value)}
                            className="h-11 rounded-xl border-zinc-200"
                            required
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <FieldLabel icon={FileText}>Deskripsi Barang</FieldLabel>
                          <Textarea
                            placeholder="Warna, ukuran, kondisi, dan detail lainnya..."
                            rows={3}
                            value={formData.itemDescription}
                            onChange={(e) => set("itemDescription", e.target.value)}
                            className="rounded-xl border-zinc-200 resize-none"
                            required
                          />
                        </div>

                        {/* Estimated price (titip-beli only) */}
                        {formData.orderType === "titip-beli" && (
                          <div>
                            <FieldLabel icon={TrendingUp}>Estimasi Harga Barang</FieldLabel>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">Rp</span>
                              <Input
                                type="number"
                                placeholder="350000"
                                value={formData.estimatedItemPrice}
                                onChange={(e) => set("estimatedItemPrice", e.target.value)}
                                className="h-11 rounded-xl border-zinc-200 pl-10"
                              />
                            </div>
                            <InfoNote>Perkiraan harga barang yang dititipkan</InfoNote>
                          </div>
                        )}

                        {/* Weight */}
                        <div>
                          <FieldLabel icon={Scale}>Estimasi Berat (kg)</FieldLabel>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0.1"
                              step="0.1"
                              placeholder="1.5"
                              value={formData.weight}
                              onChange={(e) => set("weight", e.target.value)}
                              className="h-11 rounded-xl border-zinc-200 pr-10"
                              required
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400">kg</span>
                          </div>
                        </div>
                      </div>
                    </SectionCard>
                    <StepButton />
                  </>
                )}

                {/* ═══════════════════════════════════════════════ STEP 2 */}
                {step === 2 && (
                  <>
                    <div className="mb-2">
                      <h2 className="text-base font-semibold text-zinc-900">Pilih Mitra Traveler</h2>
                      <p className="text-sm text-zinc-500 mt-0.5">Tersedia sesuai rute dan tanggal yang dipilih</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {[
                        {
                          label: "Rating", key: "minRating",
                          options: [{ label: "4.0+", value: "4" }, { label: "4.5+", value: "4.5" }, { label: "4.8+", value: "4.8" }],
                        },
                        {
                          label: "Harga", key: "maxPrice",
                          options: [{ label: "≤20K", value: "20000" }, { label: "≤30K", value: "30000" }, { label: "≤40K", value: "40000" }],
                        },
                        {
                          label: "Kapasitas", key: "minCapacity",
                          options: [{ label: "≥3kg", value: "3" }, { label: "≥5kg", value: "5" }, { label: "≥7kg", value: "7" }],
                        },
                      ].map(({ label, key, options }) => (
                        <Select
                          key={key}
                          value={filters[key as keyof typeof filters]}
                          onValueChange={(v) => setFilters({ ...filters, [key]: v })}
                        >
                          <SelectTrigger className="h-8 w-auto gap-1 rounded-full border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-600 shadow-sm">
                            <SelectValue placeholder={label} />
                            <ChevronDown className="h-3 w-3" />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ))}

                      {(filters.minRating || filters.maxPrice || filters.minCapacity) && (
                        <button
                          type="button"
                          onClick={() => setFilters({ minRating: "", minCapacity: "", maxPrice: "" })}
                          className="h-8 rounded-full border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-500 hover:bg-red-100 transition"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {filteredTravelers.map((t, i) => (
                        <motion.label
                          key={t.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className={`relative block cursor-pointer rounded-2xl border-2 bg-white p-5 transition-all duration-200 ${
                            formData.travelerId === t.id
                              ? "border-green-500 shadow-[0_0_0_4px_rgba(22,163,74,0.08)]"
                              : "border-zinc-100 hover:border-green-300 shadow-sm"
                          }`}
                        >
                          <input type="radio" name="traveler" value={t.id} checked={formData.travelerId === t.id}
                            onChange={(e) => set("travelerId", e.target.value)} className="hidden" required />

                          {/* Header */}
                          <div className="flex items-start gap-4 mb-4">
                            <img src={t.avatar} alt={t.name} className="h-14 w-14 rounded-2xl border border-zinc-100 object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <p className="font-bold text-zinc-900 text-base leading-tight">{t.name}</p>
                                {t.badge && (
                                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold shrink-0 ${
                                    t.badge === "Termurah" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                  }`}>
                                    {t.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-zinc-500">{t.route}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-semibold text-zinc-800">{t.rating}</span>
                                <span className="text-xs text-zinc-400">({t.reviews} ulasan)</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs text-zinc-400">per kg</p>
                              <p className="text-xl font-bold text-green-600">
                                {(t.pricePerKg / 1000).toFixed(0)}
                                <span className="text-sm font-semibold text-green-400">K</span>
                              </p>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3 mb-3">
                            <div>
                              <p className="text-xs text-zinc-400">Berangkat</p>
                              <p className="text-sm font-bold text-zinc-800">{t.departureTime}</p>
                            </div>
                            <div className="flex-1 flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                              <div className="flex-1 h-[2px] bg-gradient-to-r from-green-400 to-emerald-400 rounded-full" />
                              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-zinc-400">Sampai</p>
                              <p className="text-sm font-bold text-zinc-800">{t.estimatedArrival}</p>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{t.distance}</span>
                            <span>Sisa kapasitas: <span className="font-semibold text-zinc-700">{t.capacityLeft}</span></span>
                          </div>

                          {formData.travelerId === t.id && (
                            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-green-600">
                              <CheckCircle className="h-3.5 w-3.5" />Terpilih
                            </div>
                          )}
                        </motion.label>
                      ))}
                    </div>
                    <StepButton />
                  </>
                )}

                {/* ═══════════════════════════════════════════════ STEP 3 */}
                {step === 3 && (
                  <>
                    <SectionCard title={formData.orderType === "titip-beli" ? "Titik COD" : "COD 1 – Ambil Barang"}>
                      <div className="space-y-3">
                        {pickupPoints.map((p) => (
                          <PickupOption
                            key={p.id}
                            point={p}
                            name="pickupPoint"
                            checked={formData.pickupPoint === p.id}
                            onChange={() => set("pickupPoint", p.id)}
                            color="green"
                          />
                        ))}
                      </div>
                    </SectionCard>

                    {formData.orderType === "kirim" && (
                      <SectionCard title="COD 2 – Antar ke Penerima">
                        <div className="space-y-3">
                          {pickupPoints.map((p) => (
                            <PickupOption
                              key={p.id}
                              point={p}
                              name="dropPoint"
                              checked={formData.dropPoint === p.id}
                              onChange={() => set("dropPoint", p.id)}
                              color="emerald"
                            />
                          ))}
                        </div>
                      </SectionCard>
                    )}
                    <StepButton />
                  </>
                )}

                {/* ═══════════════════════════════════════════════ STEP 4 */}
                {step === 4 && (
                  <>
                    {/* Order detail */}
                    <SectionCard title="Detail Pesanan">
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-3">
                          <div>
                            <p className="text-xs text-zinc-400">Jenis Layanan</p>
                            <p className="text-sm font-semibold text-zinc-900">
                              {formData.orderType === "titip-beli" ? "Titip Beli Barang" : "Kirim / Titip Barang"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-400">Nama Barang</p>
                            <p className="text-sm font-semibold text-zinc-900">{formData.itemName || "-"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-400">Berat</p>
                            <p className="text-sm font-semibold text-zinc-900">{formData.weight || "-"} kg</p>
                          </div>
                          {formData.orderType === "titip-beli" && formData.estimatedItemPrice && (
                            <div>
                              <p className="text-xs text-zinc-400">Estimasi Harga Barang</p>
                              <p className="text-sm font-semibold text-zinc-900">
                                Rp {Number(formData.estimatedItemPrice).toLocaleString()}
                              </p>
                            </div>
                          )}
                          {formData.orderType === "titip-beli" ? (
                            <div>
                              <p className="text-xs text-zinc-400">Lokasi COD</p>
                              <p className="text-sm font-semibold text-zinc-900">{pickupLabel(formData.pickupPoint)}</p>
                            </div>
                          ) : (
                            <>
                              <div>
                                <p className="text-xs text-zinc-400">Lokasi Jemput</p>
                                <p className="text-sm font-semibold text-zinc-900">{pickupLabel(formData.pickupPoint)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-zinc-400">Lokasi Tujuan</p>
                                <p className="text-sm font-semibold text-zinc-900">{pickupLabel(formData.dropPoint)}</p>
                              </div>
                            </>
                          )}
                          {formData.itemDescription && (
                            <div>
                              <p className="text-xs text-zinc-400">Deskripsi</p>
                              <p className="text-sm text-zinc-600 leading-relaxed">{formData.itemDescription}</p>
                            </div>
                          )}
                        </div>

                        {/* Photo preview */}
                        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50 flex items-center justify-center">
                          {formData.photo ? (
                            <img src={URL.createObjectURL(formData.photo)} alt="Foto" className="w-full h-full object-cover" />
                          ) : (
                            <Package className="h-6 w-6 text-zinc-300" />
                          )}
                        </div>
                      </div>
                    </SectionCard>

                    {/* Traveler */}
                    {selectedTraveler && (
                      <SectionCard title="Mitra Traveler">
                        <div className="flex items-center gap-4">
                          <img src={selectedTraveler.avatar} alt={selectedTraveler.name}
                            className="h-14 w-14 rounded-2xl border border-zinc-100 object-cover" />
                          <div className="flex-1">
                            <p className="font-bold text-zinc-900">{selectedTraveler.name}</p>
                            <p className="text-xs text-zinc-500">{selectedTraveler.route}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-semibold text-zinc-800">{selectedTraveler.rating}</span>
                              <span className="text-xs text-zinc-400">({selectedTraveler.reviews})</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-zinc-400">Harga / kg</p>
                            <p className="text-lg font-bold text-green-600">
                              Rp {selectedTraveler.pricePerKg.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </SectionCard>
                    )}

                    {/* Express toggle */}
                    <button
                      type="button"
                      onClick={() => setIsExpress(!isExpress)}
                      className={`w-full rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                        isExpress ? "border-green-500 bg-green-50" : "border-zinc-100 bg-white hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            isExpress ? "bg-green-500 text-white" : "bg-zinc-100 text-zinc-500"
                          }`}>
                            <Zap className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900 text-sm">Express Delivery</p>
                            <p className="text-xs text-zinc-500">Prioritas diproses lebih cepat</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-green-600">+Rp 5.000</span>
                          <div className={`h-6 w-11 rounded-full transition-all duration-200 ${
                            isExpress ? "bg-green-500" : "bg-zinc-200"
                          } relative`}>
                            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                              isExpress ? "left-5" : "left-0.5"
                            }`} />
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Total payment */}
                    {selectedTraveler && (
                      <div className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 p-6 text-white shadow-lg shadow-green-200">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-green-100">Total Pembayaran</p>
                            <p className="text-xs text-green-200">
                              Ongkir: {formData.weight} kg × Rp {selectedTraveler.pricePerKg.toLocaleString()}
                            </p>
                            {formData.orderType === "titip-beli" && (
                              <p className="text-xs text-green-200">
                                Harga barang: Rp {itemPriceNum.toLocaleString()}
                              </p>
                            )}
                            {isExpress && <p className="text-xs text-green-200">Express: +Rp 5.000</p>}
                          </div>
                          <p className="text-3xl font-bold">
                            Rp {totalPayment.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-green-200 transition-all duration-150 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Konfirmasi & Kirim Order
                    </button>
                  </>
                )}
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ─── Reusable small components ─────────────────────────────────────────────────

function StepButton() {
  return (
    <button
      type="submit"
      className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-semibold text-sm shadow-md shadow-green-100 transition-all duration-150 flex items-center justify-center gap-2 mt-2"
    >
      Lanjut
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

function PickupOption({
  point, name, checked, onChange, color,
}: {
  point: { id: string; name: string; address: string; distance: string };
  name: string; checked: boolean; onChange: () => void; color: "green" | "emerald";
}) {
  const active = color === "green"
    ? "border-green-500 bg-green-50"
    : "border-emerald-500 bg-emerald-50";
  const dot = color === "green" ? "bg-green-500" : "bg-emerald-500";
  const borderColor = color === "green" ? "border-green-500" : "border-emerald-500";
  return (
    <label
      className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all duration-150 ${
        checked ? active : "border-zinc-100 hover:border-zinc-300 bg-white"
      }`}
    >
      <input type="radio" name={name} value={point.id} checked={checked} onChange={onChange} className="hidden" required />
      <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 shrink-0 ${
        checked ? borderColor : "border-zinc-300"
      }`}>
        {checked && <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900">{point.name}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{point.address}</p>
      </div>
      <span className="text-xs font-medium text-zinc-400 shrink-0">{point.distance}</span>
    </label>
  );
}