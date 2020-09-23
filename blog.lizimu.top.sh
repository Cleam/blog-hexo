#!/bin/bash
SSH_KEY_PATH="/Users/admin/.ssh/mbpwork"
ASYNC_PATH="./public/*"
DEST_SERVER_PATH="ubuntu@94.191.117.102:/data/www/blog"
# SHELL_FOLDER=$(cd "$(dirname "$0")";pwd)
scp -i ${SSH_KEY_PATH} -r ${ASYNC_PATH} ${DEST_SERVER_PATH}
# rsync -a -e `ssh -i ${SSH_KEY_PATH}` ${ASYNC_PATH} ${DEST_SERVER_PATH}