import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider, DesignProvider } from './store'
import { Nav, Footer, DesignController, Cursor } from './ui'
import { useSmoothScroll, useRouteMotion, useMagnetic, useImageSkeletons } from './motion'
import * as P from './pages'
import HomeV2 from './HomeV2'
import * as S from './services'

function Shell() {
  const loc = useLocation()
  useSmoothScroll(); useRouteMotion(); useMagnetic(); useImageSkeletons()
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      {/* Keyed on path: each route mounts fresh and plays a CSS fade that ENDS visible, so a
          missed animation can never leave a blank page. The curtain sweeps over the swap. */}
      <div className="curtain" key={'c' + loc.pathname} aria-hidden="true" />
      <div className="route" key={loc.pathname}>
        <Routes location={loc}>
          <Route path="/" element={<HomeV2 />} />
          {/* The previous homepage, kept for comparison: not linked anywhere and noindex. */}
          <Route path="/homepage-v1" element={<P.Home />} />
          <Route path="/homepage-v2" element={<Navigate to="/" replace />} />
          <Route path="/collections" element={<P.Collection />} />
          <Route path="/collections/:handle" element={<P.Collection />} />
          <Route path="/products/:handle" element={<P.ProductPage />} />
          <Route path="/build-your-ring" element={<S.RingBuilder />} />
          <Route path="/checkout" element={<P.Checkout />} />
          <Route path="/instant-quote" element={<S.InstantQuote />} />
          <Route path="/custom" element={<S.CustomJewellery />} />
          <Route path="/custom/pendant-builder" element={<Navigate to="/custom" replace />} />
          <Route path="/sell-gold" element={<S.SellGold />} />
          <Route path="/book-appointment" element={<P.Appointment />} />
          <Route path="/about" element={<P.About />} />
          <Route path="/faq" element={<P.Faq />} />
          <Route path="/contact" element={<P.Contact />} />
          <Route path="/wishlist" element={<P.Wishlist />} />
          <Route path="/pages/:slug" element={<P.Doc />} />
          <Route path="*" element={<P.NotFound />} />
        </Routes>
        <Footer />
      </div>
      <DesignController />
      <Cursor />
    </>
  )
}
export default function App() {
  return <DesignProvider><CartProvider><Shell /></CartProvider></DesignProvider>
}
