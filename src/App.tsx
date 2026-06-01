import React, { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
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
      <ScrollToTop />
      <Routes>
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
