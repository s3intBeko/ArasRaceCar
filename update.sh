#!/bin/bash

echo "\033[1;34mThere is new update\n\033[1;m"
echo "\033[1;33mgit updating...\033[1;m"


git fetch origin master && git checkout -f origin/master

echo "\033[1;32mgit updated\n\033[1;m"

exit