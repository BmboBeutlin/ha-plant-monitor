"""Constants for Plant Monitor integration."""

DOMAIN = "plant_monitor"
VERSION = "1.0.1"
URL_BASE = "/plant_monitor"

# Config entry keys
CONF_PLANT_SPECIES = "plant_species"
CONF_PLANT_NAME = "plant_name"
CONF_LOCATION = "location"
CONF_ENTITIES = "entities"
CONF_CARE_TASKS = "care_tasks"

# Entity keys
CONF_ENTITY_TEMPERATURE = "temperature"
CONF_ENTITY_SOIL_MOISTURE = "soil_moisture"
CONF_ENTITY_BATTERY = "battery"

# Storage
STORAGE_KEY = "plant_monitor.care_log"
STORAGE_VERSION = 1

# Platforms
PLATFORMS = ["sensor", "button"]
