#!/bin/sh

# This script sets the maximum old space size for Node.js based on the memory limit of the container.

MAX_MEMORY=$(cat /sys/fs/cgroup/memory.max)
MAX_OLD_SPACE_SIZE="$(printf %.0f $(echo 0.8 \* \(${MAX_MEMORY} / 1024 / 1024 - 30\) | bc))"

# Execute the container's main command
export NODE_OPTIONS="--max-old-space-size=${MAX_OLD_SPACE_SIZE}"

exec "$@"
