import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { until } from 'lit/directives/until.js';
import { LogoXS } from './Logo';

async function fetchTargetAPY() {
  const resp = await fetch(
    'https://celo-on-chain-data-service.onrender.com/target-apy'
  );
  let json = await resp.json();

  return json['target_apy'].slice(0, 4);
}

export class ChurrofiWidgetsSM extends LitElement {
  static styles = css`
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    #churrofi-widget-sm {
      display: inline-block;
      font-family: 'Jost', sans-serif;
      width: auto;
      color: #505050;
      border: 2px solid #85e2b2;
      border-radius: 6px;
      padding: 20px 30px;
    }

    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h3 {
      font-size: 16px;
      margin: 0;
    }

    #logo {
      margin-left: 32px;
    }

    #sub {
      font-size: 14px;
      margin: 0;
      margin-top: 8px;
    }
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: white;
      background: #35d07f;
      margin-top: 20px;
      padding: 10px 0;
      border-radius: 6px;
      font-size: 14px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
    }
  `;

  @property({ type: String }) address = '';
  @property({ type: String }) name = '';

  @state()
  private APY: Promise<string> = fetchTargetAPY();

  render() {
    return html`
      <div id="churrofi-widget-sm">
        <div class="head">
          <h3>Earn Profits by Investing CELOs</h3>
          <div id="logo">${unsafeSVG(LogoXS)}</div>
        </div>
        <p id="sub">
          Invest CELO by voting for Anchorage & get
          ${until(this.APY, html`~5`)}% APY!
        </p>
        <a
          href="${`https://churrofi.app/app/invest?vg=${this.address}`}"
          target="_blank"
        >
          Vote for
          ${this.name
            ? html`${this.name}`
            : html`${this.address.slice(0, 8)}...`}
        </a>
      </div>
    `;
  }
}
// <div>
//   <p id="sub">
//     Invest CELO on ChurroFi & get upto ${until(this.APY, html`~5`)}% APY!
//   </p>
//   <p id="main-text">
//     Earn Profits by voting for $
//     {this.name ? html`${this.name}` : html`${this.address.slice(0, 8)}...`}
//   </p>
// </div>;