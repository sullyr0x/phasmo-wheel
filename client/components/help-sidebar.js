import {html} from '../lib/lit-html.js';
import BaseElement from '../BaseElement.js';

class ItemSidebar extends BaseElement {
  render() {
    return html`
      <div class="wrapper">
        <h2>Help &amp; About</h2>
        <h3>Help</h3>
        <ul>
          <li>
            Click a player name to modify.
          </li>
          <li>
            Click a spinner to spin or click Spin All to spin them all at once.
          </li>
          <li>
            Once it stops, you can see details of the rules by clicking the <i class="icon help"></i> next to them.
          </li>
          <li>
            Use the <span><i class="icon team"></i> Team Rules</span> and 
            <span><i class="icon personal"></i> Personal Rules</span> panels to activate and deactivate rules in the spinner.
          </li>
          <li>
            Check the <span><i class="icon items"></i> Items to Bring</span> tab to see what to bring based on 
            item restrictions from rules.
          </li>
        </ul>
        <h3>About</h3>
        <ul>
          <li>
            Phasmo-Wheel is inspired by the work of sullyr0x and many contributors.
          </li>
          <li>
            Check out the <a href="https://discord.gg/UPEceAz" target="_blank">Phasmo-Wheel Discord</a> to learn more.
          </li>
          <li>
            Site created by <a href="https://steamcommunity.com/profiles/76561198042481118/" target="_blank">Koga</a>.
          </li>
          <li>
            Code is open-source and hosted on <a href="https://github.com/samanime/phasmo-wheel" target="_blank">GitHub</a>.
          </li>
        </ul>
      </div>
    `;
  }
}

customElements.define('help-sidebar', ItemSidebar);