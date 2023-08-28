$(document).ready(function () {
	var sets = document.getElementById("sets");
	sets.innerHTML += '<a href="./data/runandbun_script_imports.lua" download="lua_script_for_export">Download Lua Script</a><a href="./data/AI_flowchart_R&B.png" target="_blank" rel="noopener noreferrer">Flowchart of the AI</a>'
	var script = document.createElement("script");
	script.src = "./gen3_loadsave.js";
	script.onload = ()=>{gen3_loadsave()}
	document.head.appendChild(script)
});