import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, MessageSquare, CheckCircle, Eye, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { CountUp } from "@/components/ui/CountUp";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Dispute = {
  id: string;
  orderId: string;
  customer: string;
  traveler: string;
  issue: string;
  description: string;
  status: "open" | "in_review" | "resolved";
  priority: "high" | "medium" | "low";
  date: string;
  amount: string;
  resolution?: string;
  decision?: "refund" | "partial_refund" | "release_payment";
  adminNote?: string;
  resolvedAt?: string;
};

const mockDisputes: Dispute[] = [
  { 
    id: "DSP-001", 
    orderId: "ORD-001", 
    customer: "Budi Santoso", 
    traveler: "Andi Pratama", 
    issue: "Barang rusak saat pengiriman",
    description: "Sepatu yang dikirim kondisinya rusak, ada goresan di bagian samping.",
    status: "open", 
    priority: "high",
    date: "15 Feb 2024",
    amount: "Rp 45.000"
  },
  { 
    id: "DSP-002", 
    orderId: "ORD-005", 
    customer: "Rina Kusuma", 
    traveler: "Sari Dewi", 
    issue: "Barang tidak sesuai pesanan",
    description: "Warna barang yang diterima tidak sesuai dengan yang dipesan.",
    status: "in_review", 
    priority: "medium",
    date: "14 Feb 2024",
    amount: "Rp 35.000"
  },
  { 
    id: "DSP-003", 
    orderId: "ORD-003", 
    customer: "Maya Putri", 
    traveler: "Dimas Wijaya", 
    issue: "Barang hilang",
    description: "Traveler mengklaim sudah mengantarkan tapi customer belum menerima.",
    status: "open", 
    priority: "high",
    date: "13 Feb 2024",
    amount: "Rp 150.000"
  },
  { 
    id: "DSP-004", 
    orderId: "ORD-010", 
    customer: "Ahmad Fauzi", 
    traveler: "Budi Santoso", 
    issue: "Keterlambatan pengiriman",
    description: "Barang tiba 3 hari lebih lambat dari estimasi.",
    status: "resolved", 
    priority: "low",
    date: "10 Feb 2024",
    amount: "Rp 25.000",
    resolution: "Refund 50% biaya pengiriman"
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  open: { label: "Baru", className: "bg-destructive/20 text-destructive" },
  in_review: { label: "Ditinjau", className: "bg-warning/20 text-warning" },
  resolved: { label: "Selesai", className: "bg-success/20 text-success" },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: "Tinggi", className: "bg-destructive/20 text-destructive" },
  medium: { label: "Sedang", className: "bg-warning/20 text-warning" },
  low: { label: "Rendah", className: "bg-muted text-muted-foreground" },
};

export default function AdminDisputes() {
  const { toast } = useToast();
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolution, setResolution] = useState("");
  const [filter, setFilter] = useState("all");
  const [decision, setDecision] = useState<Dispute["decision"]>(undefined); // pilihan keputusan dispute
  const [adminNote, setAdminNote] = useState(""); // catatan internal admin

  const filteredDisputes = disputes.filter(d => filter === "all" || d.status === filter);

  const handleResolve = () => {
  if (selectedDispute && resolution && decision) {
    const resolvedAt = new Date().toLocaleString("id-ID");
    setDisputes(disputes.map(d =>
      d.id === selectedDispute.id ? { 
        ...d, 
        status: "resolved", 
        resolution, 
        decision, 
        adminNote, 
        resolvedAt 
      } : d
    ));
    toast({
      title: "Dispute Diselesaikan",
      description: `${selectedDispute.id} telah ditandai selesai.`,
    });
    setSelectedDispute(null);
    setResolution("");
    setDecision(undefined);
    setAdminNote("");
  }
};

  const handleMarkInReview = (dispute: any) => {
    setDisputes(disputes.map(d =>
      d.id === dispute.id ? { ...d, status: "in_review" } : d
    ));
    toast({
      title: "Status Diperbarui",
      description: `${dispute.id} sedang ditinjau.`,
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 md:p-8 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-lg bg-primary/10 p-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
          
              <div>
                <h1 className="text-2xl font-bold leading-tight">
                  Laporan & Disputes
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitoring Laporan & Permasalahan transaksi pengguna
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-3 mb-6"
        >
          <div className="rounded-xl bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10"
              >
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">Baru</p>
                <p className="text-xl font-bold text-foreground">
                  <CountUp end={disputes.filter(d => d.status === "open").length} duration={1000} />
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10"
              >
                <Clock className="h-5 w-5 text-warning" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">Ditinjau</p>
                <p className="text-xl font-bold text-foreground">
                  <CountUp end={disputes.filter(d => d.status === "in_review").length} duration={1000} />
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"
              >
                <CheckCircle className="h-5 w-5 text-success" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">Selesai</p>
                <p className="text-xl font-bold text-foreground">
                  <CountUp end={disputes.filter(d => d.status === "resolved").length} duration={1000} />
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6 flex-wrap"
        >
          {["all", "open", "in_review", "resolved"].map((f) => (
            <motion.div key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "Semua" : statusConfig[f]?.label || f}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Dispute List */}
        {filteredDisputes.length > 0 ? (
          <div className="space-y-4">
            {filteredDisputes.map((dispute, i) => (
              <motion.div
                key={dispute.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="rounded-2xl bg-card p-5 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-medium text-foreground">{dispute.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[dispute.status].className}`}>
                        {statusConfig[dispute.status].label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig[dispute.priority].className}`}>
                        {priorityConfig[dispute.priority].label}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{dispute.issue}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{dispute.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Order: {dispute.orderId}</span>
                      <span>Customer: {dispute.customer}</span>
                      <span>Traveler: {dispute.traveler}</span>
                      <span>{dispute.date}</span>
                    </div>
                    {dispute.resolution && (
  <motion.div 
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    className="mt-3 p-3 rounded-lg bg-success/10 border border-success/20 space-y-1"
  >
    <p className="text-sm text-success font-medium">Resolusi: {dispute.resolution}</p>
    {dispute.decision && (
      <p className="text-sm text-foreground font-medium">Keputusan: {dispute.decision.replace("_", " ")}</p>
    )}
    {dispute.adminNote && (
      <p className="text-xs text-muted-foreground">Catatan Admin: {dispute.adminNote}</p>
    )}
    {dispute.resolvedAt && (
      <p className="text-xs text-muted-foreground">Diselesaikan pada {dispute.resolvedAt}</p>
    )}
  </motion.div>
)}
                  </div>
                  <div className="flex gap-2">
                    {dispute.status === "open" && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkInReview(dispute)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Tinjau
                      </Button>
                    )}
                    {dispute.status === "in_review" && (
                    <Button size="sm" onClick={() => setSelectedDispute(dispute)}>
                     <CheckCircle className="h-4 w-4 mr-1" />
                     Selesaikan
                    </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={AlertTriangle}
            title="Tidak ada dispute"
            description="Semua masalah sudah ditangani"
          />
        )}

        {/* Resolve Dialog */}
        <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Selesaikan Dispute</DialogTitle>
              <DialogDescription>
                Masukkan resolusi untuk {selectedDispute?.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="font-medium mb-1">{selectedDispute?.issue}</p>
                <p className="text-muted-foreground">{selectedDispute?.description}</p>
              </div>
              <div className="text-sm text-muted-foreground">
              Nilai Transaksi: <span className="font-medium">{selectedDispute?.amount}</span>
              </div>
              <div>
  <label className="text-sm font-medium">Keputusan Dispute</label>
  <select
  className="w-full border rounded-md p-2 text-sm mb-2"
  value={decision || ""} // biar bisa default kosong
  onChange={(e) => setDecision(e.target.value as Dispute["decision"])} // casting biar TypeScript ngerti
>
    <option value="">Pilih Keputusan</option>
    <option value="refund">Refund ke Customer</option>
    <option value="partial_refund">Refund Sebagian</option>
    <option value="release_payment">Lepaskan Dana ke Traveler</option>
  </select>
</div>
<div>
  <label className="text-sm font-medium">Catatan Admin (Internal)</label>
  <Textarea
    placeholder="Catatan untuk log internal admin, tidak terlihat user"
    value={adminNote}
    onChange={(e) => setAdminNote(e.target.value)}
    rows={2}
  />
</div>
              <div>
                <label className="text-sm font-medium">Resolusi</label>
                <Textarea
                  placeholder="Jelaskan solusi yang diberikan..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedDispute(null)}>Batal</Button>
             <Button onClick={handleResolve} disabled={!resolution || !decision}>Selesaikan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}