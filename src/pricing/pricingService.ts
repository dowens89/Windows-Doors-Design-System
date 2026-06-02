import { supabase } from '../lib/supabase'
import type { WindowPricingData } from './windowPricing'
import type { DoorPricingData } from './doorPricing'
import type { DoorRange } from './doorPricing'

export async function fetchWindowPricingData(): Promise<WindowPricingData> {
  const [bandsRes, addonsRes, upliftsRes] = await Promise.all([
    supabase.from('window_bands').select('combined_mm, selling_price').order('combined_mm'),
    supabase.from('window_addons').select('key, price').order('display_order'),
    supabase.from('window_colour_uplifts').select('key, uplift_decimal').order('display_order'),
  ])

  if (bandsRes.error) throw new Error(`window_bands: ${bandsRes.error.message}`)
  if (addonsRes.error) throw new Error(`window_addons: ${addonsRes.error.message}`)
  if (upliftsRes.error) throw new Error(`window_colour_uplifts: ${upliftsRes.error.message}`)

  const bands: Record<number, number> = {}
  for (const row of bandsRes.data) {
    bands[row.combined_mm] = Number(row.selling_price)
  }

  const addons: Record<string, number> = {}
  for (const row of addonsRes.data) {
    addons[row.key] = Number(row.price)
  }

  const colourUplifts: Record<string, number> = {}
  for (const row of upliftsRes.data) {
    colourUplifts[row.key] = Number(row.uplift_decimal)
  }

  return { bands, addons, colourUplifts }
}

export async function fetchDoorPricingData(): Promise<DoorPricingData> {
  const [rangesRes, variantsRes, addonsRes, settingsRes] = await Promise.all([
    supabase.from('door_ranges').select('range_id, range_name').order('display_order'),
    supabase.from('door_variants').select('sku_id, range_id, variant_type, selling_price').order('display_order'),
    supabase.from('door_addons').select('key, price').order('display_order'),
    supabase.from('door_settings').select('key, value'),
  ])

  if (rangesRes.error) throw new Error(`door_ranges: ${rangesRes.error.message}`)
  if (variantsRes.error) throw new Error(`door_variants: ${variantsRes.error.message}`)
  if (addonsRes.error) throw new Error(`door_addons: ${addonsRes.error.message}`)
  if (settingsRes.error) throw new Error(`door_settings: ${settingsRes.error.message}`)

  const rangeMap = new Map<string, DoorRange>()
  for (const r of rangesRes.data) {
    rangeMap.set(r.range_id, { rangeId: r.range_id, rangeName: r.range_name, variants: [] })
  }
  for (const v of variantsRes.data) {
    const range = rangeMap.get(v.range_id)
    if (range) {
      range.variants.push({
        skuId: v.sku_id,
        variantType: v.variant_type as DoorRange['variants'][number]['variantType'],
        sellingPrice: Number(v.selling_price),
      })
    }
  }
  const catalogue = Array.from(rangeMap.values())

  const addons: Record<string, number> = {}
  for (const row of addonsRes.data) {
    addons[row.key] = Number(row.price)
  }

  const settingRow = settingsRes.data.find((s) => s.key === 'large_door_uplift')
  const largeDoorUplift = settingRow ? Number(settingRow.value) : 0.1

  return { catalogue, addons, largeDoorUplift }
}

export async function fetchAllPricingData() {
  const [windows, doors] = await Promise.all([fetchWindowPricingData(), fetchDoorPricingData()])
  return { windows, doors }
}

// ─── Window mutations ────────────────────────────────────────────────────────

export async function updateWindowBand(combinedMm: number, sellingPrice: number): Promise<void> {
  const { error } = await supabase
    .from('window_bands')
    .update({ selling_price: sellingPrice })
    .eq('combined_mm', combinedMm)
  if (error) throw new Error(error.message)
}

export async function createWindowBand(combinedMm: number, sellingPrice: number): Promise<void> {
  const { error } = await supabase
    .from('window_bands')
    .insert({ combined_mm: combinedMm, selling_price: sellingPrice })
  if (error) throw new Error(error.message)
}

export async function deleteWindowBand(combinedMm: number): Promise<void> {
  const { error } = await supabase.from('window_bands').delete().eq('combined_mm', combinedMm)
  if (error) throw new Error(error.message)
}

export async function updateWindowAddon(key: string, price: number): Promise<void> {
  const { error } = await supabase.from('window_addons').update({ price }).eq('key', key)
  if (error) throw new Error(error.message)
}

export async function createWindowAddon(key: string, label: string, price: number): Promise<void> {
  const { error } = await supabase.from('window_addons').insert({ key, label, price })
  if (error) throw new Error(error.message)
}

export async function deleteWindowAddon(key: string): Promise<void> {
  const { error } = await supabase.from('window_addons').delete().eq('key', key)
  if (error) throw new Error(error.message)
}

export async function updateWindowColourUplift(key: string, upliftDecimal: number): Promise<void> {
  const { error } = await supabase
    .from('window_colour_uplifts')
    .update({ uplift_decimal: upliftDecimal })
    .eq('key', key)
  if (error) throw new Error(error.message)
}

export async function createWindowColourUplift(
  key: string,
  label: string,
  upliftDecimal: number
): Promise<void> {
  const { error } = await supabase
    .from('window_colour_uplifts')
    .insert({ key, label, uplift_decimal: upliftDecimal })
  if (error) throw new Error(error.message)
}

export async function deleteWindowColourUplift(key: string): Promise<void> {
  const { error } = await supabase.from('window_colour_uplifts').delete().eq('key', key)
  if (error) throw new Error(error.message)
}

// ─── Door mutations ──────────────────────────────────────────────────────────

export async function createDoorRange(rangeId: string, rangeName: string): Promise<void> {
  const { error } = await supabase.from('door_ranges').insert({ range_id: rangeId, range_name: rangeName })
  if (error) throw new Error(error.message)
}

export async function updateDoorRangeName(rangeId: string, rangeName: string): Promise<void> {
  const { error } = await supabase
    .from('door_ranges')
    .update({ range_name: rangeName })
    .eq('range_id', rangeId)
  if (error) throw new Error(error.message)
}

export async function deleteDoorRange(rangeId: string): Promise<void> {
  const { error } = await supabase.from('door_ranges').delete().eq('range_id', rangeId)
  if (error) throw new Error(error.message)
}

export async function createDoorVariant(
  rangeId: string,
  skuId: string,
  variantType: string,
  sellingPrice: number
): Promise<void> {
  const { error } = await supabase
    .from('door_variants')
    .insert({ range_id: rangeId, sku_id: skuId, variant_type: variantType, selling_price: sellingPrice })
  if (error) throw new Error(error.message)
}

export async function updateDoorVariant(
  skuId: string,
  variantType: string,
  sellingPrice: number
): Promise<void> {
  const { error } = await supabase
    .from('door_variants')
    .update({ variant_type: variantType, selling_price: sellingPrice })
    .eq('sku_id', skuId)
  if (error) throw new Error(error.message)
}

export async function deleteDoorVariant(skuId: string): Promise<void> {
  const { error } = await supabase.from('door_variants').delete().eq('sku_id', skuId)
  if (error) throw new Error(error.message)
}

export async function updateDoorAddon(key: string, price: number): Promise<void> {
  const { error } = await supabase.from('door_addons').update({ price }).eq('key', key)
  if (error) throw new Error(error.message)
}

export async function createDoorAddon(key: string, label: string, price: number): Promise<void> {
  const { error } = await supabase.from('door_addons').insert({ key, label, price })
  if (error) throw new Error(error.message)
}

export async function deleteDoorAddon(key: string): Promise<void> {
  const { error } = await supabase.from('door_addons').delete().eq('key', key)
  if (error) throw new Error(error.message)
}

export async function updateDoorSetting(key: string, value: number): Promise<void> {
  const { error } = await supabase.from('door_settings').update({ value }).eq('key', key)
  if (error) throw new Error(error.message)
}
