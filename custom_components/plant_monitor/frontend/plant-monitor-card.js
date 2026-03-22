/**
 * Plant Monitor Card — foto-zentrierte Pflanzen-Card (LitElement)
 *
 * Shows: plant photo as background, name overlay, status dot,
 * compact data bar (temp, moisture, battery)
 */

class PlantMonitorCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._plant = null;
    this._hass = null;
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  set plant(plant) {
    this._plant = plant;
    this._render();
  }

  _getStateValue(entityId) {
    if (!this._hass || !entityId) return null;
    const state = this._hass.states[entityId];
    if (!state || state.state === "unavailable" || state.state === "unknown") return null;
    return parseFloat(state.state);
  }

  _getStatus() {
    if (!this._plant || !this._plant.plant_info) return "unknown";

    const config = this._plant.config;
    const info = this._plant.plant_info;
    const entities = config.entities || {};

    const temp = this._getStateValue(entities.temperature);
    const moisture = this._getStateValue(entities.soil_moisture);

    let hasIssue = false;

    if (temp !== null && info.temperature) {
      if (temp < info.temperature.min || temp > info.temperature.max) hasIssue = true;
    }
    if (moisture !== null && info.soil_moisture) {
      if (moisture < info.soil_moisture.min || moisture > info.soil_moisture.max) hasIssue = true;
    }

    // Check care tasks for overdue
    const careLog = this._plant.care_log || {};
    const careTasks = this._plant.care_tasks || [];
    const now = Date.now();

    for (const task of careTasks) {
      const lastDone = careLog[task.id];
      if (!lastDone) {
        hasIssue = true;
        break;
      }
      const nextDue = new Date(lastDone).getTime() + task.interval_days * 86400000;
      if (now > nextDue) {
        hasIssue = true;
        break;
      }
    }

    return hasIssue ? "alarm" : "ok";
  }

  _render() {
    if (!this._plant) return;

    const config = this._plant.config;
    const info = this._plant.plant_info || {};
    const entities = config.entities || {};

    const temp = this._getStateValue(entities.temperature);
    const moisture = this._getStateValue(entities.soil_moisture);
    const battery = this._getStateValue(entities.battery);
    const status = this._getStatus();
    const imageUrl = info.image_url || "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          cursor: pointer;
        }
        .card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: var(--card-background-color, #1e2229);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }
        .image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        .plant-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 32px 14px 10px;
          background: linear-gradient(transparent, rgba(0,0,0,0.75));
        }
        .plant-name {
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          text-shadow: 0 1px 4px rgba(0,0,0,0.8);
          line-height: 1.2;
        }
        .plant-species {
          color: rgba(255,255,255,0.7);
          font-size: 0.72rem;
          font-style: italic;
          text-shadow: 0 1px 3px rgba(0,0,0,0.6);
        }
        .status-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .status-dot.ok {
          background: #3a9a5c;
        }
        .status-dot.alarm {
          background: #c43030;
        }
        .status-dot.unknown {
          background: #666;
        }
        .data-bar {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 8px 12px;
          background: var(--card-background-color, #1e2229);
          border-top: 1px solid rgba(255,255,255,0.07);
          font-size: 0.75rem;
          color: var(--primary-text-color, #c8d0db);
          font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
        }
        .data-item {
          display: flex;
          align-items: center;
          gap: 4px;
          opacity: 0.9;
        }
        .data-icon {
          font-size: 0.85rem;
        }
        .data-value {
          font-weight: 500;
        }
        .no-image {
          width: 100%;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card-background-color, #1e2229);
          color: var(--secondary-text-color, #7a8494);
          font-size: 3rem;
        }
      </style>
      <div class="card">
        <div class="image-container">
          ${imageUrl
            ? `<img class="plant-image" src="${imageUrl}" alt="${info.common_name || ''}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'no-image\\'>🌱</div>'">`
            : '<div class="no-image">🌱</div>'
          }
          <div class="image-overlay">
            <div class="plant-name">${config.plant_name || ''}</div>
            <div class="plant-species">${info.scientific_name || ''}</div>
          </div>
          <div class="status-dot ${status}"></div>
        </div>
        <div class="data-bar">
          ${temp !== null ? `
            <div class="data-item">
              <span class="data-icon">🌡</span>
              <span class="data-value">${temp.toFixed(1)}°C</span>
            </div>
          ` : ''}
          ${moisture !== null ? `
            <div class="data-item">
              <span class="data-icon">💧</span>
              <span class="data-value">${Math.round(moisture)}%</span>
            </div>
          ` : ''}
          ${battery !== null ? `
            <div class="data-item">
              <span class="data-icon">${battery > 50 ? '🔋' : battery > 20 ? '🪫' : '⚠️'}</span>
              <span class="data-value">${Math.round(battery)}%</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define("plant-monitor-card", PlantMonitorCard);
