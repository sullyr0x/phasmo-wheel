import { html } from '../../lib/lit-html.js';
import BaseElement from '../../BaseElement.js';
import './spinner-wheel.js'

class SpinnerPanel extends BaseElement {
  static properties = {
    name: { type: String },
    rules: { type: Array },
    editable: { type: Boolean },
    currentRule: { type: Object }
  };

  render() {
    const { name, rules, editable, currentRule, handleNameChange } = this;

    return html`
      ${editable ? html`
        <input value=${name} @change=${handleNameChange}>
      ` : html`
        <h2>${name}</h2>
      `}
      <spinner-wheel
        .rules=${rules}
        .currentRule=${currentRule}
      ></spinner-wheel>
      ${currentRule ? html`
        <rule>
          <h3>
            ${currentRule.name}
          </h3>
        </rule>
      ` : ''}
    `;
  }

  handleNameChange = ({ currentTarget: { value: name } }) => {
    this.dispatchEvent(new CustomEvent('name-change', { detail: { name } }));
  };
}

customElements.define('spinner-panel', SpinnerPanel);