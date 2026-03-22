/**
 * Plant Monitor Card — SVG plant icons + smart updates (no flicker)
 */

// SVG icons per plant type (light_level based)
const PLANT_ICONS = {
  tropical: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 70V42" stroke="#4a7a5a" stroke-width="3" stroke-linecap="round"/>
    <path d="M40 42c-8-12-24-14-28-8s8 14 16 12" fill="#3a8a4a" opacity="0.9"/>
    <path d="M40 42c8-12 24-14 28-8s-8 14-16 12" fill="#2d7a3d" opacity="0.9"/>
    <path d="M40 50c-6-10-18-10-20-4s6 10 12 8" fill="#4a9a5a" opacity="0.8"/>
    <path d="M40 50c6-10 18-10 20-4s-6 10-12 8" fill="#3a8a4a" opacity="0.8"/>
    <ellipse cx="40" cy="72" rx="12" ry="3" fill="#3a3228" opacity="0.4"/>
  </svg>`,
  succulent: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="72" rx="16" ry="4" fill="#3a3228" opacity="0.4"/>
    <path d="M40 68V52" stroke="#5a8a5a" stroke-width="2.5"/>
    <ellipse cx="40" cy="48" rx="6" ry="10" fill="#5a9a6a" opacity="0.9" transform="rotate(0 40 48)"/>
    <ellipse cx="30" cy="52" rx="5" ry="9" fill="#4a8a5a" opacity="0.85" transform="rotate(20 30 52)"/>
    <ellipse cx="50" cy="52" rx="5" ry="9" fill="#4a8a5a" opacity="0.85" transform="rotate(-20 50 52)"/>
    <ellipse cx="24" cy="58" rx="4" ry="7" fill="#6aaa6a" opacity="0.7" transform="rotate(35 24 58)"/>
    <ellipse cx="56" cy="58" rx="4" ry="7" fill="#6aaa6a" opacity="0.7" transform="rotate(-35 56 58)"/>
    <rect x="30" y="66" width="20" height="8" rx="2" fill="#8a6a4a" opacity="0.6"/>
  </svg>`,
  fern: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="72" rx="12" ry="3" fill="#3a3228" opacity="0.4"/>
    <path d="M40 70V45" stroke="#3a7a4a" stroke-width="2"/>
    <path d="M40 45c-3-5-12-8-18-6" stroke="#4a9a5a" stroke-width="1.5" fill="none"/>
    <path d="M40 45c3-5 12-8 18-6" stroke="#4a9a5a" stroke-width="1.5" fill="none"/>
    <path d="M40 50c-3-4-10-6-15-5" stroke="#4a9a5a" stroke-width="1.5" fill="none"/>
    <path d="M40 50c3-4 10-6 15-5" stroke="#4a9a5a" stroke-width="1.5" fill="none"/>
    <path d="M40 55c-3-4-8-5-12-4" stroke="#5aaa5a" stroke-width="1.5" fill="none"/>
    <path d="M40 55c3-4 8-5 12-4" stroke="#5aaa5a" stroke-width="1.5" fill="none"/>
    <path d="M40 60c-2-3-6-4-9-3" stroke="#5aaa5a" stroke-width="1.5" fill="none"/>
    <path d="M40 60c2-3 6-4 9-3" stroke="#5aaa5a" stroke-width="1.5" fill="none"/>
    <path d="M38 40c-4-8-14-12-20-8" stroke="#3a8a4a" stroke-width="1.5" fill="none"/>
    <path d="M42 40c4-8 14-12 20-8" stroke="#3a8a4a" stroke-width="1.5" fill="none"/>
  </svg>`,
  cactus: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="72" rx="14" ry="3" fill="#3a3228" opacity="0.4"/>
    <rect x="34" y="35" width="12" height="35" rx="6" fill="#4a8a4a"/>
    <rect x="18" y="42" width="8" height="18" rx="4" fill="#5a9a5a"/>
    <rect x="54" y="38" width="8" height="14" rx="4" fill="#5a9a5a"/>
    <path d="M26 42h8" stroke="#4a8a4a" stroke-width="4" stroke-linecap="round"/>
    <path d="M54 45h8" stroke="#4a8a4a" stroke-width="4" stroke-linecap="round"/>
    <circle cx="38" cy="38" r="1" fill="#f0e060"/>
    <circle cx="42" cy="42" r="0.8" fill="#f0e060"/>
    <rect x="30" y="66" width="20" height="8" rx="2" fill="#8a6a4a" opacity="0.6"/>
  </svg>`,
  herb: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="72" rx="12" ry="3" fill="#3a3228" opacity="0.4"/>
    <rect x="30" y="64" width="20" height="10" rx="3" fill="#8a6a4a" opacity="0.6"/>
    <path d="M36 64V50" stroke="#5a8a3a" stroke-width="2"/>
    <path d="M40 64V46" stroke="#5a8a3a" stroke-width="2"/>
    <path d="M44 64V52" stroke="#5a8a3a" stroke-width="2"/>
    <circle cx="36" cy="47" r="4" fill="#6aaa4a" opacity="0.8"/>
    <circle cx="40" cy="43" r="4.5" fill="#5a9a3a" opacity="0.85"/>
    <circle cx="44" cy="49" r="3.5" fill="#6aaa4a" opacity="0.8"/>
    <circle cx="38" cy="40" r="3" fill="#7aba5a" opacity="0.7"/>
    <circle cx="43" cy="44" r="3" fill="#7aba5a" opacity="0.7"/>
  </svg>`,
  flowering: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="72" rx="12" ry="3" fill="#3a3228" opacity="0.4"/>
    <path d="M40 70V48" stroke="#4a7a4a" stroke-width="2.5"/>
    <path d="M40 55c-5-4-14-4-16 0s6 8 10 5" fill="#4a8a4a" opacity="0.8"/>
    <path d="M40 55c5-4 14-4 16 0s-6 8-10 5" fill="#3a7a3a" opacity="0.8"/>
    <circle cx="40" cy="38" r="5" fill="#c8a040"/>
    <ellipse cx="40" cy="30" rx="4" ry="6" fill="#d4748a" opacity="0.85"/>
    <ellipse cx="34" cy="35" rx="4" ry="6" fill="#d4748a" opacity="0.8" transform="rotate(60 34 35)"/>
    <ellipse cx="46" cy="35" rx="4" ry="6" fill="#d4748a" opacity="0.8" transform="rotate(-60 46 35)"/>
    <ellipse cx="35" cy="43" rx="4" ry="6" fill="#d4748a" opacity="0.75" transform="rotate(120 35 43)"/>
    <ellipse cx="45" cy="43" rx="4" ry="6" fill="#d4748a" opacity="0.75" transform="rotate(-120 45 43)"/>
  </svg>`,
  default: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="72" rx="12" ry="3" fill="#3a3228" opacity="0.4"/>
    <path d="M40 70V48" stroke="#4a7a5a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M40 48c-6-8-18-10-20-4s8 10 14 8" fill="#4a9a5a" opacity="0.85"/>
    <path d="M40 48c6-8 18-10 20-4s-8 10-14 8" fill="#3a8a4a" opacity="0.85"/>
    <path d="M40 56c-4-6-12-6-14-2s5 8 10 5" fill="#5aaa5a" opacity="0.7"/>
  </svg>`,
};

function getPlantIcon(plantInfo) {
  if (!plantInfo) return PLANT_ICONS.default;
  const id = plantInfo.id || "";
  const lightLevel = (plantInfo.placement && plantInfo.placement.light_level) || "";

  // Match by plant type keywords
  if (id.match(/kaktus|cactus|mammillaria|opuntia|euphorbia/i)) return PLANT_ICONS.cactus;
  if (id.match(/echever|haworth|crassula|sedum|senecio|kalanchoe|aloe/i)) return PLANT_ICONS.succulent;
  if (id.match(/farn|fern|nephro|asplen|adiatum|asparagus/i)) return PLANT_ICONS.fern;
  if (id.match(/basil|rosmar|minze|mint|petersil|thymian|lavend|ocimum|mentha|salvia/i)) return PLANT_ICONS.herb;
  if (id.match(/orchid|begon|kalanchoe|spathi|anthu|strelitz/i)) return PLANT_ICONS.flowering;
  if (id.match(/monstera|philod|pothos|epipr|calath|alocas|maran|dracae|ficus|dieff|syngon|croton/i)) return PLANT_ICONS.tropical;

  // Fallback by light level
  if (lightLevel === "full_sun") return PLANT_ICONS.succulent;
  if (lightLevel === "shade") return PLANT_ICONS.fern;
  return PLANT_ICONS.default;
}

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
    const icon = getPlantIcon(info);

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
        .icon-container {
          position: relative; width: 100%; height: 180px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(30,34,41,1) 0%, rgba(24,32,28,1) 100%);
        }
        .plant-svg { width: 90px; height: 90px; }
        .name-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px 14px 10px;
          background: linear-gradient(transparent, rgba(0,0,0,0.5));
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
        <div class="icon-container">
          <div class="plant-svg">${icon}</div>
          <div class="name-overlay">
            <div class="plant-name">${config.plant_name || ''}</div>
            <div class="plant-species">${info.scientific_name || ''}</div>
          </div>
          <div class="status-dot ${status}"></div>
        </div>
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

// Export for panel
window.PlantMonitorCard = PlantMonitorCard;
window.getPlantIcon = getPlantIcon;
