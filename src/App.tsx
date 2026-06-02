import React, { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DesignSystem } from './pages/DesignSystem'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
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

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* ── Public routes ────────────────────────────────────────── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:category" element={<ShopPage />} />
          <Route path="/windows/:slug" element={<ProductDetailPage />} />
          <Route path="/doors/:slug" element={<ProductDetailPage />} />
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfUsePage />} />

          {/* ── Protected: admin + super_admin ───────────────────────── */}
          <Route
            path="/pricing-debug"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <PricingDebugPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing-admin"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <PricingAdminPage />
              </ProtectedRoute>
            }
          />

          {/* ── Protected: all internal roles ────────────────────────── */}
          <Route
            path="/installer"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'installer']}>
                <InstallerPricingTool />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
