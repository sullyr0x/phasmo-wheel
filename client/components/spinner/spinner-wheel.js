import { html } from '../../lib/lit-html.js';
import BaseElement from '../../BaseElement.js';

const colors = [
  '#333',
  '#433',
  '#343',
  '#334',
  '#434',
  '#344',
  '#443'
]

class SpinnerWheel extends BaseElement {
  static properties = {
    rules: { type: Array },
    rotation: { type: Number },
    currentRule: { type: Object }
  };

  get totalWeight() {
    return this.rules?.reduce((sum, { weight }) => sum + weight, 0);
  }

  updated(changed) {
    if (['rules', 'currentRule'].some(key => Object.keys(changed).includes(key))
      && this.currentRule?.id !== changed.currentRule?.id && !this.spinning) {
      this.rotateToRule();
    }

    this.canvas = this.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.renderCanvas();
  }

  constructor() {
    super();

    this.rules = [];
    this.rotation = 0.0;

    this.initialAccelerationVariance = 3.0;
    this.initialAcceleration = 10.0;
    this.acceleration = 0.0;
    this.velocity = 0.0;
    this.accelerationDecay = 5.0;
    this.velocityDecay = 1.0;

    const resizeObserver = new ResizeObserver(() => this.renderCanvas());

    resizeObserver.observe(this);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <canvas @click=${this.start}>
    `;
  }

  start = () => {
    this.acceleration = this.initialAcceleration + ((2 * Math.random() - 1) * this.initialAccelerationVariance);

    this.lastTick = Date.now();
    this.spinning = true;
    this.tick();
  };

  tick = () => {
    const currentRule = this.currentRule;
    const now = Date.now();
    const delta = Math.max(now - this.lastTick, 0.001) / 1000; // to avoid divide by 0
    this.lastTick = now;

    this.velocity += this.acceleration * delta;
    this.rotation += this.velocity * delta;
    this.rotation %= 2 * Math.PI;

    this.velocity = Math.max(0, this.velocity - this.velocityDecay * delta);
    this.acceleration = Math.max(0, this.acceleration - this.accelerationDecay * delta);

    clearTimeout(this.timeoutId);

    const newRule = this.calculateCurrentRule();

    if (currentRule !== newRule) {
      this.dispatchRuleChange(newRule);
    }

    if (this.velocity > 0 || this.acceleration > 0) {
      this.timeoutId = setTimeout(this.tick, 1000 / 120);
    } else {
      this.spinning = false;
    }
  };

  renderCanvas = () => {
    const { ctx, canvas, rotation, rules, totalWeight } = this;
    const padding = 10;

    if (!this.offsetWidth || !this.offsetHeight || !rules) return;

    const canvasSize = Math.min(this.offsetWidth, this.offsetHeight);
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation - Math.PI / 2);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.lineWidth = 6;
    ctx.strokeStyle = "#999";
    ctx.fillStyle="#333";
    ctx.beginPath();
    ctx.moveTo(canvas.width - padding, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - padding, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    rules.forEach(({ weight, name }, index) => {
      const angle = weight / totalWeight * 2 * Math.PI;

      ctx.beginPath();

      // Start in center
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      // Line to edge
      ctx.lineTo(canvas.width / 2, padding);
      // Arc over wedge
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 10, -Math.PI / 2, -Math.PI / 2 + angle, false);

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      ctx.lineTo(canvas.width / 2, padding);

      ctx.closePath();

      ctx.fillStyle = colors[index % colors.length];
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;

      ctx.fill();
      ctx.stroke();

      // Rotate half way through the angle for text
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-angle / 2);
      ctx.rotate(Math.PI / 2);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      ctx.fillStyle = '#FFF';
      ctx.font = '14px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(name, canvas.width / 4, canvas.height / 2, canvas.width / 2 - 20);

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.rotate(angle / 2);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    });

    ctx.restore();

    const triangleHeight = 12;
    const triangleWidth = 24;

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2 - triangleHeight / 2);
    ctx.lineTo(triangleWidth, canvas.height / 2);
    ctx.lineTo(0, canvas.height / 2 + triangleHeight / 2);
    ctx.closePath();

    ctx.fillStyle = '#933';
    ctx.fill();
  };

  dispatchRuleChange = rule => {
    this.dispatchEvent(new CustomEvent('rule-change', {
      detail: { rule },
      bubbles: true,
      composed: true
    }));
  };

  calculateCurrentRule = () => {
    const { rotation, rules, totalWeight } = this;

    if (!rules || !rules.length) return {};

    let angle = Math.PI * 2;
    let ruleIndex = -1;
    while (angle >= rotation) {
      ruleIndex++;
      ruleIndex %= rules.length;
      angle -= (rules[ruleIndex].weight) / totalWeight * Math.PI * 2;
    }

    return rules[ruleIndex];
  }

  rotateToRule = () => {
    const { currentRule: targetRule, rules, totalWeight } = this;

    if (!targetRule || !rules) return;

    const targetIndex = rules.findIndex(({ id }) => id === targetRule.id);

    const weightToMove = [
      ...rules.slice(0, targetIndex)
    ].reduce((sum, { weight }) => sum + weight, 0);

    this.rotation = (Math.PI * 2) * ((-weightToMove - (targetRule.weight / 2)) / totalWeight);
  }
}

customElements.define('spinner-wheel', SpinnerWheel);