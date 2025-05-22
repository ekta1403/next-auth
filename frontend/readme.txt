my-app/
├── app/                     # Next.js App Router pages
│   ├── (auth)/              # Route group for authentication
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx       # Optional layout for auth pages
│   ├── dashboard/           # Protected user area
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── api/                 # API routes using Next.js (optional)
│   │   └── auth/route.ts
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css
│
├── components/              # Reusable UI components
│   ├── Navbar.tsx
│   └── Form.tsx
│
├── lib/                     # Helpers (API clients, utilities, db, auth)
│   ├── db.ts                # Database connection (e.g. Prisma)
│   ├── auth.ts              # Auth helpers
│   └── api.ts               # Axios client or fetch wrapper
│
├── server/                  # Optional: Node.js (Express/Fastify) backend
│   ├── index.ts             # Entry point for custom backend
│   └── routes/              # Backend API routes
│       └── auth.ts
│
├── public/                  # Static files (images, fonts, etc.)
│
├── styles/                  # Global and modular CSS/SCSS
│   └── tailwind.css
│
├── types/                   # Custom TypeScript types/interfaces
│   └── index.d.ts
│
├── middleware.ts            # Next.js Middleware (auth, redirects)
├── next.config.js           # Next.js config
├── tsconfig.json            # TypeScript config
├── package.json
└── .env                     # Environment variables
