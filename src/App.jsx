import { Routes, Route } from 'react-router-dom'
import { TranslationProvider } from './i18n/TranslationProvider'
import Home from './components/Home/Home'
import StockManagement from './components/Home/StockManagement/StockManagement'
import Sale from './components/Modules/Sale'
import SaleRecord from './components/Modules/SaleRecord'
import Promotion from './components/Modules/Promotion'
import Reports from './components/Modules/Reports'
import Billing from './components/Modules/Billing'
import Income from './components/Modules/Income'
import Outcome from './components/Modules/Outcome'
import ManagePatient from './components/Modules/ManagePatient'
import ManageProduct from './components/Modules/ManageProduct'
import ManageSupplier from './components/Modules/ManageSupplier'
import ManageStaff from './components/Modules/ManageStaff'
import ManagePurchase from './components/Modules/ManagePurchase'
import ManageOrder from './components/Modules/ManageOrder'
import CurrencyManagement from './components/Modules/CurrencyManagement'
import Setup from './components/Modules/Setup'

export default function App() {
  return (
    <TranslationProvider>
      <div className="min-h-screen bg-[#f2f2f7]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock/*" element={<StockManagement />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/sale-record" element={<SaleRecord />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/income" element={<Income />} />
          <Route path="/outcome" element={<Outcome />} />
          <Route path="/patient" element={<ManagePatient />} />
          <Route path="/product" element={<ManageProduct />} />
          <Route path="/supplier" element={<ManageSupplier />} />
          <Route path="/staff" element={<ManageStaff />} />
          <Route path="/purchase" element={<ManagePurchase />} />
          <Route path="/order" element={<ManageOrder />} />
          <Route path="/currency" element={<CurrencyManagement />} />
          <Route path="/setup" element={<Setup />} />
        </Routes>
      </div>
    </TranslationProvider>
  )
}
