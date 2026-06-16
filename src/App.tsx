import React, { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DesignSystem } from './pages/DesignSystem'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { WindowPDPPage } from './pages/WindowPDPPage'
import { DoorCategoryPage } from './pages/DoorCategoryPage'
import { CompositeDoorPLPPage } from './pages/CompositeDoorPLPPage'
import { UPVCDoorPLPPage } from './pages/UPVCDoorPLPPage'
import { DoorPLPPage } from './pages/DoorPLPPage'
import { DoorPDPPage } from './pages/DoorPDPPage'
import { QuickQuotePage } from './pages/QuickQuotePage'
import { BasketPage } from './pages/BasketPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { PricingPromisePage } from './pages/PricingPromisePage'
import { AboutPage } from './pages/AboutPage'
import { ServiceAreaPage } from './pages/ServiceAreaPage'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { ContactPage } from './pages/ContactPage'
import { LoginPage } from './pages/LoginPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { TermsOfUsePage } from './pages/TermsOfUsePage'
import { PricingDebugPage } from './pages/PricingDebugPage'
import { InstallerPricingTool } from './pages/InstallerPricingTool'
import { PricingAdminPage } from './pages/PricingAdminPage'
import { NotFoundPage } from './pages/NotFoundPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const isDev =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:category" element={<ShopPage />} />
        <Route path="/windows/casement-windows" element={<WindowPDPPage />} />
        <Route path="/windows/:slug" element={<ProductDetailPage />} />
        <Route path="/doors" element={<DoorCategoryPage />} />
        <Route path="/doors/composite" element={<CompositeDoorPLPPage />} />
        <Route path="/doors/upvc" element={<UPVCDoorPLPPage />} />
        {/* Legacy product-type slugs from products[] array */}
        <Route path="/doors/composite-doors" element={<ProductDetailPage />} />
        <Route path="/doors/upvc-doors" element={<ProductDetailPage />} />
        <Route path="/doors/french-doors" element={<ProductDetailPage />} />
        <Route path="/doors/patio-doors" element={<ProductDetailPage />} />
        <Route path="/doors/:slug" element={<DoorPDPPage />} />
        <Route path="/quick-quote" element={<QuickQuotePage />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/pricing-promise" element={<PricingPromisePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/service-area" element={<ServiceAreaPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/design-system" element={<DesignSystem />} />
        {/* DEV ONLY — gated by hostname */}
        <Route path="/pricing-debug" element={isDev ? <PricingDebugPage /> : <Navigate to="/" replace />} />
        <Route path="/pricing-admin" element={isDev ? <PricingAdminPage /> : <Navigate to="/" replace />} />
        <Route path="/installer" element={<InstallerPricingTool />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
