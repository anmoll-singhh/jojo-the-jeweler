import { Component, type ReactNode } from 'react'

/** Catches a render error in one part of the page so the rest still works. */
export class Boundary extends Component<{ children: ReactNode; fallback?: ReactNode; resetKey?: string }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  componentDidUpdate(p: { resetKey?: string }) { if (p.resetKey !== this.props.resetKey && this.state.err) this.setState({ err: false }) }
  componentDidCatch(e: unknown) { console.error(e) }
  render() { return this.state.err ? this.props.fallback ?? null : this.props.children }
}
