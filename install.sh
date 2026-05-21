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

docker cp dnx_3d.js "$CONTAINER":/usr/lib/python3/dist-packages/htdocs/static/dnx_3d.js

docker exec "$CONTAINER" sh -c 'grep -q dnx_3d.js /usr/lib/python3/dist-packages/htdocs/index.html || sed -i "s#</body>#<script src=\"/static/static/dnx_3d.js\"></script>\n</body>#" /usr/lib/python3/dist-packages/htdocs/index.html'

docker restart "$CONTAINER"

echo
echo "DNX 3D TOOL installed successfully."
echo
