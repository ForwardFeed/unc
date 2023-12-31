class Panel{
    constructor(panel){
        this.panel = panel
        // Title selection
        this.field_select = this.panel.find('input.selector.select2-offscreen')
        this.field_selectTitle = this.panel.find('.selector .select2-chosen')
        this.field_pokeImg = this.panel.find('legend img')
        // Head props
        this.trainerID = -1
        this.lastTrainerID = -1;
        this.pokemon = {}
        this.field_forme = this.panel.find('.forme')
        this.field_type1 = this.panel.find('.type1')
        this.field_type2 = this.panel.find('.type2')
        this.field_tera = this.panel.find('.teraType')
        this.field_tera_on = this.panel.find('.teraToggle')
        this.field_gender = this.panel.find('.gender')
        this.field_level = this.panel.find('.level')
        // Stats
        this.stats = new PanelStats(this.panel, this)
        // Propreties
        this.field_nature = this.panel.find('.nature')
        this.field_ability = this.panel.find('.ability')
        this.field_abilityOn = this.panel.find('.abilityToggle')
        this.field_allies_fainted = this.panel.find('.alliesFainted')
        this.field_item = this.panel.find('.item')
        this.field_status = this.panel.find('.status')
        this.field_toxicCounter = this.panel.find('.toxic-counter')
        // Health => panel_stats.js
        // Moves => panel_move.js
        this.moves = [  
            new panelMove(this, this.panel.find('.move1')),
            new panelMove(this, this.panel.find('.move2')),
            new panelMove(this, this.panel.find('.move3')),
            new panelMove(this, this.panel.find('.move4')) 
        ]
        // Misc
        this.abiForme = [];
        this.box = this.fetchBox()
        // Setups the event listeners
        this.setup()
    }
    // #region salades de getter & setters
    // Type
    get select(){return this.field_select.val()}
    set select(val){
        if (this.select === val) return
        this.field_select.val(val);
        this.setPanel()
    }
    get selectTitle(){return this.field_selectTitle.text()}
    set selectTitle(val){this.field_selectTitle.text(val)}
    get pokeImg(){return this.field_pokeImg.src}
    set pokeImg(val){
        this.field_pokeImg.prop("src", getSrcImgPokemon(val))
    }
    get forme(){return this.field_forme.val()}
    set forme(val){this.field_forme.val(val)}
    get type1(){return this.field_type1.val()}
    set type1(val){this.field_type1.val(val)}
    get type2(){return this.field_type2.val()}
    set type2(val){this.field_type2.val(val)}
    get types(){return [this.type1, this.type2]}
    get tera(){return this.field_tera_on.prop("checked") ? this.field_tera.val() : undefined}
    set tera(val){this.field_tera.val(val)}
    get gender(){ const val = this.field_gender.val()
        if ( val === "Male") return "M"
        return val === "Female" ? "F" : "N"
    }
    set gender(val){this.field_gender.val(val || "N")}
    get level(){return +this.field_level.val().replace(/\D/g, "")}
    set level(val){this.field_level.val(val)}
    // Props
    get nature(){return this.field_nature.val()}
    set nature(val){this.field_nature.val(val)}
    get ability(){return this.field_ability.val()}
    set ability(val){this.field_ability.val(val)}
    get abilityOn(){return this.field_abilityOn.prop("checked")}
    set abilityOn(val){this.field_abilityOn.prop("checked", val)}
    get alliesFainted(){return +this.field_allies_fainted.val()}
    set alliesFainted(val){this.field_allies_fainted.val(val)}
    get item(){return this.field_item.val()}
    set item(val){
        this.field_item.val(val)
        this.itemChange()
    }
    get status(){return this.field_status.val()}
    set status(val){this.field_status.val(val)}
    get toxicCounter(){return +this.field_toxicCounter.val()}
    set toxicCounter(val){this.field_toxicCounter.val(val)}
    // Health
    // Moves
    // Misc
    get weightkg(){return this.pokemon.weightkg}
    get heads(){return this.pokemon.heads}
    // #endregion
    setup(){
        this.field_select.change(()=>{
            this.setPanel()
            this.selectTitle = this.trainerName + " : " + this.pokemonName

        })
        this.field_forme.change(()=>{
            if (this.trainer){
                this.trainer.mons[this.pokeID]["abi_"+this.pokemon.species] = this.ability
                this.trainer.mons[this.pokeID].species = this.forme
                this.select = this.forme + ";" + this.trainerName + ";" + this.pokeID
                this.box.idToNode[this.pokeID].src = getSrcImgPokemon(this.forme)
            } else {
                this.select = this.forme
            }
            this.setPanel()
        })
        this.field_level.keyup(()=>{
            this.level = Math.max(0, Math.min(100, this.level))// apply sanit
            this.stats.calcHP();
            this.stats.calcStats()
        })
        this.field_nature.change(()=>{
            this.stats.calcStats()
        })
        this.field_item.change(()=>{
            this.itemChange()
        })
        this.lastManualStatus = "Healthy"
        this.field_status.change(()=>{
            this.lastManualStatus = this.status
        })

    }
    fetchBox(){
        const box = this.panel.closest(".panel").find('[aria-label="trainer-poks"]')
        if (box.hasClass("player-type-box")) return new PlayerBox(box, this)
        return new TrainerBox(box, this)
    }
    showFormes() {
        if (this.pokemon.baseSpecies || this.pokemon.otherFormes){
            var formes = [this.pokemon.species]
            if (this.pokemon.baseSpecies) formes.push(this.pokemon.baseSpecies)
            if (this.pokemon.otherFormes) {
                for (const forme of this.pokemon.otherFormes){
                    if (forme === this.pokemon.species) continue
                    formes.push(forme)
                }
            }
            var formeOptions = getSelectOptions(formes, false, this.pokemon.species);
            this.field_forme.find("option").remove().end().append(formeOptions);
            this.field_forme.parent().show();
        } else {
            this.field_forme.parent().hide();
        }
 
        
    }
    hasTrainerChanged(){
        const hasChanged = this.lastTrainerID == this.trainerID
        this.lastTrainerID = this.trainerID
        return !hasChanged
    }
    getAbility(){
        const poke = this.pokemon
        if (!poke.ability){
            return poke.abilities[0] //default
        }
        if (poke["abi_"+poke.species]) {
            return poke["abi_"+poke.species]
        }
        if (!isNaN(+poke.ability)){
            if (poke.ability > poke.abilities.length) {
                console.warn("the ability +" + poke.ability + " doesn't correpond to any ability")
                return poke.abilities[0]
            }
            return  poke.abilities[poke.ability]
        } else {
            return poke.ability
        }
    }
    hasAbilityActive(abilities){
        return this.abilityOn
    }
    hasAbility(abilities){
        if ((abilities.includes(this.ability))) return 1;
    }
    changeAbility(panel, id){
        var ability, ActiveDiv
        if (id < 0) {
            // ability
            ability = panel.ability
            ActiveDiv = panel.field_abilityOn
        }
        var TOGGLE_ABILITIES = ['Flash Fire', 'Intimidate', 'Minus', 'Plus', 'Slow Start','Unburden', 'Stakeout'];
        if (TOGGLE_ABILITIES.indexOf(ability) >= 0) {
            ActiveDiv.show();
        } else {
            ActiveDiv.hide();
        }

        if (ability === "Supreme Overlord") {
            this.field_allies_fainted.show();
        } else {
            this.alliesFainted = 0;
            this.field_allies_fainted.hide();

        }
    }
    checkAbilityOnEntry(){
        if (this.hasAbility('Drought', 'Orichalcum Pulse')){
            $("#sun").prop("checked", true);
        } else if (this.hasAbility('Drizzle')){
            $("#rain").prop("checked", true);
        } else if (this.hasAbility('Sand Stream')){
            $("#sand").prop("checked", true);
        } else if (this.hasAbility('Snow Warning')){
            if (gen >= 9) {
                $("#snow").prop("checked", true);
            } else {
                $("#hail").prop("checked", true);
            }
        } else if (this.hasAbility('Desolate Land')){
            $("#harsh-sunshine").prop("checked", true);
        } else if (this.hasAbility('Primordial Sea')){
            $("#heavy-rain").prop("checked", true);
        } else if (this.hasAbility('Delta Stream')){
            $("#strong-winds").prop("checked", true);
        }
    }
    abilityThatModifiesStats(){
        // Wait for Pre boosted stats to be installed
        if (this.hasAbilityActive('Violent Rush')) {
            this.stats.at = Math.floor(this.stats.PBSat * 1.2);
            this.stats.sp = Math.floor(this.stats.PBSsp * 1.5);
            //modify final speed too
        } else {
            this.stats.at = this.stats.PBSat;
            this.stats.sp = this.stats.PBSsp;
             //modify final speed too
        }

        if (this.hasAbility('Feline Prowess')) {
            this.stats.sa = Math.floor(this.stats.PBSsa * 2);
        } else {
            this.stats.sa = this.stats.PBSsa;
        }
        if (this.hasAbility('Lead Coat')) {
            this.stats.df = Math.floor(this.stats.PBSdf * 1.3);
            this.stats.sp = Math.floor(this.stats.PBSsp * 0.9);
            //modify final speed too
        } else {
            this.stats.df = this.stats.PBSat;
            this.stats.sp = this.stats.PBSsp;
             //modify final speed too
        }
    }
    parseSelector(){
        const parsed = this.select.split(";")
        this.pokemonName = parsed[0]
        if (parsed.length == 1){
            if (isNaN(+this.pokemonName)){
                //pokemon name
                this.pokemon = structuredClone(pokedex[this.pokemonName])
                this.pokemon.species = this.pokemonName
                // i won't change the trainer however
                return
            } else {
                //trainer id
                this.trainerID = +this.pokemonName
                this.trainer = setdex[this.trainerID]
                this.trainerName = this.trainer.trn
                this.pokeID = 0
                this.pokemonName = this.trainer.mons[this.pokeID].species
                this.pokemon = Object.assign(structuredClone(pokedex[this.pokemonName]), this.trainer.mons[this.pokeID])
                this.select = this.pokemonName + ";" + this.trainerName + ";" + this.pokeID
                return
            }
        }
        this.trainerName = parsed[1]
        // clone this if you don't want bad surprises
        this.pokemon = structuredClone(pokedex[this.pokemonName])
        this.trainerID = +dexset[this.trainerName]
        this.trainer = setdex[this.trainerID]
        this.pokeID  = parsed[2]
        this.pokemon = Object.assign(this.pokemon, this.trainer.mons[this.pokeID])
    }
    setPanel(){
        this.parseSelector()
        this.selectTitle = this.trainerName + " : " + this.pokemonName
        if (!this.pokemon) return
        if(this.hasTrainerChanged()) {
            this.box.changeTrainer()
            // apply reset of terrain if trainer
        }
        const poke = correctCompactedIVEV(this.pokemon)
        this.pokeImg = poke.species
        this.showFormes();
        this.type1 = poke.types[0]
        this.type2 = poke.types[1]
        this.level = poke.level || 1
        
        for (const stat of LEGACY_STATS[gen]) {
            this.stats[stat + "Base"] = poke.bs[stat]
            if (poke.ivs && !isNaN(+poke.ivs[stat])){
                this.stats[stat + "IV"]  = poke.ivs[stat]
            } else {
                this.stats[stat + "IV"]  = 31
            }
            this.stats[stat + "EV"]  = poke.evs && poke.evs[stat] || 0
            if (stat === "hp") continue
            this.stats[stat + "Boost"] = 0
        }

        this.nature = poke.nature
        this.ability = this.getAbility()
        this.abilityOn = false
        this.item = poke.heldItem || poke.item || ""
        this.status = "Healthy"
        this.stats.percentHP = 100
        if (poke.moves && poke.moves.length > 4) {
            console.error("Move Duplication found: " + poke.moves + " at " + this.trainerName + " !")
            for (var i = 0; i < poke.moves.length; i++){
                const check = poke.moves[i]
                for (var j = 0 ; j < poke.moves.length; j++){
                    const counterCheck = poke.moves[j]
                    if (j == i) continue
                    if (counterCheck === check) {
                        poke.moves.splice(j, 1)
                        setdex[this.trainerID].mons[this.pokeID].moves = poke.moves
                    }
                    
                }
            }
        }
        for (var index = 0; index < 4; index++) {
            const move = poke.moves && poke.moves[index] || "(No Move)"
            this.moves[index].setMove(move)
        }
        this.stats.calcHP()
        this.stats.drawHealthBar()
        this.stats.calcStats()
        this.getTerrainEffects()
        this.checkAbilityOnEntry()
        calcGateway.calcTrigger()
    }
    createPokemon(){
		var baseStats = {};
		var ivs = {};
		var evs = {};
		var boosts = {};
		
		for (var i = 0; i < LEGACY_STATS[gen].length; i++) {
            var legacyStat = LEGACY_STATS[gen][i];
            var stat = legacyStatToStat(legacyStat);
            baseStats[stat === 'spc' ? 'spa' : stat] = this.stats[legacyStat + "Base"];
            ivs[stat] = gen > 2 ? this.stats[legacyStat + "IV"] : this.stats[legacyStat + "DVS"] * 2 + 1;
            evs[stat] = this.stats[legacyStat + "EV"];
            boosts[stat] =  this.stats[legacyStat + "Boost"];
		}
		if (gen === 1) baseStats.spd = baseStats.spa; 
		this.stats.calcHP()
		// FIXME the Pokemon constructor expects non-dynamaxed HP
		if (this.stats.dynamax) this.stats.currentHP = Math.floor(this.stats.currentHP / 2);
		return new calc.Pokemon(gen, this.pokemonName, {
            heads: this.heads, //this should be working already within the calc but it doesn't?
            weightkg: this.weightkg, //same goes here
			level: this.level,
			ability: this.ability,
			abilityOn: this.abilityOn,
			item: this.item,
			gender: this.gender,
			nature: this.nature,
			ivs: ivs,
			evs: evs,
			isDynamaxed: this.stats.dynamax,
			isSaltCure: this.saltcure,
			alliesFainted: this.alliesFainted,
			boostedStat: undefined, // ???
			teraType: this.tera,
			boosts: boosts,
			curHP: this.stats.currentHP,
			status: CALC_STATUS[this.status],
			toxicCounter: this.status === 'Badly Poisoned' ? this.toxicCounter : 0,
			moves: [
				this.moves[0].getDetails(),
				this.moves[1].getDetails(),
				this.moves[2].getDetails(),
				this.moves[3].getDetails(),
			],
			overrides: {
				baseStats: baseStats,
				types: this.types,
			}
		});
    }
    isPokeGrounded() {
        const teraType = this.tera
        return $("#gravity").prop("checked") || (
            teraType ? teraType !== "Flying" : this.type1 !== "Flying" &&
                teraType ? teraType !== "Flying" : this.type2 !== "Flying" &&
                this.ability !== "Levitate" && this.item !== "Air Balloon"
        );
    }
    getTerrainEffects() {
        const terrain = $("input:checkbox[name='terrain']:checked").val()
        switch (terrain){
            case "Electric":
                const isGrounded = this.isPokeGrounded()
                if (!this.status === "Asleep" && isGrounded){
                    this.field_status.prop("disabled", true)
                } else {
                    this.field_status.prop("disabled", false)
                }
                break;
            case "Misty":
                if (this.status === "Healthy" && isGrounded){
                    this.field_status.prop("disabled", true)
                } else {
                    this.field_status.prop("disabled", false)
                }
                break;
            default:
                this.field_status.prop("disabled", false)
        }
    }
    itemChange() {
        switch(this.item){
            case "Flame Orb":
                this.status = "Burned"
                break;
            case "Toxic Orb":
                this.status = "Badly Poisoned"
                break;
            default:
                this.stats.showBerryHP()
            case "":
                if (this.status === this.lastManualStatus){
                    return
                }   
                this.status = this.lastManualStatus          
        }
        calcGateway.calcTrigger()
    }
    colorCoding() {
        if (!this.box.isColorCodingOn) return
        var speCheck = document.getElementById("cc-spe-border").checked;
        var damageCheck = document.getElementById("cc-damage-color").checked;
        if (!speCheck && !damageCheck) {
            return
        }
        const foe = P2.createPokemon()
        for (var index in this.box.idToNode) {
            const mon = this.createPokemonFromSavedData(this.trainer.mons[index])
            const res = calcGateway.performCalculations(mon, foe)[0]

            if (speCheck) {
                var fastestSide = res.fastestSide ? res.fastestSide == 1 ? "S" : "T" : "F";
                this.box.idToNode[index].className = ""
                this.box.idToNode[index].classList.add("mon-speed-"+fastestSide)
            }
            if (!damageCheck) continue
            var p1LD = (res.highLowRoll[0][1] / foe.curHP()) * 100
            var p1HD = (res.highLowRoll[0][2] / foe.curHP()) * 100
            var p2LD = (res.highLowRoll[1][1] / mon.curHP()) * 100
            var p2HD = (res.highLowRoll[1][2] / mon.curHP()) * 100
            // check walling
            if (p2HD < 25 && p1HD > p2HD){
                if (p1HD > 50){
                    this.box.idToNode[index].classList.add("mon-dmg-HC")
                } else {
                    this.box.idToNode[index].classList.add("mon-dmg-W")
                }
                continue
            }

            var total = ""
            if (p1LD > 100) {
                total = "1"
            } else if (p1HD > 100) {
                total = "2"
            }
            if (p2LD > 100) {
                total += "4"
            } else if (p2HD > 100) {
                total += "3"
            }
            this.box.idToNode[index].classList.add("mon-dmg-" + total)
        }
    }
    createPokemonFromSavedData(poke){
		var set = Object.assign(structuredClone(pokedex[poke.species]), structuredClone(poke))
		var ivs = {};
		var evs = {};
		for (var i = 0; i < LEGACY_STATS[gen].length; i++) {
			var legacyStat = LEGACY_STATS[gen][i];
			var stat = legacyStatToStat(legacyStat);
            set.bs[stat] = set.bs[legacyStat]
			ivs[stat] = (gen >= 3 && set.ivs && typeof set.ivs[legacyStat] !== "undefined") ? set.ivs[legacyStat] : 31;
			evs[stat] = (set.evs && typeof set.evs[legacyStat] !== "undefined") ? set.evs[legacyStat] : 0;
		}
		var moveNames = set.moves;
		var pokemonMoves = [];
        set.item = (items.includes(set.item) && typeof set.item !== "undefined" && (set.item === "Eviolite" ||
         set.item.indexOf("ite") < 0) ? set.item : "")
		for (var i = 0; i < 4; i++) {
			var moveName = moveNames[i];
			pokemonMoves.push(new calc.Move(gen, moves[moveName] ? moveName : "(No Move)", 
				{ ability: set.ability, item: set.item }));
		}
		var abiOn = false;
		var status = "Healthy"
		if ($('#cd-intimidate').prop("checked") && set.ability === "Intimidate") abiOn = true;
		if ($('#cd-guts').prop("checked") && set.ability === "Guts") status = "Burned";
		return new calc.Pokemon(gen, set.species, {
			level: set.level,
			ability: set.ability,
			abilityOn: abiOn,
			status: CALC_STATUS[status],
			item: set.item,
			nature: set.nature,
			ivs: ivs,
			evs: evs,
			moves: pokemonMoves,
            overrides: {
				baseStats: set.bs,
				types: set.types,
			}
		});
    }
}

class PlayerPanel extends Panel{
    constructor(panel){
        super(panel)
        this.trainerID = 0;
        this.trainerName = "Player"
        this.trainer = setdex[0]
        this.lastTrainerID = 0
    }
}

class TrainerPanel extends Panel{
    constructor(panel){
        super(panel)
    }
}