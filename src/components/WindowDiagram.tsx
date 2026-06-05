export interface WindowDiagramProps {
  variant: 'fixed' | 'single-right' | 'two-both' | 'three-all'
  frameColour?: string
  glazingStyle?: 'clear' | 'frosted'
  glazingBarStyle?: 'none' | 'georgian' | 'vertical' | 'diamond_lead' | 'square_lead'
  width?: number
  height?: number
}

export function WindowDiagram({
  variant,
  frameColour = '#E8E8E8',
  glazingStyle = 'clear',
  glazingBarStyle = 'none',
  width = 200,
  height = 220,
}: WindowDiagramProps) {
  const fw = 12
  const W = width
  const H = height

  const gx = fw
  const gy = fw
  const gw = W - fw * 2
  const gh = H - fw * 2

  const glassOpacity = glazingStyle === 'frosted' ? 0.5 : 1
  const isOpener = variant !== 'fixed'

  // Arc radius for opener indicator
  const r = Math.min(gw, gh) * 0.38

  // Georgian / square_lead bar stroke colour (slightly darker than frame)
  const barColour = frameColour === '#ffffff' || frameColour === '#FFFFFF' ? '#cccccc' : frameColour

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Window diagram preview"
    >
      {/* Frame */}
      <rect x={0} y={0} width={W} height={H} fill={frameColour} rx={3} />

      {/* Glass pane */}
      <rect
        x={gx}
        y={gy}
        width={gw}
        height={gh}
        fill="#C9DFF0"
        opacity={glassOpacity}
        rx={1}
      />

      {/* Glazing bars */}
      {(glazingBarStyle === 'georgian' || glazingBarStyle === 'square_lead') && (
        <>
          <line
            x1={gx} y1={gy + gh / 2}
            x2={gx + gw} y2={gy + gh / 2}
            stroke={barColour} strokeWidth={3}
          />
          <line
            x1={gx + gw / 2} y1={gy}
            x2={gx + gw / 2} y2={gy + gh}
            stroke={barColour} strokeWidth={3}
          />
        </>
      )}

      {glazingBarStyle === 'vertical' && (
        <line
          x1={gx + gw / 2} y1={gy}
          x2={gx + gw / 2} y2={gy + gh}
          stroke={barColour} strokeWidth={3}
        />
      )}

      {(glazingBarStyle === 'diamond_lead') && (
        <>
          {/* Diagonal cross for diamond lead placeholder */}
          <line
            x1={gx} y1={gy}
            x2={gx + gw} y2={gy + gh}
            stroke={barColour} strokeWidth={1.5} opacity={0.5}
          />
          <line
            x1={gx + gw} y1={gy}
            x2={gx} y2={gy + gh}
            stroke={barColour} strokeWidth={1.5} opacity={0.5}
          />
        </>
      )}

      {/* Opener indicator: dashed quarter-circle arc in bottom-right of glass */}
      {isOpener && (
        <path
          d={`M ${gx + gw - r} ${gy + gh} A ${r} ${r} 0 0 1 ${gx + gw} ${gy + gh - r}`}
          fill="none"
          stroke="#64748b"
          strokeWidth={1.5}
          strokeDasharray="5 3"
          opacity={0.75}
        />
      )}
    </svg>
  )
}
