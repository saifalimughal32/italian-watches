# Italian Watches — Headless Storefront

Next.js storefront for **Italian Watches**. Runs on built-in mock catalog data — no external API required.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
npx vercel --prod
```

Live site: [https://italian-watches.vercel.app](https://italian-watches.vercel.app)

## Pages

- `/` — homepage
- `/brands` — brand index
- `/collections/[handle]` — collection PLP
- `/products/[handle]` — product detail
- `/search?q=` — catalog search
- `/contact`, `/about`, `/authenticity`, `/cart`, `/wishlist`
