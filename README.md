# Cloudflare Workers Preact SSR

Proof of concent implementation using Cloudflare Workers to render Preact components based on props recieved from the backend.

## Demo

Backend Response: https://cloudflare-workers-preact-ssr.jakub300.now.sh/

Worker Response: https://cloudflare-workers-preact-ssr.jakub300.net/

## Commands/Deploy

```bash
yarn # install dependencies

now # deploy backend (must be installed locally)
now dev # can be used to run backend locally

yarn build-worker # bundles cloudflare worker (output file is workers/worker.bundle.js)
```

If Worker is running on different domain than backend (like in above Demo) `SOURCE_DOMAIN`/`TARGET_DOMAIN` variables must be updated in `worker/worker.js`.
