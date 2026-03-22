"""Plant Monitor - Link Zigbee2MQTT plant sensors with a plant care library."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

import voluptuous as vol

from aiohttp import web

from homeassistant.components import panel_custom, websocket_api
from homeassistant.components.http import HomeAssistantView, StaticPathConfig
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


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
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
    store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
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

    # Register custom panel in sidebar
    try:
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path="plant-monitor",
            webcomponent_name="plant-monitor-panel",
            sidebar_title="Pflanzen",
            sidebar_icon="mdi:flower",
            module_url=f"{URL_BASE}/frontend/plant-monitor-panel.js?v={VERSION}",
            require_admin=False,
            config={},
        )
    except Exception:
        _LOGGER.exception("Failed to register panel")

    # Register WebSocket API
    _register_websocket_api(hass)

    # Register photo upload endpoint
    _register_photo_upload(hass)

    # Ensure photo directory exists
    photo_dir = Path(hass.config.path("www")) / "plant_monitor"
    await hass.async_add_executor_job(photo_dir.mkdir, 0o755, True, True)

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
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


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a Plant Monitor config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN]["entries"].pop(entry.entry_id, None)
    return unload_ok


def _register_photo_upload(hass: HomeAssistant) -> None:
    """Register HTTP endpoint for photo uploads."""
    hass.http.register_view(PlantPhotoUploadView)


class PlantPhotoUploadView(HomeAssistantView):
    """HTTP view for plant photo upload."""

    url = "/api/plant_monitor/upload/{entry_id}"
    name = "api:plant_monitor:upload"
    requires_auth = True

    async def post(self, request: web.Request, entry_id: str) -> web.Response:
        """Handle POST upload."""
        hass = request.app["hass"]
        if entry_id not in hass.data[DOMAIN].get("entries", {}):
            return self.json({"error": "Invalid entry_id"}, status_code=400)

        # Read raw body (simpler than multipart for single file)
        data = await request.read()
        if len(data) > 10 * 1024 * 1024:
            return self.json({"error": "File too large (max 10MB)"}, status_code=413)
        if len(data) == 0:
            return self.json({"error": "No data"}, status_code=400)

        content_type = request.content_type or "image/jpeg"
        ext = {
            "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp",
        }.get(content_type, ".jpg")

        photo_dir = Path(hass.config.path("www")) / "plant_monitor"
        await hass.async_add_executor_job(_ensure_dir, photo_dir)

        # Remove old photos
        for old_ext in (".jpg", ".jpeg", ".png", ".webp"):
            old_file = photo_dir / f"{entry_id}{old_ext}"
            if old_file.exists():
                await hass.async_add_executor_job(old_file.unlink)

        photo_path = photo_dir / f"{entry_id}{ext}"
        await hass.async_add_executor_job(_write_file, photo_path, data)

        return self.json({
            "success": True,
            "url": f"/local/plant_monitor/{entry_id}{ext}",
        })


def _ensure_dir(path: Path) -> None:
    """Ensure directory exists."""
    path.mkdir(parents=True, exist_ok=True)


def _write_file(path: Path, data: bytes) -> None:
    """Write binary data to file."""
    with open(path, "wb") as f:
        f.write(data)


def _load_json(path: Path) -> list:
    """Load JSON file from disk."""
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def _register_websocket_api(hass: HomeAssistant) -> None:
    """Register WebSocket commands for the frontend."""

    @websocket_api.websocket_command({
        vol.Required("type"): "plant_monitor/get_plants",
    })
    @websocket_api.async_response
    async def ws_get_plants(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        """Return all configured plants with library data."""
        entries = hass.data[DOMAIN]["entries"]
        care_log = hass.data[DOMAIN]["care_log"]
        plants = []

        photo_dir = Path(hass.config.path("www")) / "plant_monitor"
        for entry_id, entry_data in entries.items():
            # Check if a photo exists
            photo_url = None
            for ext in (".jpg", ".jpeg", ".png", ".webp"):
                photo_path = photo_dir / f"{entry_id}{ext}"
                if photo_path.exists():
                    photo_url = f"/local/plant_monitor/{entry_id}{ext}"
                    break

            plant = {
                "entry_id": entry_id,
                "config": entry_data["config"],
                "plant_info": entry_data["plant_info"],
                "care_tasks": entry_data["care_tasks"],
                "care_log": care_log.get(entry_id, {}),
                "photo_url": photo_url,
            }
            plants.append(plant)

        connection.send_result(msg["id"], {"plants": plants})

    @websocket_api.websocket_command({
        vol.Required("type"): "plant_monitor/log_care",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
    })
    @websocket_api.async_response
    async def ws_log_care(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
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

    @websocket_api.websocket_command({
        vol.Required("type"): "plant_monitor/delete_photo",
        vol.Required("entry_id"): str,
    })
    @websocket_api.async_response
    async def ws_delete_photo(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        """Delete plant photo."""
        entry_id = msg["entry_id"]
        photo_dir = Path(hass.config.path("www")) / "plant_monitor"

        deleted = False
        for ext in (".jpg", ".jpeg", ".png", ".webp"):
            photo_path = photo_dir / f"{entry_id}{ext}"
            if await hass.async_add_executor_job(photo_path.exists):
                await hass.async_add_executor_job(photo_path.unlink)
                deleted = True

        connection.send_result(msg["id"], {"success": deleted})

    websocket_api.async_register_command(hass, ws_get_plants)
    websocket_api.async_register_command(hass, ws_log_care)
    websocket_api.async_register_command(hass, ws_delete_photo)
