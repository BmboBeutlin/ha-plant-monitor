# Plant Monitor for Home Assistant

Verknüpfe deine Zigbee2MQTT-Pflanzensensoren mit einer Pflanzenbibliothek. Sieh auf einen Blick, wie es deinen Pflanzen geht.

## Features

- **50+ Zimmerpflanzen** in der Bibliothek mit Bildern und Idealwerten
- **Foto-zentrierte Cards** mit Live-Sensordaten (Temperatur, Feuchtigkeit, Batterie)
- **Status-Dot** — grün wenn alles OK, rot bei Problemen
- **Pflege-Tracking** — Gießen, Düngen, Besprühen mit Countdown-Sensoren
- **Detail-Popup** mit Pflegetipps und "Erledigt"-Buttons
- **Sidebar-Panel** "Pflanzen" mit automatischer Raum-Gruppierung
- **Keine eigene MQTT-Konfiguration nötig** — nutzt bestehende Zigbee2MQTT-Entities

## Installation

### HACS (empfohlen)

1. HACS öffnen → Integrationen → "+" klicken
2. Suche nach "Plant Monitor"
3. Installieren und Home Assistant neustarten

### Manuell

1. `custom_components/plant_monitor/` in dein HA config-Verzeichnis kopieren
2. Home Assistant neustarten

## Einrichtung

1. **Einstellungen → Integrationen → Integration hinzufügen → "Plant Monitor"**
2. Pflanzenart aus der Bibliothek wählen
3. Name und Raum eingeben (z.B. "Wohnzimmer Monstera")
4. Bestehende Zigbee2MQTT-Sensoren verknüpfen
5. Pflegeaufgaben und Intervalle anpassen

## Unterstützte Sensoren

Alle Zigbee2MQTT-Pflanzensensoren werden unterstützt, z.B.:
- Tuya TS0601 Soil Sensor
- Xiaomi HHCCJCY01 (MiFlora)
- Andere MQTT-basierte Pflanzensensoren

Die Sensoren müssen bereits über Zigbee2MQTT in Home Assistant verfügbar sein.

## Pflege-Tracking

Für jede Pflanze werden automatisch Button- und Sensor-Entities erstellt:
- **Buttons:** "Gießen erledigt", "Düngen erledigt", etc.
- **Sensoren:** "Gießen fällig in 3 Tagen", "Düngen überfällig seit 2 Tagen!"

Die Intervalle kommen aus der Pflanzenbibliothek und können pro Pflanze angepasst werden.

## Dashboard

Nach der Einrichtung erscheint "Pflanzen" in der Sidebar. Die Pflanzen werden automatisch nach Räumen gruppiert.

---

Made with 🌱 by [BmboBeutlin](https://github.com/BmboBeutlin)
