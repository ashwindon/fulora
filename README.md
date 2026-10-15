# Fulora

Website for Fulora Nursery, a landscaping and nursery business in Hadapsar, Pune.
Built with Vite, React and GSAP.

```bash
npm install
npm run dev      # develop at http://localhost:5173
npm run build    # production build in /dist
```

## Where things live

- `src/components/contactData.js` holds the phone, email, address, opening hours and social links.
- `src/components/serviceData.js`, `growerData.js` and `seasons.js` hold the words and colours for the Services, Meet the grower and hero seasons.

## Getting form emails (free)

Both forms (the garden quote request and the contact message) email you through
[Web3Forms](https://web3forms.com). The free plan allows 250 messages a month and needs no card.

1. Go to https://web3forms.com, type `fuloranursery@gmail.com` and press **Create Access Key**.
2. They email you a key. Copy it.
3. Copy `.env.example` to `.env` and paste the key after `VITE_WEB3FORMS_KEY=`.
4. Restart `npm run dev` and send a test message from the site. Check the inbox (and spam) of the address above.
5. When you deploy (for example to Vercel), add `VITE_WEB3FORMS_KEY` as an environment variable in the host's
   settings too, then redeploy. Without it the deployed site stays in demo mode.

Replies go straight to the visitor's email address, so you can answer from Gmail.
