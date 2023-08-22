#!/bin/bash

templateHTML="./src/template/index.html"
templateEditor="./src/template/trainereditor.html"

if [ ! -f "$templateHTML" ] 
then
    echo "can't find "$templateHTML""
    exit 1
fi
if [ ! -f "$templateEditor" ]
then
    echo "can't find "$templateEditor""
    exit 2
fi

gamesBase="./src/"
games="runbun renegade EK"
for game in $games
do
    cp -f  "${templateHTML}"  "${gamesBase}${game}/index.html"
    cp -f  "${templateEditor}" "${gamesBase}${game}/trainereditor.html"
done