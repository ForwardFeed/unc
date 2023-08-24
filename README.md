# Unified Nuzlocke Calculator

a Pokemon Damage calculator based of [smogon/damage-calc][0] for nuzlocking purposes, 
virtually on any game up to gen 9.

## How to set a calc for a game
to set up a new calc page:
1. Copy the src/template folder.
Idealy rename it to the name of the game.
2. Modify the settings inside /data/calc_settings.js to fit your game.
Yes you can have game mechanics of gen 1 and pokemon of gen 9.
3. Start to edit the trainer list with the trainereditor.html, save the file "trainersets.js" into data/ or if there is already a smogon based calc, you can still use the convert_setdex.js script inside the console to get all pokemons and put the array into the trainersets.js this way: ```var TRAINER_DEX = [{},{}...]```
4. Each index.html and trainereditor.html are meant to be standard and not mutable for each game, if you want to have specifics things for your calc then follow the next paragraph

## Game specificity
inside the folder of a specific game there is two files
- pre_load.js loaded after the calc initialization and before the UI
- after_load.js loaded after all important UI JS script
Both of these files are meant to be specific to the game and act like patches.
Preload was thought to be a patching important data before the UI loads it. like custom pokedex, moveset, base stats. you can even replace some calc functions.
AfterLoad is more for adding links, or buttons that are specific to your game but has no connections to the calc

## Modification of the smogon calc.

The calc inside is a modified version of the smogon calc, which supports the things done in the calc without the smogon standard, i could propose but doubt it would be accepted.

## TODO list
- [ ] add custom dynamic message list for resets
- [x] add pokemon gender support

## Rejected Todo elements
- [ ] internationalization: a lot of the code is based on pokemon name (images, mechanics), if the smogon gets some improvement, then i could rethink it.

## Credits
- All the creators and maintainers of the smogon calc
- May8th1995 for sprites and EK specifics mechanics, alongside some others for testing my app
- msikma for pokesprite
- Creators of interactJS library.