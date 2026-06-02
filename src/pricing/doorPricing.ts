/**
 * WDO Door Pricing Engine
 *
 * Structure:
 * - Doors are grouped into master ranges (e.g. "Alnwick")
 * - Each range has child variants (Standard, Bevel, Solid, Mini Blind)
 * - Base selling price is fixed per SKU
 * - Add-ons are flat fees applied after the base price
 * - Large door carries a +10% uplift applied last
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type DoorVariantType =
  | 'standard'
  | 'bevel'
  | 'solid'
  | 'mini_blind'
  | 'pvc';

export interface DoorVariant {
  skuId: string;
  variantType: DoorVariantType;
  sellingPrice: number;
}

export interface DoorRange {
  rangeId: string;
  rangeName: string;
  variants: DoorVariant[];
}

// ─── Add-ons ─────────────────────────────────────────────────────────────────

export const DOOR_ADDONS: Record<string, number> = {
  basic_colour:          0,    // no charge — included
  premium_colour:       50,
  auto_lock:           100,
  handle_600mm:        100,
  handle_1200mm:       100,
  handle_1800mm:       100,
  letterbox:            50,
  knocker:              50,
  top_light:            50,
  side_light:          100,
};

// Large door uplift — applied as a percentage after flat add-ons
export const LARGE_DOOR_UPLIFT = 0.10;

// ─── Full Catalogue ───────────────────────────────────────────────────────────
// Grouped into master ranges with child variants.
// Selling prices taken directly from the installer price file.

export const DOOR_CATALOGUE: DoorRange[] = [
  {
    rangeId: 'aintree',
    rangeName: 'Aintree',
    variants: [
      { skuId: 'CD-01', variantType: 'solid', sellingPrice: 1404 },
    ],
  },
  {
    rangeId: 'alnwick',
    rangeName: 'Alnwick',
    variants: [
      { skuId: 'CD-02', variantType: 'standard', sellingPrice: 931.50 },
      { skuId: 'CD-03', variantType: 'bevel',    sellingPrice: 946.50 },
      { skuId: 'CD-04', variantType: 'solid',    sellingPrice: 858.00 },
    ],
  },
  {
    rangeId: 'antwerp',
    rangeName: 'Antwerp',
    variants: [
      { skuId: 'CD-05', variantType: 'standard', sellingPrice: 1248.00 },
      { skuId: 'CD-06', variantType: 'bevel',    sellingPrice: 1413.00 },
    ],
  },
  {
    rangeId: 'appleby',
    rangeName: 'Appleby',
    variants: [
      { skuId: 'CD-07', variantType: 'solid', sellingPrice: 856.50 },
    ],
  },
  {
    rangeId: 'arundel',
    rangeName: 'Arundel',
    variants: [
      { skuId: 'CD-08', variantType: 'standard', sellingPrice: 1057.50 },
      { skuId: 'CD-09', variantType: 'bevel',    sellingPrice: 1125.00 },
    ],
  },
  {
    rangeId: 'ash',
    rangeName: 'Ash',
    variants: [
      { skuId: 'CD-10', variantType: 'standard', sellingPrice: 1057.50 },
      { skuId: 'CD-11', variantType: 'bevel',    sellingPrice: 1125.00 },
    ],
  },
  {
    rangeId: 'astley',
    rangeName: 'Astley',
    variants: [
      { skuId: 'CD-12', variantType: 'standard', sellingPrice: 1041.00 },
      { skuId: 'CD-13', variantType: 'bevel',    sellingPrice: 1120.50 },
    ],
  },
  {
    rangeId: 'athens',
    rangeName: 'Athens',
    variants: [
      { skuId: 'CD-14', variantType: 'solid', sellingPrice: 1072.50 },
    ],
  },
  {
    rangeId: 'balmoral',
    rangeName: 'Balmoral',
    variants: [
      { skuId: 'CD-15', variantType: 'standard', sellingPrice: 960.00 },
      { skuId: 'CD-16', variantType: 'bevel',    sellingPrice: 1089.00 },
      { skuId: 'CD-17', variantType: 'solid',    sellingPrice: 858.00 },
    ],
  },
  {
    rangeId: 'barcelona',
    rangeName: 'Barcelona',
    variants: [
      { skuId: 'CD-18', variantType: 'standard', sellingPrice: 1167.00 },
      { skuId: 'CD-19', variantType: 'bevel',    sellingPrice: 1231.50 },
    ],
  },
  {
    rangeId: 'barnard',
    rangeName: 'Barnard',
    variants: [
      { skuId: 'CD-20', variantType: 'standard', sellingPrice: 1005.00 },
      { skuId: 'CD-21', variantType: 'bevel',    sellingPrice: 1104.00 },
    ],
  },
  {
    rangeId: 'beech',
    rangeName: 'Beech',
    variants: [
      { skuId: 'CD-22', variantType: 'standard', sellingPrice: 936.00 },
      { skuId: 'CD-24', variantType: 'bevel',    sellingPrice: 945.00 },
    ],
  },
  {
    rangeId: 'berkley',
    rangeName: 'Berkley',
    variants: [
      { skuId: 'CD-26', variantType: 'standard',  sellingPrice: 1003.50 },
      { skuId: 'CD-27', variantType: 'bevel',     sellingPrice: 1078.50 },
      { skuId: 'CD-28', variantType: 'mini_blind', sellingPrice: 1041.00 },
    ],
  },
  {
    rangeId: 'berlin',
    rangeName: 'Berlin',
    variants: [
      { skuId: 'CD-29', variantType: 'solid', sellingPrice: 1072.50 },
    ],
  },
  {
    rangeId: 'birch',
    rangeName: 'Birch',
    variants: [
      { skuId: 'CD-30', variantType: 'standard', sellingPrice: 1015.50 },
      { skuId: 'CD-31', variantType: 'bevel',    sellingPrice: 1042.50 },
    ],
  },
  {
    rangeId: 'bowes',
    rangeName: 'Bowes',
    variants: [
      { skuId: 'CD-32', variantType: 'standard', sellingPrice: 1032.00 },
      { skuId: 'CD-33', variantType: 'bevel',    sellingPrice: 1116.00 },
    ],
  },
  {
    rangeId: 'caernarfon',
    rangeName: 'Caernarfon',
    variants: [
      { skuId: 'CD-34', variantType: 'standard', sellingPrice: 1008.00 },
      { skuId: 'CD-35', variantType: 'bevel',    sellingPrice: 1138.50 },
    ],
  },
  {
    rangeId: 'cark',
    rangeName: 'Cark',
    variants: [
      { skuId: 'CD-36', variantType: 'standard',  sellingPrice: 985.50 },
      { skuId: 'CD-37', variantType: 'bevel',     sellingPrice: 1099.50 },
      { skuId: 'CD-38', variantType: 'mini_blind', sellingPrice: 1041.00 },
    ],
  },
  {
    rangeId: 'carlisle',
    rangeName: 'Carlisle',
    variants: [
      { skuId: 'CD-39', variantType: 'standard', sellingPrice: 952.50 },
      { skuId: 'CD-40', variantType: 'bevel',    sellingPrice: 1017.00 },
    ],
  },
  {
    rangeId: 'cedar',
    rangeName: 'Cedar',
    variants: [
      { skuId: 'CD-41', variantType: 'standard', sellingPrice: 1006.50 },
      { skuId: 'CD-42', variantType: 'bevel',    sellingPrice: 1068.00 },
    ],
  },
  {
    rangeId: 'cheltenham',
    rangeName: 'Cheltenham',
    variants: [
      { skuId: 'CD-43', variantType: 'standard',  sellingPrice: 1536.00 },
      { skuId: 'CD-44', variantType: 'bevel',     sellingPrice: 1630.50 },
      { skuId: 'CD-45', variantType: 'mini_blind', sellingPrice: 1605.00 },
    ],
  },
  {
    rangeId: 'conwy',
    rangeName: 'Conwy',
    variants: [
      { skuId: 'CD-46', variantType: 'standard',  sellingPrice: 939.00 },
      { skuId: 'CD-47', variantType: 'bevel',     sellingPrice: 1053.00 },
      { skuId: 'CD-48', variantType: 'mini_blind', sellingPrice: 994.50 },
    ],
  },
  {
    rangeId: 'dalton',
    rangeName: 'Dalton',
    variants: [
      { skuId: 'CD-49', variantType: 'standard', sellingPrice: 1017.00 },
      { skuId: 'CD-50', variantType: 'bevel',    sellingPrice: 1038.00 },
    ],
  },
  {
    rangeId: 'doune',
    rangeName: 'Doune',
    variants: [
      { skuId: 'CD-51', variantType: 'standard', sellingPrice: 952.50 },
      { skuId: 'CD-52', variantType: 'bevel',    sellingPrice: 1017.00 },
    ],
  },
  {
    rangeId: 'dublin',
    rangeName: 'Dublin',
    variants: [
      { skuId: 'CD-53', variantType: 'solid', sellingPrice: 1072.50 },
    ],
  },
  {
    rangeId: 'dunster',
    rangeName: 'Dunster',
    variants: [
      { skuId: 'CD-54', variantType: 'standard', sellingPrice: 1057.50 },
      { skuId: 'CD-55', variantType: 'bevel',    sellingPrice: 1125.00 },
    ],
  },
  {
    rangeId: 'durham',
    rangeName: 'Durham',
    variants: [
      { skuId: 'CD-56', variantType: 'standard', sellingPrice: 999.00 },
      { skuId: 'CD-57', variantType: 'bevel',    sellingPrice: 1098.00 },
    ],
  },
  {
    rangeId: 'edinburgh',
    rangeName: 'Edinburgh',
    variants: [
      { skuId: 'CD-58', variantType: 'standard', sellingPrice: 907.50 },
      { skuId: 'CD-59', variantType: 'bevel',    sellingPrice: 940.50 },
    ],
  },
  {
    rangeId: 'elder',
    rangeName: 'Elder',
    variants: [
      { skuId: 'CD-60', variantType: 'standard', sellingPrice: 946.50 },
      { skuId: 'CD-61', variantType: 'bevel',    sellingPrice: 970.50 },
    ],
  },
  {
    rangeId: 'elm',
    rangeName: 'Elm',
    variants: [
      { skuId: 'CD-62', variantType: 'standard', sellingPrice: 1057.50 },
      { skuId: 'CD-63', variantType: 'bevel',    sellingPrice: 1125.00 },
    ],
  },
  {
    rangeId: 'epsom',
    rangeName: 'Epsom',
    variants: [
      { skuId: 'CD-64', variantType: 'standard', sellingPrice: 1483.50 },
      { skuId: 'CD-65', variantType: 'bevel',    sellingPrice: 1489.50 },
    ],
  },
  {
    rangeId: 'etal',
    rangeName: 'Etal',
    variants: [
      { skuId: 'CD-66', variantType: 'standard', sellingPrice: 1087.50 },
      { skuId: 'CD-67', variantType: 'bevel',    sellingPrice: 1159.50 },
    ],
  },
  {
    rangeId: 'eye',
    rangeName: 'Eye',
    variants: [
      { skuId: 'CD-68', variantType: 'standard', sellingPrice: 1008.00 },
      { skuId: 'CD-69', variantType: 'bevel',    sellingPrice: 1197.00 },
    ],
  },
  {
    rangeId: 'florence',
    rangeName: 'Florence',
    variants: [
      { skuId: 'CD-70', variantType: 'standard', sellingPrice: 1231.50 },
      { skuId: 'CD-71', variantType: 'bevel',    sellingPrice: 1252.50 },
    ],
  },
  {
    rangeId: 'geneva',
    rangeName: 'Geneva',
    variants: [
      { skuId: 'CD-72', variantType: 'standard', sellingPrice: 1167.00 },
      { skuId: 'CD-73', variantType: 'bevel',    sellingPrice: 1231.50 },
    ],
  },
  {
    rangeId: 'hailes',
    rangeName: 'Hailes',
    variants: [
      { skuId: 'CD-74', variantType: 'standard',  sellingPrice: 1116.00 },
      { skuId: 'CD-75', variantType: 'bevel',     sellingPrice: 1228.50 },
      { skuId: 'CD-76', variantType: 'mini_blind', sellingPrice: 1171.50 },
    ],
  },
  {
    rangeId: 'hamburg',
    rangeName: 'Hamburg',
    variants: [
      { skuId: 'CD-77', variantType: 'standard', sellingPrice: 1167.00 },
      { skuId: 'CD-78', variantType: 'bevel',    sellingPrice: 1231.50 },
    ],
  },
  {
    rangeId: 'hawthorn',
    rangeName: 'Hawthorn',
    variants: [
      { skuId: 'CD-79', variantType: 'standard', sellingPrice: 1057.50 },
      { skuId: 'CD-80', variantType: 'bevel',    sellingPrice: 1125.00 },
    ],
  },
  {
    rangeId: 'haydock',
    rangeName: 'Haydock',
    variants: [
      { skuId: 'CD-81', variantType: 'standard', sellingPrice: 1521.00 },
      { skuId: 'CD-82', variantType: 'bevel',    sellingPrice: 1527.00 },
    ],
  },
  {
    rangeId: 'helsinki',
    rangeName: 'Helsinki',
    variants: [
      { skuId: 'CD-83', variantType: 'standard', sellingPrice: 1231.50 },
      { skuId: 'CD-84', variantType: 'bevel',    sellingPrice: 1252.50 },
    ],
  },
  {
    rangeId: 'hendon',
    rangeName: 'Hendon',
    variants: [
      { skuId: 'CD-85', variantType: 'standard', sellingPrice: 1003.50 },
      { skuId: 'CD-86', variantType: 'bevel',    sellingPrice: 1071.00 },
    ],
  },
  {
    rangeId: 'holly',
    rangeName: 'Holly',
    variants: [
      { skuId: 'CD-87', variantType: 'standard', sellingPrice: 952.50 },
      { skuId: 'CD-88', variantType: 'bevel',    sellingPrice: 957.00 },
    ],
  },
  {
    rangeId: 'huntley',
    rangeName: 'Huntley',
    variants: [
      { skuId: 'CD-89', variantType: 'standard', sellingPrice: 952.50 },
      { skuId: 'CD-90', variantType: 'bevel',    sellingPrice: 1017.00 },
    ],
  },
  {
    rangeId: 'juniper',
    rangeName: 'Juniper',
    variants: [
      { skuId: 'CD-91', variantType: 'standard', sellingPrice: 1005.00 },
      { skuId: 'CD-92', variantType: 'bevel',    sellingPrice: 1104.00 },
    ],
  },
  {
    rangeId: 'kempton',
    rangeName: 'Kempton',
    variants: [
      { skuId: 'CD-93', variantType: 'standard', sellingPrice: 1530.00 },
      { skuId: 'CD-94', variantType: 'bevel',    sellingPrice: 1552.50 },
    ],
  },
  {
    rangeId: 'kendle',
    rangeName: 'Kendle',
    variants: [
      { skuId: 'CD-95', variantType: 'standard', sellingPrice: 1017.00 },
      { skuId: 'CD-96', variantType: 'bevel',    sellingPrice: 1038.00 },
    ],
  },
  {
    rangeId: 'kenilworth',
    rangeName: 'Kenilworth',
    variants: [
      { skuId: 'CD-97', variantType: 'standard', sellingPrice: 1110.00 },
      { skuId: 'CD-98', variantType: 'bevel',    sellingPrice: 1246.50 },
    ],
  },
  {
    rangeId: 'leeds',
    rangeName: 'Leeds',
    variants: [
      { skuId: 'CD-99',  variantType: 'standard', sellingPrice: 1008.00 },
      { skuId: 'CD-100', variantType: 'bevel',    sellingPrice: 1107.00 },
    ],
  },
  {
    rangeId: 'lincoln',
    rangeName: 'Lincoln',
    variants: [
      { skuId: 'CD-101', variantType: 'standard', sellingPrice: 1005.00 },
      { skuId: 'CD-102', variantType: 'bevel',    sellingPrice: 1104.00 },
    ],
  },
  {
    rangeId: 'lisbon',
    rangeName: 'Lisbon',
    variants: [
      { skuId: 'CD-103', variantType: 'standard', sellingPrice: 1237.50 },
      { skuId: 'CD-104', variantType: 'bevel',    sellingPrice: 1260.00 },
    ],
  },
  {
    rangeId: 'lyon',
    rangeName: 'Lyon',
    variants: [
      { skuId: 'CD-105', variantType: 'standard', sellingPrice: 1248.00 },
      { skuId: 'CD-106', variantType: 'bevel',    sellingPrice: 1413.00 },
    ],
  },
  {
    rangeId: 'madrid',
    rangeName: 'Madrid',
    variants: [
      { skuId: 'CD-107', variantType: 'standard', sellingPrice: 1167.00 },
      { skuId: 'CD-108', variantType: 'bevel',    sellingPrice: 1231.50 },
    ],
  },
  {
    rangeId: 'maple',
    rangeName: 'Maple',
    variants: [
      { skuId: 'CD-109', variantType: 'standard', sellingPrice: 1015.50 },
      { skuId: 'CD-110', variantType: 'bevel',    sellingPrice: 592.50 },
    ],
  },
  {
    rangeId: 'milan',
    rangeName: 'Milan',
    variants: [
      { skuId: 'CD-111', variantType: 'standard', sellingPrice: 1246.50 },
      { skuId: 'CD-112', variantType: 'bevel',    sellingPrice: 1411.50 },
    ],
  },
  {
    rangeId: 'morton',
    rangeName: 'Morton',
    variants: [
      { skuId: 'CD-113', variantType: 'standard', sellingPrice: 1057.50 },
      { skuId: 'CD-114', variantType: 'bevel',    sellingPrice: 1125.00 },
    ],
  },
  {
    rangeId: 'mulberry',
    rangeName: 'Mulberry',
    variants: [
      { skuId: 'CD-115', variantType: 'standard', sellingPrice: 1015.50 },
      { skuId: 'CD-116', variantType: 'bevel',    sellingPrice: 1042.50 },
    ],
  },
  {
    rangeId: 'munich',
    rangeName: 'Munich',
    variants: [
      { skuId: 'CD-117', variantType: 'standard', sellingPrice: 1231.50 },
      { skuId: 'CD-118', variantType: 'bevel',    sellingPrice: 1252.50 },
    ],
  },
  {
    rangeId: 'naples',
    rangeName: 'Naples',
    variants: [
      { skuId: 'CD-119', variantType: 'standard', sellingPrice: 1248.00 },
      { skuId: 'CD-120', variantType: 'bevel',    sellingPrice: 1413.00 },
    ],
  },
  {
    rangeId: 'nice',
    rangeName: 'Nice',
    variants: [
      { skuId: 'CD-121', variantType: 'solid', sellingPrice: 1072.50 },
    ],
  },
  {
    rangeId: 'olive',
    rangeName: 'Olive',
    variants: [
      { skuId: 'CD-122', variantType: 'standard', sellingPrice: 952.50 },
      { skuId: 'CD-123', variantType: 'bevel',    sellingPrice: 1017.00 },
    ],
  },
  {
    rangeId: 'ordell',
    rangeName: 'Ordell',
    variants: [
      { skuId: 'CD-124', variantType: 'standard', sellingPrice: 1116.00 },
      { skuId: 'CD-125', variantType: 'bevel',    sellingPrice: 1140.00 },
    ],
  },
  {
    rangeId: 'orford',
    rangeName: 'Orford',
    variants: [
      { skuId: 'CD-126', variantType: 'standard', sellingPrice: 1005.00 },
      { skuId: 'CD-127', variantType: 'bevel',    sellingPrice: 1104.00 },
    ],
  },
  {
    rangeId: 'oxford',
    rangeName: 'Oxford',
    variants: [
      { skuId: 'CD-128', variantType: 'standard', sellingPrice: 1170.00 },
      { skuId: 'CD-129', variantType: 'bevel',    sellingPrice: 1197.00 },
    ],
  },
  {
    rangeId: 'palm',
    rangeName: 'Palm',
    variants: [
      { skuId: 'CD-130', variantType: 'standard', sellingPrice: 952.50 },
      { skuId: 'CD-131', variantType: 'bevel',    sellingPrice: 1017.00 },
    ],
  },
  {
    rangeId: 'paris',
    rangeName: 'Paris',
    variants: [
      { skuId: 'CD-132', variantType: 'standard', sellingPrice: 1246.50 },
      { skuId: 'CD-133', variantType: 'bevel',    sellingPrice: 1411.50 },
    ],
  },
  {
    rangeId: 'peil',
    rangeName: 'Peil',
    variants: [
      { skuId: 'CD-134', variantType: 'standard', sellingPrice: 1008.00 },
      { skuId: 'CD-135', variantType: 'bevel',    sellingPrice: 1197.00 },
    ],
  },
  {
    rangeId: 'pembroke',
    rangeName: 'Pembroke',
    variants: [
      { skuId: 'CD-136', variantType: 'standard', sellingPrice: 1105.50 },
      { skuId: 'CD-137', variantType: 'bevel',    sellingPrice: 1158.00 },
    ],
  },
  {
    rangeId: 'pickering',
    rangeName: 'Pickering',
    variants: [
      { skuId: 'CD-138', variantType: 'standard', sellingPrice: 1041.00 },
      { skuId: 'CD-139', variantType: 'bevel',    sellingPrice: 1120.50 },
    ],
  },
  {
    rangeId: 'pine',
    rangeName: 'Pine',
    variants: [
      { skuId: 'CD-140', variantType: 'standard', sellingPrice: 1005.00 },
      { skuId: 'CD-141', variantType: 'bevel',    sellingPrice: 1104.00 },
    ],
  },
  {
    rangeId: 'poplar',
    rangeName: 'Poplar',
    variants: [
      { skuId: 'CD-142', variantType: 'standard', sellingPrice: 952.50 },
      { skuId: 'CD-143', variantType: 'bevel',    sellingPrice: 1017.00 },
    ],
  },
  {
    rangeId: 'porto',
    rangeName: 'Porto',
    variants: [
      { skuId: 'CD-144', variantType: 'standard', sellingPrice: 1071.00 },
    ],
  },
  {
    rangeId: 'pvc',
    rangeName: 'PVC',
    variants: [
      { skuId: 'CD-145', variantType: 'bevel',    sellingPrice: 817.50 },
      { skuId: 'CD-146', variantType: 'standard', sellingPrice: 750.00 },
      { skuId: 'CD-147', variantType: 'solid',    sellingPrice: 787.50 },
    ],
  },
  {
    rangeId: 'raglan',
    rangeName: 'Raglan',
    variants: [
      { skuId: 'CD-148', variantType: 'standard', sellingPrice: 1066.50 },
      { skuId: 'CD-149', variantType: 'bevel',    sellingPrice: 1072.50 },
    ],
  },
  {
    rangeId: 'richmond',
    rangeName: 'Richmond',
    variants: [
      { skuId: 'CD-150', variantType: 'standard', sellingPrice: 952.50 },
    ],
  },
  {
    rangeId: 'rochester',
    rangeName: 'Rochester',
    variants: [
      { skuId: 'CD-151', variantType: 'standard', sellingPrice: 1008.00 },
      { skuId: 'CD-152', variantType: 'bevel',    sellingPrice: 1138.50 },
    ],
  },
  {
    rangeId: 'rome',
    rangeName: 'Rome',
    variants: [
      { skuId: 'CD-153', variantType: 'solid', sellingPrice: 1072.50 },
    ],
  },
  {
    rangeId: 'rowan',
    rangeName: 'Rowan',
    variants: [
      { skuId: 'CD-154', variantType: 'standard',  sellingPrice: 985.50 },
      { skuId: 'CD-155', variantType: 'bevel',     sellingPrice: 1099.50 },
      { skuId: 'CD-156', variantType: 'mini_blind', sellingPrice: 1041.00 },
    ],
  },
  {
    rangeId: 'rufus',
    rangeName: 'Rufus',
    variants: [
      { skuId: 'CD-157', variantType: 'standard', sellingPrice: 1041.00 },
      { skuId: 'CD-158', variantType: 'bevel',    sellingPrice: 1120.50 },
    ],
  },
  {
    rangeId: 'sherbourne',
    rangeName: 'Sherbourne',
    variants: [
      { skuId: 'CD-159', variantType: 'standard', sellingPrice: 1081.50 },  // Diamond
      { skuId: 'CD-160', variantType: 'bevel',    sellingPrice: 1087.50 },  // Diamond Bevel
      { skuId: 'CD-161', variantType: 'solid',    sellingPrice: 988.50 },
      { skuId: 'CD-162', variantType: 'standard', sellingPrice: 1077.00 },  // Square
      { skuId: 'CD-163', variantType: 'bevel',    sellingPrice: 1101.00 },  // Square Bevel
    ],
  },
  {
    rangeId: 'skipton',
    rangeName: 'Skipton',
    variants: [
      { skuId: 'CD-164', variantType: 'standard', sellingPrice: 1005.00 },
      { skuId: 'CD-165', variantType: 'bevel',    sellingPrice: 1069.50 },
    ],
  },
  {
    rangeId: 'somerton',
    rangeName: 'Somerton',
    variants: [
      { skuId: 'CD-166', variantType: 'standard', sellingPrice: 1096.50 },
      { skuId: 'CD-167', variantType: 'bevel',    sellingPrice: 1245.00 },
    ],
  },
  {
    rangeId: 'spruce',
    rangeName: 'Spruce',
    variants: [
      { skuId: 'CD-168', variantType: 'standard', sellingPrice: 1005.00 },
      { skuId: 'CD-169', variantType: 'bevel',    sellingPrice: 1104.00 },
    ],
  },
  {
    rangeId: 'turton',
    rangeName: 'Turton',
    variants: [
      { skuId: 'CD-170', variantType: 'standard', sellingPrice: 1273.50 },
      { skuId: 'CD-171', variantType: 'bevel',    sellingPrice: 1404.00 },
    ],
  },
  {
    rangeId: 'venice',
    rangeName: 'Venice',
    variants: [
      { skuId: 'CD-172', variantType: 'standard', sellingPrice: 1167.00 },
      { skuId: 'CD-173', variantType: 'bevel',    sellingPrice: 1231.50 },
    ],
  },
  {
    rangeId: 'vienna',
    rangeName: 'Vienna',
    variants: [
      { skuId: 'CD-174', variantType: 'standard', sellingPrice: 1237.50 },
      { skuId: 'CD-175', variantType: 'bevel',    sellingPrice: 1260.00 },
    ],
  },
  {
    rangeId: 'wark',
    rangeName: 'Wark',
    variants: [
      { skuId: 'CD-176', variantType: 'standard', sellingPrice: 1008.00 },
      { skuId: 'CD-177', variantType: 'bevel',    sellingPrice: 1197.00 },
    ],
  },
  {
    rangeId: 'willow',
    rangeName: 'Willow',
    variants: [
      { skuId: 'CD-178', variantType: 'solid', sellingPrice: 858.00 },
    ],
  },
  {
    rangeId: 'wilton',
    rangeName: 'Wilton',
    variants: [
      { skuId: 'CD-179', variantType: 'standard', sellingPrice: 1017.00 },
      { skuId: 'CD-180', variantType: 'bevel',    sellingPrice: 1038.00 },
    ],
  },
];

// ─── Query Helpers ────────────────────────────────────────────────────────────

/** Find a range by ID */
export function getDoorRange(rangeId: string): DoorRange | undefined {
  return DOOR_CATALOGUE.find((r) => r.rangeId === rangeId);
}

/** Find a specific variant by SKU ID across the full catalogue */
export function getDoorBySku(skuId: string): {
  range: DoorRange;
  variant: DoorVariant;
} | undefined {
  for (const range of DOOR_CATALOGUE) {
    const variant = range.variants.find((v) => v.skuId === skuId);
    if (variant) return { range, variant };
  }
  return undefined;
}

/** List all variants of a given type across the catalogue */
export function getDoorsByVariantType(type: DoorVariantType): {
  range: DoorRange;
  variant: DoorVariant;
}[] {
  const results: { range: DoorRange; variant: DoorVariant }[] = [];
  for (const range of DOOR_CATALOGUE) {
    for (const variant of range.variants) {
      if (variant.variantType === type) {
        results.push({ range, variant });
      }
    }
  }
  return results;
}

// ─── Main Calculation ─────────────────────────────────────────────────────────

export interface DoorQuoteInput {
  skuId: string;
  isLargeDoor?: boolean;
  premiumColour?: boolean;
  autoLock?: boolean;
  handleSize?: '600mm' | '1200mm' | '1800mm' | null;
  letterbox?: boolean;
  knocker?: boolean;
  topLight?: boolean;
  sideLight?: boolean;
}

export interface DoorQuoteResult {
  input: DoorQuoteInput;
  skuId: string;
  rangeName: string;
  variantType: DoorVariantType;
  basePrice: number;
  addons: { label: string; amount: number }[];
  subtotal: number;
  largeDoorUpliftAmount: number;
  totalPrice: number;
  totalPriceRounded: number;
}

export function calculateDoorPrice(
  input: DoorQuoteInput
): DoorQuoteResult {
  const found = getDoorBySku(input.skuId);
  if (!found) {
    throw new Error(`SKU ${input.skuId} not found in door catalogue.`);
  }

  const { range, variant } = found;
  const basePrice = variant.sellingPrice;

  // Build flat add-ons
  const addons: { label: string; amount: number }[] = [];

  if (input.premiumColour) {
    addons.push({
      label: 'Premium colour',
      amount: DOOR_ADDONS.premium_colour,
    });
  }

  if (input.autoLock) {
    addons.push({ label: 'Auto lock', amount: DOOR_ADDONS.auto_lock });
  }

  if (input.handleSize) {
    const handleKey = `handle_${input.handleSize.replace('mm', 'mm')}`;
    addons.push({
      label: `Long bar handle (${input.handleSize})`,
      amount: DOOR_ADDONS[`handle_${input.handleSize}`] ?? 100,
    });
  }

  if (input.letterbox) {
    addons.push({ label: 'Letterbox', amount: DOOR_ADDONS.letterbox });
  }

  if (input.knocker) {
    addons.push({ label: 'Knocker', amount: DOOR_ADDONS.knocker });
  }

  if (input.topLight) {
    addons.push({ label: 'Top light', amount: DOOR_ADDONS.top_light });
  }

  if (input.sideLight) {
    addons.push({ label: 'Side light', amount: DOOR_ADDONS.side_light });
  }

  const addonTotal = addons.reduce((sum, a) => sum + a.amount, 0);
  const subtotal = basePrice + addonTotal;

  // Large door uplift applied last
  const largeDoorUpliftAmount = input.isLargeDoor
    ? subtotal * LARGE_DOOR_UPLIFT
    : 0;

  const totalPrice = subtotal + largeDoorUpliftAmount;
  const totalPriceRounded = Math.round(totalPrice);

  return {
    input,
    skuId: input.skuId,
    rangeName: range.rangeName,
    variantType: variant.variantType,
    basePrice,
    addons,
    subtotal,
    largeDoorUpliftAmount,
    totalPrice,
    totalPriceRounded,
  };
}
