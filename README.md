This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


pemuda-hikma/
├── app/
│   ├── (public)/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── articles/
│   │   │   ├── page.js
│   │   │   └── [slug]/
│   │   │       └── page.js
│   │   └── events/
│   │       ├── page.js
│   │       ├── [slug]/
│   │       │   └── page.js
│   │       └── [slug]/
│   │           └── payment.js
│   │
│   ├── (admin)/
│   │   ├── layout.js
│   │   ├── dashboard/
│   │   │   └── page.js
│   │   ├── articles/
│   │   │   ├── page.js
│   │   │   ├── new/
│   │   │   │   └── page.js
│   │   │   └── [slug]/
│   │   │       ├── details
│   │   │       │   └── page.js
│   │   │       └── edit
│   │   │           └── page.js
│   │   └── events/
│   │       ├── page.js
│   │       ├── new/
│   │       │   └── page.js
│   │       └── [slug]/
│   │   │       ├── details
│   │   │       │   └── page.js
│   │   │       └── edit
│   │   │           └── page.js
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.js
│   │   ├── articles/
│   │   │   └── route.js
│   │   ├── upload-image/
│   │   │   └── route.js
│   │   ├── events/
│   │   │   └── route.js
│   │   └── payments/
│   │       ├── route.js
│   │       └── webhook/
│   │           └── route.js
│   │
│   ├── login/
│   │   └── page.js
│   │
│   └── layout.js
│
├── components/
│   ├── Navbar.js
│   ├── AdminNavbar.js
│   ├── Footer.js
│   ├── ArticleCard.js
│   ├── EventCard.js
│   └── LoadingSpinner.js
│
├── lib/
│   ├── auth.js
│   ├── db.js
│   └── midtrans.js
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   ├── images/
│   │   ├── logo-hikma.png
│   │   └── logo-hikma-white.png
│   └── assets/
│       ├── default-article.jpg
│       └── default-event.jpg
│
├── styles/
│   └── globals.css
│
├── .env.local
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
