
function HideShowCCSettings() {
	$('#show-cc')[0].toggleAttribute("hidden");
	$('#hide-cc')[0].toggleAttribute("hidden");
	$('#refr-cc')[0].toggleAttribute("hidden");
	$('#info-cc')[0].toggleAttribute("hidden");
	$('#cc-sets')[0].toggleAttribute("hidden");
}

function colorCodeUpdate() {
	var speCheck = document.getElementById("cc-spe-border").checked;
	var ohkoCheck = document.getElementById("cc-ohko-color").checked;
	if (!speCheck && !ohkoCheck) {
		return
	}
	var pMons = document.getElementById("trainer-mons").querySelectorAll("img");
	// i calc here to alleviate some calculation, fortunately p2 doesn't get overwritten
	var p2info = $("#p2");
	var p2 = createPokemon(p2info);
	for (var i = 0, iLen = pMons.length; i < iLen; i++) {
		var set = pMons[i].getAttribute("data-id");
		var idColor = calculationsColors(set, p2);
		if (speCheck && ohkoCheck) {
			pMons[i].className = "mon-speed-" + idColor.speed + " mon-dmg-" + idColor.code;
		}
		else if (speCheck) {
			pMons[i].className = "mon-speed-" + idColor.speed;
		}
		else if (ohkoCheck) {
			pMons[i].className = "mon-dmg-" + idColor.code;
		}
	}
}
function showColorCodes() {
	window.AUTO_REFRESH = document.getElementById("cc-auto-refr").checked;
	colorCodeUpdate();
	HideShowCCSettings();
}

function refreshColorCode() {
	window.AUTO_REFRESH = document.getElementById("cc-auto-refr").checked;
	colorCodeUpdate();
}

function hideColorCodes() {
	var pMons = document.getElementById("trainer-mons").querySelectorAll("img");
	for (var i = 0; i < pMons.length; i++) {
		pMons[i].className = "";
	}
	window.AUTO_REFRESH = false;
	HideShowCCSettings();
}

function SpeedBorderSetsChange(ev) {
	var monImgs = document.getElementById("trainer-mons").querySelectorAll("img");
	for (var i = 0; i < monImgs.length; i++) {
		if (ev.target.checked) {
			monImgs[i].classList.remove("mon-speed-none");
		} else {
			monImgs[i].classList.add("mon-speed-none");
		}

	}

}
function widthSpeedBorder(ev) {
	document.documentElement.style.setProperty("--spe-bor-width", ev.target.value + "px");
}

function ColorCodeSetsChange(ev) {
	var monImgs = document.getElementById("trainer-mons").querySelectorAll("img");
	for (var i = 0; i < monImgs.length; i++) {
		if (ev.target.checked) {
			monImgs[i].classList.remove("mon-dmg-none");
		} else {
			monImgs[i].classList.add("mon-dmg-none");
		}

	}
}

function toggleInfoColorCode() {
	document.getElementById("info-cc-field").toggleAttribute("hidden");
}

$(document).ready(function () {
    $('#show-cc').click(showColorCodes);
    $('#hide-cc').click(hideColorCodes);
    $('#refr-cc').click(refreshColorCode);
    $('#info-cc').click(toggleInfoColorCode);
    $('#cc-spe-border').change(SpeedBorderSetsChange);
    $('#cc-ohko-color').change(ColorCodeSetsChange);
    $('#cc-auto-refr').change(refreshColorCode);
    $('#cc-spe-border')[0].checked = true;
    $('#cc-ohko-color')[0].checked = true;
    $('#cc-spe-width').change(widthSpeedBorder);
});

