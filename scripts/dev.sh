#!/bin/bash
cd /home/z/my-project
bash scripts/start-mysql.sh
echo "Starting Next.js..."
exec npx next dev -p 3000 2>&1 | tee dev.log
