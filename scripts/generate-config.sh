#!/bin/bash

echo "Generating config.json from environment variable..."
mkdir -p src/assets

echo "{
  \"apiUrl\": \"${API_URL}\"
}" > src/assets/config.json
