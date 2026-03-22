"""Plant Monitor - Link Zigbee2MQTT plant sensors with a plant care library."""

from __future__ import annotations

import json
import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    CONF_CARE_TASKS,
    CONF_PLANT_SPECIES,
    DOMAIN,
    PLATFORMS,
    STORAGE_KEY,
    STORAGE_VERSION,
    URL_BASE,
    VERSION,
)

_LOGGER = logging.getLogger(__name__)

type PlantMonitorConfigEntry = ConfigEntry


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up Plant Monitor integration (once, not per entry)."""
    hass.data.setdefault(DOMAIN, {
        "library": {},
        "entries": {},
        "store": None,
        "care_log": {},
        "frontend_registered": False,
    })

    # Load plant library
    library_path = Path(__file__).parent / "data" / "plant_library.json"
    try:
        library_data = await hass.async_add_executor_job(
            _load_json, library_path
        )
        hass.data[DOMAIN]["library"] = {
            plant["id"]: plant for plant in library_data
        }
        _LOGGER.info("Loaded %d plants from library", len(library_data))
    except Exception:
        _LOGGER.exception("Failed to load plant library")
        return False

    # Set up persistent storage for care log
    store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    hass.data[DOMAIN]["store"] = store
    stored_data = await store.async_load()
    if stored_data:
        hass.data[DOMAIN]["care_log"] = stored_data

    # Register frontend assets (once)
    if not hass.data[DOMAIN]["frontend_registered"]:
        frontend_dir = str(Path(__file__).parent / "frontend")
        await hass.http.async_register_static_paths([
            StaticPathConfig(
                url_path=f"{URL_BASE}/frontend",
                path=frontend_dir,
                cache_headers=False,
            )
        ])
        hass.data[DOMAIN]["frontend_registered"] = True

    # Register panel
    hass.components.frontend.async_register_built_in_panel(
        component_name="custom",
        sidebar_title="Pflanzen",
        sidebar_icon="mdi:flower",
        frontend_url_path="plant-monitor",
        config={
            "_panel_custom": {
                "name": "plant-monitor-panel",
                "module_url": f"{URL_BASE}/frontend/plant-monitor-panel.js?v={VERSION}",
            }
        },
        require_admin=False,
    )

    # Register WebSocket API
    _register_websocket_api(hass)

    return True


async def async_setup_entry(hass: HomeAssistant, entry: PlantMonitorConfigEntry) -> bool:
    """Set up a Plant Monitor config entry."""
    species_id = entry.data[CONF_PLANT_SPECIES]
    library = hass.data[DOMAIN]["library"]
    plant_info = library.get(species_id, {})

    # Merge library care tasks with user-configured ones
    care_tasks = entry.data.get(CONF_CARE_TASKS, [])
    if not care_tasks and plant_info:
        care_tasks = plant_info.get("care_tasks", [])

    hass.data[DOMAIN]["entries"][entry.entry_id] = {
        "config": dict(entry.data),
        "plant_info": plant_info,
        "care_tasks": care_tasks,
    }

    # Initialize care log for this entry if not exists
    if entry.entry_id not in hass.data[DOMAIN]["care_log"]:
        hass.data[DOMAIN]["care_log"][entry.entry_id] = {}

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: PlantMonitorConfigEntry) -> bool:
    """Unload a Plant Monitor config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN]["entries"].pop(entry.entry_id, None)
    return unload_ok


def _load_json(path: Path) -> list:
    """Load JSON file from disk."""
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def _register_websocket_api(hass: HomeAssistant) -> None:
    """Register WebSocket commands for the frontend."""
    from homeassistant.components import websocket_api

    @websocket_api.websocket_command({
        "type": "plant_monitor/get_plants",
    })
    @websocket_api.async_response
    async def ws_get_plants(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        """Return all configured plants with library data."""
        entries = hass.data[DOMAIN]["entries"]
        care_log = hass.data[DOMAIN]["care_log"]
        plants = []

        for entry_id, entry_data in entries.items():
            plant = {
                "entry_id": entry_id,
                "config": entry_data["config"],
                "plant_info": entry_data["plant_info"],
                "care_tasks": entry_data["care_tasks"],
                "care_log": care_log.get(entry_id, {}),
            }
            plants.append(plant)

        connection.send_result(msg["id"], {"plants": plants})

    @websocket_api.websocket_command({
        "type": "plant_monitor/log_care",
        "entry_id": str,
        "task_id": str,
    })
    @websocket_api.async_response
    async def ws_log_care(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        """Log a care task as completed."""
        from datetime import datetime, timezone

        entry_id = msg["entry_id"]
        task_id = msg["task_id"]
        now = datetime.now(timezone.utc).isoformat()

        care_log = hass.data[DOMAIN]["care_log"]
        if entry_id not in care_log:
            care_log[entry_id] = {}
        care_log[entry_id][task_id] = now

        # Persist to storage
        store = hass.data[DOMAIN]["store"]
        await store.async_save(care_log)

        # Fire event so sensors update
        hass.bus.async_fire(f"{DOMAIN}_care_logged", {
            "entry_id": entry_id,
            "task_id": task_id,
            "timestamp": now,
        })

        connection.send_result(msg["id"], {"success": True})

    websocket_api.async_register_command(hass, ws_get_plants)
    websocket_api.async_register_command(hass, ws_log_care)
