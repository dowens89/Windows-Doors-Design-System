import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  calculateWindowPrice,
  calculateDoorPrice,
  formatPrice,
  usePricingData,
} from '../pricing'
import type {
  WindowQuoteInput,
  WindowQuoteResult,
  DoorQuoteInput,
  DoorQuoteResult,
  WindowPricingData,
  DoorPricingData,
} from '../pricing'

// ─── Types ───────────────────────────────────────────────────────────────────

type LineType = 'window' | 'door'

interface WindowLine {
  id: string
  type: 'window'
  label: string
  input: WindowQuoteInput
  result: WindowQuoteResult
}

interface DoorLine {
  id: string
  type: 'door'
  label: string
  input: DoorQuoteInput
  result: DoorQuoteResult
}

type QuoteLine = WindowLine | DoorLine

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full bg-slate-800 border border-slate-700 text-slate-100 font-mono text-sm px-3 py-2 rounded focus:outline-none focus:border-sky-500 transition-colors'
const selectCls =
  'w-full bg-slate-800 border border-slate-700 text-slate-100 text-sm px-3 py-2 rounded focus:outline-none focus:border-sky-500 transition-colors'
const checkCls = 'accent-sky-500 w-4 h-4 rounded'
const btnPrimary =
  'px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900'
const btnGhost =
  'px-3 py-1.5 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-xs rounded transition-colors focus:outline-none'

// ─── Window Form ──────────────────────────────────────────────────────────────

function WindowForm({
  windowData,
  onAdd,
}: {
  windowData: WindowPricingData
  onAdd: (line: WindowLine) => void
}) {
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [openers, setOpeners] = useState('0')
  const [bayPoles, setBayPoles] = useState('0')
  const [colour, setColour] = useState<'white' | 'standard' | 'premium'>('white')
  const [midRail, setMidRail] = useState(false)
  const [leading, setLeading] = useState(false)
  const [georgianBar, setGeorgianBar] = useState(false)
  const [flushCasement, setFlushCasement] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleAdd() {
    setError(null)
    const w = parseFloat(width)
    const h = parseFloat(height)
    if (!w || !h || w <= 0 || h <= 0) {
      setError('Enter valid width and height in mm.')
      return
    }
    try {
      const input: WindowQuoteInput = {
        widthMm: w,
        heightMm: h,
        openers: parseInt(openers, 10) || 0,
        bayPoles: parseInt(bayPoles, 10) || 0,
        colourType: colour,
        midRail,
        leading,
        georgianBar,
        flushCasement,
      }
      const result = calculateWindowPrice(input, windowData)
      const label = `Window ${w}×${h}mm${openers !== '0' ? ` ${openers}op` : ''} / ${colour}`
      onAdd({ id: uid(), type: 'window', label, input, result })
      setWidth('')
      setHeight('')
      setOpeners('0')
      setBayPoles('0')
      setColour('white')
      setMidRail(false)
      setLeading(false)
      setGeorgianBar(false)
      setFlushCasement(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Width (mm)">
          <input className={inputCls} type="number" placeholder="e.g. 900" value={width} onChange={(e) => setWidth(e.target.value)} />
        </Field>
        <Field label="Height (mm)">
          <input className={inputCls} type="number" placeholder="e.g. 1200" value={height} onChange={(e) => setHeight(e.target.value)} />
        </Field>
        <Field label="Openers">
          <input className={inputCls} type="number" min="0" max="6" value={openers} onChange={(e) => setOpeners(e.target.value)} />
        </Field>
        <Field label="Bay poles">
          <input className={inputCls} type="number" min="0" max="4" value={bayPoles} onChange={(e) => setBayPoles(e.target.value)} />
        </Field>
      </div>

      <Field label="Colour">
        <select className={selectCls} value={colour} onChange={(e) => setColour(e.target.value as typeof colour)}>
          <option value="white">White — no uplift</option>
          <option value="standard">Standard colour — +{Math.round((windowData.colourUplifts.standard ?? 0.2) * 100)}%</option>
          <option value="premium">Premium colour — +{Math.round((windowData.colourUplifts.premium ?? 0.3) * 100)}%</option>
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
        {(
          [
            ['midRail', `Mid rail (+£${windowData.addons.mid_rail ?? 20})`, midRail, setMidRail],
            ['leading', `Leading (+£${windowData.addons.leading ?? 50})`, leading, setLeading],
            ['georgianBar', `Georgian bar (+£${windowData.addons.georgian_bar ?? 50})`, georgianBar, setGeorgianBar],
            ['flushCasement', `Flush casement (+£${windowData.addons.flush_casement ?? 363})`, flushCasement, setFlushCasement],
          ] as const
        ).map(([key, label, val, set]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="checkbox" className={checkCls} checked={val as boolean} onChange={(e) => (set as (v: boolean) => void)(e.target.checked)} />
            {label}
          </label>
        ))}
      </div>

      {error && <p className="text-xs text-amber-400 font-mono">{error}</p>}

      <button className={btnPrimary} onClick={handleAdd}>
        Add window to list
      </button>
    </div>
  )
}

// ─── Door Form ────────────────────────────────────────────────────────────────

function DoorForm({
  doorData,
  onAdd,
}: {
  doorData: DoorPricingData
  onAdd: (line: DoorLine) => void
}) {
  const allSkus = doorData.catalogue.flatMap((r) =>
    r.variants.map((v) => ({
      skuId: v.skuId,
      display: `${v.skuId} — ${r.rangeName} (${v.variantType})`,
      rangeName: r.rangeName,
      variantType: v.variantType,
      basePrice: v.sellingPrice,
    }))
  )

  const [skuId, setSkuId] = useState(allSkus[0]?.skuId ?? 'CD-08')
  const [isLarge, setIsLarge] = useState(false)
  const [premiumColour, setPremiumColour] = useState(false)
  const [autoLock, setAutoLock] = useState(false)
  const [letterbox, setLetterbox] = useState(false)
  const [knocker, setKnocker] = useState(false)
  const [topLight, setTopLight] = useState(false)
  const [sideLight, setSideLight] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleAdd() {
    setError(null)
    try {
      const input: DoorQuoteInput = {
        skuId,
        isLargeDoor: isLarge,
        premiumColour,
        autoLock,
        letterbox,
        knocker,
        topLight,
        sideLight,
      }
      const result = calculateDoorPrice(input, doorData)
      const entry = allSkus.find((s) => s.skuId === skuId)
      const label = entry ? `${entry.rangeName} (${entry.variantType}) ${skuId}` : skuId
      onAdd({ id: uid(), type: 'door', label, input, result })
      setIsLarge(false)
      setPremiumColour(false)
      setAutoLock(false)
      setLetterbox(false)
      setKnocker(false)
      setTopLight(false)
      setSideLight(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const entry = allSkus.find((s) => s.skuId === skuId)

  return (
    <div className="space-y-4">
      <Field label="Door SKU">
        <select className={selectCls} value={skuId} onChange={(e) => setSkuId(e.target.value)}>
          {allSkus.map((s) => (
            <option key={s.skuId} value={s.skuId}>{s.display}</option>
          ))}
        </select>
      </Field>

      {entry && (
        <p className="text-xs text-slate-400 font-mono">Base: {formatPrice(entry.basePrice)}</p>
      )}

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {(
          [
            ['isLarge', `Large door (+${Math.round(doorData.largeDoorUplift * 100)}%)`, isLarge, setIsLarge],
            ['premiumColour', `Premium colour (+£${doorData.addons.premium_colour ?? 50})`, premiumColour, setPremiumColour],
            ['autoLock', `Auto lock (+£${doorData.addons.auto_lock ?? 100})`, autoLock, setAutoLock],
            ['letterbox', `Letterbox (+£${doorData.addons.letterbox ?? 50})`, letterbox, setLetterbox],
            ['knocker', `Knocker (+£${doorData.addons.knocker ?? 50})`, knocker, setKnocker],
            ['topLight', `Top light (+£${doorData.addons.top_light ?? 50})`, topLight, setTopLight],
            ['sideLight', `Side light (+£${doorData.addons.side_light ?? 100})`, sideLight, setSideLight],
          ] as const
        ).map(([key, label, val, set]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="checkbox" className={checkCls} checked={val as boolean} onChange={(e) => (set as (v: boolean) => void)(e.target.checked)} />
            {label}
          </label>
        ))}
      </div>

      {error && <p className="text-xs text-amber-400 font-mono">{error}</p>}

      <button className={btnPrimary} onClick={handleAdd}>
        Add door to list
      </button>
    </div>
  )
}

// ─── Quote Line Row ───────────────────────────────────────────────────────────

function QuoteLineRow({ line, index, onRemove }: { line: QuoteLine; index: number; onRemove: (id: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-700 rounded overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[10px] font-mono text-slate-500 w-5 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={`text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded ${
            line.type === 'window' ? 'bg-sky-900 text-sky-300' : 'bg-amber-900 text-amber-300'
          }`}>
            {line.type}
          </span>
          <span className="font-mono text-sm text-slate-200 truncate">{line.label}</span>
        </div>
        <div className="flex items-center gap-4 shrink-0 ml-4">
          <span className="font-mono text-base font-semibold text-white">
            {formatPrice(line.result.totalPriceRounded)}
          </span>
          <button onClick={() => setOpen((o) => !o)} className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-mono">
            {open ? '▲ hide' : '▼ detail'}
          </button>
          <button onClick={() => onRemove(line.id)} className="text-xs text-slate-500 hover:text-red-400 transition-colors font-mono" aria-label="Remove line">
            ✕
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 py-3 bg-slate-900 border-t border-slate-700 font-mono text-xs text-slate-400 space-y-0.5">
          {line.type === 'window' ? (
            <>
              <p>{line.result.input.widthMm}mm × {line.result.input.heightMm}mm = {line.result.combinedMm}mm combined → band {line.result.band}mm</p>
              <p>Base: {formatPrice(line.result.basePrice)}</p>
              {line.result.addons.map((a, i) => <p key={i}>+ {a.label}: {formatPrice(a.amount)}</p>)}
              <p>Subtotal: {formatPrice(line.result.subtotal)}</p>
              {line.result.colourUpliftPct > 0 && (
                <p>+ Colour {(line.result.colourUpliftPct * 100).toFixed(0)}%: {formatPrice(line.result.colourUpliftAmount)}</p>
              )}
              <p className="text-slate-200 pt-1">Total: {formatPrice(line.result.totalPriceRounded)}</p>
            </>
          ) : (
            <>
              <p>{line.result.skuId} — {line.result.rangeName} ({line.result.variantType})</p>
              <p>Base: {formatPrice(line.result.basePrice)}</p>
              {line.result.addons.map((a, i) => <p key={i}>+ {a.label}: {formatPrice(a.amount)}</p>)}
              {line.result.largeDoorUpliftAmount > 0 && (
                <p>+ Large door uplift: {formatPrice(line.result.largeDoorUpliftAmount)}</p>
              )}
              <p className="text-slate-200 pt-1">Total: {formatPrice(line.result.totalPriceRounded)}</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Reference Panels ─────────────────────────────────────────────────────────

function BandReference({ windowData }: { windowData: WindowPricingData }) {
  const [open, setOpen] = useState(false)

  const bandEntries = Object.entries(windowData.bands)
    .map(([k, v]) => ({ band: parseInt(k, 10), price: v }))
    .sort((a, b) => a.band - b.band)

  const stdPct = windowData.colourUplifts.standard ?? 0.2
  const premPct = windowData.colourUplifts.premium ?? 0.3

  return (
    <div className="border border-slate-700 rounded overflow-hidden">
      <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 text-sm text-slate-300 hover:text-white transition-colors" onClick={() => setOpen((o) => !o)}>
        <span className="font-semibold">Window band reference</span>
        <span className="font-mono text-slate-500">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="bg-slate-900 border-t border-slate-700">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-4 py-2 text-slate-500">Combined</th>
                <th className="text-right px-4 py-2 text-slate-500">Base price</th>
                <th className="text-right px-4 py-2 text-slate-500">+{Math.round(stdPct * 100)}% std</th>
                <th className="text-right px-4 py-2 text-slate-500">+{Math.round(premPct * 100)}% prem</th>
              </tr>
            </thead>
            <tbody>
              {bandEntries.map(({ band, price }, i) => (
                <tr key={band} className={`border-b border-slate-800 last:border-0 ${i % 2 === 0 ? '' : 'bg-slate-800/30'}`}>
                  <td className="px-4 py-1.5 text-slate-300">{band}mm</td>
                  <td className="px-4 py-1.5 text-right text-slate-300">{formatPrice(price)}</td>
                  <td className="px-4 py-1.5 text-right text-slate-400">{formatPrice(Math.round(price * (1 + stdPct)))}</td>
                  <td className="px-4 py-1.5 text-right text-slate-400">{formatPrice(Math.round(price * (1 + premPct)))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono space-y-0.5">
            <p>Opener: +£{windowData.addons.opener ?? 242} each</p>
            <p>Bay pole: +£{windowData.addons.bay_pole ?? 242} each</p>
            <p>Mid rail: +£{windowData.addons.mid_rail ?? 20}</p>
            <p>Leading: +£{windowData.addons.leading ?? 50}</p>
            <p>Georgian bar: +£{windowData.addons.georgian_bar ?? 50}</p>
            <p>Flush casement: +£{windowData.addons.flush_casement ?? 363}</p>
            <p className="pt-1 text-slate-600">Colour uplift applied after all flat add-ons.</p>
          </div>
        </div>
      )}
    </div>
  )
}

function DoorAddonReference({ doorData }: { doorData: DoorPricingData }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-700 rounded overflow-hidden">
      <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 text-sm text-slate-300 hover:text-white transition-colors" onClick={() => setOpen((o) => !o)}>
        <span className="font-semibold">Door add-on reference</span>
        <span className="font-mono text-slate-500">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="bg-slate-900 border-t border-slate-700 px-4 py-3 font-mono text-xs text-slate-400 space-y-0.5">
          {Object.entries(doorData.addons).map(([k, v]) => (
            <p key={k}>{k.replace(/_/g, ' ')}: {v > 0 ? `+£${v}` : 'included'}</p>
          ))}
          <p className="pt-1 text-slate-600">Large door: +{Math.round(doorData.largeDoorUplift * 100)}% applied after all flat add-ons.</p>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function InstallerPricingTool() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { windows: windowData, doors: doorData, loading, error: pricingError } = usePricingData()
  const [activeForm, setActiveForm] = useState<LineType>('window')
  const [lines, setLines] = useState<QuoteLine[]>([])

  const addLine = useCallback((line: QuoteLine) => {
    setLines((prev) => [...prev, line])
  }, [])

  const removeLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const total = lines.reduce((sum, l) => sum + l.result.totalPriceRounded, 0)
  const windowCount = lines.filter((l) => l.type === 'window').length
  const doorCount = lines.filter((l) => l.type === 'door').length

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="font-mono text-sm text-slate-400">Loading pricing data…</p>
      </div>
    )
  }

  if (pricingError || !windowData || !doorData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <p className="font-mono text-sm text-amber-400">{pricingError ?? 'Pricing data unavailable'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-0.5">
              Windows & Doors Online
            </p>
            <h1 className="font-mono text-base font-semibold text-slate-100">
              Installer Pricing Tool
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className={btnGhost} onClick={() => navigate('/pricing-admin')}>
              Pricing admin
            </button>
            {lines.length > 0 && (
              <button className={btnGhost} onClick={() => setLines([])}>
                Clear all
              </button>
            )}
            <button
              className={btnGhost}
              onClick={() => signOut().then(() => navigate('/login'))}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 items-start">

          {/* ── Left column: forms ────────────────────────────────── */}
          <div className="space-y-6">
            {/* Tab switcher */}
            <div className="flex gap-px border border-slate-700 rounded overflow-hidden">
              {(['window', 'door'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveForm(t)}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors focus:outline-none ${
                    activeForm === t ? 'bg-sky-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t === 'window' ? 'Window' : 'Door'}
                </button>
              ))}
            </div>

            {/* Active form */}
            <div className="bg-slate-900 border border-slate-700 rounded p-5">
              {activeForm === 'window' ? (
                <WindowForm windowData={windowData} onAdd={addLine} />
              ) : (
                <DoorForm doorData={doorData} onAdd={addLine} />
              )}
            </div>

            {/* Reference panels */}
            <div className="space-y-2">
              <BandReference windowData={windowData} />
              <DoorAddonReference doorData={doorData} />
            </div>
          </div>

          {/* ── Right column: quote list ──────────────────────────── */}
          <div className="space-y-4">
            {/* Summary bar */}
            <div className="bg-slate-900 border border-slate-700 rounded px-5 py-4 flex items-center justify-between">
              <div className="font-mono text-xs text-slate-400 space-y-0.5">
                <p>
                  {lines.length} line{lines.length !== 1 ? 's' : ''}
                  {windowCount > 0 && <span className="ml-2 text-sky-400">{windowCount}W</span>}
                  {doorCount > 0 && <span className="ml-2 text-amber-400">{doorCount}D</span>}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-0.5">
                  Running total
                </p>
                <p className="font-mono text-2xl font-bold text-white">
                  {lines.length > 0 ? formatPrice(total) : '—'}
                </p>
              </div>
            </div>

            {/* Lines */}
            {lines.length === 0 ? (
              <div className="border border-slate-800 border-dashed rounded px-6 py-12 text-center">
                <p className="font-mono text-sm text-slate-600">No lines yet. Add a window or door above.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {lines.map((line, i) => (
                  <QuoteLineRow key={line.id} line={line} index={i} onRemove={removeLine} />
                ))}
              </div>
            )}

            {/* Per-category subtotals when mixed */}
            {windowCount > 0 && doorCount > 0 && (
              <div className="bg-slate-900 border border-slate-700 rounded px-5 py-4 font-mono text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Windows ({windowCount})</span>
                  <span>{formatPrice(lines.filter((l) => l.type === 'window').reduce((s, l) => s + l.result.totalPriceRounded, 0))}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Doors ({doorCount})</span>
                  <span>{formatPrice(lines.filter((l) => l.type === 'door').reduce((s, l) => s + l.result.totalPriceRounded, 0))}</span>
                </div>
                <div className="flex justify-between text-white pt-1 border-t border-slate-700">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
