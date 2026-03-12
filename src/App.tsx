import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import Trips from "./pages/Trips";
import TripDetail from "./pages/TripDetail";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/NotFound";
import ChatTraveler from "@/pages/chat-traveler";
import CustomerHelp from "./pages/CustomerHelp";
import { OrderProvider } from "@/context/OrderContext";

// Legal Pages
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import SocialPlaceholder from "./pages/SocialPlaceholder";

// Traveler Registration
import TravelerRegister from "./pages/TravelerRegister";

// Traveler Orders
import TravelerOrders from "@/pages/traveler/Orders";

// Order Pages
import NewOrder from "./pages/order/NewOrder";
import OrderDetail from "./pages/order/OrderDetail";
import OrderTracking from "./pages/order/OrderTracking";
import OrderCancelled from "./pages/order/OrderCancelled";
import CustomerHistory from "./pages/dashboard/CustomerHistory";
import OrderPayment from "./pages/order/OrderPayment";
import CustomerRejected from "./pages/dashboard/CustomerRejected";

// Dashboard
import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
import TravelerDashboard from "./pages/dashboard/TravelerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

// Traveler Pages
import NewTrip from "./pages/traveler/NewTrip";
import TripManage from "./pages/traveler/TripManage";
import TravelerWallet from "./pages/traveler/Wallet";
import TravelerTrip from "./pages/traveler/TravelerTrip";
import DetailManage from "@/pages/traveler/DetailManage";
import TarikSaldo from "./pages/traveler/TarikSaldo";
import RiwayatSaldo from "./pages/traveler/RiwayatSaldo";
import PaymentBoost from "./pages/traveler/PaymentBoost";

// Admin Pages
import AdminUsers from "./pages/admin/Users";
import AdminUserTraveler from "./pages/admin/UserTraveler";
import AdminTransactions from "./pages/admin/Transactions";
import AdminRoutes from "./pages/admin/Routes";
import AdminDisputes from "./pages/admin/Disputes";
import AdminSettings from "./pages/admin/Settings";
import AdminWallet from "./pages/admin/AdminWallet";
import AdminRating from "./pages/admin/Rating"
import AdminBoosters from "./pages/admin/Boosters";
import AdminIklan from "./pages/admin/Iklan";

// Profile Pages
import CustomerProfile from "./pages/profile/CustomerProfile";
import TravelerProfile from "./pages/profile/TravelerProfile";
import AdminProfile from "./pages/profile/AdminProfile";

// Notification Pages
import CustomerNotifications from "./pages/notifications/CustomerNotifications";
import TravelerNotifications from "./pages/notifications/TravelerNotifications";
import AdminNotifications from "./pages/notifications/AdminNotifications";

// Settings Pages
import CustomerSettings from "./pages/settings/CustomerSettings";
import TravelerSettings from "./pages/settings/TravelerSettings";

// Order Aktif
import CustomerOrders from "@/pages/dashboard/CustomerOrders";

// Live Chat
import LiveChat from "./pages/LiveChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <OrderProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/cara-kerja" element={<HowItWorks />} />
          <Route path="/perjalanan" element={<Trips />} />
          <Route path="/perjalanan/:id" element={<TripDetail />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/kontak" element={<Contact />} />
          <Route path="/daftar-traveler" element={<TravelerRegister />} />
          
          {/* Legal Pages */}
          <Route path="/syarat-ketentuan" element={<Terms />} />
          <Route path="/privasi" element={<Privacy />} />
          <Route path="/social/:platform" element={<SocialPlaceholder />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Traveler Orders */}
          <Route path="/traveler/orders" element={<TravelerOrders />} />
          
          {/* Order Routes */}
          <Route path="/order/new" element={<NewOrder />} />
          <Route path="/order/:id" element={<OrderDetail />} />
          <Route path="/order/:id/tracking" element={<OrderTracking />} />
          <Route path="/tracking/:id" element={<OrderTracking />} />
          <Route path="/order/:orderId/cancelled" element={<OrderCancelled />} />
          <Route path="/order/:id/payment" element={<OrderPayment />} />

          
          {/* Customer Dashboard */}
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/history" element={<CustomerHistory />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/notifications" element={<CustomerNotifications />} />
          <Route path="/settings" element={<CustomerSettings />} />
          <Route path="/chat-traveler/:orderId" element={<ChatTraveler />} />
          <Route path="/orders" element={<CustomerOrders />} />
          <Route path="/order/:orderId/rejected" element={<CustomerRejected />} />
          <Route path="/help" element={<CustomerHelp />} />


          {/* Traveler Dashboard */}
          <Route path="/traveler" element={<TravelerDashboard />} />
          <Route path="/traveler/trip/new" element={<NewTrip />} />
          <Route path="/traveler/trip" element={<TravelerTrip />} />
          <Route path="/traveler/trip/:id/manage" element={<TripManage />} />
          <Route path="/traveler/wallet" element={<TravelerWallet />} />
          <Route path="/traveler/profile" element={<TravelerProfile />} />
          <Route path="/traveler/notifications" element={<TravelerNotifications />} />
          <Route path="/traveler/settings" element={<TravelerSettings />} />
          <Route path="/traveler/order/:id" element={<DetailManage />} />
          <Route path="/traveler/tariksaldo" element={<TarikSaldo />} />
          <Route path="/traveler/riwayatsaldo" element={<RiwayatSaldo />} />
          <Route path="/traveler/boost/payment" element={<PaymentBoost />} />
          
          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/usertraveler" element={<AdminUserTraveler />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/routes" element={<AdminRoutes />} />
          <Route path="/admin/disputes" element={<AdminDisputes />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/wallet" element={<AdminWallet />} />
          <Route path="/admin/rating" element={<AdminRating />} />
          <Route path="/admin/boosters" element={<AdminBoosters />} />
          <Route path="/admin/iklan" element={<AdminIklan />} />
          
          {/* Live Chat */}
          <Route path="/live-chat" element={<LiveChat />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </OrderProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
