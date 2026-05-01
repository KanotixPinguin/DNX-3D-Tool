> **Important:** This is a custom OpenWebRX+ modification (mod), **not** an official OpenWebRX+ plugin.  
> No support is provided by upstream maintainers.
# DNX 3D Mod for OpenWebRX+

Author: DAD833  
Final status date: 01.05.2026

## Overview
This package installs the custom DNX 3D Tool into OpenWebRX+.

Included:
- `files/modification.js` (main modification)
- `files/help_de_en.html` (Help DE/EN)
- `scripts/install.sh` (installer)
- `scripts/uninstall.sh` (uninstaller)

## Installation
```bash
cd /home/ich/dnx3dtool-modification
chmod +x scripts/install.sh scripts/uninstall.sh
sudo ./scripts/install.sh
```

After install restart OpenWebRX+ (example):
```bash
docker restart owrxp-cb
```

## Uninstallation
```bash
cd /home/ich/dnx3dtool-modification
sudo ./scripts/uninstall.sh
```

## Credit
Built and developed by DAD833.  
Final state reference: 01.05.2026

## Wichtiger Hinweis / Important Notice

Diese Erweiterung ist **kein offiziell unterstütztes OpenWebRX+ Upstream-modification**.
Es handelt sich um eine **benutzerdefinierte Modifikation (Custom Patch/Injection)**.

- Kein offizieller Support durch OpenWebRX+ Maintainer
- Nicht Teil des offiziellen Upstream-Supportumfangs
- Nutzung auf eigenes Risiko
- Betrieb, Wartung und Fehlerbehebung liegen vollständig beim Betreiber dieser Modifikation

This extension is **not an officially supported OpenWebRX+ upstream modification**.
It is a **custom modification (custom patch/injection)**.

- No official support from OpenWebRX+ maintainers
- Not part of official upstream support scope
- Use at your own risk
- Operation, maintenance, and troubleshooting are fully the responsibility of the operator

Maintainer of this modification: **DAD833**  
Status date: **01.05.2026**
