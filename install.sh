#!/bin/bash

echo
echo "=== DNX 3D TOOL INSTALL ==="
echo

mapfile -t CONTAINERS < <(docker ps --format "{{.Names}}" | grep -Ei "owrx|openwebrx")

if [ ${#CONTAINERS[@]} -eq 0 ]; then
 echo "No OpenWebRX containers found."
 exit 1
fi

echo "Found OpenWebRX containers:"
echo

for i in "${!CONTAINERS[@]}"; do
 echo "$((i+1))) ${CONTAINERS[$i]}"
done

echo
read -p "Select container number: " NUM

INDEX=$((NUM-1))
CONTAINER="${CONTAINERS[$INDEX]}"

if [ -z "$CONTAINER" ]; then
 echo "Invalid selection."
 exit 1
fi

echo
echo "Using container: $CONTAINER"
echo

docker exec "$CONTAINER" sh -c '
mkdir -p /usr/lib/python3/dist-packages/htdocs/plugins/receiver/dnx_3dtool

sed -i "/dnx_3d.js/d" /usr/lib/python3/dist-packages/htdocs/index.html

rm -f /usr/lib/python3/dist-packages/htdocs/static/dnx_3d.js

rm -f /usr/lib/python3/dist-packages/htdocs/plugins/receiver/dnx_3dtool.js
'

docker cp plugin.js "$CONTAINER":/usr/lib/python3/dist-packages/htdocs/plugins/receiver/dnx_3dtool/plugin.js

docker restart "$CONTAINER"

echo
echo "DNX 3D TOOL installed successfully."
echo
