// The things visitors can drop into their garden, plus a few ready-made layouts.
// `view` is half the width of the art's drawing box; `size` is how wide the item
// appears on the canvas at scale 1 (canvas is 800 x 520).

export const CATS = [
  { id: 'flowers', label: 'Flowers' },
  { id: 'trees', label: 'Trees and shrubs' },
  { id: 'features', label: 'Features' },
]

const RAW = [
  { id: 'daisy', name: 'Daisies', cat: 'flowers', view: 48, size: 86, layer: 1, tags: ['cottage', 'meadow'] },
  { id: 'rose', name: 'Rose bush', cat: 'flowers', view: 48, size: 90, layer: 1, tags: ['cottage'] },
  { id: 'lavender', name: 'Lavender', cat: 'flowers', view: 48, size: 92, layer: 1, tags: ['cottage', 'meadow', 'zen'] },
  { id: 'sunflower', name: 'Sunflowers', cat: 'flowers', view: 48, size: 96, layer: 1, tags: ['meadow', 'kitchen'] },
  { id: 'tulips', name: 'Tulips', cat: 'flowers', view: 48, size: 86, layer: 1, tags: ['cottage', 'kitchen'] },
  { id: 'fern', name: 'Ferns', cat: 'flowers', view: 48, size: 88, layer: 1, tags: ['woodland', 'zen'] },
  { id: 'oak', name: 'Oak tree', cat: 'trees', view: 64, size: 168, layer: 2, tags: ['woodland'] },
  { id: 'blossom', name: 'Blossom tree', cat: 'trees', view: 52, size: 132, layer: 2, tags: ['cottage', 'zen'] },
  { id: 'shrub', name: 'Round shrub', cat: 'trees', view: 38, size: 76, layer: 1, tags: ['zen', 'modern'] },
  { id: 'hedge', name: 'Hedge', cat: 'trees', view: 50, size: 120, layer: 1, tags: ['modern', 'kitchen'] },
  { id: 'pond', name: 'Pond', cat: 'features', view: 56, size: 150, layer: 0, tags: ['zen', 'woodland'] },
  { id: 'stones', name: 'Stepping stones', cat: 'features', view: 48, size: 96, layer: 0, tags: ['zen', 'cottage'] },
  { id: 'bench', name: 'Bench', cat: 'features', view: 48, size: 100, layer: 1, tags: ['cottage', 'zen', 'modern'] },
  { id: 'lantern', name: 'Lantern', cat: 'features', view: 28, size: 44, layer: 1, tags: ['zen', 'modern'] },
  { id: 'birdbath', name: 'Bird bath', cat: 'features', view: 32, size: 70, layer: 1, tags: ['cottage'] },
  { id: 'vegbed', name: 'Veg bed', cat: 'features', view: 48, size: 110, layer: 1, tags: ['kitchen'] },
  { id: 'table', name: 'Patio set', cat: 'features', view: 52, size: 116, layer: 2, tags: ['modern', 'cottage'] },
]

// Slightly larger on the canvas so each plant has presence.
export const ITEMS = RAW.map((i) => ({ ...i, size: Math.round(i.size * 1.18) }))

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]))

export const MOODS = {
  cottage: 'Cottage garden',
  zen: 'Zen retreat',
  woodland: 'Woodland glade',
  meadow: 'Wildflower meadow',
  kitchen: 'Kitchen garden',
  modern: 'Clean and modern',
}

export function moodOf(items) {
  if (!items.length) return null
  const score = {}
  items.forEach((it) => ITEM_BY_ID[it.type].tags.forEach((t) => (score[t] = (score[t] || 0) + 1)))
  const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0]
  return MOODS[best[0]]
}

// [type, x, y, scale, rotation]
export const PRESETS = [
  {
    name: 'Cottage',
    items: [
      ['blossom', 150, 175, 1.1, 0],
      ['rose', 280, 255, 1, 0],
      ['rose', 360, 215, 0.9, 20],
      ['lavender', 510, 195, 1, 0],
      ['lavender', 600, 255, 0.9, 0],
      ['daisy', 235, 395, 1, 0],
      ['tulips', 365, 415, 1, 0],
      ['bench', 660, 385, 1, 0],
      ['birdbath', 490, 345, 1, 0],
      ['stones', 420, 305, 1, 28],
      ['stones', 335, 345, 1, 28],
    ],
  },
  {
    name: 'Zen',
    items: [
      ['pond', 590, 330, 1.25, 0],
      ['stones', 390, 395, 1, -20],
      ['stones', 300, 335, 1, -38],
      ['lantern', 470, 235, 1, 0],
      ['lantern', 690, 215, 1, 0],
      ['shrub', 170, 215, 1, 0],
      ['shrub', 255, 275, 0.8, 0],
      ['fern', 150, 355, 1, 0],
      ['fern', 250, 425, 0.9, 0],
      ['blossom', 115, 140, 1, 0],
      ['bench', 430, 155, 1, 0],
    ],
  },
  {
    name: 'Woodland',
    items: [
      ['oak', 150, 215, 1.1, 0],
      ['oak', 670, 205, 1, 0],
      ['fern', 310, 205, 1, 0],
      ['fern', 390, 265, 0.9, 0],
      ['fern', 255, 385, 1, 0],
      ['pond', 480, 385, 1, 0],
      ['stones', 345, 310, 1, 30],
      ['shrub', 570, 250, 0.9, 0],
      ['lantern', 585, 345, 1, 0],
      ['blossom', 440, 160, 0.9, 0],
    ],
  },
  {
    name: 'Kitchen',
    items: [
      ['vegbed', 190, 205, 1, 0],
      ['vegbed', 330, 205, 1, 0],
      ['vegbed', 470, 205, 1, 0],
      ['tulips', 255, 365, 1, 0],
      ['sunflower', 630, 205, 1, 0],
      ['sunflower', 690, 275, 0.9, 0],
      ['table', 565, 390, 1, 0],
      ['stones', 385, 335, 1, 90],
      ['hedge', 250, 455, 1.4, 0],
      ['hedge', 470, 455, 1.4, 0],
    ],
  },
]
