### Overview

This repo uses yarn2 without PnP. You can see the config in `yarnrc.yml`.

You'll need to run `yarn install` with dotenv cli or prefixing it with the env var due to how the REMIX_AUTH_TOKEN is set. But hey, if you're cloning this, you can do whatever makes you feel good.

```sh
cp env.example .env
# setup your environment variables
dotenv yarn install # or you can run: REMIX_AUTH_TOKEN=YOURTOKEN yarn install
yarn dev
```

You'll want a database - this is setup for postgres, and you can grab a free one from many different providers. Heroku, DigitalOcean, Fly.io, Render.com, Supabase.io, etc etc are all viable options. If you're developing locally, just add docker compose and add a postgres 11 config, expose the port, and connect to it.

---

# Welcome to Remix!

- [Remix Docs](https://docs.remix.run)
- [Customer Dashboard](https://remix.run/dashboard)

## Vercel Setup

First you'll need the [Vercel CLI](https://vercel.com/docs/cli):

```sh
npm i -g vercel
```

Before you can run the app in development, you need link this project to a new Vercel project on your account.

**It is important that you use a new project. If you try to link this project to an existing project (like a Next.js site) you will have problems.**

```sh
$ vercel link
```

Follow the prompts, and when its done you should be able to get started.

## Development

You will be running two processes during development when using Vercel as your server.

- Your Vercel server in one
- The Remix development server in another

```sh
# in one tab
$ vercel dev

# in another
$ npm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

If you'd rather run everything in a single tab, you can look at [concurrently](https://npm.im/concurrently) or similar tools to run both processes in one tab.

## Deploying

You will need to add your `REMIX_AUTH_TOKEN` to your server's environment:

If it looks something like that, then you can run these commands to add your npmrc from the command line:

```bash
$ vercel env add REMIX_AUTH_TOKEN yourtoken
```

You can also add this environment variable in your vercel project dashboard.

Once that's done you can deploy!

```sh
$ npm run build
# preview deployment
$ vercel

# production deployment
$ vercel --prod
```

### GitHub Automatic Deployments

For some reason the GitHub integration doesn't deploy the public folder. We're working with Vercel to figure this out.

For now, [you can set up a GitHub action with this config](https://gist.github.com/mcansh/91f8effda798b41bb373351fad217070) from our friend @mcansh.
