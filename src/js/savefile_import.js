function saveFileSelection() {
    var el = window._protected_reference = document.createElement("INPUT");
    el.type = "application/x-spss-sav";
    el.accept = ".sav";
    el.multiple = "multiple"; // remove to have a single file selection
    
    // (cancel will not trigger 'change')
    el.addEventListener('change', function(ev2) {
      // access el.files[] to do something with it (test its length!)
      
      // add first image, if available
      if (el.files.length) {
        console.log(el.files[0])
      }
  
  
      // test some async handling
      new Promise(function(resolve) {
        setTimeout(function() { console.log(el.files); resolve(); }, 1000);
      })
      .then(function() {
        // clear / free reference
        el = window._protected_reference = undefined;
      });
  
    });
    el.click(); // open
}


function readFile(file) {
	var reader = new FileReader();
	reader.onload = function (e) {
		var bytes = new Uint8Array(e.target.result);
        var SIZE_SECTOR = 0x1000;
        var SIZE_SECTOR_USED = 0xF80;
        var COUNT_MAIN = 14;
        var SIZE_MAIN = COUNT_MAIN * SIZE_SECTOR;
		if (bytes.length > 32000 && bytes[0x2008] == 99 && bytes[0x2d0f] == 127) {
			try {
				pokemon = [];
				deadPokemon = [];
				pokemon = pokemon.concat(readPokemonList(bytes, 0x2865, 6, 48));
				for (var i = 0; i < 16; i++) {
					var l = readNewbox(bytes, 0x2f20 + i * 0x21);
					if (i >= 12) {
						deadPokemon = deadPokemon.concat(l);
					} else {
						pokemon = pokemon.concat(l);
					}
				}
				box = pokemon;
				deadBox = deadPokemon;
				var badgeMask = (bytes[0x23e5] << 8) | bytes[0x23e6];
				badges = 0;
				for (var i = 0; i < 16; i++) {
					if ((badgeMask & 1) == 1) {
						badges++;
					}
					badgeMask >>= 1;
				}
				document.getElementById("badges").value = badges;
				updateBadges();
				if (box.length > 0) {
					setPlayer(0);
				}
				updateBox();
				var popup = '<div onclick="closePopup()" class="save-success">Successfully parsed save!';
				popup += '<lb></lb>Encounters: ' + pokemon.length;
				if (deadPokemon.length > 0) {
					popup += ' (+' + deadPokemon.length + ' fainted)';
				}
				popup += '<lb></lb>Badges: ' + badges;
				popup += '</div>';
				document.getElementById("info-popup").innerHTML = popup;
			} catch (e) {
				document.getElementById("info-popup").innerHTML = '<div onclick="closePopup()" class="save-error">Error while parsing save!<lb></lb>Is this a valid file?<lb></lb>See console for details</div>';
			}
		} else {
			console.log("File doesn't appear to be a save file!");
			console.log(bytes[0x2008]);
			console.log(bytes[0x2d0f]);
			document.getElementById("info-popup").innerHTML = '<div onclick="closePopup()" class="save-error">File doesn\'t appear to be a save file!<lb></lb>Name should end with .sav</div>';
		}
	};
	reader.readAsArrayBuffer(file);
}

$(document).ready(function(){
    $('#import-savefile-btn').click(saveFileSelection);
});