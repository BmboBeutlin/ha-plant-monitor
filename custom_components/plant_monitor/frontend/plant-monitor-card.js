/**
 * Plant Monitor Card — SVG plant icons + smart updates (no flicker)
 * Icons loaded from plant-icons.js
 */
import "./plant-icons.js";

class PlantMonitorCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._plant = null;
    this._hass = null;
    this._rendered = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (this._rendered) {
      this._updateValues();
    } else {
      this._render();
    }
  }

  set plant(plant) {
    this._plant = plant;
    this._rendered = false;
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
    const careLog = this._plant.care_log || {};
    const careTasks = this._plant.care_tasks || [];
    const now = Date.now();
    for (const task of careTasks) {
      const lastDone = careLog[task.id];
      if (!lastDone) { hasIssue = true; break; }
      const nextDue = new Date(lastDone).getTime() + task.interval_days * 86400000;
      if (now > nextDue) { hasIssue = true; break; }
    }
    return hasIssue ? "alarm" : "ok";
  }

  /** Only update values + status dot — no DOM rebuild */
  _updateValues() {
    if (!this._plant || !this._rendered) return;
    const config = this._plant.config;
    const entities = config.entities || {};
    const temp = this._getStateValue(entities.temperature);
    const moisture = this._getStateValue(entities.soil_moisture);
    const battery = this._getStateValue(entities.battery);
    const status = this._getStatus();

    const el = (sel) => this.shadowRoot.querySelector(sel);
    const tempEl = el('[data-field="temp"]');
    const moistEl = el('[data-field="moisture"]');
    const battEl = el('[data-field="battery"]');
    const dotEl = el('.status-dot');

    if (tempEl) tempEl.textContent = temp !== null ? `${temp.toFixed(1)}°C` : '--';
    if (moistEl) moistEl.textContent = moisture !== null ? `${Math.round(moisture)}%` : '--';
    if (battEl) battEl.textContent = battery !== null ? `${Math.round(battery)}%` : '--';
    if (dotEl) { dotEl.className = `status-dot ${status}`; }
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
    const photoUrl = this._plant.photo_url || null;
    const icon = window.getPlantIcon ? window.getPlantIcon(info) : '';
    const hasPhoto = !!photoUrl;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; cursor: pointer; }
        .card {
          position: relative; border-radius: 12px; overflow: hidden;
          background: var(--card-background-color, #1e2229);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.4); }

        /* Photo mode */
        .image-container {
          position: relative; width: 100%; height: 200px; overflow: hidden;
        }
        .plant-photo {
          width: 100%; height: 100%; object-fit: cover; display: block;
          /* Stylization filters */
          filter: contrast(1.1) saturate(0.85) brightness(0.9);
        }
        .photo-vignette {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%);
          pointer-events: none;
        }

        /* SVG icon mode */
        .icon-container {
          position: relative; width: 100%; height: 180px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(30,34,41,1) 0%, rgba(24,32,28,1) 100%);
        }
        .plant-svg { width: 110px; height: 110px; }

        .name-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px 14px 10px;
          background: linear-gradient(transparent, rgba(0,0,0,0.65));
        }
        .plant-name {
          color: #fff; font-size: 0.85rem; font-weight: 600;
          text-shadow: 0 1px 3px rgba(0,0,0,0.6); line-height: 1.2;
        }
        .plant-species {
          color: rgba(255,255,255,0.6); font-size: 0.68rem; font-style: italic;
        }
        .status-dot {
          position: absolute; top: 10px; right: 10px;
          width: 12px; height: 12px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
        }
        .status-dot.ok { background: #3a9a5c; }
        .status-dot.alarm { background: #c43030; }
        .status-dot.unknown { background: #555; }
        .data-bar {
          display: flex; justify-content: space-around; align-items: center;
          padding: 8px 10px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 0.72rem; color: var(--primary-text-color, #c8d0db);
        }
        .data-item { display: flex; align-items: center; gap: 4px; opacity: 0.85; }
        .data-icon { width: 14px; height: 14px; opacity: 0.7; }
      </style>
      <div class="card">
        ${hasPhoto ? `
          <div class="image-container">
            <img class="plant-photo" src="${photoUrl}" alt="${config.plant_name || ''}" loading="lazy">
            <div class="photo-vignette"></div>
        ` : `
          <div class="icon-container">
            <div class="plant-svg">${icon}</div>
        `}
          <div class="name-overlay">
            <div class="plant-name">${config.plant_name || ''}</div>
            <div class="plant-species">${info.scientific_name || ''}</div>
          </div>
          <div class="status-dot ${status}"></div>
        </div><!-- close image/icon container -->
        <div class="data-bar">
          <div class="data-item">
            <svg class="data-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-1.1 0-2-.9-2-2 0-.78.45-1.45 1.1-1.78L12 5l.9 7.22c.65.33 1.1 1 1.1 1.78 0 1.1-.9 2-2 2z" fill="currentColor" opacity="0.7"/></svg>
            <span data-field="temp">${temp !== null ? `${temp.toFixed(1)}°C` : '--'}</span>
          </div>
          <div class="data-item">
            <svg class="data-icon" viewBox="0 0 24 24"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" fill="currentColor" opacity="0.7"/></svg>
            <span data-field="moisture">${moisture !== null ? `${Math.round(moisture)}%` : '--'}</span>
          </div>
          <div class="data-item">
            <svg class="data-icon" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.34C7 21.4 7.6 22 8.33 22h7.34c.73 0 1.33-.6 1.33-1.33V5.33C17 4.6 16.4 4 15.67 4z" fill="currentColor" opacity="0.7"/></svg>
            <span data-field="battery">${battery !== null ? `${Math.round(battery)}%` : '--'}</span>
          </div>
        </div>
      </div>
    `;
    this._rendered = true;
  }
}

customElements.define("plant-monitor-card", PlantMonitorCard);
