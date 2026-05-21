#!/bin/bash

echo
echo "=== DNX 3D TOOL REMOVE ==="
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

docker exec "$CONTAINER" sed -i '/dnx_3d.js/d' /usr/lib/python3/dist-packages/htdocs/index.html

docker exec "$CONTAINER" rm -f /usr/lib/python3/dist-packages/htdocs/static/dnx_3d.js

docker restart "$CONTAINER"

echo
echo "DNX 3D TOOL removed successfully."
echo
