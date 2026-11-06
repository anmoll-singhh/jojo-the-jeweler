import { useEffect, useRef, useState } from 'react'

/**
 * A reading drawn onto the LCD in a photograph: seven-segment digits (DSEG7) with the faint unlit
 * segments a real display shows, warped into the photo's perspective with a matrix3d computed from the
 * display's four corners (given in the photo's own pixel coordinates).
 */
type Pt = [number, number]
const W = 400, H = 100 // the readout's own box before it is warped

function homography(src: Pt[], dst: Pt[]) {
  // solve the 8 unknowns of the projective map src -> dst (Gaussian elimination)
  const A: number[][] = []
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = dst[i]
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u])
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v])
  }
  for (let c = 0; c < 8; c++) {
    let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r
    ;[A[c], A[p]] = [A[p], A[c]]
    for (let r = 0; r < 8; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k < 9; k++) A[r][k] -= f * A[c][k] }
  }
  const h = A.map((row, i) => row[8] / row[i])
  const [a, b, c, d, e, f, g, k] = h
  return `matrix3d(${a},${d},0,${g},${b},${e},0,${k},0,0,1,0,${c},${f},0,1)`
}

export function Lcd({ value, quad, size, unit = 'g' }: { value: number; quad: Pt[]; size: number; unit?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [m, setM] = useState('')
  useEffect(() => {
    const host = ref.current?.parentElement; if (!host) return
    const fit = () => { const s = host.clientWidth / size; setM(homography([[0, 0], [W, 0], [W, H], [0, H]], quad.map(([x, y]) => [x * s, y * s]))) }
    fit(); const ro = new ResizeObserver(fit); ro.observe(host); return () => ro.disconnect()
  }, [quad, size])
  const txt = value.toFixed(1).padStart(5, '!')
  return (
    <div ref={ref} className="lcd" style={{ width: W, height: H, transform: m }} aria-hidden="true">
      <span className="lcd__ghost">888.8</span>
      <span className="lcd__val">{txt}</span>
      <span className="lcd__unit">{unit}</span>
    </div>
  )
}
