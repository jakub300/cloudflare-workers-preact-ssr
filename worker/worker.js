import components from '../shared/components';
import render from 'preact-render-to-string';
import { h } from 'preact';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

function escAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/'/g, '&apos;');
}

const SOURCE_DOMAIN = 'https://cloudflare-workers-preact-ssr.jakub300.net/';
const SOURCE_DOMAIN_LENGTH = SOURCE_DOMAIN.length;
const TARGET_DOMAIN = 'https://cloudflare-workers-preact-ssr.jakub300.now.sh/';

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = request.url.startsWith(SOURCE_DOMAIN)
    ? `${TARGET_DOMAIN}${request.url.substr(SOURCE_DOMAIN_LENGTH)}`
    : request.url;
  const res = await fetch(url, request);

  const contentType = res.headers.get('content-type');
  if (!(contentType && contentType.includes('text/html'))) {
    return res;
  }

  const { readable: readableTransform, writable } = new TransformStream();
  const newResponse = new Response(readableTransform, res);

  const reader = res.body.getReader();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder('utf-8', { fatal: true });

  let body = '';

  (async () => {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        body += decoder.decode(undefined, { stream: false });

        const newBody = body.replace(
          /<!-- PREACT-COMPONENT (\w+) ([\w\+\/=]+) -->/g,
          (_, name, propsBase64) => {
            const props = JSON.parse(atob(propsBase64));
            console.log(props);
            if (!components[name]) {
              return `<!-- Component ${name} not found -->`;
            } else {
              const preactComponent = render(h(components[name], props));
              const propsStr = escAttr(JSON.stringify(props));

              return `<div class="js-preact-component" data-name="${name}" data-props='${propsStr}'>${preactComponent}</div>`;
            }
          },
        );

        await writer.write(encoder.encode(newBody));
        await writer.close();

        break;
      }

      body += decoder.decode(value, { stream: true });
    }
  })().catch(e => {
    console.log(e);
  });

  return newResponse;
}
