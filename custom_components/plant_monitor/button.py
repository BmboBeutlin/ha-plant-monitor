"""Care task buttons for Plant Monitor."""

from __future__ import annotations

from datetime import datetime, timezone
import logging

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CONF_CARE_TASKS, CONF_PLANT_NAME, DOMAIN
from .entity import PlantMonitorEntity

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up care task buttons."""
    entry_data = hass.data[DOMAIN]["entries"].get(entry.entry_id, {})
    care_tasks = entry_data.get("care_tasks", [])

    entities = []
    for task in care_tasks:
        entities.append(CareTaskButton(hass, entry, task))

    if entities:
        async_add_entities(entities)


class CareTaskButton(PlantMonitorEntity, ButtonEntity):
    """Button to mark a care task as completed."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        task: dict,
    ) -> None:
        """Initialize the care task button."""
        super().__init__(entry)
        self._hass = hass
        self._task = task
        self._task_id = task["id"]

        self._attr_unique_id = f"{entry.entry_id}_{self._task_id}_done"
        self._attr_name = f"{task['name']} erledigt"
        self._attr_icon = task.get("icon", "mdi:check-circle")

    async def async_press(self) -> None:
        """Handle button press — log care task as completed."""
        now = datetime.now(timezone.utc).isoformat()

        care_log = self._hass.data[DOMAIN]["care_log"]
        entry_id = self._entry.entry_id

        if entry_id not in care_log:
            care_log[entry_id] = {}
        care_log[entry_id][self._task_id] = now

        # Persist to storage
        store = self._hass.data[DOMAIN]["store"]
        await store.async_save(care_log)

        # Fire event so countdown sensors update
        self._hass.bus.async_fire(f"{DOMAIN}_care_logged", {
            "entry_id": entry_id,
            "task_id": self._task_id,
            "timestamp": now,
        })

        _LOGGER.info(
            "Care task '%s' marked as done for %s",
            self._task["name"],
            self._entry.data[CONF_PLANT_NAME],
        )
