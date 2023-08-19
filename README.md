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
4. Each index.html and editor.html are meant to be placeholders and replaced all in the same time by a standard ui. However, if you want to have specifics things for you calc, the calculator_specific.js will be executed at the end of the page, from there you can dynamically add stuff like links.


## TODOLIST
- [ ] add custom dynamic message list for resets
- [ ] internationalisation
- [ ] add gender to pokemon