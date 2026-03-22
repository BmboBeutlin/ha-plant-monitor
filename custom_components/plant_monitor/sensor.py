"""Countdown sensors for Plant Monitor care tasks."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
import logging

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import async_track_time_interval

from .const import CONF_CARE_TASKS, CONF_PLANT_NAME, DOMAIN
from .entity import PlantMonitorEntity

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up countdown sensors for each care task."""
    entry_data = hass.data[DOMAIN]["entries"].get(entry.entry_id, {})
    care_tasks = entry_data.get("care_tasks", [])

    entities = []
    for task in care_tasks:
        entities.append(CareCountdownSensor(hass, entry, task))

    if entities:
        async_add_entities(entities)


class CareCountdownSensor(PlantMonitorEntity, SensorEntity):
    """Sensor showing days until a care task is due."""

    _attr_icon = "mdi:calendar-clock"
    _attr_native_unit_of_measurement = "d"

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        task: dict,
    ) -> None:
        """Initialize the countdown sensor."""
        super().__init__(entry)
        self._hass = hass
        self._task = task
        self._task_id = task["id"]
        self._interval_days = task["interval_days"]

        plant_name = entry.data[CONF_PLANT_NAME]
        self._attr_unique_id = f"{entry.entry_id}_{self._task_id}_due"
        self._attr_name = f"{task['name']}"
        self._attr_icon = task.get("icon", "mdi:calendar-clock")

        self._update_state()

    def _get_last_done(self) -> datetime | None:
        """Get the last time this task was completed."""
        care_log = self._hass.data[DOMAIN]["care_log"]
        entry_log = care_log.get(self._entry.entry_id, {})
        last_done_str = entry_log.get(self._task_id)

        if last_done_str:
            try:
                return datetime.fromisoformat(last_done_str)
            except (ValueError, TypeError):
                return None
        return None

    def _update_state(self) -> None:
        """Calculate days until due."""
        last_done = self._get_last_done()
        now = datetime.now(timezone.utc)

        if last_done is None:
            # Never done — mark as due now
            self._attr_native_value = 0
            self._attr_extra_state_attributes = {
                "last_done": None,
                "next_due": None,
                "interval_days": self._interval_days,
                "is_overdue": True,
                "status": "never_done",
                "task_name": self._task["name"],
            }
            return

        next_due = last_done.replace(
            hour=0, minute=0, second=0, microsecond=0
        ) + timedelta(days=self._interval_days)

        days_until = (next_due - now).days
        is_overdue = days_until < 0

        self._attr_native_value = days_until
        self._attr_extra_state_attributes = {
            "last_done": last_done.isoformat(),
            "next_due": next_due.isoformat(),
            "interval_days": self._interval_days,
            "is_overdue": is_overdue,
            "status": "overdue" if is_overdue else ("due_today" if days_until == 0 else "ok"),
            "task_name": self._task["name"],
        }

    async def async_added_to_hass(self) -> None:
        """Register update listeners when added to hass."""
        # Listen for care log events
        self.async_on_remove(
            self._hass.bus.async_listen(
                f"{DOMAIN}_care_logged", self._handle_care_logged
            )
        )

        # Periodic update (hourly)
        self.async_on_remove(
            async_track_time_interval(
                self._hass, self._handle_interval_update,
                timedelta(hours=1),
            )
        )

    @callback
    def _handle_care_logged(self, event: Event) -> None:
        """Handle care task completion event."""
        if (
            event.data.get("entry_id") == self._entry.entry_id
            and event.data.get("task_id") == self._task_id
        ):
            self._update_state()
            self.async_write_ha_state()

    @callback
    def _handle_interval_update(self, _now: datetime) -> None:
        """Handle periodic state update."""
        self._update_state()
        self.async_write_ha_state()
