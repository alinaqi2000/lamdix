#!/bin/bash
bun run typecheck || exit 1
bun run build > artifacts/build.log 2>&1 || { tail -20 artifacts/build.log; exit 1; }
fuser -k 3000/tcp 2>/dev/null; sleep 1
setsid nohup bun run start > artifacts/server.log 2>&1 < /dev/null &
sleep 4
timeout 100 bun scripts/_shot.ts poster; timeout 200 bun scripts/_shot.ts; echo shot=$?
