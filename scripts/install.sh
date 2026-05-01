#!/usr/bin/env bash
set -euo pipefail

PLUGIN_JS_SRC="$(dirname "$0")/../files/plugin.js"
HELP_HTML_SRC="$(dirname "$0")/../files/help_de_en.html"

BASE="/usr/lib/python3/dist-packages/htdocs/plugins/receiver"
DNX_DIR="$BASE/dnx_3dtool"
INIT_JS="$BASE/init.js"

[ -f "$PLUGIN_JS_SRC" ] || { echo "FEHLER: plugin.js fehlt"; exit 1; }
[ -f "$HELP_HTML_SRC" ] || { echo "FEHLER: help_de_en.html fehlt"; exit 1; }
[ -f "$INIT_JS" ] || { echo "FEHLER: init.js fehlt: $INIT_JS"; exit 1; }

mkdir -p "$DNX_DIR"

ts="$(date +%Y%m%d_%H%M%S)"
cp -f "$INIT_JS" "$INIT_JS.bak_dnx3d_${ts}"
if [ -f "$DNX_DIR/plugin.js" ]; then
  cp -f "$DNX_DIR/plugin.js" "$DNX_DIR/plugin.js.bak_dnx3d_${ts}"
fi

cp -f "$PLUGIN_JS_SRC" "$DNX_DIR/plugin.js"
cp -f "$HELP_HTML_SRC" "$DNX_DIR/help_de_en.html"

sed -i '/\/static\/plugins\/receiver\/dnx_3dtool\/plugin\.js/d' "$INIT_JS"
echo '(function(){var s=document.createElement("script");s.src="/static/plugins/receiver/dnx_3dtool/plugin.js?v=FINAL_ONLY_2026-05-01";document.head.appendChild(s);})();' >> "$INIT_JS"

echo "OK: DNX 3D Tool installiert."
