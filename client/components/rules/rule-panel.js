import {html, unsafeHTML} from '../../lib/lit-html.js';
import BaseElement from '../../BaseElement.js';

class RulePanel extends BaseElement {
  static properties = {
    rules: { type: Array }
  };

  render() {
    const { rules, handleToggleRule, handleAll, handleNone} = this;

    if (!rules) return;

    return html`
      <buttons>
        <button @click=${handleAll}>All</button>
        <button @click=${handleNone}>None</button>
      </buttons>
      <ul>
        ${rules.map(({ active, name, summary, description, weight = 1.0, restrict = [] }, index) => html`
          <li 
            ?active=${active}
            @click=${handleToggleRule},
            .index=${index}
          >
            <h3>${name}</h3>
            <p class="summary">${summary}</p>
            ${description ? html`
              <div class="description">
                ${unsafeHTML(description)}            
              </div>
            ` : ''}
          </li>
        `)}
      </ul>
    `;
  }

  handleAll = () => {
    const { rules } = this;

    this.dispatchChange(rules.map(rule => ({ ...rule, active: true })));
  };

  handleNone = () => {
    const { rules } = this;

    this.dispatchChange(rules.map(rule => ({ ...rule, active: false })));
  };

  handleToggleRule = event => {
    const { index } = event.currentTarget;
    const rule = this.rules[index];

    this.dispatchChange([
      ...this.rules.slice(0, index),
      { ...rule, active: !rule.active },
      ...this.rules.slice(index + 1)
    ]);
  };

  dispatchChange = rules => {
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { rules }
    }));
  };
}

customElements.define('rule-panel', RulePanel);