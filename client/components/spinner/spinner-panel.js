import {html, unsafeHTML} from '../../lib/lit-html.js';
import BaseElement from '../../BaseElement.js';
import './spinner-wheel.js'

class SpinnerPanel extends BaseElement {
  static properties = {
    name: { type: String },
    rules: { type: Array },
    editable: { type: Boolean },
    currentRule: { type: Object },
    showPopup: { type: Boolean }
  };

  updated(changed) {
    if (changed.hasOwnProperty('rules') && this.rules.length && !this.currentRule?.id) {
      this.currentRule = this.rules[0];
    }
  }

  render() {
    const { name, rules, editable, currentRule, showPopup, handleShowPopup, handleHidePopup, handleNameChange } = this;

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
      ${currentRule && currentRule.id ? html`
        <rule>
          <h3 @click=${handleShowPopup}>
            ${currentRule.name}
            <button class="popup-help"></button>
          </h3>
        </rule>
      ` : ''}
      ${showPopup ? html`
        <popup @click=${handleHidePopup}>
          <div class="content">
            <button class="popup-close" @click=${handleHidePopup}></button>
            <h3>${currentRule.name}</h3>
            <p class="summary">${currentRule.summary}</p>
            ${currentRule.description ? html`
              <hr />
              <div>
                ${unsafeHTML(currentRule.description)}
              </div>
            `: ''}
          </div>
        </popup>
      ` : ''}
    `;
  }

  handleShowPopup = () => {
    this.showPopup = true;
    document.body.classList.add('hasPopup');
  };

  handleHidePopup = event => {
    console.log(event.composedPath());
    if (![...this.querySelectorAll('popup, popup .popup-close')].includes((event.path || event.composedPath())[0])) return;

    this.showPopup = false;
    document.body.classList.remove('hasPopup');
  };

  handleNameChange = ({ currentTarget: { value: name } }) => {
    this.dispatchEvent(new CustomEvent('name-change', { detail: { name } }));
  };
}

customElements.define('spinner-panel', SpinnerPanel);