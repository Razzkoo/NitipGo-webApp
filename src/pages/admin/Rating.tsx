import { useState } from "react";
import { motion } from "framer-motion";
import { Star, AlertCircle, CheckCircle, Crown, } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/CountUp";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/hooks/use-toast";

type Review = {
  id: string;
  traveler: string;
  customer: string;
  rating: number; // 1-5
  review: string;
  date: string;
  flagged?: boolean;
};

const mockReviews: Review[] = [
  { id: "R-001", traveler: "Andi Pratama", customer: "Budi Santoso", rating: 5, review: "Traveler ramah & cepat!", date: "20 Feb 2024" },
  { id: "R-002", traveler: "Sari Dewi", customer: "Rina Kusuma", rating: 3, review: "Barang sampai agak terlambat.", date: "19 Feb 2024" },
  { id: "R-003", traveler: "Dimas Wijaya", customer: "Maya Putri", rating: 2, review: "Kurang teliti, barang ada gores.", date: "18 Feb 2024" },
  { id: "R-004", traveler: "Budi Santoso", customer: "Ahmad Fauzi", rating: 4, review: "Lumayan cepat, komunikasi baik.", date: "17 Feb 2024" },
  { id: "R-005", traveler: "Andi Pratama", customer: "Lina Permata", rating: 5, review: "Sangat memuaskan, rekomendasi!", date: "16 Feb 2024" },
];

export default function AdminReviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [filter, setFilter] = useState<"all" | "positive" | "neutral" | "negative">("all");

  // Filter reviews sesuai pilihan
  const filteredReviews = reviews.filter(r => {
    if (filter === "all") return true;
    if (filter === "positive") return r.rating >= 4;
    if (filter === "neutral") return r.rating === 3;
    if (filter === "negative") return r.rating < 3;
    return true;
  });

  // Tandai review bermasalah (dummy)
  const handleFlag = (review: Review) => {
    setReviews(reviews.map(r => r.id === review.id ? { ...r, flagged: true } : r));
    toast({
      title: "Review Ditandai",
      description: `${review.id} ditandai bermasalah.`,
    });
  };

  // Statistik cepat
  const stats = {
    total: reviews.length,
    positive: reviews.filter(r => r.rating >= 4).length,
    neutral: reviews.filter(r => r.rating === 3).length,
    negative: reviews.filter(r => r.rating < 3).length,
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 md:p-8 lg:p-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-lg bg-primary/10 p-2">
                <Crown className="h-5 w-5 text-primary" />
              </div>
          
              <div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  Rating & Ulasan Platform
                </h1>
                <p className="text-sm text-muted-foreground">
                    Pantau feedback traveler untuk tingkatkan kualitas layanan
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="rounded-xl bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow">
            <p className="text-sm text-muted-foreground">Total Review</p>
            <p className="text-xl font-bold text-foreground">
              <CountUp end={stats.total} duration={1000} />
            </p>
          </div>
          <div className="rounded-xl bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow">
            <p className="text-sm text-muted-foreground">Positif (≥4)</p>
            <p className="text-xl font-bold text-success">
              <CountUp end={stats.positive} duration={1000} />
            </p>
          </div>
          <div className="rounded-xl bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow">
            <p className="text-sm text-muted-foreground">Netral (3)</p>
            <p className="text-xl font-bold text-warning">
              <CountUp end={stats.neutral} duration={1000} />
            </p>
          </div>
          <div className="rounded-xl bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow">
            <p className="text-sm text-muted-foreground">Negatif (&lt;3)</p>
            <p className="text-xl font-bold text-destructive">
              <CountUp end={stats.negative} duration={1000} />
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-2 mb-6 flex-wrap">
          {["all", "positive", "neutral", "negative"].map(f => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f as any)}>
              {f === "all" ? "Semua" : f === "positive" ? "Positif" : f === "neutral" ? "Netral" : "Negatif"}
            </Button>
          ))}
        </motion.div>

        {/* Review List */}
        {filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }} whileHover={{ y: -2, transition: { duration: 0.2 } }} className={`rounded-2xl p-5 shadow-card transition-all ${r.flagged ? "border border-destructive" : "bg-card"}`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="font-medium text-foreground">{r.traveler}</span>
                      <span className="text-sm text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={`h-4 w-4 ${idx < r.rating ? (r.rating >= 4 ? "text-success" : r.rating === 3 ? "text-warning" : "text-destructive") : "text-muted-foreground"}`} />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">{r.rating}/5</span>
                    </div>
                    <p className="text-sm text-foreground">{r.review}</p>
                  </div>
                  {!r.flagged && (
                    <Button size="sm" variant="outline" onClick={() => handleFlag(r)} className="self-start">
                      <AlertCircle className="h-4 w-4 mr-1" /> Tandai
                    </Button>
                  )}
                  {r.flagged && (
                    <div title="Flagged">
                      <CheckCircle className="h-6 w-6 text-destructive mt-1" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState icon={AlertCircle} title="Tidak ada review" description="Belum ada feedback traveler" />
        )}
      </div>
    </DashboardLayout>
  );
}
