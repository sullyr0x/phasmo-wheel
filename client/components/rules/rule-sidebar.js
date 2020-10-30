import { html } from '../../lib/lit-html.js';
import BaseElement from '../../BaseElement.js';
import './rule-panel.js';

class RuleSidebar extends BaseElement {
  static properties = {
    title: { type: String },
    rules: { type: Array }
  }

  render() {
    const { title, rules } = this;

    return html`
      <div class="wrapper">
        <h2>${title}</h2>
        <rule-panel
          .rules=${rules}
        ></rule-panel>
      </div>
    `;
  }
}

customElements.define('rule-sidebar', RuleSidebar);