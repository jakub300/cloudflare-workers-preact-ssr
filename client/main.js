import { h, render } from 'preact';
import components from '../shared/components';

function prepareDevComponents() {
  // When there is no Cloudflare find comments and replace on frontend
  const commentsNodes = [];
  (() => {
    const commentsIterator = document.evaluate(
      '//comment()',
      document,
      null,
      XPathResult.ANY_TYPE,
      null,
    );
    let node = commentsIterator.iterateNext();
    while (node) {
      commentsNodes.push(node);
      node = commentsIterator.iterateNext();
    }
  })();

  commentsNodes.forEach(comment => {
    const component = comment.textContent.match(
      /^ PREACT-COMPONENT (\w+) ([\w\+\/=]+) $/,
    );
    if (!component) return;

    const [, name, propsBase64] = component;
    const div = document.createElement('div');

    div.dataset.name = name;
    div.dataset.props = atob(propsBase64);
    div.classList.add('js-preact-component');

    const parent = comment.parentElement;
    parent.insertBefore(div, comment);
    parent.removeChild(comment);
  });
}

function addLogger() {
  // https://jsfiddle.net/developit/2vgozmvc/
  function watch(obj, method) {
    let p = obj[method];
    obj[method] = function(...args) {
      console.log(method + ' called: ', ...args);
      //debugger;
      return p.apply(this, args);
    };
  }
  watch(Element.prototype, 'appendChild');
  watch(Element.prototype, 'replaceChild');
  watch(Element.prototype, 'insertBefore');
}

function hydrateComponents() {
  document.querySelectorAll('.js-preact-component').forEach(el => {
    const { name, props: propsStr } = el.dataset;
    if (!name || !components[name]) return;
    const props = JSON.parse(propsStr);
    render(h(components[name], props), el, el.firstElementChild);
  });
}

prepareDevComponents();
addLogger();
hydrateComponents();
