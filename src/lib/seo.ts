import { useEffect } from 'react'
/** Page titles per route; the SPA has no server, so this is the <title> the person and the crawler see. */
export function useTitle(t: string) {
  useEffect(() => { document.title = t ? `${t} · JoJo The Jeweler` : 'JoJo The Jeweler — Custom jewelry and solid gold chains, New York Diamond District' }, [t])
}
