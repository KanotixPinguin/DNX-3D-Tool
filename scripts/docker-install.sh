#!/usr/bin/env bash
set -euo pipefail

CONTAINER="${1:-owrxp-cb}"
PKG_BASE="$(cd "$(dirname "$0")/.." && pwd)"
PLUGIN_JS="$PKG_BASE/files/plugin.js"
HELP_HTML="$PKG_BASE/files/help_de_en.html"

if [[ ! -f "$PLUGIN_JS" || ! -f "$HELP_HTML" ]]; then
  echo "FEHLER: files/plugin.js oder files/help_de_en.html fehlt."
  exit 1
fi

echo "[1/5] Prüfe Container: $CONTAINER"
docker ps --format '{{.Names}}' | grep -qx "$CONTAINER" || { echo "FEHLER: Container '$CONTAINER' läuft nicht."; exit 1; }

echo "[2/5] Zielpfade im Container"
BASE="/usr/lib/python3/dist-packages/htdocs/plugins/receiver"
DNX_DIR="$BASE/dnx_3dtool"
INIT_JS="$BASE/init.js"

docker exec "$CONTAINER" sh -lc "test -f '$INIT_JS' || { echo 'FEHLER: $INIT_JS fehlt'; exit 1; }"

echo "[3/5] Backup + Dateien kopieren"
TS="$(date +%Y%m%d_%H%M%S)"
docker exec "$CONTAINER" sh -lc "mkdir -p '$DNX_DIR' && cp -f '$INIT_JS' '$INIT_JS.bak_dnx3d_${TS}' && [ -f '$DNX_DIR/plugin.js' ] && cp -f '$DNX_DIR/plugin.js' '$DNX_DIR/plugin.js.bak_dnx3d_${TS}' || true"
docker cp "$PLUGIN_JS" "$CONTAINER:$DNX_DIR/plugin.js"
docker cp "$HELP_HTML" "$CONTAINER:$DNX_DIR/help_de_en.html"

echo "[4/5] Loader in init.js setzen (idempotent)"
docker exec "$CONTAINER" sh -lc "sed -i '/\\/static\\/plugins\\/receiver\\/dnx_3dtool\\/plugin\\.js/d' '$INIT_JS' && echo '(function(){var s=document.createElement(\"script\");s.src=\"/static/plugins/receiver/dnx_3dtool/plugin.js?v=FINAL_ONLY_2026-05-01\";document.head.appendChild(s);})();' >> '$INIT_JS'"

echo "[5/5] Restart"
docker restart "$CONTAINER" >/dev/null
sleep 6

echo "OK: DNX 3D Tool in Container '$CONTAINER' installiert."
echo "Browser: Strg+Shift+R"
