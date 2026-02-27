import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package, MapPin, Calendar, Upload, Info, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const pickupPoints = [
  { id: "1", name: "Mitra Pos Cikini", address: "Jl. Cikini Raya No. 45" },
  { id: "2", name: "Mitra Pos Menteng", address: "Jl. Menteng Raya No. 12" },
  { id: "3", name: "Titik Temu Stasiun Gambir", address: "Lobi Utama Stasiun" },
];

const cities = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Batam",
  "Denpasar",
];

const travelers = [
  { id: "t1", name: "Andi Pratama", route: "Jakarta → Batam", date: "2026-02-15", rating: 4.8, reviews: 120, capacityLeft: "5 kg", distance: "5km", departureTime: "08:30", estimatedArrival: "18:00", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=andi", pricePerKg: 25000 },
  { id: "t2", name: "Salsa Putri", route: "Bandung → Surabaya", date: "2026-02-18", rating: 4.7, reviews: 95, capacityLeft: "7 kg", distance: "12km", departureTime: "09:00", estimatedArrival: "20:00", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=salsa", pricePerKg: 15000 },
  { id: "t3", name: "Rizky Mahendra", route: "Jakarta → Denpasar", date: "2026-02-20", rating: 4.5, reviews: 85, capacityLeft: "3 kg", distance: "18km", departureTime: "07:00", estimatedArrival: "19:00", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=rizky", pricePerKg: 35000 },
];

// Simulate auth state - in real app this would come from auth context
const isLoggedIn = true; // Set to false to test guest view

export default function NewOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderTypeFromUrl = searchParams.get("type");
  const [step, setStep] = useState<number>(1);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    orderType: orderTypeFromUrl === "kirim" ? "kirim" : "titip-beli",
    itemName: "",
    itemDescription: "",
    serviceType: "",
    weight: "",
    photo: null as File | null,
    pickupPoint: "",
    estimatedItemPrice: "",
    notes: "",
    pickupLocation: "",
    dropLocation: "",
    dropPoint: "",
    originCity: "",
    destinationCity: "",
    travelDate: "",
    travelerId: "",
    originAddress: "",
    destinationAddress: "",
  });
  useEffect(() => {
  if (orderTypeFromUrl === "titip-beli" || orderTypeFromUrl === "kirim") {
    setFormData((prev) => ({
      ...prev,
      orderType: orderTypeFromUrl,
    }));
  }
}, [orderTypeFromUrl]);

  // Mock calculation
  const estimatedPrice = formData.weight ? parseInt(formData.weight) * 25000 : 0;

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (step < 4) {
    setStep(step + 1);
  } else {
    const generatedOrderNumber = `ORD-${Date.now()
      .toString()
      .slice(-6)}`;

    setOrderNumber(generatedOrderNumber);
    setSubmitted(true);

    console.log("Order submitted:", formData);
  }
};

      const selectedTraveler = travelers.find(
  (t) => t.id === formData.travelerId
);

const weightNumber = Number(formData.weight || 0
);

const estimatedItemPriceNumber = Number(
  formData.estimatedItemPrice || 0
);

const deliveryFee =
  selectedTraveler
    ? weightNumber * selectedTraveler.pricePerKg
    : 0;

const totalPayment =
  formData.orderType === "titip-beli"
    ? deliveryFee + estimatedItemPriceNumber
    : deliveryFee;

const [filters, setFilters] = useState({
  minRating: "",
  minCapacity: "",
  maxPrice: "",
});

const filteredTravelers = travelers
  .filter((t) => {
    if (filters.minRating && t.rating < Number(filters.minRating)) return false;
    if (
      filters.minCapacity &&
      parseInt(t.capacityLeft) < Number(filters.minCapacity)
    )
      return false;
    if (filters.maxPrice && t.pricePerKg > Number(filters.maxPrice))
      return false;
    return true;
  })
  .sort((a, b) => a.pricePerKg - b.pricePerKg); // TERMURAH KE ATAS

const userProfile = {
  address: "Jl. Kaliurang KM 7, Sleman, Yogyakarta",
};

const pickupLabel = (id: string) => {
  const point = pickupPoints.find((p) => p.id === id);
  return point ? `${point.name} – ${point.address}` : "-";
};

useEffect(() => {
  if (userProfile?.address) {
    setFormData((prev) => ({
      ...prev,
      originAddress: userProfile.address,
    }));
  }
}, [userProfile]);

  // If guest, show login prompt
  if (!isLoggedIn) {
    return (
      <DashboardLayout role="customer">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card p-8 shadow-card text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/20 mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-warning" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Login Diperlukan
              </h2>
              <p className="text-muted-foreground mb-6">
                Anda harus login sebagai customer terlebih dahulu untuk membuat order.
              </p>
              <div className="flex flex-col gap-3">
                <Button variant="hero" asChild>
                  <Link to="/login">Login Sekarang</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/register">Daftar Gratis</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="customer">
      <div className="p-6 md:p-8 lg:p-10">
          {!submitted && (
  <Button
    variant="ghost"
    className="mb-6"
    onClick={() =>
      step > 1 ? setStep(step - 1) : navigate(-1)
    }
  >
    <ArrowLeft className="h-4 w-4 mr-2" />
    {step > 1 ? "Langkah Sebelumnya" : "Kembali"}
  </Button>
)}

          <div className="max-w-2xl">
            {/* Progress */}
            {!submitted && (
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                        s <= step
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s}
                    </div>
                    {s < 4 && (
                      <div className={`w-12 h-1 mx-2 ${s < step ? "bg-primary" : "bg-muted"}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {!submitted ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl bg-card p-6 md:p-8 shadow-card"
              >
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <>
                      <h2 className="text-xl font-semibold text-foreground mb-6">
                        Detail Barang
                      </h2>
                      <div className="space-y-5">
                         <div className="space-y-2">
  <Label>Foto Barang (Opsional)</Label>

  <label className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer block">
    <input
      type="file"
      accept="image/png,image/jpeg"
      className="hidden"
      onChange={(e) =>
        setFormData({
          ...formData,
          photo: e.target.files?.[0] || null,
        })
      }
    />

    {!formData.photo ? (
      <>
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Klik untuk upload foto barang
        </p>
      </>
    ) : (
      <img
        src={URL.createObjectURL(formData.photo)}
        alt="Preview"
        className="mx-auto max-h-40 rounded-lg object-cover"
      />
    )}
  </label>
</div>
                        <div className="space-y-2">
                          <Label>Jenis Order</Label>
                          <Select value={formData.orderType} disabled>
                            <p className="text-xs text-muted-foreground">Jenis order ditentukan dari pilihan sebelumnya</p>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="titip-beli">Titip Beli Barang</SelectItem>
                              <SelectItem value="kirim">Kirim / Titip Barang</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label>Kota Asal</Label>
    <Select
      value={formData.originCity}
      onValueChange={(value) =>
        setFormData({ ...formData, originCity: value })
      }
    >
      <SelectTrigger className="h-12">
        <SelectValue placeholder="Pilih kota asal" />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  <div className="space-y-2">
    <Label>Kota Tujuan</Label>
    <Select
      value={formData.destinationCity}
      onValueChange={(value) =>
        setFormData({ ...formData, destinationCity: value })
      }
    >
      <SelectTrigger className="h-12">
        <SelectValue placeholder="Pilih kota tujuan" />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>
<div className="space-y-2">
  <Label>Alamat Asal</Label>
  <Input
    value={formData.originAddress}
    readOnly
    className="h-12 bg-muted cursor-not-allowed"
  />
  <p className="text-xs text-muted-foreground">
    Alamat diambil otomatis dari profil Anda
  </p>
</div>

{formData.orderType === "kirim" && (
  <div className="space-y-2">
    <Label htmlFor="destinationAddress">
      Alamat Tujuan (Detail)
    </Label>
    <Textarea
      id="destinationAddress"
      placeholder="Contoh: Jl. Ahmad Yani No. 12"
      rows={2}
      value={formData.destinationAddress}
      onChange={(e) =>
        setFormData({
          ...formData,
          destinationAddress: e.target.value,
        })
      }
      required
    />
  </div>
)}
<div className="space-y-2">
  <Label htmlFor="travelDate">Tanggal Perjalanan</Label>
  <Input
    id="travelDate"
    type="date"
    value={formData.travelDate}
    onChange={(e) =>
      setFormData({ ...formData, travelDate: e.target.value })
    }
    className="h-12"
    required
  />
</div>

                        <div className="space-y-2">
                          <Label htmlFor="itemName">Nama Barang</Label>
                          <Input
                            id="itemName"
                            placeholder="Contoh: Sepatu Nike Air Max"
                            value={formData.itemName}
                            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                            className="h-12"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="itemDescription">Deskripsi Barang</Label>
                          <Textarea
                            id="itemDescription"
                            placeholder="Jelaskan detail barang (warna, ukuran, kondisi, dll)"
                            rows={4}
                            value={formData.itemDescription}
                            onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                            required
                          />
                        </div>
                        {formData.orderType === "titip-beli" && (
  <div className="space-y-2">
    <Label htmlFor="estimatedItemPrice">
      Estimasi Harga Barang
    </Label>
    <Input
      id="estimatedItemPrice"
      type="number"
      placeholder="Contoh: 350000"
      value={formData.estimatedItemPrice}
      onChange={(e) =>
        setFormData({
          ...formData,
          estimatedItemPrice: e.target.value,
        })
      }
      className="h-12"
    />
    <p className="text-xs text-muted-foreground">
      Digunakan sebagai perkiraan harga barang (khusus titip beli)
    </p>
  </div>
)}
                        <div className="space-y-2">
                          <Label htmlFor="weight">Estimasi Berat (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            min="0.1"
                            step="0.1"
                            placeholder="Contoh: 1.5"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            className="h-12"
                            required
                          />
                        </div>
</div>
<div className="pt-6">
  <Button
    type="submit"
    className="w-full h-12 text-base font-semibold gap-2"
  >
    Lanjut
    <ArrowRight className="h-5 w-5" />
  </Button>
</div>
  </>
)}

{step === 2 && (
  <>
    <h2 className="text-xl font-semibold text-foreground mb-2">
      Pilih Mitra Traveler
    </h2>

    <p className="text-sm text-muted-foreground mb-6">
      Traveler tersedia sesuai rute, tanggal, dan jam keberangkatan
    </p>

    {/* ================= QUICK FILTER (ENHANCED UI) ================= */}
<div className="mb-8">
  <div
    className="
      flex items-center gap-3 overflow-x-auto
      rounded-2xl border bg-background/70 backdrop-blur
      px-4 py-3 shadow-sm
    "
  >

    {/* RATING */}
    <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
      <span className="text-sm font-medium text-muted-foreground">
        Rating
      </span>

      <Select
        value={filters.minRating}
        onValueChange={(value) =>
          setFilters({ ...filters, minRating: value })
        }
      >
        <SelectTrigger className="h-8 w-[90px] rounded-full border-none bg-background shadow-sm">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="4">4.0+</SelectItem>
          <SelectItem value="4.5">4.5+</SelectItem>
          <SelectItem value="4.8">4.8+</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* HARGA */}
    <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
      <span className="text-sm font-medium text-muted-foreground">
        Harga
      </span>

      <Select
        value={filters.maxPrice}
        onValueChange={(value) =>
          setFilters({ ...filters, maxPrice: value })
        }
      >
        <SelectTrigger className="h-8 w-[120px] rounded-full border-none bg-background shadow-sm">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="20000">≤ 20K</SelectItem>
          <SelectItem value="30000">≤ 30K</SelectItem>
          <SelectItem value="40000">≤ 40K</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* KAPASITAS */}
    <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
      <span className="text-sm font-medium text-muted-foreground">
        Kapasitas
      </span>

      <Select
        value={filters.minCapacity}
        onValueChange={(value) =>
          setFilters({ ...filters, minCapacity: value })
        }
      >
        <SelectTrigger className="h-8 w-[110px] rounded-full border-none bg-background shadow-sm">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="3">≥ 3 kg</SelectItem>
          <SelectItem value="5">≥ 5 kg</SelectItem>
          <SelectItem value="7">≥ 7 kg</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* RESET BUTTON */}
    {(filters.minRating || filters.maxPrice || filters.minCapacity) && (
      <button
        type="button"
        onClick={() =>
          setFilters({
            minRating: "",
            minCapacity: "",
            maxPrice: "",
          })
        }
        className="
          ml-auto flex items-center gap-2
          rounded-full border border-primary/30
          bg-primary/10 px-4 py-2
          text-sm font-semibold text-primary
          hover:bg-primary hover:text-primary-foreground
          transition-all
        "
      >
        Reset
      </button>
    )}
  </div>
</div>

    {/* LIST TRAVELER */}
    <div className="space-y-6">
      {filteredTravelers.map((traveler, index) => (
        <motion.label
          key={traveler.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`relative block rounded-2xl border-2 p-5 cursor-pointer transition-all
            ${
              formData.travelerId === traveler.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border hover:border-primary/40 hover:shadow-sm"
            }
          `}
        >
          <input
            type="radio"
            name="traveler"
            value={traveler.id}
            checked={formData.travelerId === traveler.id}
            onChange={(e) =>
              setFormData({ ...formData, travelerId: e.target.value })
            }
            className="hidden"
            required
          />

          {/* HEADER */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* AVATAR ANIMATION */}
              <motion.img
                src={traveler.avatar}
                alt={traveler.name}
                className="w-16 h-16 rounded-full object-cover border"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <div>
                <p className="font-semibold text-foreground text-base leading-tight">
                  {traveler.name}
                </p>

                <p className="text-sm text-muted-foreground">
                  {traveler.route}
                </p>

                {/* HARGA DITONJOLIN */}
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground">
                    Harga per kg
                  </p>
                  <p className="text-lg font-bold text-primary">
                    Rp {traveler.pricePerKg.toLocaleString()}
                    <span className="text-sm font-medium text-muted-foreground">
                      {" "}
                      / kg
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* RATING */}
            <div className="flex items-center gap-1 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-yellow-400"
              >
                <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>

              <span className="text-sm font-semibold text-yellow-500">
                {traveler.rating}
              </span>
              <span className="text-xs text-muted-foreground">
                ({traveler.reviews})
              </span>
            </div>
          </div>

          
{/* JAM & ESTIMASI (TIMELINE TRAVEL) */}
<motion.div
  className="mt-6 rounded-xl border bg-muted/40 px-4 py-4"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
>
  <div className="relative flex items-center justify-between min-h-[56px]">

    {/* BERANGKAT */}
    <div className="flex items-center gap-3 z-10">
      <div className="relative flex items-center justify-center w-4 h-4">
        <span className="absolute inline-flex h-4 w-4 rounded-full bg-primary/40 animate-ping" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">Berangkat</p>
        <p className="font-semibold text-foreground">
          {traveler.departureTime}
        </p>
      </div>
    </div>

    {/* GARIS */}
    <div className="absolute left-1/2 -translate-x-1/2 w-[40%] h-[2px] bg-gradient-to-r from-primary via-primary/60 to-emerald-500 rounded-full z-0" />

    {/* SAMPAI */}
    <div className="flex items-center gap-3 z-10">
      <div>
        <p className="text-xs text-muted-foreground text-right">Sampai</p>
        <p className="font-semibold text-foreground text-right">
          {traveler.estimatedArrival}
        </p>
      </div>

      <div className="relative flex items-center justify-center w-4 h-4">
        <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-500/40 animate-ping" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
      </div>
    </div>

  </div>
</motion.div>

          {/* FOOTER */}
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              {traveler.distance}
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                Kapasitas tersedia
              </p>
              <p className="font-semibold text-foreground">
                {traveler.capacityLeft}
              </p>
            </div>
          </div>

          {/* SELECTED INDICATOR */}
           {formData.travelerId === traveler.id && (
      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
        ✓ Terpilih
      </span>
    )}
        </motion.label>
      ))}
    </div>
   <div className="pt-6">
  <Button
    type="submit"
    className="w-full h-12 text-base font-semibold gap-2"
  >
    Lanjut
    <ArrowRight className="h-5 w-5" />
  </Button>
</div>
  </>
)}

                  {step === 3 && (
  <>
    <h2 className="text-xl font-semibold text-foreground mb-2">
      Titik COD
    </h2>

    <p className="text-sm text-muted-foreground mb-6">
      {formData.orderType === "titip-beli"
        ? "Tentukan lokasi pertemuan dengan traveler"
        : "Tentukan lokasi ambil dan antar barang"}
    </p>

    <div className="space-y-6">

      {/* ================= TITIP BELI ================= */}
      {formData.orderType === "titip-beli" && (
        <div className="space-y-3">
          {pickupPoints.map((point) => (
            <label
              key={point.id}
              className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition
                ${
                  formData.pickupPoint === point.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
            >
              <input
                type="radio"
                name="pickupPoint"
                value={point.id}
                checked={formData.pickupPoint === point.id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pickupPoint: e.target.value,
                  })
                }
                className="mt-1"
                required
              />

              <div>
                <p className="font-medium text-foreground">
                  {point.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {point.address}
                </p>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* ================= KIRIM BARANG ================= */}
      {formData.orderType === "kirim" && (
        <>
          {/* COD 1 */}
          <div>
            <h3 className="font-semibold mb-3">
              COD 1 – Ambil Barang
            </h3>

            <div className="space-y-3">
              {pickupPoints.map((point) => (
                <label
                  key={point.id}
                  className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition
                    ${
                      formData.pickupPoint === point.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                >
                  <input
                    type="radio"
                    name="pickupPoint"
                    value={point.id}
                    checked={formData.pickupPoint === point.id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickupPoint: e.target.value,
                      })
                    }
                    className="mt-1"
                    required
                  />

                  <div>
                    <p className="font-medium">{point.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {point.address}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* COD 2 */}
          <div className="pt-6">
            <h3 className="font-semibold mb-3">
              COD 2 – Antar ke Penerima
            </h3>

            <div className="space-y-3">
              {pickupPoints.map((point) => (
                <label
                  key={point.id}
                  className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition
                    ${
                      formData.dropPoint === point.id
                        ? "border-emerald-500 bg-emerald-500/5"
                        : "border-border hover:border-emerald-500/40"
                    }`}
                >
                  <input
                    type="radio"
                    name="dropPoint"
                    value={point.id}
                    checked={formData.dropPoint === point.id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dropPoint: e.target.value,
                      })
                    }
                    className="mt-1"
                    required
                  />

                  <div>
                    <p className="font-medium">{point.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {point.address}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>

    <div className="pt-6">
  <Button
    type="submit"
    className="w-full h-12 text-base font-semibold gap-2"
  >
    Lanjut
    <ArrowRight className="h-5 w-5" />
  </Button>
</div>
  </>
)}

                  {step === 4 && (
  <>
    <h2 className="text-xl font-semibold text-foreground mb-2">
      Review & Konfirmasi Order
    </h2>

    <p className="text-sm text-muted-foreground mb-6">
      Pastikan semua detail sudah benar sebelum mengirim pesanan
    </p>

    <div className="space-y-6">

      {/* ===================== */}
      {/* DETAIL PESANAN */}
      {/* ===================== */}
      <div className="rounded-2xl border p-5 bg-background">
        <h3 className="font-semibold text-foreground mb-4">
          Detail Pesanan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

          {/* ===== KIRI: INFO PESANAN ===== */}
<div className="md:col-span-2 space-y-4">

  <div>
            <p className="text-xs text-muted-foreground">Jenis Layanan</p>
            <p className="font-medium text-foreground">
             {formData.orderType === "titip-beli"
    ? "Titip Beli Barang"
              : "Kirim / Titip Barang"}
            </p>
          </div>

  {/* INFO BARANG */}
  <div className="flex-1">
    <p className="font-semibold text-foreground">
      {formData.itemName}
    </p>

    <p className="text-sm text-muted-foreground mt-1">
      Berat: {formData.weight} kg
    </p>

    {formData.orderType === "titip-beli" &&
      formData.estimatedItemPrice && (
        <p className="text-sm text-muted-foreground mt-1">
          Estimasi harga barang: Rp{" "}
          {Number(formData.estimatedItemPrice).toLocaleString()}
        </p>
      )}

    {formData.itemDescription && (
  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
    {formData.itemDescription}
  </p>
)}
  </div>
    {/* ================= LOKASI ================= */}
{formData.orderType === "titip-beli" && (
  <div>
    <p className="text-xs text-muted-foreground">
      Lokasi COD
    </p>
    <p className="font-medium text-foreground">
      {pickupLabel(formData.pickupPoint)}
    </p>
  </div>
)}

{formData.orderType === "kirim" && (
  <>
    <div>
      <p className="text-xs text-muted-foreground">
        Lokasi Jemput
      </p>
      <p className="font-medium text-foreground">
        {pickupLabel(formData.pickupPoint)}
      </p>
    </div>

    <div>
      <p className="text-xs text-muted-foreground">
        Lokasi Tujuan
      </p>
      <p className="font-medium text-foreground">
        {pickupLabel(formData.dropPoint)}
      </p>
    </div>
  </>
)}
</div>

          {formData.notes && (
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Catatan</p>
              <p className="font-medium text-foreground">
                {formData.notes}
              </p>
            </div>
          )}
           {/* ===== KANAN: FOTO BARANG ===== */}
<div className="w-full h-full rounded-xl border bg-muted/30 flex items-center justify-center overflow-hidden">
  {formData.photo ? (
    <img
      src={URL.createObjectURL(formData.photo)}
      alt="Foto barang"
      className="w-full h-full object-cover"
    />
  ) : (
    <p className="text-sm text-muted-foreground text-center px-4">
      Foto barang belum ditambahkan
    </p>
  )}
</div>
          </div>
      </div>

      {/* ===================== */}
      {/* TRAVELER TERPILIH */}
      {/* ===================== */}
      {selectedTraveler && (
        <div className="rounded-2xl border p-5 bg-background">
          <h3 className="font-semibold text-foreground mb-4">
            Mitra Traveler
          </h3>

          <div className="flex items-center gap-4">
            <img
              src={selectedTraveler.avatar}
              alt={selectedTraveler.name}
              className="w-14 h-14 rounded-full border"
            />

            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {selectedTraveler.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedTraveler.route}
              </p>

              <div className="flex items-center gap-2 mt-1 text-sm">
                <span className="text-yellow-500 font-semibold">
                  ★ {selectedTraveler.rating}
                </span>
                <span className="text-muted-foreground">
                  ({selectedTraveler.reviews} ulasan)
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                Harga / kg
              </p>
              <p className="font-bold text-primary">
                Rp {selectedTraveler.pricePerKg.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

{/* ===================== */}
{/* TOTAL PEMBAYARAN */}
{/* ===================== */}
{selectedTraveler && (
  <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6">
    <div className="flex items-center justify-between gap-4">

   <div className="space-y-1">

  <p className="text-sm text-muted-foreground">
    Total Pembayaran
  </p>

  <p className="text-xs text-muted-foreground">
    Ongkir: {formData.weight} kg × Rp {selectedTraveler.pricePerKg.toLocaleString()}
  </p>

  {formData.orderType === "titip-beli" && (
    <p className="text-xs text-muted-foreground">
      Estimasi barang: Rp {Number(formData.estimatedItemPrice || 0).toLocaleString()}
    </p>
  )}

</div>

      {/* KANAN – ANGKA BESAR */}
      <p className="text-3xl font-bold text-primary text-right whitespace-nowrap">
      Rp {totalPayment.toLocaleString()}
      </p>

    </div>
  </div>
)}

      {/* ===================== */}
      {/* AKSI */}
      {/* ===================== */}
 <div className="pt-6">
  <Button
    type="submit"
    className="
      w-full
      h-14
      text-base
      font-semibold
      gap-2
      rounded-xl
      bg-primary
      hover:bg-primary/90
      active:scale-[0.98]
      transition
      shadow-md
    "
  >
    Konfirmasi & Kirim Order
  </Button>
</div>
      </div>

  </>
)}
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl bg-card p-8 shadow-card text-center"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20 mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Order Berhasil Dibuat!
                </h2>
                <p className="text-muted-foreground mb-2">
                  Order Anda telah dikirim ke traveler. Anda akan mendapat notifikasi setelah traveler mengonfirmasi.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                 No. Order: <span className="font-semibold text-foreground">{orderNumber}</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="hero" asChild>
                    <Link to="/dashboard">
                      <Package className="h-5 w-5 mr-2" />
                      Ke Dashboard
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
      </div>
    </DashboardLayout>
  );
}
