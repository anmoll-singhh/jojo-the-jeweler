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
import { Checkout } from './pages/Checkout'
import { Clients } from './pages/Clients'
import { Boundary } from './components/Boundary'
import { useRadioKeys } from './lib/a11y'
import { useFormatFallback } from './lib/formats'
import { Link } from 'react-router-dom'

const HomeV2 = lazy(() => import('./pages/HomeV2'))
const Lab = lazy(() => import('./pages/Lab').then((m) => ({ default: m.Lab })))

function Shell() {
  const { pathname } = useLocation()
  useSmoothScroll(); useRouteMotion(); useMagnetic(); useImageSkeletons(); useRadioKeys(); useFormatFallback()
  const over = ['/', '/v2', '/film', '/about', '/clients'].includes(pathname)
  return (
    <>
      <Nav key={pathname} over={over} />
      <Boundary resetKey={pathname} fallback={<main id="main" className="page nf wrap"><h1 className="h1">Something went wrong</h1><p className="lede">This page didn’t load. Try again, or text JoJo.</p><div className="nf__acts"><button className="btn" onClick={() => location.reload()}>Reload</button><Link className="link" to="/">Home</Link></div></main>}>
      <Routes>
        <Route path="/" element={<HomeV1 />} />
        <Route path="/v2" element={<HomeV1 gate />} />
        <Route path="/film" element={<Suspense fallback={<main id="main" className="page" />}><HomeV2 /></Suspense>} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/collections/:handle" element={<Collection />} />
        <Route path="/collections" element={<Collection />} />
        <Route path="/products/:handle" element={<ProductPage />} />
        <Route path="/custom" element={<Custom />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/lab" element={<Suspense fallback={<main id="main" className="page" />}><Lab /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Boundary>
      <Footer />
      {CONTROLLER_ENABLED && <DesignController />}
    </>
  )
}

export default function App() {
  return <DesignProvider><CartProvider><Shell /></CartProvider></DesignProvider>
}
