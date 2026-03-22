/**
 * Plant Monitor Panel — Sidebar panel with room-grouped plant cards + detail popup
 */

import "./plant-monitor-card.js";

class PlantMonitorPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._plants = [];
    this._selectedPlant = null;
    this._loading = true;
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;

    // Load plants on first hass set
    if (!oldHass && hass) {
      this._loadPlants();
    }

    // Update child cards (smart update, no re-render)
    this.shadowRoot.querySelectorAll("plant-monitor-card").forEach((card) => {
      card.hass = hass;
    });

    // Update popup values if open (smart update, no DOM rebuild)
    if (this._selectedPlant) {
      this._updatePopupValues();
    }
  }

  set panel(panel) {
    this._panel = panel;
  }

  async _loadPlants() {
    try {
      const result = await this._hass.callWS({ type: "plant_monitor/get_plants" });
      this._plants = result.plants || [];
      this._loading = false;
      this._render();
    } catch (err) {
      console.error("Failed to load plants:", err);
      this._loading = false;
      this._plants = [];
      this._render();
    }
  }

  _getGroupedPlants() {
    const groups = {};
    for (const plant of this._plants) {
      const location = plant.config.location || "Unbekannt";
      if (!groups[location]) groups[location] = [];
      groups[location].push(plant);
    }
    return groups;
  }

  _render() {
    const groups = this._getGroupedPlants();
    const groupKeys = Object.keys(groups).sort();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 100vh;
          background: var(--primary-background-color, #111318);
          color: var(--primary-text-color, #c8d0db);
          font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
        }
        .header {
          padding: 16px 24px;
          font-size: 1.4rem;
          font-weight: 600;
        }
        .info-banner {
          margin: 0 24px 16px;
          padding: 12px 16px;
          background: var(--card-background-color, #1e2229);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.78rem;
          color: var(--secondary-text-color, #7a8494);
        }
        .info-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .info-text strong {
          color: var(--primary-text-color, #c8d0db);
        }
        .info-text code {
          background: rgba(255,255,255,0.06);
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.72rem;
        }
        .room-section {
          padding: 0 24px 24px;
        }
        .room-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: var(--secondary-text-color, #7a8494);
          font-size: 0.9rem;
        }
        .empty {
          text-align: center;
          padding: 60px 24px;
          color: var(--secondary-text-color, #7a8494);
        }
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }
        .empty-text {
          font-size: 0.9rem;
        }

        /* Detail Popup Overlay */
        .popup-overlay {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          z-index: 1000;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }
        .popup-overlay.open {
          display: flex;
        }
        .popup {
          background: var(--card-background-color, #1e2229);
          border-radius: 14px;
          max-width: 420px;
          width: 90%;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .popup-image {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-radius: 14px 14px 0 0;
          display: block;
        }
        .popup-close {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          border: none;
          color: #fff;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .popup-close:hover {
          background: rgba(0,0,0,0.7);
        }
        .popup-header {
          position: relative;
        }
        .popup-name-overlay {
          position: absolute;
          bottom: 0;
          left: 0; right: 0;
          padding: 24px 16px 12px;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
        }
        .popup-plant-name {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          text-shadow: 0 1px 4px rgba(0,0,0,0.8);
        }
        .popup-species {
          color: rgba(255,255,255,0.7);
          font-size: 0.78rem;
          font-style: italic;
        }
        .popup-body {
          padding: 16px;
        }
        .popup-section-title {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--secondary-text-color, #7a8494);
          font-weight: 700;
          margin: 16px 0 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .popup-section-title:first-child {
          margin-top: 0;
        }
        .sensor-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .sensor-label {
          color: var(--secondary-text-color, #7a8494);
          font-size: 0.75rem;
        }
        .sensor-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .status-badge {
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
        .photo-upload-btn {
          position: absolute; top: 10px; left: 10px;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(0,0,0,0.5); border: none; color: #fff;
          font-size: 1rem; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .photo-upload-btn:hover { background: rgba(0,0,0,0.7); }
        .status-ok { background: rgba(58,154,92,0.2); color: #3a9a5c; }
        .status-low { background: rgba(200,160,40,0.2); color: #c8a028; }
        .status-high { background: rgba(196,48,48,0.2); color: #c43030; }
        .range-bar-container {
          margin: 4px 0 8px;
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          position: relative;
        }
        .range-bar-ideal {
          position: absolute;
          height: 100%;
          background: rgba(58,154,92,0.3);
          border-radius: 2px;
        }
        .range-bar-value {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          top: -2px;
          transform: translateX(-50%);
        }
        .range-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.6rem;
          color: var(--secondary-text-color, #7a8494);
          opacity: 0.7;
          margin-bottom: 6px;
        }

        /* Care tasks in popup */
        .care-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .care-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .care-icon {
          font-size: 1rem;
          width: 24px;
          text-align: center;
        }
        .care-name {
          font-size: 0.75rem;
          color: var(--primary-text-color, #c8d0db);
        }
        .care-due {
          font-size: 0.7rem;
          color: var(--secondary-text-color, #7a8494);
        }
        .care-due.overdue {
          color: #c43030;
          font-weight: 600;
        }
        .care-btn {
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: var(--primary-text-color, #c8d0db);
          font-size: 0.65rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .care-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        /* Guide section */
        .guide-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 4px 0;
          font-size: 0.75rem;
          color: var(--primary-text-color, #c8d0db);
        }
        .guide-icon {
          flex-shrink: 0;
          width: 20px;
          text-align: center;
        }

        /* Scrollbar */
        .popup::-webkit-scrollbar { width: 4px; }
        .popup::-webkit-scrollbar-track { background: transparent; }
        .popup::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.09); border-radius: 4px; }
      </style>

      <div class="header">Pflanzen</div>

      <div class="info-banner">
        <span class="info-icon">ℹ️</span>
        <div class="info-text">
          <strong>MQTT Zigbee2MQTT Integration</strong><br>
          Die Sensordaten kommen direkt von deinen Zigbee2MQTT-Pflanzensensoren.
          Neue Pflanzen kannst du unter <strong>Einstellungen → Integrationen → Plant Monitor</strong> hinzufügen.
        </div>
      </div>

      ${this._loading ? '<div class="loading">Lade Pflanzen...</div>' : ''}

      ${!this._loading && this._plants.length === 0 ? `
        <div class="empty">
          <div class="empty-icon">🌱</div>
          <div class="empty-text">
            Noch keine Pflanzen konfiguriert.<br>
            Gehe zu <strong>Einstellungen → Integrationen</strong> und füge "Plant Monitor" hinzu.
          </div>
        </div>
      ` : ''}

      ${groupKeys.map(location => `
        <div class="room-section">
          <div class="room-title">${location}</div>
          <div class="cards-grid" data-location="${location}">
            ${groups[location].map((plant, idx) => `
              <plant-monitor-card
                data-entry-id="${plant.entry_id}"
                data-plant-index="${this._plants.indexOf(plant)}"
              ></plant-monitor-card>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <div class="popup-overlay" id="popup-overlay">
        <div class="popup" id="popup-content"></div>
      </div>
    `;

    // Set plant data on cards
    this.shadowRoot.querySelectorAll("plant-monitor-card").forEach((card) => {
      const idx = parseInt(card.dataset.plantIndex);
      card.plant = this._plants[idx];
      card.hass = this._hass;
      card.addEventListener("click", () => this._openPopup(this._plants[idx]));
    });

    // Close popup on overlay click
    const overlay = this.shadowRoot.getElementById("popup-overlay");
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) this._closePopup();
    });
  }

  _openPopup(plant) {
    this._selectedPlant = plant;
    this._renderPopup();
    this.shadowRoot.getElementById("popup-overlay").classList.add("open");
  }

  _closePopup() {
    this._selectedPlant = null;
    this.shadowRoot.getElementById("popup-overlay").classList.remove("open");
  }

  _renderPopup() {
    const plant = this._selectedPlant;
    if (!plant) return;

    const config = plant.config;
    const info = plant.plant_info || {};
    const entities = config.entities || {};
    const careTasks = plant.care_tasks || [];
    const careLog = plant.care_log || {};

    const temp = this._getStateValue(entities.temperature);
    const moisture = this._getStateValue(entities.soil_moisture);
    const battery = this._getStateValue(entities.battery);

    const popup = this.shadowRoot.getElementById("popup-content");

    // Temperature status
    let tempStatus = "ok", tempBadge = "OK";
    if (temp !== null && info.temperature) {
      if (temp < info.temperature.min) { tempStatus = "low"; tempBadge = "ZU KALT"; }
      else if (temp > info.temperature.max) { tempStatus = "high"; tempBadge = "ZU WARM"; }
    }

    // Moisture status
    let moistStatus = "ok", moistBadge = "OK";
    if (moisture !== null && info.soil_moisture) {
      if (moisture < info.soil_moisture.min) { moistStatus = "low"; moistBadge = "ZU TROCKEN"; }
      else if (moisture > info.soil_moisture.max) { moistStatus = "high"; moistBadge = "ZU NASS"; }
    }

    // Range bar helpers
    const rangeBar = (value, min, max, absMin, absMax, status) => {
      if (value === null) return '';
      const range = absMax - absMin;
      const idealLeft = ((min - absMin) / range) * 100;
      const idealWidth = ((max - min) / range) * 100;
      const valuePos = Math.max(0, Math.min(100, ((value - absMin) / range) * 100));
      const dotColor = status === "ok" ? "#3a9a5c" : status === "low" ? "#c8a028" : "#c43030";

      return `
        <div class="range-label">
          <span>${absMin}</span>
          <span>Ideal: ${min}–${max}</span>
          <span>${absMax}</span>
        </div>
        <div class="range-bar-container">
          <div class="range-bar-ideal" style="left:${idealLeft}%;width:${idealWidth}%"></div>
          <div class="range-bar-value" style="left:${valuePos}%;background:${dotColor}"></div>
        </div>
      `;
    };

    // Care tasks HTML
    const careHtml = careTasks.map(task => {
      const lastDone = careLog[task.id];
      let dueText = "Noch nie erledigt";
      let isOverdue = true;

      if (lastDone) {
        const lastDate = new Date(lastDone);
        const nextDue = new Date(lastDate.getTime() + task.interval_days * 86400000);
        const now = new Date();
        const daysUntil = Math.ceil((nextDue - now) / 86400000);

        if (daysUntil < 0) {
          dueText = `Überfällig seit ${Math.abs(daysUntil)} Tag${Math.abs(daysUntil) !== 1 ? 'en' : ''}!`;
          isOverdue = true;
        } else if (daysUntil === 0) {
          dueText = "Heute fällig";
          isOverdue = false;
        } else {
          dueText = `In ${daysUntil} Tag${daysUntil !== 1 ? 'en' : ''} fällig`;
          isOverdue = false;
        }
      }

      // Map icon names to emoji fallbacks
      const iconMap = {
        "mdi:watering-can": "💧",
        "mdi:spray": "🌫️",
        "mdi:hand-wash": "🧹",
        "mdi:flower": "🌱",
        "mdi:content-cut": "✂️",
        "mdi:pot": "🪴",
        "mdi:rotate-3d-variant": "🔄",
        "mdi:leaf": "🍃",
      };
      const icon = iconMap[task.icon] || "🍃";

      return `
        <div class="care-row">
          <div class="care-info">
            <span class="care-icon">${icon}</span>
            <div>
              <div class="care-name">${task.name}</div>
              <div class="care-due ${isOverdue ? 'overdue' : ''}">${dueText}</div>
            </div>
          </div>
          <button class="care-btn" data-entry-id="${plant.entry_id}" data-task-id="${task.id}">
            ✓ Erledigt
          </button>
        </div>
      `;
    }).join('');

    const photoUrl = plant.photo_url || null;
    const plantIcon = window.getPlantIcon ? window.getPlantIcon(info) : '';

    popup.innerHTML = `
      <div class="popup-header">
        ${photoUrl
          ? `<img class="popup-image" src="${photoUrl}" alt="${config.plant_name || ''}"
               style="filter: contrast(1.1) saturate(0.85) brightness(0.9);">`
          : `<div class="popup-image" style="height:180px;display:flex;align-items:center;justify-content:center;
               background:linear-gradient(135deg,#1e2229,#182018);">
               <div style="width:120px;height:120px;">${plantIcon}</div>
             </div>`
        }
        <button class="popup-close" id="popup-close-btn">✕</button>
        <label class="photo-upload-btn" id="photo-upload-label" title="Foto hochladen">
          📷
          <input type="file" accept="image/*" id="photo-upload-input"
                 style="display:none" data-entry-id="${plant.entry_id}">
        </label>
        <div class="popup-name-overlay">
          <div class="popup-plant-name">${config.plant_name || ''}</div>
          <div class="popup-species">${info.scientific_name || ''}</div>
        </div>
      </div>
      <div class="popup-body">
        <div class="popup-section-title">Aktuelle Werte</div>

        ${temp !== null ? `
          <div class="sensor-row">
            <span class="sensor-label">Temperatur</span>
            <span class="sensor-value">
              <span data-popup="temp">${temp.toFixed(1)}°C</span>
              ${info.temperature ? `<span class="status-badge status-${tempStatus}">${tempBadge}</span>` : ''}
            </span>
          </div>
          ${info.temperature ? rangeBar(temp, info.temperature.min, info.temperature.max, 0, 45, tempStatus) : ''}
        ` : ''}

        ${moisture !== null ? `
          <div class="sensor-row">
            <span class="sensor-label">Bodenfeuchtigkeit</span>
            <span class="sensor-value">
              <span data-popup="moisture">${Math.round(moisture)}%</span>
              ${info.soil_moisture ? `<span class="status-badge status-${moistStatus}">${moistBadge}</span>` : ''}
            </span>
          </div>
          ${info.soil_moisture ? rangeBar(moisture, info.soil_moisture.min, info.soil_moisture.max, 0, 100, moistStatus) : ''}
        ` : ''}

        ${battery !== null ? `
          <div class="sensor-row">
            <span class="sensor-label">Batterie</span>
            <span class="sensor-value"><span data-popup="battery">${Math.round(battery)}%</span></span>
          </div>
        ` : ''}

        ${careTasks.length > 0 ? `
          <div class="popup-section-title">Pflege</div>
          ${careHtml}
        ` : ''}

        ${info.placement || info.light ? `
          <div class="popup-section-title">Standort</div>
        ` : ''}

        ${info.placement ? `
          <div class="guide-item">
            <span class="guide-icon">☀️</span>
            <span>${info.placement.light_label || info.light || ''}</span>
          </div>
          <div class="guide-item">
            <span class="guide-icon">📏</span>
            <span>${info.placement.window_distance || ''}</span>
          </div>
          <div class="guide-item">
            <span class="guide-icon">🧭</span>
            <span>${info.placement.window_direction || ''}</span>
          </div>
          ${info.placement.avoid && info.placement.avoid.length > 0 ? `
            <div class="guide-item">
              <span class="guide-icon">⚠️</span>
              <span>Vermeiden: ${info.placement.avoid.join(', ')}</span>
            </div>
          ` : ''}
          ${info.placement.tips ? `
            <div class="guide-item">
              <span class="guide-icon">💡</span>
              <span>${info.placement.tips}</span>
            </div>
          ` : ''}
        ` : info.light ? `
          <div class="guide-item">
            <span class="guide-icon">☀️</span>
            <span>${info.light}</span>
          </div>
        ` : ''}

        ${info.care_tips ? `
          <div class="popup-section-title">Pflege-Tipps</div>
          <div class="guide-item">
            <span class="guide-icon">📝</span>
            <span>${Array.isArray(info.care_tips) ? info.care_tips.join('. ') : info.care_tips}</span>
          </div>
        ` : ''}
      </div>
    `;

    // Event listeners
    popup.querySelector("#popup-close-btn").addEventListener("click", () => this._closePopup());

    // Photo upload handler
    const uploadInput = popup.querySelector("#photo-upload-input");
    if (uploadInput) {
      uploadInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const entryId = uploadInput.dataset.entryId;

        try {
          const token = this._hass.auth.data.access_token;
          const resp = await fetch(`/api/plant_monitor/upload/${entryId}`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": file.type,
            },
            body: file,
          });
          const result = await resp.json();
          if (result.success) {
            plant.photo_url = result.url + "?t=" + Date.now();
            this._renderPopup();
            this._render();
            this._openPopup(plant);
          }
        } catch (err) {
          console.error("Upload failed:", err);
        }
      });
    }

    popup.querySelectorAll(".care-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const entryId = btn.dataset.entryId;
        const taskId = btn.dataset.taskId;

        try {
          await this._hass.callWS({
            type: "plant_monitor/log_care",
            entry_id: entryId,
            task_id: taskId,
          });

          // Update local care log
          if (!plant.care_log) plant.care_log = {};
          plant.care_log[taskId] = new Date().toISOString();

          // Re-render popup and cards
          this._renderPopup();
          this._render();
          // Re-open popup since _render rebuilds DOM
          this._openPopup(plant);
        } catch (err) {
          console.error("Failed to log care:", err);
        }
      });
    });
  }

  /** Smart update — only patch values in existing popup DOM */
  _updatePopupValues() {
    const plant = this._selectedPlant;
    if (!plant) return;
    const popup = this.shadowRoot.getElementById("popup-content");
    if (!popup) return;

    const config = plant.config;
    const entities = config.entities || {};
    const temp = this._getStateValue(entities.temperature);
    const moisture = this._getStateValue(entities.soil_moisture);
    const battery = this._getStateValue(entities.battery);

    const el = (sel) => popup.querySelector(sel);
    const tempEl = el('[data-popup="temp"]');
    const moistEl = el('[data-popup="moisture"]');
    const battEl = el('[data-popup="battery"]');

    if (tempEl && temp !== null) tempEl.textContent = `${temp.toFixed(1)}°C`;
    if (moistEl && moisture !== null) moistEl.textContent = `${Math.round(moisture)}%`;
    if (battEl && battery !== null) battEl.textContent = `${Math.round(battery)}%`;
  }

  _getStateValue(entityId) {
    if (!this._hass || !entityId) return null;
    const state = this._hass.states[entityId];
    if (!state || state.state === "unavailable" || state.state === "unknown") return null;
    return parseFloat(state.state);
  }
}

customElements.define("plant-monitor-panel", PlantMonitorPanel);
