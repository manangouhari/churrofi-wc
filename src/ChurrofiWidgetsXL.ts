import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { styleMap } from 'lit/directives/style-map.js';

import { until } from 'lit/directives/until.js';
import { LogoXS } from './Logo';

async function fetchTargetAPY() {
  const resp = await fetch(
    'https://celo-on-chain-data-service.onrender.com/target-apy'
  );
  let json = await resp.json();

  return json['target_apy'].slice(0, 4);
}

export class ChurrofiWidgetsXL extends LitElement {
  static get styles() {
    return css`
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-family: 'Jost', sans-serif;
      }

      #churrofi-widget-xl {
        display: inline-block;
        width: auto;
        color: #505050;
        border: 2px solid #85e2b2;
        border-radius: 6px;
        padding: 30px 40px;
        box-shadow: 0 2px 4px 0 rgba(30, 30, 30, 0.1);
      }

      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      h3 {
        font-size: 20px;
        margin: 0;
        font-weight: 500;
      }

      #logo {
        margin-left: 84px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #sub {
        font-size: 16px;
        margin: 0;
        margin-top: 10px;
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
        font-size: 16px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.25);
      }

      #investment-calc {
        margin-top: 30px;
        display: flex;
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      #input-div {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        margin-right: 20px;
      }

      #input-div > input {
        margin-top: 10px;
        font-size: 18px;
        border-radius: 6px;
        padding: 10px 20px;
        color: #505050;
      }

      input:focus {
        outline: none;
      }

      .label {
        font-size: 14px;
      }
      p {
        margin: 0;
      }

      #earning {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
      }

      .earning > p {
        margin: 0;
      }

      #earning-value {
        font-size: 20px;
        font-weight: 500;
        color: #2aa665;
        margin-bottom: 10px;
      }

      #earning-value > span {
        font-size: 12px;
      }
    `;
  }

  @state()
  private APY: Promise<string> = fetchTargetAPY();

  @property({ type: String }) address = '';
  @property() name?: string;
  @property() theme?: string = 'white';
  @property() celoAmount = 1000;
  @property() usdAmount = 3000;

  handleCeloChange(event: Event) {
    const inp = event.target as HTMLInputElement;
    console.log(inp.value);
    if (inp.value === '') {
      this.celoAmount = 0;
    } else {
      this.celoAmount = Number(inp.value);
    }

    this.usdAmount = this.celoAmount * 3;
  }
  handleUSDChange(event: Event) {
    const inp = event.target as HTMLInputElement;
    console.log(inp.value);
    if (inp.value === '') this.usdAmount = 0;
    else this.usdAmount = Number(inp.value);

    this.celoAmount = this.usdAmount === 0 ? 0 : this.usdAmount / 3;
  }

  render() {
    const WHITE = `#ffffff`;
    const GRAY = `#f5f5f5`;
    const DARK_GRAY = `#A8A8A8`;
    const LIGHT_GREEN = `#D6F5E5`;
    const GREEN = `#35D07F`;

    const parentStyles = {
      background:
        this.theme === 'white'
          ? WHITE
          : this.theme === 'green'
          ? LIGHT_GREEN
          : null,
    };

    const inputStyle = {
      background:
        this.theme === 'white'
          ? GRAY
          : this.theme === 'green'
          ? LIGHT_GREEN
          : null,
      border: `2px solid ${
        this.theme === 'white'
          ? DARK_GRAY
          : this.theme === 'green'
          ? GREEN
          : null
      }`,
    };

    return html`
      <div id="churrofi-widget-xl" style=${styleMap(parentStyles)}>
        <div class="head">
          <h3>Earn Profits by Investing CELOs</h3>
          <div id="logo">${unsafeSVG(LogoXS)}</div>
        </div>
        <p id="sub">
          Invest CELO by voting for Anchorage & get
          ${until(this.APY, html`~5`)}% APY!
        </p>
        <div id="investment-calc">
          <div id="input-div">
            <label class="label"> If you invest: </label>
            <input
              type="number"
              .value=${this.celoAmount}
              @input=${this.handleCeloChange}
              style=${styleMap(inputStyle)}
            />
          </div>
          <div id="earning">
            <p class="label">You could be earning:</p>
            <p id="earning-value">
              $ ${(this.usdAmount * 0.051).toFixed(1)} <span>(anually)</span>
            </p>
          </div>
        </div>
        <a
          href="${`https://churrofi.app/app/invest?vg=${this.address}&amount=${this.celoAmount}`}"
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

// If you invest
// <input
//   type="number"
//   .value=${this.celoAmount}
//   @input=${this.handleCeloChange}
// />
//           CELOs ($
//           <input
//             type="number"
//             .value=${this.usdAmount}
//             @input=${this.handleUSDChange}
//           />), you could be earning $ ${(this.usdAmount * 0.05).toFixed(1)}
//           annually.
