#!/bin/bash

echo "\033[1;34mThere is new update\n\033[1;m"
echo "\033[1;33mgit updating...\033[1;m"

if [ $1 ]
then
    kill -9 $1
else
    killall -9 python
fi

git fetch origin master && git checkout -f origin/master

echo "\033[1;32mgit updated\n\033[1;m"

exit