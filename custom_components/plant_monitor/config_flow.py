"""Config flow for Plant Monitor integration."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)

from .const import (
    CONF_CARE_TASKS,
    CONF_ENTITIES,
    CONF_ENTITY_BATTERY,
    CONF_ENTITY_SOIL_MOISTURE,
    CONF_ENTITY_TEMPERATURE,
    CONF_LOCATION,
    CONF_PLANT_NAME,
    CONF_PLANT_SPECIES,
    DOMAIN,
)

_LOGGER = logging.getLogger(__name__)


class PlantMonitorConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Plant Monitor."""

    VERSION = 1

    def __init__(self) -> None:
        """Initialize the config flow."""
        self._data: dict[str, Any] = {}
        self._library: dict = {}

    def _get_library(self) -> dict:
        """Get plant library, loading from file if needed."""
        if self._library:
            return self._library

        # Try from hass.data first
        if self.hass and DOMAIN in self.hass.data:
            self._library = self.hass.data[DOMAIN].get("library", {})
            if self._library:
                return self._library

        # Fallback: load from file
        library_path = Path(__file__).parent / "data" / "plant_library.json"
        try:
            with open(library_path, encoding="utf-8") as f:
                plants = json.load(f)
                self._library = {p["id"]: p for p in plants}
        except Exception:
            _LOGGER.exception("Failed to load plant library in config flow")
            self._library = {}

        return self._library

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> dict:
        """Step 1: Select plant species from library."""
        library = await self.hass.async_add_executor_job(self._get_library)

        if user_input is not None:
            self._data[CONF_PLANT_SPECIES] = user_input[CONF_PLANT_SPECIES]
            return await self.async_step_details()

        # Build plant options from library
        options = [
            {
                "value": plant_id,
                "label": f"{plant['common_name']} ({plant['scientific_name']})",
            }
            for plant_id, plant in sorted(
                library.items(), key=lambda x: x[1]["common_name"]
            )
        ]

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required(CONF_PLANT_SPECIES): SelectSelector(
                    SelectSelectorConfig(
                        options=options,
                        mode=SelectSelectorMode.DROPDOWN,
                        sort=False,
                    )
                ),
            }),
        )

    async def async_step_details(
        self, user_input: dict[str, Any] | None = None
    ) -> dict:
        """Step 2: Enter plant name and location."""
        if user_input is not None:
            self._data[CONF_PLANT_NAME] = user_input[CONF_PLANT_NAME]
            self._data[CONF_LOCATION] = user_input[CONF_LOCATION]
            return await self.async_step_entities()

        # Suggest name from library
        library = self._get_library()
        species = library.get(self._data[CONF_PLANT_SPECIES], {})
        suggested_name = species.get("common_name", "")

        return self.async_show_form(
            step_id="details",
            data_schema=vol.Schema({
                vol.Required(
                    CONF_PLANT_NAME, default=suggested_name
                ): TextSelector(),
                vol.Required(CONF_LOCATION): TextSelector(),
            }),
        )

    async def async_step_entities(
        self, user_input: dict[str, Any] | None = None
    ) -> dict:
        """Step 3: Link existing HA sensor entities."""
        if user_input is not None:
            self._data[CONF_ENTITIES] = {
                CONF_ENTITY_TEMPERATURE: user_input.get(CONF_ENTITY_TEMPERATURE, ""),
                CONF_ENTITY_SOIL_MOISTURE: user_input.get(CONF_ENTITY_SOIL_MOISTURE, ""),
                CONF_ENTITY_BATTERY: user_input.get(CONF_ENTITY_BATTERY, ""),
            }
            return await self.async_step_care()

        return self.async_show_form(
            step_id="entities",
            data_schema=vol.Schema({
                vol.Optional(CONF_ENTITY_TEMPERATURE): EntitySelector(
                    EntitySelectorConfig(domain="sensor")
                ),
                vol.Optional(CONF_ENTITY_SOIL_MOISTURE): EntitySelector(
                    EntitySelectorConfig(domain="sensor")
                ),
                vol.Optional(CONF_ENTITY_BATTERY): EntitySelector(
                    EntitySelectorConfig(domain="sensor")
                ),
            }),
        )

    async def async_step_care(
        self, user_input: dict[str, Any] | None = None
    ) -> dict:
        """Step 4: Configure care tasks and intervals."""
        if user_input is not None:
            # Build care tasks from user input
            care_tasks = []
            library = self._get_library()
            species = library.get(self._data[CONF_PLANT_SPECIES], {})
            default_tasks = species.get("care_tasks", [])

            for task in default_tasks:
                task_id = task["id"]
                enabled_key = f"enable_{task_id}"
                interval_key = f"interval_{task_id}"

                if user_input.get(enabled_key, True):
                    care_tasks.append({
                        "id": task_id,
                        "name": task["name"],
                        "icon": task.get("icon", "mdi:leaf"),
                        "interval_days": int(
                            user_input.get(interval_key, task["interval_days"])
                        ),
                    })

            self._data[CONF_CARE_TASKS] = care_tasks

            return self.async_create_entry(
                title=f"{self._data[CONF_LOCATION]} {self._data[CONF_PLANT_NAME]}",
                data=self._data,
            )

        # Build form with care task toggles and intervals
        library = self._get_library()
        species = library.get(self._data[CONF_PLANT_SPECIES], {})
        default_tasks = species.get("care_tasks", [])

        schema_dict: dict = {}
        for task in default_tasks:
            task_id = task["id"]
            schema_dict[vol.Optional(
                f"enable_{task_id}", default=True
            )] = bool
            schema_dict[vol.Optional(
                f"interval_{task_id}", default=task["interval_days"]
            )] = NumberSelector(
                NumberSelectorConfig(
                    min=1,
                    max=365,
                    step=1,
                    mode=NumberSelectorMode.BOX,
                    unit_of_measurement="Tage",
                )
            )

        if not schema_dict:
            # No care tasks in library for this species
            self._data[CONF_CARE_TASKS] = []
            return self.async_create_entry(
                title=f"{self._data[CONF_LOCATION]} {self._data[CONF_PLANT_NAME]}",
                data=self._data,
            )

        return self.async_show_form(
            step_id="care",
            data_schema=vol.Schema(schema_dict),
        )
