"""Base entity for Plant Monitor."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.entity import DeviceInfo, Entity

from .const import CONF_PLANT_NAME, CONF_PLANT_SPECIES, DOMAIN


class PlantMonitorEntity(Entity):
    """Base class for Plant Monitor entities."""

    _attr_has_entity_name = True

    def __init__(self, entry: ConfigEntry) -> None:
        """Initialize the entity."""
        self._entry = entry
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=entry.data[CONF_PLANT_NAME],
            manufacturer="Plant Monitor",
            model=entry.data.get(CONF_PLANT_SPECIES, "Unknown"),
            entry_type=None,
        )
