import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { until } from 'lit/directives/until.js';
import { LogoSM } from './Logo';

async function fetchTargetAPY() {
  const resp = await fetch(
    'https://celo-on-chain-data-service.onrender.com/target-apy'
  );
  let json = await resp.json();

  return json['target_apy'].slice(0, 4);
}

export class ChurrofiWidgetsXS extends LitElement {
  static styles = css`
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    a {
      display: inline-flex;
      align-items: center;
      font-family: 'Jost', sans-serif;
      width: auto;
      text-decoration: none;
      color: #505050;
      border: 2px solid #85e2b2;
      border-radius: 6px;
      padding: 20px;
    }
    #logo {
      margin-right: 20px;
    }

    #sub {
      font-size: 14px;
      margin: 0;
    }
    #main-text {
      font-size: 20px;
      margin: 0;
      margin-top: 4px;
    }
  `;

  @property({ type: String }) address = '';
  @property({ type: String }) name = '';

  @state()
  private APY: Promise<string> = fetchTargetAPY();

  render() {
    return html`
      <a
        id="churrofi-widget-xs"
        href="${`https://churrofi.app/app/invest?vg=${this.address}`}"
        target="_blank"
        ><div id="logo">${unsafeSVG(LogoSM)}</div>
        <div>
          <p id="sub">
            Invest CELO on ChurroFi & get upto ${until(this.APY, html`~5`)}%
            APY!
          </p>
          <p id="main-text">
            Earn Profits by voting for
            ${this.name
              ? html`${this.name}`
              : html`${this.address.slice(0, 8)}...`}
          </p>
        </div>
      </a>
    `;
  }
}
