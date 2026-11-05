import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * Procedural Miami Cuban link, built in three.js (no model file needed): flattened links,
 * alternately rotated, laid along a hanging curve. Drag to turn it, pinch or wheel does nothing
 * (native scroll stays native). Metal switches through the `metal` prop. Lazy-loaded by V2 only.
 */
export type Metal = 'yellow' | 'white' | 'rose'
const COLORS: Record<Metal, number> = { yellow: 0xd9b25c, white: 0xd8dadd, rose: 0xd9a38a }

export function Chain3D({ metal = 'yellow', width = 12, className = '', drop = false }: { metal?: Metal; width?: number; className?: string; drop?: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const matRef = useRef<THREE.MeshStandardMaterial | null>(null)
  const groupRef = useRef<THREE.Group | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const el = host.current!
    // no WebGL (old device, blocked GPU, privacy mode): show the photograph instead
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }) } catch { setFailed(true); return }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05
    el.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100); cam.position.set(0, 0.2, 12.5)
    const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 5, 4); scene.add(key)
    const rim = new THREE.DirectionalLight(0xfff1d6, 0.8); rim.position.set(-4, -2, -3); scene.add(rim)
    const mat = new THREE.MeshStandardMaterial({ color: COLORS[metal], metalness: 1, roughness: 0.18, envMapIntensity: 1.4 })
    matRef.current = mat
    const group = new THREE.Group(); groupRef.current = group; scene.add(group)
    // one link: a torus squashed in Y (Cuban links are flat ovals), stretched in X
    const link = new THREE.TorusGeometry(0.42, 0.14, 24, 64); link.scale(1.35, 1, 0.55)
    const N = 26
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-4.2, 1.6, 0), new THREE.Vector3(-2.4, 0.2, 0), new THREE.Vector3(0, -0.6, 0), new THREE.Vector3(2.4, 0.2, 0), new THREE.Vector3(4.2, 1.6, 0)])
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1)
      const m = new THREE.Mesh(link, mat)
      m.position.copy(curve.getPointAt(t))
      const tan = curve.getTangentAt(t)
      m.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tan)
      m.rotateX(i % 2 ? Math.PI / 2 : 0)
      m.rotateY(0)
      group.add(m)
    }
    group.rotation.x = 0.35
    // drop: the chain falls in from above and swings to rest (damped spring on y, pendulum on z)
    let y = drop ? 9 : 0, vy = 0, swing = drop ? 0.5 : 0, vs = 0
    group.position.y = y
    let rotY = 0, vel = 0.003, drag = false, lastX = 0
    const size = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.position.z = cam.aspect < 1.2 ? 12.5 * (1.2 / cam.aspect) : 12.5; cam.updateProjectionMatrix() }
    size(); const ro = new ResizeObserver(size); ro.observe(el)
    const down = (e: PointerEvent) => { drag = true; lastX = e.clientX; el.setPointerCapture(e.pointerId) }
    const move = (e: PointerEvent) => { if (!drag) return; vel = (e.clientX - lastX) * 0.004; rotY += vel; lastX = e.clientX }
    const up = () => { drag = false }
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up)
    let raf = 0, visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(el)
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible) return
      if (!drag) { vel += (0.003 - vel) * 0.03; if (!reduced) rotY += vel }
      group.rotation.y = rotY
      if (drop) { vy += (-y * 0.045) - vy * 0.12; y += vy; vs += (-swing * 0.03) - vs * 0.04; swing += vs + (drag ? vel * 0.15 : 0); group.position.y = y; group.rotation.z = swing }
      renderer.render(scene, cam)
    }
    loop()
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); renderer.dispose(); link.dispose(); mat.dispose(); pmrem.dispose(); el.removeChild(renderer.domElement) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => { matRef.current?.color.setHex(COLORS[metal]) }, [metal])
  useEffect(() => { groupRef.current?.scale.setScalar(0.6 + (width - 8) * 0.04) }, [width])
  if (failed) return <div className={'chain3d chain3d--still ' + className}><img src="/media/products/miami-cuban-link-chain-1-800.webp" alt="Miami Cuban link chain" /></div>
  return <div ref={host} className={'chain3d ' + className} role="img" aria-label="Miami Cuban link chain, drag to rotate" />
}
export default Chain3D
