import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './lib/store'
import { DesignProvider, CONTROLLER_ENABLED } from './lib/design'
import { useImageSkeletons, useMagnetic, useRouteMotion, useSmoothScroll } from './lib/motion'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { DesignController } from './components/DesignController'
import HomeV1 from './pages/HomeV1'
import { Collection } from './pages/Collection'
import { ProductPage } from './pages/Product'
import { SearchPage, Cart, Wishlist, NotFound } from './pages/Pages'
import { About } from './pages/About'
import { Custom } from './pages/Custom'
import { Contact } from './pages/Contact'

const HomeV2 = lazy(() => import('./pages/HomeV2'))

function Shell() {
  const { pathname } = useLocation()
  useSmoothScroll(); useRouteMotion(); useMagnetic(); useImageSkeletons()
  const over = pathname === '/' || pathname === '/v2' || pathname === '/about'
  return (
    <>
      <Nav key={pathname} over={over} />
      <Routes>
        <Route path="/" element={<HomeV1 />} />
        <Route path="/v2" element={<Suspense fallback={<main id="main" className="page" />}><HomeV2 /></Suspense>} />
        <Route path="/collections/:handle" element={<Collection />} />
        <Route path="/collections" element={<Collection />} />
        <Route path="/products/:handle" element={<ProductPage />} />
        <Route path="/custom" element={<Custom />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      {CONTROLLER_ENABLED && <DesignController />}
    </>
  )
}

export default function App() {
  return <DesignProvider><CartProvider><Shell /></CartProvider></DesignProvider>
}
