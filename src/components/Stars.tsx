import { Star, StarHalf } from '@phosphor-icons/react'

/** Five stars for a 0–5 value (half steps). Decorative: the number beside it carries the meaning. */
export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="stars" aria-label={`${value.toFixed(1)} out of 5`} role="img">
      {[0, 1, 2, 3, 4].map((i) => { const d = value - i; return d >= 0.75 ? <Star key={i} size={size} weight="fill" /> : d >= 0.25 ? <StarHalf key={i} size={size} weight="fill" /> : <Star key={i} size={size} weight="regular" /> })}
    </span>
  )
}
