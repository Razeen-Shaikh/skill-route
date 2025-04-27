# Skill Route

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Install Docker

If you haven't installed Docker yet, download and install it from the official website:

- [Download Docker](https://www.docker.com/get-started/)

Make sure Docker is running before proceeding.

### Running with Docker & PostgreSQL

If you already have Docker files set up, simply run the following command to start your Next.js app along with PostgreSQL:

```bash
docker-compose up -d
```

### Running PostgreSQL Database Locally

If you want to run PostgreSQL locally, you can use the following command:

```bash
npx prisma migrate dev --name init
npx prisma db push
```

### Seed Database

```bash
npx prisma db seed
```

### Open Database Studio

You can open the database studio using the following command:

```bash
npx prisma studio
```

or to connect to the database on the command line

```bash
docker-compose exec postgres psql -U admin -d learning_platform -W
```

### Running the Development Server Without Docker

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

### Login with Email and Password

email: alice@mail.com
password: password123

### Close Docker

```bash
docker-compose down
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
