import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Calendar,
  ArrowRight,
  Package,
  Plane,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedProgress } from "@/components/ui/AnimatedProgress";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Trip = {
  id: string;
  from_city: string;
  to_city: string;
  departure_date: string;
  arrival_date: string;
  total_orders: number;
  remaining_capacity: number; // kg
  capacity_percent: number; // 0 - 100
  status: "active" | "completed" | "cancelled";
};

export default function TravelerTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setTrips([
  {
    id: "1", // ⬅️ PENTING: HARUS SAMA
    from_city: "Jakarta",
    to_city: "Bandung",
    departure_date: "20 Feb 2026",
    arrival_date: "20 Feb 2026",
    total_orders: 3,
    remaining_capacity: 5,
    capacity_percent: 50,
    status: "active",
  },
  {
    id: "2", // ⬅️ ini nyambung ke mockTripDetails["2"]
    from_city: "Jakarta",
    to_city: "Surabaya",
    departure_date: "25 Feb 2026",
    arrival_date: "25 Feb 2026",
    total_orders: 1,
    remaining_capacity: 8,
    capacity_percent: 20,
    status: "completed",
  },
]);

    setLoading(false);
  }, []);

  return (
    <DashboardLayout role="traveler">
      <div className="p-6 md:p-8 lg:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div className="flex items-start justify-between mb-6">
  <div className="flex items-start gap-3">
    <div className="mt-1 rounded-lg bg-primary/10 p-2">
      <Plane className="h-5 w-5 text-primary" />
    </div>

    <div>
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        Daftar Perjalanan
      </h1>
      <p className="text-sm text-muted-foreground">
        Kelola perjalananmu dan lihat detail order yang sedang berjalan
      </p>
    </div>
  </div>
</div>

          <Button
            className="mt-4 md:mt-0 bg-gradient-to-r from-accent to-accent/90 shadow-lg"
            asChild
          >
            <Link to="/traveler/trip/new">
              <Plus className="h-5 w-5 mr-1" />
              Tambah Perjalanan
            </Link>
          </Button>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Belum ada perjalanan"
            description="Buat perjalanan pertamamu untuk mulai menerima order"
            actionLabel="Tambah Perjalanan"
            actionHref="/traveler/trip/new"
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {trips.map((trip) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl bg-card p-5 shadow-card hover:shadow-card-hover transition-all"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <StatusBadge status={trip.status} />
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {trip.departure_date}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 text-center">
                      <p className="text-xs text-muted-foreground">Dari</p>
                      <p className="font-semibold text-foreground">
                        {trip.from_city}
                      </p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>

                    <div className="flex-1 text-center">
                      <p className="text-xs text-muted-foreground">Ke</p>
                      <p className="font-semibold text-foreground">
                        {trip.to_city}
                      </p>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">
                        Sisa kapasitas
                      </span>
                      <span className="font-medium text-foreground">
                        {trip.remaining_capacity} kg
                      </span>
                    </div>
                    <AnimatedProgress
                      value={trip.capacity_percent}
                      size="sm"
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {trip.total_orders} order
                    </span>

                    <Button variant="soft" size="sm" asChild>
                      <Link to={`/traveler/trip/${trip.id}/manage`}>
                        Detail
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
