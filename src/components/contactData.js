// The business details shown across the site. Only the opening hours below are still placeholders.

export const CONTACT = {
  email: 'fuloranursery@gmail.com',
  phone: '080104 81393',
  phoneHref: '+918010481393',
  whatsapp: '918010481393',
  address: ['161, Hadapsar, Laxmi Vihar', 'Hadapsar, Pune, Maharashtra 411028'],
  area: 'Hadapsar, Pune and nearby areas',
  // The business's time zone, so the "open now" badge uses its clock, not the visitor's.
  timeZone: 'Asia/Kolkata',
  // PLACEHOLDER HOURS: replace with the real opening hours.
  // open / close are whole hours in 24-hour time. `open: null` means closed that day.
  hours: [
    { label: 'Monday to Friday', days: ['mon', 'tue', 'wed', 'thu', 'fri'], open: 8, close: 17 },
    { label: 'Saturday', days: ['sat'], open: 9, close: 14 },
    { label: 'Sunday', days: ['sun'], open: null, close: null },
  ],
  socials: [
    { name: 'Facebook', href: 'https://www.facebook.com/fuloranursery/' },
    { name: 'Instagram', href: 'https://www.instagram.com/fulora_nursery/' },
    { name: 'YouTube', href: 'https://www.youtube.com/@fuloranursery3436' },
  ],
}

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const NAMES = { sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday' }

export const hourLabel = (h) => (h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`)

function clockIn(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
    ...(timeZone ? { timeZone } : {}),
  }).formatToParts(date)
  const get = (t) => parts.find((p) => p.type === t)?.value
  return { day: DAYS.indexOf(get('weekday').slice(0, 3).toLowerCase()), minutes: +get('hour') * 60 + +get('minute') }
}

function slot(dayKey) {
  const row = CONTACT.hours.find((h) => h.days.includes(dayKey))
  return row && row.open != null ? row : null
}

// Is the business open right now, and what should the badge say?
export function openStatus(date = new Date()) {
  const { day, minutes } = clockIn(date, CONTACT.timeZone)
  const today = slot(DAYS[day])
  if (today && minutes >= today.open * 60 && minutes < today.close * 60) {
    return { open: true, today: DAYS[day], label: `Open now, until ${hourLabel(today.close)}` }
  }
  if (today && minutes < today.open * 60) {
    return { open: false, today: DAYS[day], label: `Closed, opens today at ${hourLabel(today.open)}` }
  }
  for (let i = 1; i <= 7; i++) {
    const key = DAYS[(day + i) % 7]
    const next = slot(key)
    if (next) return { open: false, today: DAYS[day], label: `Closed, opens ${i === 1 ? 'tomorrow' : NAMES[key]} at ${hourLabel(next.open)}` }
  }
  return { open: false, today: DAYS[day], label: 'Closed' }
}
