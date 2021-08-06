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

export class ChurrofiWidgetsXL extends LitElement {
  static styles = css`
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-family: 'Jost', sans-serif;
    }

    #churrofi-widget-sm {
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
      background: #f5f5f5;
      border: 2px solid #a8a8a8;
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

  @state()
  private APY: Promise<string> = fetchTargetAPY();

  @property({ type: String }) address = '';
  @property() name?: string;
  @property() celoAmount = 1000;
  @property() usdAmount = 3500;

  handleCeloChange(event: Event) {
    const inp = event.target as HTMLInputElement;
    console.log(inp.value);
    if (inp.value === '') {
      this.celoAmount = 0;
    } else {
      this.celoAmount = Number(inp.value);
    }

    this.usdAmount = this.celoAmount * 3.5;
  }
  handleUSDChange(event: Event) {
    const inp = event.target as HTMLInputElement;
    console.log(inp.value);
    if (inp.value === '') this.usdAmount = 0;
    else this.usdAmount = Number(inp.value);

    this.celoAmount = this.usdAmount === 0 ? 0 : this.usdAmount / 3.3;
  }

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
        <div id="investment-calc">
          <div id="input-div">
            <label class="label"> If you invest: </label>
            <input
              type="number"
              .value=${this.celoAmount}
              @input=${this.handleCeloChange}
            />
          </div>
          <div id="earning">
            <p class="label">You could be earning:</p>
            <p id="earning-value">
              $ ${(this.usdAmount * 0.05).toFixed(1)} <span>(anually)</span>
            </p>
          </div>
        </div>
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
