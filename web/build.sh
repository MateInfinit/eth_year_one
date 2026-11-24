#!/usr/bin/env bash
# Rebuilds web/index.html from the parts in web/src (no tools needed).
cd "$(dirname "$0")"
cat src/0_shell_head.html src/1_core.js src/2_world.js src/3_flows.js src/4_games.js src/4b_view.js src/5_main.js > index.html
echo "built web/index.html"
