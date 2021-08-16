import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
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

export class ChurrofiWidgetsMD extends LitElement {
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
      margin-left: 52px;
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
      padding: 0 20px;
      text-align: center;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    #investment-calc > input {
      border: none;
      background: transparent;
      font-size: inherit;
      color: inherit;
      width: 7ch;
      text-align: center;
      border-bottom: 1.75px solid #505050;
      padding: 0;
    }

    input:focus {
      outline: none;
    }
  `;

  @state()
  private APY: Promise<string> = fetchTargetAPY();

  @property({ type: String }) address = '';
  @property() name?: string;
  @property() celoAmount = 1000;
  @property() usdAmount = 3000;
  @property() theme?: string = 'white';

  handleCeloChange(event: Event) {
    const inp = event.target as HTMLInputElement;
    console.log(inp.value);
    if (inp.value === '') {
      this.celoAmount = 0;
      inp.style.width = `5ch`;
    } else {
      this.celoAmount = Number(inp.value);
      inp.style.width = `${inp.value.length + 2}ch`;
    }

    this.usdAmount = this.celoAmount * 3;
  }
  handleUSDChange(event: Event) {
    const inp = event.target as HTMLInputElement;
    console.log(inp.value);
    if (inp.value === '') this.usdAmount = 0;
    else this.usdAmount = Number(inp.value);

    this.celoAmount = this.usdAmount === 0 ? 0 : this.usdAmount / 3;

    inp.style.width = `${inp.value.length + 2}ch`;
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

    return html`
      <div id="churrofi-widget-sm" style=${styleMap(parentStyles)}>
        <div class="head">
          <h3>Earn Profits by Investing CELOs</h3>
          <div id="logo">${unsafeSVG(LogoXS)}</div>
        </div>
        <p id="sub">
          Invest CELO by voting for Anchorage & get
          ${until(this.APY, html`~5`)}% APY!
        </p>
        <p id="investment-calc">
          If you invest
          <input
            type="number"
            .value=${this.celoAmount}
            @input=${this.handleCeloChange}
          />
          CELOs ($
          <input
            type="number"
            .value=${this.usdAmount}
            @input=${this.handleUSDChange}
          />), you could be earning $ ${(this.usdAmount * 0.051).toFixed(1)}
          annually.
        </p>
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
