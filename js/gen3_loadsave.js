function readTeamSize(teamOffset, bytes){
    console.log(teamOffset)
    console.log(teamOffset + 564)
    console.log(teamOffset + 564 + 2)
    for (var i = 0; i< 4; i++){
        console.log(bytes[teamOffset + 564 + i])
    }
}


function parseFileGen3(file){
    var reader = new FileReader();
	reader.onload = function (e) {
		var bytes = new Uint8Array(e.target.result);
        //size check, for now only emerald.
        if (bytes.length != 131072 && bytes.length != 131088) {
            console.warn("Not a pokemon emerald game", bytes.length)
            return
        }
        //I could check for the validity of all sectors, but maybe later
        /*for (var i = 0; i< (bytes.length/65536); i++) {
            //check which Game is the latest saved. //3884 //3968
        }*/
        // check saves files
        /* private const int SIZE_SECTOR = 0x1000;
    private const int SIZE_SECTOR_USED = 0xF80;
    private const int COUNT_MAIN = 14; // sectors worth of data
    private const int SIZE_MAIN = COUNT_MAIN * SIZE_SECTOR;

    // There's no harm having buffers larger than their actual size (per format).
    // A checksum consuming extra zeroes does not change the prior checksum result.
    public readonly byte[] Small   = new byte[1 * SIZE_SECTOR_USED]; //  [0x890 RS, 0xf24 FR/LG, 0xf2c E]
    public readonly byte[] Large   = new byte[4 * SIZE_SECTOR_USED]; //3+[0xc40 RS, 0xee8 FR/LG, 0xf08 E]
    public readonly byte[] Storage = new byte[9 * SIZE_SECTOR_USED]; //  [0x83D0]
*/  
        var SIZE_SECTOR = 4096;
        
        var partySize = 100;
        var boxMonSize = 80
        var teamOffset = 3884
        var boxOffset = teamOffset + 3968 + 3968 + 3968 + 3848;

        try {
            readTeamSize(teamOffset, bytes)
            console.log(bytes);
        } catch (e) {
            console.warn(e)
        }
		
    }
    reader.readAsArrayBuffer(file);
};

$(document).ready(function(){
    $('#import-zone').val("")
    $('#import-zone').on({
        dragenter: function(e){
            if (pokeDragged){
                return
            }
            if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
                console.log(e.originalEvent.dataTransfer.files)
            }
            if (e.originalEvent.target.tagName === "IMG") console.log("aeaze")
            console.log()
        },
        dragleave: function(e){
            if (pokeDragged){ // don't show the visual hint for a non-file, should make this more robust tho
                return
            }
        },
        drop: function(e){
            if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
                parseFileGen3(e.originalEvent.dataTransfer.files[0]);
            }
        }
    })
});