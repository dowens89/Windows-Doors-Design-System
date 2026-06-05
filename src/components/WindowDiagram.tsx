import React, { useId } from 'react'

export interface WindowDiagramProps {
  variant: 'fixed' | 'single-right' | 'two-both' | 'three-all'
  frameColour?: string
  glazingStyle?: 'clear' | 'frosted'
  glazingBarStyle?: 'none' | 'georgian' | 'vertical' | 'diamond_lead' | 'square_lead'
  width?: number
  height?: number
}

type OpenerDir = 'left' | 'right' | false

interface Light {
  x: number
  y: number
  w: number
  h: number
  opener: OpenerDir
}

export function WindowDiagram({
  variant,
  frameColour = '#E8E8E8',
  glazingStyle = 'clear',
  glazingBarStyle = 'none',
  width = 200,
  height = 220,
}: WindowDiagramProps) {
  const uid = useId()
  const W = width
  const H = height
  // Scale frame/mullion width proportionally so small diagrams remain legible
  const fw = Math.max(3, Math.round(W / 17))
  const mw = fw

  const gx = fw
  const gy = fw
  const gw = W - fw * 2
  const gh = H - fw * 2

  const glassOpacity = glazingStyle === 'frosted' ? 0.5 : 1
  const barColour =
    frameColour === '#ffffff' || frameColour === '#FFFFFF' ? '#cccccc' : frameColour

  // ─── Lights and mullion positions ─────────────────────────────────────────
  let lights: Light[] = []
  let mullionXs: number[] = []

  if (variant === 'fixed') {
    lights = [{ x: gx, y: gy, w: gw, h: gh, opener: false }]
  } else if (variant === 'single-right') {
    // left fixed (60%) | right opener (40%)
    const splitX = gx + Math.round(gw * 0.6)
    const leftW = splitX - gx - Math.round(mw / 2)
    const rightX = splitX + Math.ceil(mw / 2)
    mullionXs = [splitX - Math.round(mw / 2)]
    lights = [
      { x: gx, y: gy, w: leftW, h: gh, opener: false },
      { x: rightX, y: gy, w: gx + gw - rightX, h: gh, opener: 'right' },
    ]
  } else {
    // two-both: opener | fixed | opener (3 lights, 2 mullions)
    // three-all: opener | opener | opener (3 lights, 2 mullions)
    const totalLightW = gw - 2 * mw
    const lw = Math.floor(totalLightW / 3)
    const m1x = gx + lw
    const l1x = m1x + mw
    const m2x = l1x + lw
    const l2x = m2x + mw
    mullionXs = [m1x, m2x]
    lights =
      variant === 'two-both'
        ? [
            { x: gx, y: gy, w: lw, h: gh, opener: 'left' },
            { x: l1x, y: gy, w: lw, h: gh, opener: false },
            { x: l2x, y: gy, w: gx + gw - l2x, h: gh, opener: 'right' },
          ]
        : [
            { x: gx, y: gy, w: lw, h: gh, opener: 'left' },
            { x: l1x, y: gy, w: lw, h: gh, opener: 'right' },
            { x: l2x, y: gy, w: gx + gw - l2x, h: gh, opener: 'right' },
          ]
  }

  // ─── Red triangle opener indicator ────────────────────────────────────────
  function renderTriangle(l: Light) {
    if (!l.opener) return null
    const { x, y, w, h } = l
    // Peak points toward hinge side
    const pts =
      l.opener === 'right'
        ? `${x},${y} ${x + w},${y + h / 2} ${x},${y + h}`
        : `${x + w},${y} ${x},${y + h / 2} ${x + w},${y + h}`
    return (
      <polygon
        points={pts}
        fill="none"
        stroke="#DC2626"
        strokeWidth={Math.max(1, W / 110)}
        strokeLinejoin="round"
      />
    )
  }

  // ─── Glazing bars ─────────────────────────────────────────────────────────
  function renderBars(l: Light, idx: number) {
    if (glazingBarStyle === 'none') return null
    const { x, y, w, h } = l
    const bw = Math.max(1, W / 90)
    const key = `${uid}${idx}`

    if (glazingBarStyle === 'vertical') {
      return (
        <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={barColour} strokeWidth={bw} />
      )
    }

    if (glazingBarStyle === 'georgian') {
      // 6 panes: 1 vertical bar + 2 horizontal bars (splits into 2 cols × 3 rows)
      return (
        <>
          <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={barColour} strokeWidth={bw} />
          <line x1={x} y1={y + h / 3} x2={x + w} y2={y + h / 3} stroke={barColour} strokeWidth={bw} />
          <line x1={x} y1={y + (2 * h) / 3} x2={x + w} y2={y + (2 * h) / 3} stroke={barColour} strokeWidth={bw} />
        </>
      )
    }

    if (glazingBarStyle === 'square_lead') {
      // 9 panes: 2 vertical + 2 horizontal bars (3 cols × 3 rows)
      return (
        <>
          <line x1={x + w / 3} y1={y} x2={x + w / 3} y2={y + h} stroke={barColour} strokeWidth={bw} />
          <line x1={x + (2 * w) / 3} y1={y} x2={x + (2 * w) / 3} y2={y + h} stroke={barColour} strokeWidth={bw} />
          <line x1={x} y1={y + h / 3} x2={x + w} y2={y + h / 3} stroke={barColour} strokeWidth={bw} />
          <line x1={x} y1={y + (2 * h) / 3} x2={x + w} y2={y + (2 * h) / 3} stroke={barColour} strokeWidth={bw} />
        </>
      )
    }

    if (glazingBarStyle === 'diamond_lead') {
      // Repeating small diamond grid via two sets of diagonal lines, clipped to light bounds
      const step = Math.max(5, Math.min(w, h) / 4)
      const lines: React.ReactElement[] = []

      // NW-SE diagonals (slope +1)
      for (let d = -h; d < w; d += step) {
        let x1 = x + d, y1 = y, x2 = x + d + h, y2 = y + h
        if (x1 < x) { y1 += x - x1; x1 = x }
        if (x2 > x + w) { y2 -= x2 - (x + w); x2 = x + w }
        if (x2 <= x1) continue
        lines.push(
          <line key={`${key}a${d}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={barColour} strokeWidth={0.8} opacity={0.65} />
        )
      }

      // NE-SW diagonals (slope -1)
      for (let d = 0; d < w + h; d += step) {
        let x1 = x + d, y1 = y, x2 = x + d - h, y2 = y + h
        if (x1 > x + w) { y1 += x1 - (x + w); x1 = x + w }
        if (x2 < x) { y2 -= x - x2; x2 = x }
        if (x1 <= x2) continue
        lines.push(
          <line key={`${key}b${d}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={barColour} strokeWidth={0.8} opacity={0.65} />
        )
      }

      return <>{lines}</>
    }

    return null
  }

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Window diagram preview"
    >
      {/* Outer frame */}
      <rect x={0} y={0} width={W} height={H} fill={frameColour} rx={3} />

      {/* Glass panes */}
      {lights.map((l, i) => (
        <rect key={i} x={l.x} y={l.y} width={l.w} height={l.h}
          fill="#C9DFF0" opacity={glassOpacity} rx={1} />
      ))}

      {/* Glazing bars (drawn before mullions so mullions cover overhang) */}
      {lights.map((l, i) => <g key={i}>{renderBars(l, i)}</g>)}

      {/* Vertical mullions on top of glass */}
      {mullionXs.map((mx, i) => (
        <rect key={i} x={mx} y={gy} width={mw} height={gh} fill={frameColour} />
      ))}

      {/* Red opener triangles on top of everything */}
      {lights.map((l, i) => <g key={i}>{renderTriangle(l)}</g>)}
    </svg>
  )
}
