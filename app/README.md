## Overview

This is a [Next.js](https://nextjs.org/) application, it's built using Typescript, React and Apollo client.

It's meant to be used in pair with the Graphql API provided in the same repo (`../api` directory).

In order to **avoid** installing a [couple of binary dependencies](https://github.com/yakovmeister/pdf2image/blob/HEAD/docs/gm-installation.md), a docker image definition is provided.

## Setup

Just run `docker compose up` in this directory (remember to launch the API!).

## Known issues / To Do

- SSR and Apollo client aren't working nicely (due to Subscriptions). Basically the server-rendered version isn't what React is expecting in the front end. I'm not sure yet, but probably needs some work to make sure the DOM is the same in the first client-side render.
- I would like to display the first slide in each item the Decks grid (`/<company handler>`).

---

### (Original Next.js Readme below)

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
