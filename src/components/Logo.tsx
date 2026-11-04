import { BRAND } from '../data/site'

/** Monogram (redrawn from the client's mark: a gem with a mirrored pair of Js) + wordmark. */
export function Logo({ mark = true, word = true, className = '' }: { mark?: boolean; word?: boolean; className?: string }) {
  return (
    <span className={'logo ' + className} aria-label={BRAND.name}>
      {mark && <Monogram />}
      {word && <span className="logo__word" aria-hidden="true"><b>JoJo</b> The Jeweler</span>}
    </span>
  )
}
export function Monogram({ size = 36 }: { size?: number }) {
  return (
    <svg className="logo__mark" width={size} height={size} viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 23H96L103 55L60 101L17 55Z" />
      <path d="M17 55H103" />
      <path d="M30 32H90" />
      <path d="M52 32V78Q52 86 44 86Q39 86 36 81" />
      <path d="M68 32V78Q68 86 76 86Q81 86 84 81" />
      <path d="M24 23L36 55M96 23L84 55M36 55L60 101M84 55L60 101" />
    </svg>
  )
}
