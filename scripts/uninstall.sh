#!/usr/bin/env bash
set -euo pipefail

BASE="/usr/lib/python3/dist-packages/htdocs/plugins/receiver"
DNX_DIR="$BASE/dnx_3dtool"
INIT_JS="$BASE/init.js"

sed -i '/\/static\/plugins\/receiver\/dnx_3dtool\/plugin\.js/d' "$INIT_JS"
rm -rf "$DNX_DIR"

echo "OK: DNX 3D Tool entfernt."
