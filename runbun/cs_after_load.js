$(document).ready(function () {
	var sets = document.getElementById("sets");
	sets.innerHTML += '<a href="./data/runandbun_script_imports.lua" download="lua_script_for_export">Download Lua Script</a><a href="./data/AI_flowchart_R&B.png" target="_blank" rel="noopener noreferrer">Flowchart of the AI</a>'
	var script = document.createElement("script");
	script.src = "./gen3_loadsave.js";
	script.onload = ()=>{gen3_loadsave()}
	document.head.appendChild(script)
});

//Make the calc print IVs instead of EVs
calc.getEVDescriptionText = function (gen, pokemon, stat, natureName) {
    var nature = gen.natures.get((0, util_1.toID)(natureName));
    return (pokemon.ivs[stat] +
        (nature.plus === nature.minus ? ''
            : nature.plus === stat ? '+'
                : nature.minus === stat ? '-'
                    : '') + ' ' +
        stats_1.Stats.displayStat(stat));
}


getFinalSpeed = function(gen, pokemon, field, side) {
    var weather = field.weather || '';
    var terrain = field.terrain;
    var speed = getModifiedStat(pokemon.rawStats.spe, pokemon.boosts.spe, gen);
    var speedMods = [];
    if (side.isTailwind)
        speedMods.push(8192);
    if ((pokemon.hasAbility('Unburden') && pokemon.abilityOn) ||
        (pokemon.hasAbility('Chlorophyll') && weather.includes('Sun')) ||
        (pokemon.hasAbility('Sand Rush') && weather === 'Sand') ||
        (pokemon.hasAbility('Swift Swim') && weather.includes('Rain')) ||
        (pokemon.hasAbility('Slush Rush') && ['Hail', 'Snow'].includes(weather)) ||
        (pokemon.hasAbility('Surge Surfer') && terrain === 'Electric')) {
        speedMods.push(8192);
    }
    else if (pokemon.hasAbility('Quick Feet') && pokemon.status) {
        speedMods.push(6144);
    }
    else if (pokemon.hasAbility('Slow Start') && pokemon.abilityOn) {
        speedMods.push(2048);
    }
    else if (calc.getQPBoostedStat(pokemon, gen) === 'spe' &&
        ((pokemon.hasAbility('Protosynthesis') &&
            (weather.includes('Sun') || pokemon.hasItem('Booster Energy'))) ||
            (pokemon.hasAbility('Quark Drive') &&
                (terrain === 'Electric' || pokemon.hasItem('Booster Energy'))))) {
        speedMods.push(6144);
    }
    if (pokemon.hasItem('Choice Scarf')) {
        speedMods.push(6144);
    }
    else if (pokemon.hasItem.apply(pokemon, __spreadArray(['Iron Ball'], __read(EV_ITEMS), false))) {
        speedMods.push(2048);
    }
    else if (pokemon.hasItem('Quick Powder') && pokemon.named('Ditto')) {
        speedMods.push(8192);
    }
    speed = OF32(pokeRound((speed * chainMods(speedMods, 410, 131172)) / 4096));
    if (pokemon.hasStatus('par') && !pokemon.hasAbility('Quick Feet')) {
        speed = Math.floor(OF32(speed * (gen.num < 7 ? 25 : 25)) / 100);
    }
    speed = Math.min(gen.num <= 2 ? 999 : 10000, speed);
    return Math.max(0, speed);
}

calculateBPModsSMSSSV = function(gen, attacker, defender, move, field, desc, basePower, hasAteAbilityTypeChange, turnOrder) {
    var bpMods = [];
    var resistedKnockOffDamage = !defender.item ||
        (defender.named('Dialga-Origin') && defender.hasItem('Adamant Crystal')) ||
        (defender.named('Palkia-Origin') && defender.hasItem('Lustrous Globe')) ||
        (defender.name.includes('Giratina-Origin') && defender.item.includes('Griseous')) ||
        (defender.name.includes('Arceus') && defender.item.includes('Plate')) ||
        (defender.name.includes('Genesect') && defender.item.includes('Drive')) ||
        (defender.named('Groudon', 'Groudon-Primal') && defender.hasItem('Red Orb')) ||
        (defender.named('Kyogre', 'Kyogre-Primal') && defender.hasItem('Blue Orb')) ||
        (defender.name.includes('Silvally') && defender.item.includes('Memory')) ||
        defender.item.includes(' Z') ||
        (defender.named('Zacian') && defender.hasItem('Rusted Sword')) ||
        (defender.named('Zamazenta') && defender.hasItem('Rusted Shield') ||
            (defender.named('Venomicon-Epilogue') && defender.hasItem('Vile Vial')));
    if (!resistedKnockOffDamage && defender.item) {
        var item = gen.items.get((0, util_1.toID)(defender.item));
        resistedKnockOffDamage = !!item.megaEvolves && defender.name.includes(item.megaEvolves);
    }
    if ((move.named('Facade') && attacker.hasStatus('brn', 'par', 'psn', 'tox')) ||
        (move.named('Brine') && defender.curHP() <= defender.maxHP() / 2) ||
        (move.named('Venoshock') && defender.hasStatus('psn', 'tox')) ||
        (move.named('Lash Out') && ((0, util_2.countBoosts)(gen, attacker.boosts) < 0))) {
        bpMods.push(8192);
        desc.moveBP = basePower * 2;
    }
    else if (move.named('Expanding Force') && (0, util_2.isGrounded)(attacker, field) && field.hasTerrain('Psychic')) {
        move.target = 'allAdjacentFoes';
        bpMods.push(6144);
        desc.moveBP = basePower * 1.5;
    }
    else if ((move.named('Knock Off') && !resistedKnockOffDamage) ||
        (move.named('Misty Explosion') && (0, util_2.isGrounded)(attacker, field) && field.hasTerrain('Misty')) ||
        (move.named('Grav Apple') && field.isGravity)) {
        bpMods.push(6144);
        desc.moveBP = basePower * 1.5;
    }
    else if (move.named('Solar Beam', 'Solar Blade') &&
        field.hasWeather('Rain', 'Heavy Rain', 'Sand', 'Hail', 'Snow')) {
        bpMods.push(2048);
        desc.moveBP = basePower / 2;
        desc.weather = field.weather;
    }
    else if (move.named('Collision Course', 'Electro Drift')) {
        var isGhostRevealed = attacker.hasAbility('Scrappy') || field.defenderSide.isForesight;
        var isRingTarget = defender.hasItem('Ring Target') && !defender.hasAbility('Klutz');
        var type1Effectiveness = (0, util_2.getMoveEffectiveness)(gen, move, defender.types[0], isGhostRevealed, field.isGravity, isRingTarget);
        var type2Effectiveness = defender.types[1] ? (0, util_2.getMoveEffectiveness)(gen, move, defender.types[0], isGhostRevealed, field.isGravity, isRingTarget) : 1;
        if (type1Effectiveness * type2Effectiveness >= 2) {
            bpMods.push(5461);
            desc.moveBP = basePower * (5461 / 4096);
        }
    }
    if (field.attackerSide.isHelpingHand) {
        bpMods.push(6144);
        desc.isHelpingHand = true;
    }
    var terrainMultiplier = 6144;
    if ((0, util_2.isGrounded)(attacker, field)) {
        if ((field.hasTerrain('Electric') && move.hasType('Electric')) ||
            (field.hasTerrain('Grassy') && move.hasType('Grass')) ||
            (field.hasTerrain('Psychic') && move.hasType('Psychic'))) {
            bpMods.push(terrainMultiplier);
            desc.terrain = field.terrain;
        }
    }
    if ((0, util_2.isGrounded)(defender, field)) {
        if ((field.hasTerrain('Misty') && move.hasType('Dragon')) ||
            (field.hasTerrain('Grassy') && move.named('Bulldoze', 'Earthquake'))) {
            bpMods.push(2048);
            desc.terrain = field.terrain;
        }
    }
    if ((attacker.hasAbility('Technician') && basePower <= 60) ||
        (attacker.hasAbility('Flare Boost') &&
            attacker.hasStatus('brn') && move.category === 'Special') ||
        (attacker.hasAbility('Toxic Boost') &&
            attacker.hasStatus('psn', 'tox') && move.category === 'Physical') ||
        (attacker.hasAbility('Mega Launcher') && move.flags.pulse) ||
        (attacker.hasAbility('Strong Jaw') && move.flags.bite) ||
        (attacker.hasAbility('Steely Spirit') && move.hasType('Steel')) ||
        (attacker.hasAbility('Sharpness') && move.flags.slicing)) {
        bpMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    var aura = "".concat(move.type, " Aura");
    var isAttackerAura = attacker.hasAbility(aura);
    var isDefenderAura = defender.hasAbility(aura);
    var isUserAuraBreak = attacker.hasAbility('Aura Break') || defender.hasAbility('Aura Break');
    var isFieldAuraBreak = field.isAuraBreak;
    var isFieldFairyAura = field.isFairyAura && move.type === 'Fairy';
    var isFieldDarkAura = field.isDarkAura && move.type === 'Dark';
    var auraActive = isAttackerAura || isDefenderAura || isFieldFairyAura || isFieldDarkAura;
    var auraBreak = isFieldAuraBreak || isUserAuraBreak;
    if (auraActive) {
        if (auraBreak) {
            bpMods.push(3072);
            desc.attackerAbility = attacker.ability;
            desc.defenderAbility = defender.ability;
        }
        else {
            bpMods.push(5448);
            if (isAttackerAura)
                desc.attackerAbility = attacker.ability;
            if (isDefenderAura)
                desc.defenderAbility = defender.ability;
        }
    }
    if ((attacker.hasAbility('Sheer Force') &&
        (move.secondaries || move.named('Jet Punch', 'Order Up')) && !move.isMax) ||
        (attacker.hasAbility('Sand Force') &&
            field.hasWeather('Sand') && move.hasType('Rock', 'Ground', 'Steel')) ||
        (attacker.hasAbility('Analytic') &&
            (turnOrder !== 'first' || field.defenderSide.isSwitching === 'out')) ||
        (attacker.hasAbility('Tough Claws') && move.flags.contact) ||
        (attacker.hasAbility('Punk Rock') && move.flags.sound)) {
        bpMods.push(5325);
        desc.attackerAbility = attacker.ability;
    }
    if (field.attackerSide.isBattery && move.category === 'Special') {
        bpMods.push(5325);
        desc.isBattery = true;
    }
    if (field.attackerSide.isPowerSpot) {
        bpMods.push(5325);
        desc.isPowerSpot = true;
    }
    if (attacker.hasAbility('Rivalry') && ![attacker.gender, defender.gender].includes('N')) {
        if (attacker.gender === defender.gender) {
            bpMods.push(5120);
            desc.rivalry = 'buffed';
        }
        else {
            bpMods.push(3072);
            desc.rivalry = 'nerfed';
        }
        desc.attackerAbility = attacker.ability;
    }
    if (!move.isMax && hasAteAbilityTypeChange) {
        bpMods.push(4915);
    }
    if ((attacker.hasAbility('Reckless') && (move.recoil || move.hasCrashDamage)) ||
        (attacker.hasAbility('Iron Fist') && move.flags.punch)) {
        bpMods.push(4915);
        desc.attackerAbility = attacker.ability;
    }
    if (attacker.hasItem('Punching Glove') && move.flags.punch) {
        bpMods.push(4506);
        desc.attackerItem = attacker.item;
    }
    if (defender.hasAbility('Heatproof') && move.hasType('Fire')) {
        bpMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.hasAbility('Dry Skin') && move.hasType('Fire')) {
        bpMods.push(5120);
        desc.defenderAbility = defender.ability;
    }
    if (attacker.hasAbility('Supreme Overlord') && attacker.alliesFainted) {
        var powMod = [4096, 4506, 4915, 5325, 5734, 6144];
        bpMods.push(powMod[Math.min(5, attacker.alliesFainted)]);
        desc.attackerAbility = attacker.ability;
        desc.alliesFainted = attacker.alliesFainted;
    }
    if (attacker.hasItem("".concat(move.type, " Gem"))) {
        bpMods.push(6144);
        desc.attackerItem = attacker.item;
    }
    else if (((attacker.hasItem('Adamant Crystal') && attacker.named('Dialga-Origin')) ||
        (attacker.hasItem('Adamant Orb') && attacker.named('Dialga')) &&
            move.hasType('Steel', 'Dragon')) ||
        ((attacker.hasItem('Lustrous Orb') &&
            attacker.named('Palkia')) ||
            (attacker.hasItem('Lustrous Globe') && attacker.named('Palkia-Origin')) &&
                move.hasType('Water', 'Dragon')) ||
        ((attacker.hasItem('Griseous Orb') || attacker.hasItem('Griseous Core')) &&
            (attacker.named('Giratina-Origin') || attacker.named('Giratina')) &&
            move.hasType('Ghost', 'Dragon')) ||
        (attacker.hasItem('Vile Vial') &&
            attacker.named('Venomicon-Epilogue') &&
            move.hasType('Poison', 'Flying')) ||
        attacker.item && move.hasType((0, items_1.getItemBoostType)(attacker.item))) {
        bpMods.push(4915);
        desc.attackerItem = attacker.item;
    }
    else if ((attacker.hasItem('Muscle Band') && move.category === 'Physical') ||
        (attacker.hasItem('Wise Glasses') && move.category === 'Special')) {
        bpMods.push(4505);
        desc.attackerItem = attacker.item;
    }
    return bpMods;
}