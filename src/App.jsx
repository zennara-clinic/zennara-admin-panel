import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MinimalDashboard from './components/Dashboard';
import SimpleDashboard from './components/SimpleDashboard';
import Bookings from './pages/Bookings';
import BookingDetails from './pages/BookingDetails';
import BookingSlip from './pages/BookingSlip';
import PendingConfirmations from './pages/PendingConfirmations';
import TodaySchedule from './pages/TodaySchedule';
import PatientForms from './components/PatientForms';
import AllPatients from './components/AllPatients';
import PatientFormView from './components/PatientFormView';
import FormSettings from './components/FormSettings';
import MedicalRecords from './components/MedicalRecords';
import PatientRecordDetail from './components/PatientRecordDetail';
import PatientDetail from './pages/PatientDetail';
import EditPatient from './pages/EditPatient';
import DoctorManagement from './components/DoctorManagement';
import DoctorSchedule from './components/DoctorSchedule';
import DoctorScheduleManagement from './components/DoctorScheduleManagement';
import ConsultationServices from './components/ConsultationServices';
import AddEditService from './components/AddEditService';
import EditConsultation from './pages/EditConsultation';
import AddConsultation from './pages/AddConsultation';
import CategoriesManagement from './pages/CategoriesManagement';
import Packages from './components/Packages';
import CreatePackage from './pages/CreatePackage';
import EditPackage from './pages/EditPackage';
import AssignedPackages from './pages/AssignedPackages';
import AssignPackageForm from './pages/AssignPackageForm';
import AssignmentDetails from './pages/AssignmentDetails';
import PackageProgress from './pages/PackageProgress';
import MediaUploads from './pages/MediaUploads';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Brands from './pages/Brands';
import Formulations from './pages/Formulations';
import Coupons from './pages/Coupons';
import Inventory from './components/Inventory';
import PurchaseOrders from './components/PurchaseOrders';
import PatientOrders from './components/PatientOrders';
import OrderManagement from './components/OrderManagement';
import Locations from './components/Locations';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import ComingSoon from './pages/ComingSoon';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import PendingOrders from './pages/PendingOrders';
import Invoices from './pages/Invoices';
import CancelledOrders from './pages/CancelledOrders';
import ReturnedOrders from './pages/ReturnedOrders';
import Vendors from './pages/Vendors';
import InventoryManagement from './pages/InventoryManagement';
import AddInventory from './pages/AddInventory';
import EditInventory from './pages/EditInventory';
import FinancialRevenue from './pages/analytics/FinancialRevenue';
import PatientCustomerAnalytics from './pages/analytics/PatientCustomerAnalytics';
import AppointmentAnalytics from './pages/analytics/AppointmentAnalytics';
import ServiceAnalytics from './pages/analytics/ServiceAnalytics';
import InventoryAnalytics from './pages/analytics/InventoryAnalytics';
import Notifications from './pages/Notifications';
import AppCustomization from './pages/appui/AppCustomization';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route - Login */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Routes - All Admin Panel Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-zennara-white via-zennara-pastel-blue/20 to-zennara-pastel-green/20">
              <div className="flex">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-72">
                  <Header />
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                    <Route path="/" element={<SimpleDashboard />} />
                    <Route path="/dashboard/minimal" element={<MinimalDashboard />} />
                    <Route path="/dashboard/old" element={<Dashboard />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/bookings/pending" element={<PendingConfirmations />} />
                    <Route path="/bookings/today" element={<TodaySchedule />} />
                    <Route path="/bookings/:id" element={<BookingDetails />} />
                    <Route path="/bookings/:id/slip" element={<BookingSlip />} />
                    <Route path="/patients/all" element={<AllPatients />} />
                    <Route path="/patients/forms" element={<PatientForms />} />
                    <Route path="/patients/forms/:id/view" element={<PatientFormView />} />
                    <Route path="/patients/forms/settings" element={<FormSettings />} />
                    <Route path="/patients/records" element={<MedicalRecords />} />
                    <Route path="/patients/records/:id" element={<PatientDetail />} />
                    <Route path="/patients/edit/:id" element={<EditPatient />} />
                    <Route path="/doctors" element={<DoctorManagement />} />
                    <Route path="/doctors/schedules" element={<DoctorScheduleManagement />} />
                    <Route path="/doctors/:id/schedule" element={<DoctorSchedule />} />
                    <Route path="/consultations/services" element={<ConsultationServices />} />
                    <Route path="/consultations/add" element={<AddConsultation />} />
                    <Route path="/consultations/edit/:id" element={<EditConsultation />} />
                    <Route path="/consultations/categories" element={<CategoriesManagement />} />
                    <Route path="/consultations/packages" element={<Packages />} />
                    <Route path="/consultations/packages/add" element={<CreatePackage />} />
                    <Route path="/consultations/packages/edit/:id" element={<EditPackage />} />
                    <Route path="/consultations/assign-packages" element={<AssignedPackages />} />
                    <Route path="/consultations/assign-packages/new" element={<AssignPackageForm />} />
                    <Route path="/consultations/assign-packages/:id" element={<AssignmentDetails />} />
                    <Route path="/consultations/assign-packages/:id/progress" element={<PackageProgress />} />
                    <Route path="/media/uploads" element={<MediaUploads />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/add" element={<AddProduct />} />
                    <Route path="/products/edit/:id" element={<EditProduct />} />
                    <Route path="/products/brands" element={<Brands />} />
                    <Route path="/products/formulations" element={<Formulations />} />
                    <Route path="/products/coupons" element={<Coupons />} />
                    <Route path="/orders/pending" element={<PendingOrders />} />
                    <Route path="/orders/cancelled" element={<CancelledOrders />} />
                    <Route path="/orders/returned" element={<ReturnedOrders />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/brands" element={<Brands />} />
                    <Route path="/formulations" element={<Formulations />} />
                    <Route path="/coupons" element={<Coupons />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/inventory" element={<InventoryManagement />} />
                    <Route path="/inventory/add" element={<AddInventory />} />
                    <Route path="/inventory/edit/:id" element={<EditInventory />} />
                    <Route path="/inventory/vendors" element={<Vendors />} />
                    <Route path="/communications" element={<ComingSoon />} />
                    <Route path="/reviews" element={<ComingSoon />} />
                    <Route path="/analytics" element={<ComingSoon />} />
                    <Route path="/analytics/financial" element={<FinancialRevenue />} />
                    <Route path="/analytics/patients" element={<PatientCustomerAnalytics />} />
                    <Route path="/analytics/appointments" element={<AppointmentAnalytics />} />
                    <Route path="/analytics/services" element={<ServiceAnalytics />} />
                    <Route path="/analytics/inventory" element={<InventoryAnalytics />} />
                    <Route path="/analytics/orders" element={<ComingSoon />} />
                    <Route path="/analytics/packages" element={<ComingSoon />} />
                    <Route path="/analytics/payments" element={<ComingSoon />} />
                    <Route path="/analytics/engagement" element={<ComingSoon />} />
                    <Route path="/analytics/trends" element={<ComingSoon />} />
                    <Route path="/analytics/goals" element={<ComingSoon />} />
                    <Route path="/analytics/locations" element={<ComingSoon />} />
                    <Route path="/analytics/rankings" element={<ComingSoon />} />
                    <Route path="/analytics/summary" element={<ComingSoon />} />
                    <Route path="/locations" element={<Locations />} />
                    <Route path="/locations/branches" element={<Locations />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/app/customization" element={<AppCustomization />} />
                  </Routes>
                  </main>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
