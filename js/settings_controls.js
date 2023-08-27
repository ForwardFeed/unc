function doubleModeSelection() {
    var double = document.querySelector("input[name=\"double\"]:checked").id;
    if (double === "double-two") {
        //set the 2 v 1 mode (modern :D)
        localStorage.setItem("doubleLegacy", 0);
        if (window.isInDoubles) {
			document.getElementById("trainer-pok-list-opposing2").removeAttribute("hidden");
			for (toShow of document.getElementsByClassName("for-doubles")) {
				toShow.removeAttribute("hidden");
			}
		}
    } else {
        //It's more like legacy mode (bruh)
        localStorage.setItem("doubleLegacy", 1);
        if (window.isInDoubles) {
			document.getElementById("trainer-pok-list-opposing2").setAttribute("hidden", true);
			for (toHide of document.getElementsByClassName("for-doubles")) {
				toHide.setAttribute("hidden", true);
			}
		}
    }
}

function settingsMenuToggle() {
    document.getElementById("settings-menu").toggleAttribute("hidden");
}

function fieldResetToggle() {
    localStorage.setItem("field-reset", ! JSON.parse(localStorage.getItem("field-reset")));
}

function resultColorToggle() {
    var resultColor = JSON.parse(localStorage.getItem("result-color"))
    localStorage.setItem("result-color", !resultColor);
    if (!resultColor) { // inversion here^
        $('#result-color-on').prop("checked", true)
    } else {
        $('#result-color-off').prop("checked", true)
        var subgroups = document.getElementsByClassName("move-result-subgroup");
        for (sub of subgroups){
            for(div of sub.children){
                if (div.className.match(/move-dmg-[0-9]/)) div.className = ""
            }
        }
    }
    calcTrigger();
}

function activePokemonNoteToggle() {
    var status =  $('#p-notes-on').prop("checked")
    if (status) {
        localStorage.setItem("p-notes", "1")
        $("#div-p-notes").prop("hidden", false);
    } else {
        localStorage.setItem("p-notes", "0")
        $("#div-p-notes").prop("hidden", true);
    }
}

function pokeSelecSpeToggle(){
    var status =  $('#p-s-specifier-on').prop("checked")
    if (status) {
        localStorage.setItem("p-s-spe", "1")
        $(".pokebar-selection-specifier").css("display", "inline");
    } else {
        localStorage.setItem("p-s-spe", "0")
        $(".pokebar-selection-specifier").css("display", "none");
    }
}

$(document).ready(function () {
    try{ //if some settings are missing, it's w/e so far
        $('#light-theme').change(themeSelection);
        $('#dark-theme').change(themeSelection);
        $('#forest-theme').change(themeSelection);
        $('#blahaj-theme').change(themeSelection);
        $('#double-two').change(doubleModeSelection);
        $('#double-one').change(doubleModeSelection);
        if (+localStorage.getItem("doubleLegacy")) {
            $('#double-one').prop("checked", true);
            doubleModeSelection()
        }
        $('#hide-arrows').change(sideArrowToggle);
        $('#show-arrows').change(sideArrowToggle);
        $('#open-settings-box').click(settingsMenuToggle);
        $('#close-settings-box').click(settingsMenuToggle);
        $('#field-reset-on').click(fieldResetToggle);
        $('#field-reset-off').click(fieldResetToggle);
        if (JSON.parse(localStorage.getItem("field-reset")))   $('#field-reset-on').prop("checked", true);
        $('#result-color-on').click(resultColorToggle);
        $('#result-color-off').click(resultColorToggle);
        if (JSON.parse(localStorage.getItem("result-color")))   $('#result-color-on').prop("checked", true);
        $('#p-notes-on').click(activePokemonNoteToggle);
        $('#p-notes-off').click(activePokemonNoteToggle);
        $('#p-notes-reset').change(clearAllNotes);
        +localStorage.getItem("p-notes") ? $('#p-notes-on').prop("checked", true).click() : $('#p-notes-off').prop("checked", true).click();
        $('#p-s-specifier-on').click(pokeSelecSpeToggle);
        $('#p-s-specifier-off').click(pokeSelecSpeToggle);
        +localStorage.getItem("p-s-spe") ? $('#p-s-specifier-on').prop("checked", true).click() : $('#p-s-specifier-off').prop("checked", true).click();
    } catch(e) {

    }

    

});