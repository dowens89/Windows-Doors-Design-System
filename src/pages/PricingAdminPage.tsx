import React, { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Download, Upload, Check, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ds/Button'
import { Input } from '../components/ds/Input'
import { Alert } from '../components/ds/Alert'
import { Loading } from '../components/ds/Loading'
import { formatPrice, usePricingData } from '../pricing'
import type { WindowPricingData, DoorPricingData } from '../pricing'
import type { DoorRange } from '../pricing'
import {
  updateWindowBand, createWindowBand, deleteWindowBand,
  updateWindowAddon, createWindowAddon, deleteWindowAddon,
  updateWindowColourUplift,
  updateDoorVariant, createDoorVariant, deleteDoorVariant,
  updateDoorAddon, createDoorAddon, deleteDoorAddon,
  updateDoorSetting,
} from '../pricing/pricingService'

// ─── Toast ───────────────────────────────────────────────────────────────────

interface ToastMsg { id: number; text: string; type: 'success' | 'error' }

function useToasts() {
  const [toasts, setToasts] = useState<ToastMsg[]>([])
  const counter = useRef(0)

  function push(text: string, type: 'success' | 'error') {
    const id = ++counter.current
    setToasts((t) => [...t, { id, text, type }])
    setTimeout(() => setToasts((t) => t.filter((m) => m.id !== id)), 3500)
  }

  return { toasts, success: (t: string) => push(t, 'success'), error: (t: string) => push(t, 'error') }
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function PricingAdminPage() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { windows, doors, loading, error: pricingError, refetch } = usePricingData()
  const { toasts, success, error: toastError } = useToasts()
  const [tab, setTab] = useState<'windows' | 'doors'>('windows')

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (pricingError || !windows || !doors) {
    return (
      <div className="min-h-screen bg-paper p-8">
        <Alert variant="warning" message={pricingError ?? 'Pricing data unavailable'} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <div className="bg-ink text-paper px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/pricing-debug')}
          className="flex items-center gap-1.5 text-sm text-paper opacity-70 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Debug
        </button>
        <span className="text-paper opacity-30">/</span>
        <h1 className="font-display text-lg text-paper">Pricing Admin</h1>
        <div className="ml-auto">
          <button
            onClick={() => signOut().then(() => navigate('/login'))}
            className="flex items-center gap-1.5 text-sm text-paper opacity-70 hover:opacity-100 transition-opacity"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-hairline px-6">
        <div className="flex gap-1 -mb-px">
          {(['windows', 'doors'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 font-sans text-sm font-medium capitalize transition-colors border-b-2 ${
                tab === t
                  ? 'border-brand text-brand'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {tab === 'windows' ? (
          <WindowsTab data={windows} refetch={refetch} success={success} error={toastError} />
        ) : (
          <DoorsTab data={doors} refetch={refetch} success={success} error={toastError} />
        )}
      </div>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded shadow-lg font-sans text-sm text-paper pointer-events-auto ${
              t.type === 'success' ? 'bg-success' : 'bg-error'
            }`}
          >
            {t.type === 'success' && <Check className="w-4 h-4 flex-shrink-0" />}
            {t.text}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Windows Tab ─────────────────────────────────────────────────────────────

function WindowsTab({
  data,
  refetch,
  success,
  error,
}: {
  data: WindowPricingData
  refetch: () => void
  success: (t: string) => void
  error: (t: string) => void
}) {
  const [newBandMm, setNewBandMm] = useState('')
  const [newBandPrice, setNewBandPrice] = useState('')
  const [newAddonKey, setNewAddonKey] = useState('')
  const [newAddonLabel, setNewAddonLabel] = useState('')
  const [newAddonPrice, setNewAddonPrice] = useState('')

  const bandEntries = Object.entries(data.bands)
    .map(([k, v]) => ({ mm: parseInt(k, 10), price: v }))
    .sort((a, b) => a.mm - b.mm)

  const addonEntries = Object.entries(data.addons)
  const upliftEntries = Object.entries(data.colourUplifts)

  async function saveBand(mm: number, raw: string) {
    const price = parseFloat(raw)
    if (isNaN(price)) return
    try {
      await updateWindowBand(mm, price)
      refetch()
      success(`Band ${mm}mm updated`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Save failed')
    }
  }

  async function addBand() {
    const mm = parseInt(newBandMm, 10)
    const price = parseFloat(newBandPrice)
    if (isNaN(mm) || isNaN(price)) return
    try {
      await createWindowBand(mm, price)
      refetch()
      setNewBandMm('')
      setNewBandPrice('')
      success(`Band ${mm}mm added`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Create failed')
    }
  }

  async function removeBand(mm: number) {
    try {
      await deleteWindowBand(mm)
      refetch()
      success(`Band ${mm}mm removed`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  async function saveAddon(key: string, raw: string) {
    const price = parseFloat(raw)
    if (isNaN(price)) return
    try {
      await updateWindowAddon(key, price)
      refetch()
      success(`Add-on "${key}" updated`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Save failed')
    }
  }

  async function addAddon() {
    const price = parseFloat(newAddonPrice)
    if (!newAddonKey || !newAddonLabel || isNaN(price)) return
    try {
      await createWindowAddon(newAddonKey, newAddonLabel, price)
      refetch()
      setNewAddonKey('')
      setNewAddonLabel('')
      setNewAddonPrice('')
      success(`Add-on "${newAddonKey}" created`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Create failed')
    }
  }

  async function removeAddon(key: string) {
    try {
      await deleteWindowAddon(key)
      refetch()
      success(`Add-on "${key}" removed`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  async function saveUplift(key: string, raw: string) {
    const pct = parseFloat(raw)
    if (isNaN(pct)) return
    try {
      await updateWindowColourUplift(key, pct / 100)
      refetch()
      success(`Colour uplift "${key}" updated`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Save failed')
    }
  }

  function exportCsv() {
    const rows = ['combined_mm,selling_price', ...bandEntries.map((b) => `${b.mm},${b.price}`)]
    downloadCsv(rows.join('\n'), 'window-bands.csv')
  }

  return (
    <div className="space-y-16">
      {/* Price Bands */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ink">Price Bands</h2>
          <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={exportCsv}>
            Export CSV
          </Button>
        </div>
        <div className="border border-hairline overflow-hidden">
          <table className="w-full font-sans text-sm">
            <thead>
              <tr className="bg-surface border-b border-hairline">
                <th className="text-left px-4 py-3 text-ink-muted text-xs font-semibold uppercase tracking-widest">Combined mm</th>
                <th className="text-right px-4 py-3 text-ink-muted text-xs font-semibold uppercase tracking-widest">Selling Price</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {bandEntries.map(({ mm, price }) => (
                <tr key={mm} className="border-b border-hairline last:border-0 hover:bg-surface/50">
                  <td className="px-4 py-2 text-ink font-mono">{mm}mm</td>
                  <td className="px-4 py-2 text-right">
                    <PriceInput
                      defaultValue={(price / 1).toFixed(2)}
                      onSave={(v) => saveBand(mm, v)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => removeBand(mm)} className="text-error hover:opacity-70 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-surface/50">
                <td className="px-4 py-2">
                  <input
                    type="number"
                    placeholder="mm"
                    value={newBandMm}
                    onChange={(e) => setNewBandMm(e.target.value)}
                    className="w-24 border border-hairline bg-paper px-2 py-1.5 text-sm text-ink font-mono rounded focus:outline-none focus:border-brand"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-2">
                    <input
                      type="number"
                      placeholder="price"
                      value={newBandPrice}
                      onChange={(e) => setNewBandPrice(e.target.value)}
                      className="w-24 border border-hairline bg-paper px-2 py-1.5 text-sm text-ink font-mono rounded focus:outline-none focus:border-brand text-right"
                    />
                    <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={addBand}>
                      Add
                    </Button>
                  </div>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Add-ons */}
      <section>
        <h2 className="font-display text-xl text-ink mb-6">Add-ons</h2>
        <div className="border border-hairline overflow-hidden">
          <table className="w-full font-sans text-sm">
            <thead>
              <tr className="bg-surface border-b border-hairline">
                <th className="text-left px-4 py-3 text-ink-muted text-xs font-semibold uppercase tracking-widest">Key</th>
                <th className="text-right px-4 py-3 text-ink-muted text-xs font-semibold uppercase tracking-widest">Price (£)</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {addonEntries.map(([key, price]) => (
                <tr key={key} className="border-b border-hairline last:border-0 hover:bg-surface/50">
                  <td className="px-4 py-2 text-ink font-mono">{key}</td>
                  <td className="px-4 py-2 text-right">
                    <PriceInput defaultValue={(price).toFixed(2)} onSave={(v) => saveAddon(key, v)} />
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => removeAddon(key)} className="text-error hover:opacity-70 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-surface/50">
                <td className="px-4 py-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="key"
                    value={newAddonKey}
                    onChange={(e) => setNewAddonKey(e.target.value)}
                    className="w-28 border border-hairline bg-paper px-2 py-1.5 text-sm text-ink font-mono rounded focus:outline-none focus:border-brand"
                  />
                  <input
                    type="text"
                    placeholder="label"
                    value={newAddonLabel}
                    onChange={(e) => setNewAddonLabel(e.target.value)}
                    className="w-28 border border-hairline bg-paper px-2 py-1.5 text-sm text-ink rounded focus:outline-none focus:border-brand"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-2">
                    <input
                      type="number"
                      placeholder="price"
                      value={newAddonPrice}
                      onChange={(e) => setNewAddonPrice(e.target.value)}
                      className="w-20 border border-hairline bg-paper px-2 py-1.5 text-sm text-ink font-mono rounded focus:outline-none focus:border-brand text-right"
                    />
                    <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={addAddon}>
                      Add
                    </Button>
                  </div>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Colour Uplifts */}
      <section>
        <h2 className="font-display text-xl text-ink mb-6">Colour Uplifts</h2>
        <div className="border border-hairline overflow-hidden">
          <table className="w-full font-sans text-sm">
            <thead>
              <tr className="bg-surface border-b border-hairline">
                <th className="text-left px-4 py-3 text-ink-muted text-xs font-semibold uppercase tracking-widest">Key</th>
                <th className="text-right px-4 py-3 text-ink-muted text-xs font-semibold uppercase tracking-widest">Uplift %</th>
              </tr>
            </thead>
            <tbody>
              {upliftEntries.map(([key, decimal]) => (
                <tr key={key} className="border-b border-hairline last:border-0 hover:bg-surface/50">
                  <td className="px-4 py-2 text-ink font-mono">{key}</td>
                  <td className="px-4 py-2 text-right">
                    <PriceInput
                      defaultValue={(decimal * 100).toFixed(1)}
                      suffix="%"
                      onSave={(v) => saveUplift(key, v)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

// ─── Doors Tab ────────────────────────────────────────────────────────────────

function DoorsTab({
  data,
  refetch,
  success,
  error,
}: {
  data: DoorPricingData
  refetch: () => void
  success: (t: string) => void
  error: (t: string) => void
}) {
  const [expandedRange, setExpandedRange] = useState<string | null>(null)
  const [newVariantRangeId, setNewVariantRangeId] = useState('')
  const [newVariantSku, setNewVariantSku] = useState('')
  const [newVariantType, setNewVariantType] = useState('')
  const [newVariantPrice, setNewVariantPrice] = useState('')
  const [newAddonKey, setNewAddonKey] = useState('')
  const [newAddonLabel, setNewAddonLabel] = useState('')
  const [newAddonPrice, setNewAddonPrice] = useState('')

  async function saveVariant(skuId: string, variantType: string, raw: string) {
    const price = parseFloat(raw)
    if (isNaN(price)) return
    try {
      await updateDoorVariant(skuId, variantType, price)
      refetch()
      success(`SKU ${skuId} updated`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Save failed')
    }
  }

  async function addVariant() {
    const price = parseFloat(newVariantPrice)
    if (!newVariantRangeId || !newVariantSku || !newVariantType || isNaN(price)) return
    try {
      await createDoorVariant(newVariantRangeId, newVariantSku, newVariantType, price)
      refetch()
      setNewVariantSku('')
      setNewVariantType('')
      setNewVariantPrice('')
      success(`SKU ${newVariantSku} created`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Create failed')
    }
  }

  async function removeVariant(skuId: string) {
    try {
      await deleteDoorVariant(skuId)
      refetch()
      success(`SKU ${skuId} removed`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  async function saveAddon(key: string, raw: string) {
    const price = parseFloat(raw)
    if (isNaN(price)) return
    try {
      await updateDoorAddon(key, price)
      refetch()
      success(`Add-on "${key}" updated`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Save failed')
    }
  }

  async function addAddon() {
    const price = parseFloat(newAddonPrice)
    if (!newAddonKey || !newAddonLabel || isNaN(price)) return
    try {
      await createDoorAddon(newAddonKey, newAddonLabel, price)
      refetch()
      setNewAddonKey('')
      setNewAddonLabel('')
      setNewAddonPrice('')
      success(`Add-on "${newAddonKey}" created`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Create failed')
    }
  }

  async function removeAddon(key: string) {
    try {
      await deleteDoorAddon(key)
      refetch()
      success(`Add-on "${key}" removed`)
    } catch (e) {
      error(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  async function saveLargeUplift(raw: string) {
    const pct = parseFloat(raw)
    if (isNaN(pct)) return
    try {
      await updateDoorSetting('large_door_uplift', pct / 100)
      refetch()
      success('Large door uplift updated')
    } catch (e) {
      error(e instanceof Error ? e.message : 'Save failed')
    }
  }

  function exportCsv() {
    const rows = ['sku_id,range_id,range_name,variant_type,selling_price']
    for (const range of data.catalogue) {
      for (const v of range.variants) {
        rows.push(`${v.skuId},${range.rangeId},${range.rangeName},${v.variantType},${v.sellingPrice}`)
      }
    }
    downloadCsv(rows.join('\n'), 'door-variants.csv')
  }

  const addonEntries = Object.entries(data.addons)

  return (
    <div className="space-y-16">
      {/* Large door uplift */}
      <section>
        <h2 className="font-display text-xl text-ink mb-4">Settings</h2>
        <div className="border border-hairline p-4 inline-flex items-center gap-4">
          <span className="font-sans text-sm text-ink">Large door uplift</span>
          <PriceInput
            defaultValue={(data.largeDoorUplift * 100).toFixed(1)}
            suffix="%"
            onSave={saveLargeUplift}
          />
        </div>
      </section>

      {/* Catalogue */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ink">Catalogue ({data.catalogue.length} ranges)</h2>
          <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={exportCsv}>
            Export CSV
          </Button>
        </div>

        <div className="border border-hairline overflow-hidden divide-y divide-hairline">
          {data.catalogue.map((range) => (
            <div key={range.rangeId}>
              <button
                onClick={() => setExpandedRange(expandedRange === range.rangeId ? null : range.rangeId)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface/50 transition-colors"
              >
                <span className="font-sans text-sm font-medium text-ink">{range.rangeName}</span>
                <span className="font-sans text-xs text-ink-muted">
                  {range.variants.length} variant{range.variants.length !== 1 ? 's' : ''}
                </span>
              </button>

              {expandedRange === range.rangeId && (
                <div className="border-t border-hairline bg-surface/30">
                  <table className="w-full font-sans text-sm">
                    <thead>
                      <tr className="border-b border-hairline">
                        <th className="text-left px-6 py-2 text-ink-muted text-xs uppercase tracking-widest">SKU</th>
                        <th className="text-left px-4 py-2 text-ink-muted text-xs uppercase tracking-widest">Type</th>
                        <th className="text-right px-4 py-2 text-ink-muted text-xs uppercase tracking-widest">Price (£)</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {range.variants.map((v) => (
                        <tr key={v.skuId} className="border-b border-hairline last:border-0">
                          <td className="px-6 py-2 text-ink font-mono">{v.skuId}</td>
                          <td className="px-4 py-2 text-ink-muted">{v.variantType}</td>
                          <td className="px-4 py-2 text-right">
                            <PriceInput
                              defaultValue={(v.sellingPrice).toFixed(2)}
                              onSave={(val) => saveVariant(v.skuId, v.variantType, val)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <button onClick={() => removeVariant(v.skuId)} className="text-error hover:opacity-70 transition-opacity">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-surface/50">
                        <td className="px-6 py-2">
                          <input
                            type="text"
                            placeholder="SKU"
                            value={newVariantRangeId === range.rangeId ? newVariantSku : ''}
                            onFocus={() => setNewVariantRangeId(range.rangeId)}
                            onChange={(e) => setNewVariantSku(e.target.value)}
                            className="w-24 border border-hairline bg-paper px-2 py-1 text-sm text-ink font-mono rounded focus:outline-none focus:border-brand"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            placeholder="type"
                            value={newVariantRangeId === range.rangeId ? newVariantType : ''}
                            onFocus={() => setNewVariantRangeId(range.rangeId)}
                            onChange={(e) => setNewVariantType(e.target.value)}
                            className="w-24 border border-hairline bg-paper px-2 py-1 text-sm text-ink rounded focus:outline-none focus:border-brand"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-end gap-2">
                            <input
                              type="number"
                              placeholder="price"
                              value={newVariantRangeId === range.rangeId ? newVariantPrice : ''}
                              onFocus={() => setNewVariantRangeId(range.rangeId)}
                              onChange={(e) => setNewVariantPrice(e.target.value)}
                              className="w-20 border border-hairline bg-paper px-2 py-1 text-sm text-ink font-mono rounded focus:outline-none focus:border-brand text-right"
                            />
                            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3 h-3" />} onClick={addVariant}>
                              Add
                            </Button>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Add-ons */}
      <section>
        <h2 className="font-display text-xl text-ink mb-6">Add-ons</h2>
        <div className="border border-hairline overflow-hidden">
          <table className="w-full font-sans text-sm">
            <thead>
              <tr className="bg-surface border-b border-hairline">
                <th className="text-left px-4 py-3 text-ink-muted text-xs font-semibold uppercase tracking-widest">Key</th>
                <th className="text-right px-4 py-3 text-ink-muted text-xs font-semibold uppercase tracking-widest">Price (£)</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {addonEntries.map(([key, price]) => (
                <tr key={key} className="border-b border-hairline last:border-0 hover:bg-surface/50">
                  <td className="px-4 py-2 text-ink font-mono">{key}</td>
                  <td className="px-4 py-2 text-right">
                    <PriceInput defaultValue={(price).toFixed(2)} onSave={(v) => saveAddon(key, v)} />
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => removeAddon(key)} className="text-error hover:opacity-70 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-surface/50">
                <td className="px-4 py-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="key"
                    value={newAddonKey}
                    onChange={(e) => setNewAddonKey(e.target.value)}
                    className="w-28 border border-hairline bg-paper px-2 py-1.5 text-sm text-ink font-mono rounded focus:outline-none focus:border-brand"
                  />
                  <input
                    type="text"
                    placeholder="label"
                    value={newAddonLabel}
                    onChange={(e) => setNewAddonLabel(e.target.value)}
                    className="w-28 border border-hairline bg-paper px-2 py-1.5 text-sm text-ink rounded focus:outline-none focus:border-brand"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-2">
                    <input
                      type="number"
                      placeholder="price"
                      value={newAddonPrice}
                      onChange={(e) => setNewAddonPrice(e.target.value)}
                      className="w-20 border border-hairline bg-paper px-2 py-1.5 text-sm text-ink font-mono rounded focus:outline-none focus:border-brand text-right"
                    />
                    <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={addAddon}>
                      Add
                    </Button>
                  </div>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

// ─── Inline price input ───────────────────────────────────────────────────────

function PriceInput({
  defaultValue,
  suffix,
  onSave,
}: {
  defaultValue: string
  suffix?: string
  onSave: (value: string) => void
}) {
  const [val, setVal] = useState(defaultValue)
  const [dirty, setDirty] = useState(false)

  function handleBlur() {
    if (dirty) {
      onSave(val)
      setDirty(false)
    }
  }

  return (
    <div className="inline-flex items-center gap-1 justify-end">
      {!suffix && <span className="font-sans text-xs text-ink-muted">£</span>}
      <input
        type="number"
        value={val}
        onChange={(e) => { setVal(e.target.value); setDirty(true) }}
        onBlur={handleBlur}
        className="w-24 border border-hairline bg-paper px-2 py-1 text-sm text-ink font-mono rounded focus:outline-none focus:border-brand text-right"
      />
      {suffix && <span className="font-sans text-xs text-ink-muted">{suffix}</span>}
    </div>
  )
}

// ─── CSV helpers ──────────────────────────────────────────────────────────────

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
