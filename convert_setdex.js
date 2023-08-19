pokemons = Object.keys(setdex)
trainers = []
for (pokemon in pokemons){
  sets = Object.keys(setdex[pokemons[pokemon]])
  for (set in sets) {
    var mon = pokemons[pokemon]
    var trainer = sets[set]
    var set = setdex[mon][trainer]
    set.species = mon
    if (trainers[trainer]) {
      trainers[trainer].mons.push(set)
    } else {
      trainers[trainer] = {trn: trainer, mons: [set]}
    }
  }
}
ids = Object.keys(trainers)
newsetdex = [{trn: "Player", mons: []}]
for (id in ids){
  newsetdex.push(trainers[ids[id]])
}
console.log(newsetdex)