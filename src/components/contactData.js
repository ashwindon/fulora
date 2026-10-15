// PLACEHOLDER DETAILS: swap every value in here for the real business details.
// The phone number is a fictional 555-01xx number and the email uses the reserved
// .example domain, so nothing here can reach a real person by accident.

export const CONTACT = {
  email: 'hello@fulora.example',
  phone: '+1 (555) 010-0199',
  phoneHref: '+15550100199',
  whatsapp: '15550100199',
  address: ['12 Marigold Lane', 'Greenfield'],
  area: 'Greenfield and about 30 km around it',
  // The business's time zone, like 'Europe/London'. Leave empty to use the visitor's own clock.
  timeZone: '',
  // open / close are whole hours in 24-hour time. `open: null` means closed that day.
  hours: [
    { label: 'Monday to Friday', days: ['mon', 'tue', 'wed', 'thu', 'fri'], open: 8, close: 17 },
    { label: 'Saturday', days: ['sat'], open: 9, close: 14 },
    { label: 'Sunday', days: ['sun'], open: null, close: null },
  ],
  // Generic site addresses stand in for the real profiles. Replace with the real links.
  socials: [
    { name: 'Instagram', href: 'https://www.instagram.com/' },
    { name: 'Facebook', href: 'https://www.facebook.com/' },
    { name: 'Pinterest', href: 'https://www.pinterest.com/' },
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
