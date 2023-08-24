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

function settingsMenuToggle(){
    document.getElementById("settings-menu").toggleAttribute("hidden");
}

function fieldResetToggle(){
    localStorage.setItem("field-reset", !localStorage.getItem("field-reset"))
}

$(document).ready(function () {
    $('#light-theme').change(themeSelection);
    $('#dark-theme').change(themeSelection);
    $('#forest-theme').change(themeSelection);
    $('#double-two').change(doubleModeSelection);
    $('#double-one').change(doubleModeSelection);
    $('#hide-arrows').change(sideArrowToggle);
    $('#show-arrows').change(sideArrowToggle);
    $('#open-settings-box').click(settingsMenuToggle);
    $('#close-settings-box').click(settingsMenuToggle);
    $('#field-reset-on').click(fieldResetToggle);
    $('#field-reset-off').click(fieldResetToggle);
    if (JSON.parse(localStorage.getItem("field-reset")))   $('#field-reset-on').prop("checked", true);
});