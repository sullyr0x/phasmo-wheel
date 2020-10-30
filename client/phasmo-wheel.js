import {html} from './lib/lit-html.js';
import BaseElement from './BaseElement.js';
import './components/spinner/spinner-panel.js';
import './components/rules/rule-sidebar.js';
import './components/items/item-sidebar.js';
import './components/help-sidebar.js';

const TEAM_SIDEBAR = 'team';
const PERSONAL_SIDEBAR = 'personal';
const ITEMS_SIDEBAR = 'items';
const HELP_SIDEBAR = 'help';

const normalizeDescription = description =>
  description && `<ul>
      <li>
        ${description.split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join('</li><li>')}
      </li>
  </ul>`;

const normalizeRule = rule => ({
  ...rule,
  weight: rule.weight || 1,
  active: true,
  description: normalizeDescription(rule.description)
});

class PhasmoWheel extends BaseElement {
  static properties = {
    activePersonalRules: { type: Array },
    activeTeamRules: { type: Array },
    personalRules: { type: Array },
    teamRules: { type: Array },
    showSidebar: { type: String },
    items: { type: Array },
    names: { type: Array },
    currentTeamRule: { type: Object },
    currentPersonalRules: { type: Array }
  };

  updated(changed) {
    if (this.personalRules && this.teamRules && !this.loaded) {
      this.loaded = true;
      this.parseUrl();
    }

    if (changed.hasOwnProperty('personalRules') && !this.currentPersonalRules[0]) {
      this.currentPersonalRules = this.currentPersonalRules.map(() => this.personalRules.find(({ active }) => active));
    }

    if (changed.hasOwnProperty('teamRules') && !this.currentTeamRule) {
      this.currentTeamRule = this.teamRules.find(({ active }) => active);
    }

    this.updateUrl();
  }

  constructor() {
    super();

    this.showSidebar = ITEMS_SIDEBAR;
    this.names = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
    this.currentPersonalRules = new Array(4).fill(undefined);

    // noinspection JSIgnoredPromiseFromCall
    this.loadData();
  }

  render() {
    const { activeTeamRules, activePersonalRules, names, currentTeamRule, currentPersonalRules,
      personalRules, teamRules, showSidebar, items,
      handleNameChange, handleRuleChange, handleTeamRuleChange, handleSpinAll,
      handlePersonalChange, handleTeamChange, handleToggleSidebar } = this;

    return html`
      <main>
        <header>
            <h1><a href="/">Phasmo-Wheel</a></h1>
            <buttons>
                <button 
                    id="toggle-team"
                    .sidebar=${TEAM_SIDEBAR}
                    @click=${handleToggleSidebar}
                    ?active=${showSidebar === TEAM_SIDEBAR}
                ></button>
                <button 
                    id="toggle-personal"
                    .sidebar=${PERSONAL_SIDEBAR}
                    @click=${handleToggleSidebar}
                    ?active=${showSidebar === PERSONAL_SIDEBAR}
                ></button>
                <button 
                    id="toggle-items"
                    .sidebar=${ITEMS_SIDEBAR}
                    @click=${handleToggleSidebar}
                    ?active=${showSidebar === ITEMS_SIDEBAR}
                ></button>
                <button 
                    id="toggle-help"
                    .sidebar=${HELP_SIDEBAR}
                    @click=${handleToggleSidebar}
                    ?active=${showSidebar === HELP_SIDEBAR}
                ></button>
            </buttons>
        </header>
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
      <rule-sidebar
        title="Team Rules"
        class="sidebar"
        ?show=${showSidebar === TEAM_SIDEBAR}
        .rules=${teamRules}
        @change=${handleTeamChange}
      ></rule-sidebar>
      <rule-sidebar 
        title="Personal Rules"
        class="sidebar"
        ?show=${showSidebar === PERSONAL_SIDEBAR}
        .rules=${personalRules}
        @change=${handlePersonalChange}
      ></rule-sidebar>
      <item-sidebar
        class="sidebar"
        ?show=${showSidebar === ITEMS_SIDEBAR}
        .personalRules=${currentPersonalRules}
        .teamRule=${currentTeamRule}
        .items=${items}
      ></item-sidebar>
      <help-sidebar
        class="sidebar"
        ?show=${showSidebar === HELP_SIDEBAR}
      ></help-sidebar>
    `;
  }

  handleToggleSidebar = event => {
    const { sidebar } = event.currentTarget;

    this.showSidebar = this.showSidebar === sidebar ? undefined : sidebar;
  }

  handlePersonalChange = ({ detail: { rules }}) => {
    this.personalRules = rules;
    this.updateActiveRules();
  };

  handleTeamChange = ({ detail: { rules }}) => {
    this.teamRules = rules;
    this.updateActiveRules();
  };

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
    this.items = YAML.parse(await (await fetch('../data/items.yml')).text());

    this.personalRules = YAML.parse(await (await fetch('../data/personal-rules.yml')).text())
      .map(normalizeRule);

    this.teamRules = YAML.parse(await (await fetch('../data/team-rules.yml')).text())
      .map(normalizeRule);

    this.updateActiveRules();
  }

  updateActiveRules = () => {
    this.activePersonalRules = this.personalRules.filter(({ active }) => active);
    this.activeTeamRules = this.teamRules.filter(({ active }) => active);
  };

  updateUrl() {
    const { personalRules, teamRules, currentTeamRule, currentPersonalRules, names } = this;

    if (!teamRules || !personalRules || !currentTeamRule || !currentPersonalRules) return;

    document.location.hash = [
      currentTeamRule.id,
      currentPersonalRules.map(({ id } = {}) => id || 0).join('|'),
      teamRules.map(({ active }) => active ? 1 : 0).join(''),
      personalRules.map(({ active }) => active ? 1 : 0).join(''),
      names.join('|')
    ].join('-');
  }

  parseUrl() {
    try {
      const {personalRules, teamRules} = this;

      if (!personalRules || !teamRules || !document.location.hash) return;

      let [teamRuleId, personalRuleIds, activeTeamIds, activePersonalIds, names]
        = document.location.hash.slice(1).split('-');

      teamRuleId = parseInt(teamRuleId);
      activeTeamIds = activeTeamIds.split('').map(v => Boolean(parseInt(v)));
      activePersonalIds = activePersonalIds.split('').map(v => Boolean(parseInt(v)));

      this.currentTeamRule = teamRules.find(({id}) => teamRuleId === id);

      this.currentPersonalRules = personalRuleIds.split('|')
        .map(id => parseInt(id))
        .map(personalId => personalRules.find(({id}) => personalId === id));

      this.teamRules = this.teamRules.map((rule, index) => ({...rule, active: activeTeamIds[index]}));

      this.personalRules = this.personalRules
        .map((rule, index) => ({...rule, active: activePersonalIds[index]}));

      this.names = names.split('|').map(name => decodeURIComponent(name));

      this.updateActiveRules();
    } catch (_) {} // if we fail to parse, we'll just skip it
  }
}

customElements.define('phasmo-wheel', PhasmoWheel);