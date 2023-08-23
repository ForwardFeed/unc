
function themeSelection(){
    var theme = document.querySelector("input[name=\"theme\"]:checked").id
	document.getElementById('dark-theme-styles').disabled = true;
	document.getElementById('light-theme-styles').disabled = true;
	document.getElementById('other-theme-styles').disabled = true;
	document.getElementById(theme + '-styles').disabled = false;
	
}
themeSelection()