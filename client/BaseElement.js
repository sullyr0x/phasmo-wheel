import {render} from './lib/lit-html.js';

const backingKeyPrefix = '__backing_'
const toBackingKey = key => `${backingKeyPrefix}${key}`;
const fromBackingKey = backingKey => backingKey.replace(backingKeyPrefix, '');
const isBackingKey = key => new RegExp(`^${backingKeyPrefix}`).test(key);

const registerHandler = (element, properties) => {
  const handler = {
    set: async (_, prop, value) => {
      if (isBackingKey(prop)) {
        if (element[prop] === value) return;

        const oldValue = element[prop];
        element[prop] = value;

        if (element.__isConnected) {
          render(element.render(), element);
          element.updated({ [fromBackingKey(prop)]: oldValue });
        }
      }

      return true;
    }
  };

  const proxy = new Proxy(element, handler);

  Object.keys(properties).forEach(key => {
    const backingKey = toBackingKey(key);

    Object.defineProperty(element, key, {
      get: () => proxy.hasOwnProperty(backingKey)
        ? proxy[backingKey]
        : element.getAttribute(key) || element.hasAttribute(key) || undefined,
      set: value => {
        proxy[backingKey] = value;
      }
    })
  });
};

export default class BaseElement extends HTMLElement {
  static properties = {};

  constructor() {
    super();

    this.__isConnected = false;

    registerHandler(this, this.constructor.properties);
  }

  connectedCallback() {
    this.__isConnected = true;

    render(this.render(), this);
  }

  disconnectedCallback() {
    this.__isConnected = false;
  }

  render() {}
  updated() {}
}