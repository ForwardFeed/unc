function toggleDoubleLegacyMode() {
	if (+localStorage.getItem("doubleLegacy")) {
		localStorage.setItem("doubleLegacy", 0)
		document.getElementById("double-legacy-mode").innerText = "Doubles Modern"
		if (window.isInDoubles) {
			document.getElementById("trainer-pok-list-opposing2").removeAttribute("hidden");
			for (toShow of document.getElementsByClassName("for-doubles")) {
				toShow.removeAttribute("hidden");
			}
		}
	} else {
		localStorage.setItem("doubleLegacy", 1)
		document.getElementById("double-legacy-mode").innerText = "Doubles Legacy"
		if (window.isInDoubles) {
			document.getElementById("trainer-pok-list-opposing2").setAttribute("hidden", true);
			for (toHide of document.getElementsByClassName("for-doubles")) {
				toHide.setAttribute("hidden", true);
			}
		}
	}
}



$(document).ready(function () {
    $('#light-theme').click(themeSelection);
    $('#dark-theme').click(themeSelection);
    $('#double-two').click();
    $('#double-one').click();
    $('#hide-arrows').click();
    $('#show-arrows').click();
});