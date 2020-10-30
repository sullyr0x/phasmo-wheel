import { html } from '../../lib/lit-html.js';
import BaseElement from '../../BaseElement.js';

class ItemSidebar extends BaseElement {
  static properties = {
    personalRules: { type: Array },
    teamRule: { type: Array },
    items: { type: Array },
    itemsToBring: { type: Array },
    showLegend: { type: Boolean }
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
    const { itemsToBring, teamRule, personalRules, showLegend, handleShowLegendToggle } = this;

    const rules = [teamRule, ...personalRules].filter(Boolean);

    return html`
      <div class="wrapper">
        <h2>Items To Bring</h2>
        <h3 
          class="legend-label" 
          @click=${handleShowLegendToggle}
          ?show=${showLegend}
        >Legend</h3>
        <ul class="legend" ?show=${showLegend}>
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
          <li>
            <span class="required">(1)</span>
            means a challenge requires bringing at least this many of this item
          </li>       
        </ul>
        <hr />
        <h3>Items</h3>
        <ul>
          ${itemsToBring.map(({ id, name, quantity, min, max }) => {
            const requiredQuantity = rules.reduce((sum, { require = {} }) => sum + (require[id] || 0), 0);
            
            return html`
              <li
                ?under=${quantity < min && min > 0}
                ?none=${quantity === min}
                ?less=${quantity < max && quantity > min}
              >
                <span class="quantity">${Math.max(min, quantity)}x</span>
                <span class="name">${name}</span>
                ${requiredQuantity ? html`<span class="required">(${requiredQuantity})</span>` : ''}
              </li>
          `})}
        </ul>
      </div>
    `;
  }

  handleShowLegendToggle = () => {
    this.showLegend = !this.showLegend;
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
    ].filter(Boolean);

    this.itemsToBring = items
      .map(({ id, name, min, max }) => ({
        id,
        name,
        quantity: Math.max(
          Math.max(...rules.map(({ require = {} }) => require[id] || 0)),
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