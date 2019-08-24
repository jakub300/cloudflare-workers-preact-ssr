const [start, end] = require('fs')
  .readFileSync('dist/index.html', 'utf8')
  .split('<div id="body"></div>');

function renderComponent(name, props = {}) {
  const propsBase64 = Buffer.from(JSON.stringify(props)).toString('base64');
  return `<!-- PREACT-COMPONENT ${name} ${propsBase64} -->`;
}

module.exports = async (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.end(`
    ${start}
    <h1>Preact SSR in Cloudflare Workers</h1>

    <h2>Hello</h2>
    ${renderComponent('Hello')}

    <h2>Now</h2>
    ${renderComponent('Now', { dateString: new Date().toString() })}

    <h2>TodoList</h2>
    ${renderComponent('TodoList', {
      todos: [
        'Some',
        'Todos',
        'Returned',
        'From',
        'Server',
        'Are',
        'Initial',
        'State',
      ].map(text => ({ text })),
    })}

    <h2>SomeNotExistingComponent</h2>
    ${renderComponent('SomeNotExistingComponent', { hello: 'world' })}
    ${end}
  `);
};
