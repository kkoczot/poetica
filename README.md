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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


Instalacja:
@clerk/nextjs
mongoose
tailwindcss-animate
shadcn-ui@latest
@uploadthing/react - do uploadowania zdjęć
uploadthing
svix - do używania webhooks

email: mickiewicz@poetica.pl
username: mickiewicz
password: mickiewicz1@

email: slowacki@poetica.pl
username: slowacki
password: slowacki1@


-------------------------------------------------------------------------------------------------------------

INFO: Clerk: The request to /search is being redirected because there is no signed-in user, and the path is not included in `ignoredRoutes` or `publicRoutes`. To prevent this behavior, choose one of:

1. To make the route accessible to both signed in and signed out users, add "/search" to the `publicRoutes` array passed to authMiddleware
2. To prevent Clerk authentication from running at all, add "/search" to the `ignoredRoutes` array passed to authMiddleware
3. Pass a custom `afterAuth` to authMiddleware, and replace Clerk's default behavior of redirecting unless a route is included in publicRoutes

For additional information about middleware, please visit https://clerk.com/docs/nextjs/middleware
(This log only appears in development mode, or if `debug: true` is passed to authMiddleware)
INFO: Clerk: The request to /credits is being redirected because there is no signed-in user, and the path is not included in `ignoredRoutes` or `publicRoutes`. To 
prevent this behavior, choose one of:

1. To make the route accessible to both signed in and signed out users, add "/credits" to the `publicRoutes` array passed to authMiddleware
2. To prevent Clerk authentication from running at all, add "/credits" to the `ignoredRoutes` array passed to authMiddleware
3. Pass a custom `afterAuth` to authMiddleware, and replace Clerk's default behavior of redirecting unless a route is included in publicRoutes

For additional information about middleware, please visit https://clerk.com/docs/nextjs/middleware
(This log only appears in development mode, or if `debug: true` is passed to authMiddleware)
INFO: Clerk: The request to /profile/user_2eea4HTJHMWmw1leW363bHc5wR0 is being redirected because there is no signed-in user, and the path is not included in `ignoredRoutes` or `publicRoutes`. To prevent this behavior, choose one of:

1. To make the route accessible to both signed in and signed out users, add "/profile/user_2eea4HTJHMWmw1leW363bHc5wR0" to the `publicRoutes` array passed to authMiddleware
2. To prevent Clerk authentication from running at all, add "/profile/user_2eea4HTJHMWmw1leW363bHc5wR0" to the `ignoredRoutes` array passed to authMiddleware      
3. Pass a custom `afterAuth` to authMiddleware, and replace Clerk's default behavior of redirecting unless a route is included in publicRoutes

For additional information about middleware, please visit https://clerk.com/docs/nextjs/middleware
(This log only appears in development mode, or if `debug: true` is passed to authMiddleware)