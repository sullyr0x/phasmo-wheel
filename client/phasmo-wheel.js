import {html} from './lib/lit-html.js';
import BaseElement from './BaseElement.js';
import './components/spinner-panel.js';

class PhasmoWheel extends BaseElement {
  static properties = {
    activePersonalRules: { type: Array },
    activeTeamRules: { type: Array },
    personalRules: { type: Array },
    teamRules: { type: Array },
    items: { type: Array },
    names: { type: Array },
    currentTeamRule: { type: Object },
    currentPersonalRules: { type: Array }
  };

  constructor() {
    super();

    this.names = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
    this.currentPersonalRules = new Array(4);

    // noinspection JSIgnoredPromiseFromCall
    this.loadData();
  }

  render() {
    const { activeTeamRules, activePersonalRules, names, currentTeamRule, currentPersonalRules,
      handleNameChange, handleRuleChange, handleTeamRuleChange, handleSpinAll } = this;

    return html`
      <main>
        <h1>Phasmo-Wheel</h1>
        <team-wheel>
          <spinner-panel 
            .rules=${activeTeamRules} 
            .currentRule=${currentTeamRule}
            name="Team"
            @rule-change=${handleTeamRuleChange}
          ></spinner-panel>
        </team-wheel>
        <personal-wheels>
          ${names.map((name, index) => html`
            <spinner-panel 
              .rules=${activePersonalRules} 
              .currentRule=${currentPersonalRules[index]}
              index=${index}
              name=${name}
              editable
              @name-change=${handleNameChange}
              @rule-change=${handleRuleChange}
            ></spinner-panel>
          `)}
        </personal-wheels>
        <spin-all @click=${handleSpinAll}>
          Spin All
        </spin-all>
      </main>
    `;
  }

  handleNameChange = event => {
    const index = parseInt(event.currentTarget.getAttribute('index'));
    const { name } = event.detail;

    this.names = [
      ...this.names.slice(0, index),
      name,
      ...this.names.slice(index + 1)
    ];
  };

  handleTeamRuleChange = ({ detail: { rule } }) => {
    this.currentTeamRule = rule;
  };

  handleRuleChange = event => {
    const index = parseInt(event.currentTarget.getAttribute('index'));
    const { rule } = event.detail;

    this.currentPersonalRules = [
      ...this.currentPersonalRules.slice(0, index),
      rule,
      ...this.currentPersonalRules.slice(index + 1)
    ];
  };

  handleSpinAll = () => {
    [...document.querySelectorAll('spinner-wheel canvas')].forEach(canvas => canvas.click());
  };

  async loadData() {
    this.personalRules = (await (await fetch('../data/personal-rules.json')).json())
      .map(rule => ({ ...rule, active: true }));
    this.activePersonalRules = this.personalRules;

    this.teamRules = (await (await fetch('../data/team-rules.json')).json())
      .map(rule => ({ ...rule, active: true }));
    this.activeTeamRules = this.teamRules;

    this.items = await (await fetch('../data/items.json')).json();
  }

  updateUrl() {
  }
}

customElements.define('phasmo-wheel', PhasmoWheel);