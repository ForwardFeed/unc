/*
	for now only save the current trainer #p1
*/
function saveTrainerPokemon() {
	var pokeInfo = $(this).closest(".poke-info");
	var selectID = pokeInfo.find("input.selector").val()
	var pokeID = selectID.split(";");
	var tID = 0;
	var monID = pokeID[2] || setdex[0].mons.length;
	var trainerName = pokeID[1] || null
	var poke = addSets(ExportPokemon(pokeInfo));
	if (!trainerName) dispatchPlayerMon(poke);
	setdex[tID].mons[monID]= poke[0];
	localStorage.setItem(GameName + "playerdex", JSON.stringify(window.setdex[0].mons));
	
	$("#save-change").prop("hidden", true);
	if (!trainerName) return
	var boxedImg = idToNode[monID];
	boxedImg.src = getSrcImgPokemon(pokeID[0]);
	boxedImg.dataset.id = pokeID[0] + ";" + pokeID[1] + ";" + monID;
	pokeInfo.find("input.selector").val(boxedImg.dataset.id);

	
}

function ExportPokemon(pokeInfo) {
	var pokemon = createPokemon(pokeInfo);
	var EV_counter = 0;
	var finalText = "";
	finalText = pokemon.name + (pokemon.item ? " @ " + pokemon.item : "") + "\n";
	finalText += "Level: " + pokemon.level + "\n";
	finalText += "Gender: " + pokemon.gender + "\n";
	finalText += pokemon.nature && gen > 2 ? pokemon.nature + " Nature" + "\n" : "";
	finalText += pokemon.teraType && gen > 8 ? "Tera Type: " + pokemon.teraType : "";
	finalText += pokemon.ability ? "Ability: " + pokemon.ability + "\n" : "";
	if (gen > 2) {
		var EVs_Array = [];
		for (var stat in pokemon.evs) {
			var ev = pokemon.evs[stat] ? pokemon.evs[stat] : 0;
			if (ev > 0) {
				EVs_Array.push(ev + " " + calc.Stats.displayStat(stat));
			}
			EV_counter += ev;
			if (EV_counter > 510) break;
		}
		if (EVs_Array.length > 0) {
			finalText += "EVs: ";
			finalText += serialize(EVs_Array, " / ");
			finalText += "\n";
		}
	}

	var IVs_Array = [];
	for (var stat in pokemon.ivs) {
		var iv = pokemon.ivs[stat] ? pokemon.ivs[stat] : 0;
		if (iv < 31) {
			IVs_Array.push(iv + " " + calc.Stats.displayStat(stat));
		}
	}
	if (IVs_Array.length > 0) {
		finalText += "IVs: ";
		finalText += serialize(IVs_Array, " / ");
		finalText += "\n";
	}

	for (var i = 0; i < 4; i++) {
		var moveName = pokemon.moves[i].name;
		if (moveName !== "(No Move)") {
			finalText += "- " + moveName + "\n";
		}
	}
	finalText = finalText.trim();
	return finalText;
}

function importMonsPlayer() {
	var text = document.getElementById("import-zone");
	var monsList = window.addSets(text.value);
	dispatchPlayerMon(monsList);
	text.value = "";
}
$("#exportL").click(function () {
	var exportData = ExportPokemon($("#p1"));
	$("textarea.import-team-text").val(exportData);
	navigator.clipboard.writeText(exportData).then(function () {
	});
});

$("#exportR").click(function () {
	var exportData = ExportPokemon($("#p2"));
	$("textarea.import-team-text").val(exportData);
	navigator.clipboard.writeText(exportData).then(function () {
	});
});

function serialize(array, separator) {
	var text = "";
	for (var i = 0; i < array.length; i++) {
		if (i < array.length - 1) {
			text += array[i] + separator;
		} else {
			text += array[i];
		}
	}
	return text;
}

function getAbility(row) {
	var ability = row[1] ? row[1].trim() : '';
	if (calc.ABILITIES[9].indexOf(ability) !== -1) return ability;
}

function getTeraType(row) {
	var teraType = row[1] ? row[1].trim() : '';
	if (Object.keys(calc.TYPE_CHART[9]).slice(1).indexOf(teraType) !== -1) return teraType;
}

function statToLegacyStat(stat) {
	switch (stat) {
	case 'hp':
		return "hp";
	case 'atk':
		return "at";
	case 'def':
		return "df";
	case 'spa':
		return "sa";
	case 'spd':
		return "sd";
	case 'spe':
		return "sp";
	}
}
function getStats(currentPoke, rows, offset) {
	currentPoke.nature = "Serious";
	var currentEV;
	var currentIV;
	var currentAbility;
	var currentTeraType;
	var currentNature;
	currentPoke.level = 100;
	for (var x = offset; x < offset + 9; x++) {
		var currentRow = rows[x] ? rows[x].split(/[/:]/) : '';
		var evs = {};
		var ivs = {};
		var ev;
		var j;

		switch (currentRow[0]) {
		case 'Level':
			currentPoke.level = parseInt(currentRow[1].trim());
			break;
		case 'EVs':
			for (j = 1; j < currentRow.length; j++) {
				currentEV = currentRow[j].trim().split(" ");
				currentEV[1] = statToLegacyStat(currentEV[1].toLowerCase());
				evs[currentEV[1]] = parseInt(currentEV[0]);
			}
			currentPoke.evs = evs;
			break;
		case 'IVs':
			for (j = 1; j < currentRow.length; j++) {
				currentIV = currentRow[j].trim().split(" ");
				currentIV[1] = statToLegacyStat(currentIV[1].toLowerCase());
				ivs[currentIV[1]] = parseInt(currentIV[0]);
			}
			currentPoke.ivs = ivs;
			break;

		}
		currentAbility = rows[x] ? rows[x].trim().split(":") : '';
		if (currentAbility[0] == "Ability") {
			currentPoke.ability = currentAbility[1].trim();
		}

		currentTeraType = rows[x] ? rows[x].trim().split(":") : '';
		if (currentTeraType[0] == "Tera Type") {
			currentPoke.teraType = currentTeraType[1].trim();
		}

		currentNature = rows[x] ? rows[x].trim().split(" ") : '';
		if (currentNature[1] == "Nature" && currentNature[2] !== "Power") { // edge case with the move nature power that overwrite nature
			currentPoke.nature = currentNature[0];
		}
	}
	return currentPoke;
}

function getItem(currentRow, j) {
	for (;j < currentRow.length; j++) {
		var item = currentRow[j].trim();
		if (calc.ITEMS[9].indexOf(item) != -1) {
			return item;
		}
	}
}

function getMoves(currentPoke, rows, offset) {
	var movesFound = false;
	var moves = [];
	for (var x = offset; x < offset + 12; x++) {
		if (rows[x]) {
			if (rows[x][0] == "-") {
				movesFound = true;
				var move = rows[x].substr(2, rows[x].length - 2).replace("[", "").replace("]", "").replace("  ", "");
				moves.push(move);
			} else {
				if (movesFound == true) {
					break;
				}
			}
		}
	}
	currentPoke.moves = moves;
	return currentPoke;
}

function getImportGender(row) {
	switch (row){
		case "Male":
		case "M":
			return "M";
		case "Female":
		case "F":
			return "F";
		default:
			return "N";
	}
}

function addSets(pokes) {
	var rows = pokes.split("\n");
	var currentRow;
	var currentPoke;
	var pokelist = [];
	for (var i = 0; i < rows.length; i++) {
		currentRow = rows[i].split(/[()@]/);
		for (var j = 0; j < currentRow.length; j++) {
			currentRow[j] = checkExeptions(currentRow[j].trim());
			if (calc.SPECIES[9][currentRow[j].trim()] !== undefined) {
				currentPoke =  structuredClone(calc.SPECIES[9][currentRow[j].trim()]); // prevents painfull overwrite of the pokedex
				currentPoke.species = currentRow[j].trim();
				currentPoke.item = getItem(currentRow, j + 1);
				currentPoke.gender = getImportGender(rows[2].split(":")[1].trim())
				currentPoke.ability = getAbility(rows[i + 1].split(":"));
				currentPoke.teraType = getTeraType(rows[i + 1].split(":"));
				currentPoke = getStats(currentPoke, rows, i + 1);
				currentPoke = getMoves(currentPoke, rows, i);
				pokelist.push(currentPoke);
				break;
			}
		}
	}
	return pokelist;
}

function checkExeptions(poke) {
	switch (poke) {
	case 'Aegislash':
		poke = "Aegislash-Blade";
		break;
	case 'Basculin-Blue-Striped':
		poke = "Basculin";
		break;
	case 'Gastrodon-East':
		poke = "Gastrodon";
		break;
	case 'Mimikyu-Busted-Totem':
		poke = "Mimikyu-Totem";
		break;
	case 'Mimikyu-Busted':
		poke = "Mimikyu";
		break;
	case 'Pikachu-Belle':
	case 'Pikachu-Cosplay':
	case 'Pikachu-Libre':
	case 'Pikachu-Original':
	case 'Pikachu-Partner':
	case 'Pikachu-PhD':
	case 'Pikachu-Pop-Star':
	case 'Pikachu-Rock-Star':
		poke = "Pikachu";
		break;
	case 'Vivillon-Fancy':
	case 'Vivillon-Pokeball':
		poke = "Vivillon";
		break;
	case 'Florges-White':
	case 'Florges-Blue':
	case 'Florges-Orange':
	case 'Florges-Yellow':
		poke = "Florges";
		break;
	}
	return poke;

}
function sortImports(a, b) {
	var sorted = [a.species, b.species].sort()[0];
	if (sorted == b.species) {
		return 1;
	}
	return -1;
}

var idToNode = [];
function dispatchPlayerMon(list) {
	if (list.length <= 0) {
		return;
	}
	list.sort(sortImports);
	var box = document.getElementById("box-poke-list");
	var playerMons = window.setdex[0].mons;
	var boxOffset = playerMons.length; 
	for (var i = 0, iLen = list.length; i < iLen; i++) {
		var poke = list[i];
		/* checks for dupes*/
		var isDupe = false;
		for (var j = 0, jLen = playerMons.length; j < jLen; j++) {
			if (playerMons[j].species === poke.species) {
				isDupe = j;
				break;
			}
		}
		if (isDupe !== false) {
			window.setdex[0].mons[j] = poke;
			boxOffset--
			if (boxOffset < 0){
				boxOffset == 0
			}
		} else {
			var idOffeseted = boxOffset + i
			idToNode.push(window.addBoxed(box, poke, idOffeseted, 0));
			window.setdex[0].mons.push(poke);
		}
	}
	localStorage.setItem(GameName + "playerdex", JSON.stringify(window.setdex[0].mons));
	box.children[0].click();
}

function moveSetBuildLegend(set){
	var monLegend = document.createElement("legend");
	var evoText = set.evl ? " (" + set.evl + ")": " ";
	monLegend.innerText = set.mon + evoText;
	return monLegend;
}

function moveSetBuildSector(set){
	var fragA = new DocumentFragment();
	var fragB = new DocumentFragment();
	for (var i = 0, iLen = set.mv.length; i< iLen; i++) {
		var move = set.mv[i];
		var row = document.createElement("div");
		row.className = "moveset-row";
		row.innerText = "Lv." + move[0] + " " + move[1];
		//slit into two rows, the lower level left
		Math.round(i / iLen) ? fragB.append(row) : fragA.append(row);
	}
	var blockA = document.createElement("div");
	blockA.className = "moveset-block";
	blockA.append(fragA)
	var blockB = document.createElement("div");
	blockB.className = "moveset-block";
	blockB.append(fragB)
	var movesetBox = document.createElement("div");
	movesetBox.className = "moveset-sector"
	movesetBox.append(blockA)
	movesetBox.append(blockB)
	
	return movesetBox;
}	

function moveSetShow(set, evoset, preevo){
	var box = document.getElementById("moveset-box-body");
	if (set.ab){ //it may be missing
		box.children[0].innerHTML = `<b>Abilities:</b> <span>${set.ab[0][0]} </span> | <span> ${set.ab[1][0]} </span> <b>Hidden:</b> <span> ${set.ab[2][0]}</span>`;
	}
	box.children[1].innerHTML = "";
	box.children[1].append(moveSetBuildLegend(set));
	box.children[1].append(moveSetBuildSector(set));
	if (evoset) {
		box.children[1].append(moveSetBuildLegend(evoset));
		box.children[1].append(moveSetBuildSector(evoset));
	}
	if (preevo) {
		box.children[1].append(moveSetBuildLegend(preevo));
		box.children[1].append(moveSetBuildSector(preevo));
	}
}

function moveSetToggling(){
	var frame = document.getElementById("moveset-box-frame");
	frame.toggleAttribute("hidden")
	var state = frame.getAttribute("hidden") === "" ? false : true; //weird dev web moment
	if (state) {
		//show
		var monSel = $('#p1').find("input.selector").val();
		var monName = monSel.split(";")[0];
		if (! MOVESETS) return //not ready yet
		for (var i = 0, iLen = MOVESETS.length; i < iLen; i++){
			var set = MOVESETS[i];
			if (set.mon !== monName) continue;
			var evoset = set.evl ? MOVESETS[i+1] : null;
			var preevo =  MOVESETS[i-1].evl ? MOVESETS[i-1]: null;
			// fetch the next next evo and set preevo to it instead
			if (evoset && !preevo) preevo = evoset.evl ? MOVESETS[i+2] : null
			// fetch the previous pre evo and set nextEvo to it instead
			if (!evoset && preevo) evoset = MOVESETS[i-2].evl ? MOVESETS[i-2] : null
			moveSetShow(set, evoset, preevo);
		}
	} else {
		//hide
	}
}


$(document).ready(function () {
	$('#save-change').click(saveTrainerPokemon);
	$("#import").click(importMonsPlayer);
	var savedMons = JSON.parse(localStorage.getItem(GameName + "playerdex"));
	if (savedMons) {
		dispatchPlayerMon(savedMons);
	}
	$('#p1').find("input.selector").change();
	clearField();
	$('#close-moveset-box').click(moveSetToggling);
	$('#moveset').click(moveSetToggling);
	var script = document.createElement("script");
	script.src = "./data/movesets.js";
	document.head.appendChild(script)
});
