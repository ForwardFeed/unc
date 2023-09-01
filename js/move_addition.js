var damageAddition = new Array(16).fill(0);
function findSelectedDamage(){
    var selected = "#" + document.querySelector('[name="resultMove"]:checked').id;
    for (var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            if (resultLocations[i][j].move === selected) return damageResults[i][j]
        }
    }
}

function calcMedian(arr) {
    if (!arr.length) return arr
    var half = Math.floor(arr.length / 2);
    arr.sort(function(a, b) { return a - b;});

    if (arr.length % 2) {
        return arr[half];
    } else {
        return (arr[half] + arr[half]) / 2.0;
    }
}

function calcaddToggle(){
    var frame = document.getElementById("calcadd-box-frame");
	frame.toggleAttribute("hidden")
	var state = frame.getAttribute("hidden") === "" ? false : true;
    if (state){

    } else {
        
    }
}

function calcaddReset(){
    damageAddition.fill(0)
    var textDiv = document.getElementById("calcadd-text")
    textDiv.innerText = "";
    var rsltDiv = document.getElementById("calcadd-result")
    rsltDiv.innerText = "0 - 0 - 0%";
}

function calcaddAdd(){
    var dmgResult = findSelectedDamage()
    //because of dragon rage stuff
    if (typeof dmgResult.damage === "object") {
        damageAddition = dmgResult.damage.map((a,i)=> a + damageAddition[i]);
    } else {
        damageAddition = damageAddition.map((a,i)=> a + dmgResult.damage);
    }
    
    var textDiv = document.getElementById("calcadd-text");
    textDiv.innerHTML += (textDiv.innerText ? " <em>Into</em> <b>" : "<b>") + dmgResult.attacker.name + "</b>: " + dmgResult.move.name;
    var rsltDiv = document.getElementById("calcadd-result");
    var low = Math.floor(damageAddition[0] * (1000/1) / dmgResult.defender.maxHP()) / 10;
    var median = Math.floor(calcMedian(damageAddition) * (1000/1) / dmgResult.defender.maxHP()) /10 ;
    var high =  Math.floor( damageAddition[15] * (1000/1)  / dmgResult.defender.maxHP()) /10  ;
    rsltDiv.innerText = low + " - " + median + " - " + high + " %";

}

$(document).ready(function () {
    $('#calcadd').click(calcaddToggle);
    $('#close-calcadd-box').click(calcaddToggle);
    $('#calcadd-reset').click(calcaddReset);
    $('#calcadd-add').click(calcaddAdd);
});