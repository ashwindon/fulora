// Sends a form to the owner's inbox.
//
//   1. With VITE_WEB3FORMS_KEY set, the message goes to Web3Forms, a free service that emails it
//      to the address the key was created for (see README.md, "Getting form emails").
//   2. Otherwise, with VITE_FORM_ENDPOINT set, it is POSTed there as JSON (any service works).
//   3. Otherwise it runs in demo mode: nothing is sent and the console shows what would have been.
//
// `message` is the human-readable email body. `data` is the same information as structured data.

const KEY = import.meta.env.VITE_WEB3FORMS_KEY
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || import.meta.env.VITE_CONTACT_ENDPOINT || import.meta.env.VITE_QUOTE_ENDPOINT

export async function deliver({ subject, name, email, phone, message, data }) {
  if (KEY) {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: KEY,
        subject,
        from_name: 'Fulora website',
        name,
        email,
        ...(phone ? { phone } : {}),
        message,
      }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok || json.success === false) throw new Error(json.message || `Request failed: ${res.status}`)
    return 'sent'
  }

  if (ENDPOINT) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, name, email, phone, message, data }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return 'sent'
  }

  await new Promise((r) => setTimeout(r, 900))
  console.info(`[Fulora] "${subject}" (demo mode, nothing was sent)\n\n${message}`)
  return 'demo'
}
