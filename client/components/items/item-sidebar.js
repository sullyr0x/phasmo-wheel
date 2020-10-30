import { html } from '../../lib/lit-html.js';
import BaseElement from '../../BaseElement.js';

class ItemSidebar extends BaseElement {
  static properties = {
    personalRules: { type: Array },
    teamRule: { type: Array },
    items: { type: Array },
    itemsToBring: { type: Array }
  }

  constructor() {
    super();

    this.itemsToBring = [];
  }

  updated(changed) {
    if (['personalRules', 'teamRule', 'items'].some(key => Object.keys(changed).includes(key))) {
      this.calculateItemsToBring();
    }
  }

  render() {
    const { itemsToBring } = this;

    return html`
      <div class="wrapper">
        <h2>Items To Bring</h2>
        <h3>Legend</h3>
        <ul class="legend">
          <li>
            <span class="quantity">3x</span> take max
          </li>
          <li less>
            <span class="quantity">3x</span> less than max
          </li>
          <li none>
            <span class="quantity">0x</span>
            means take none
          </li>
          <li under>
            <span class="quantity">1x</span>
            means the game forces you to take this quantity but don't use it
          </li>        
        </ul>
        <hr />
        <h3>Items</h3>
        <ul>
          ${itemsToBring.map(({ name, quantity, min, max }) => html`
            <li
              ?under=${quantity < min && min > 0}
              ?none=${quantity === min}
              ?less=${quantity < max && quantity > min}
            >
              <span class="quantity">${Math.max(min, quantity)}x</span>
              <span class="name">${name}</span>
            </li>
          `)}
        </ul>
      </div>
    `;
  }

  calculateItemsToBring() {
    const { personalRules, teamRule, items } = this;

    if (!personalRules || !teamRule || !items) {
      this.itemsToBring = [];
      return;
    }

    const rules = [
      ...personalRules,
      teamRule
    ];

    this.itemsToBring = items
      .map(({ id, name, min, max }) => ({
        id,
        name,
        quantity: Math.max(
          0,
          Math.min(
            ...rules.map(({ restrict = {} }) => restrict[id] ?? max),
            max - rules.reduce((sum, { reduce = {} }) => sum + (reduce[id] || 0), 0)
          )
        ),
        min,
        max
      }))
  }
}

customElements.define('item-sidebar', ItemSidebar);