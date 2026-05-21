# DNX-3D-Tool

Movable DNX Runtime 3D Frontend Extension for OpenWebRX+

---

# Preview

DNX 3D TOOL adds a movable realtime 3D visualization frontend to OpenWebRX+.

Features include:

- Floating movable DNX 3D window
- Persistent window positions
- DNX styled movable launcher button
- Runtime frontend extension architecture
- No OpenWebRX DSP core modifications
- Portable multi-container installation
- Realtime canvas rendering
- OpenWebRX compatible runtime integration

---

# Features

## DNX Runtime Architecture

DNX-3D-Tool works as a runtime frontend extension.

It does NOT replace or modify OpenWebRX DSP processing.

The extension injects a movable DNX frontend layer on top of OpenWebRX.





---

## Movable DNX Button

- Draggable launcher button
- Persistent position via localStorage
- DNX statusbar color styling
- Floating runtime UI

---

## Realtime 3D Rendering

- Canvas based rendering
- Live visualization
- Runtime rendering pipeline
- Expandable architecture for future GPU/WebGL modes

---

## Multi Container Support

Installer automatically detects OpenWebRX containers.

Examples:

- owrx-8010
- owrx-8011
- owrx-8015
- owrxp


---

# Installation

## Clone repository

git clone https://github.com/KanotixPinguin/DNX-3D-Tool.git

---

## Enter project directory

cd DNX-3D-Tool

---

## Make scripts executable

chmod +x install.sh uninstall.sh

---

## Run installer

./install.sh

Installer automatically detects OpenWebRX containers.

Example:

1) owrx-8010
2) owrx-8011
3) owrx-8015

Select container number:

---

## Reload browser

After installation:

CTRL + SHIFT + R

---

# Removal

Run:

./uninstall.sh


---

# Runtime Notes

- No OpenWebRX DSP modifications
- Runtime frontend extension only
- Persistent localStorage positions
- Works across multiple OpenWebRX containers
- DNX frontend ecosystem component

---

# Compatibility

Tested with:

- OpenWebRX+
- slechev/openwebrxplus-softmbe
- Docker based OpenWebRX deployments

---

# Troubleshooting

## Old buttons still visible

Run:

./uninstall.sh

Then:

./install.sh

Finally reload browser with:

CTRL + SHIFT + R

---

## Browser cache problems

Use hard reload:

CTRL + SHIFT + R

---

## Multiple OpenWebRX containers

Installer automatically detects containers.

Select the correct container during installation.

---

# Roadmap

Planned future extensions:

- GPU accelerated renderer
- Advanced waterfall modes
- SDRangel style rendering
- Camera presets
- Split rendering modes
- Modern DNX frontend integration
- Extended realtime controls

---

# DNX Ecosystem

Related DNX projects:

- DNX-Statusbar
- DNX-3D-Tool
- DNX-noVNC
- DNX-Waterfall
- DNX Runtime Frontend Extensions

---

# License

MIT License

Copyright (c) 2026 KanotixPinguin
