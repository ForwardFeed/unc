var PLAYER_AVAILABLE_ITEMS=["Silk Scarf","Oran Berry","Nevermelt Ice","Pecha Berry","Soft Sand","Cheri Berry","Black Glasses","Chesto Berry","Poison Barb","Leppa Berry","Miracle Seed","Rawst Berry","Silver Powder","Persim Berry","Hard Stone","Aspear Berry","Sharp Beak","Sitrus Berry","Pixie Plate","Lum Berry","Black Belt","Lansat Berry","Metal Coat","Starf Berry","Dragon Fang","Custap Berry","Charcoal","Liechi Berry","Magnet","Salac Berry","Mystic Water","Petaya Berry","Twisted Spoon","Mago Berry","Spell Tag","Aguav Berry","Iapapa Berry","Rock Gem","Ganlon Berry","Dark Gem","Apicot Berry","Poison Gem","Rowap Berry","Ground Gem","Jaboca Berry","Steel Gem","Figy Berry","Electric Gem","Wiki Berry","Grass Gem","Watmel Berry","Flying Gem","Belue Berry","Fire Gem","Pomeg Berry","Psychic Gem","Kelpsy Berry","Bug Gem","Qualot Berry","Normal Gem","Hondew Berry","Ghost Gem","Micle Berry","Ice Gem","Cornn Berry","Fighting Gem","Durin Berry","Water Gem","Pinap Berry","Fairy Gem","Chilan Berry","Dragon Gem","Occa Berry","Passho berry","Wide Lens","Wacan Berry","Muscle Band","Rindo Berry","Wise Glasses","Yache Berry","Chople Berry","Zoom Lens","Kebia Berry","Razor Claw","Shuca Berry","Razor Fang","Coba Berry","King's Rock","Payapa Berry","Life Orb","Tanga Berry","Metronome","Charti Berry","Shell Bell","Kasib Berry","Expert Belt","Haban Berry","Assault Vest","Colbur Berry","Leftovers","Babiri Berry","Choice Band","Roseli Berry","Choice Scarf","Choice Specs","Rocky Helmet","Heavy Duty Boots","White Herb","Shed Shell","Electric Seed","Grassy Seed","Misty Seed","Psychic Seed","Power Herb","Mental Herb","Room Service","Eject Button","Eject Pack","Red Card","Focus Sash"];
// extends the species available to gen 9
SPECIES_BY_ID[8] = structuredClone(SPECIES_BY_ID[9])
//correct the wrong bs changes
SPECIES_BY_ID[8]["zoroarkhisui"].baseStats  = { hp: 60, atk: 105, def: 60, spa: 120, spd: 60, spe: 105 };
SPECIES_BY_ID[8]["zoruahisui"].baseStats = { hp: 35, atk: 60, def: 40, spa: 85, spd: 40, spe: 70 };
SPECIES_BY_ID[8]["zacian"].baseStats = { hp: 92, atk: 130, def: 115, spa: 80, spd: 115, spe: 138 };
SPECIES_BY_ID[8]["zamazenta"].baseStats = { hp: 92, atk: 130, def: 115, spa: 80, spd: 115, spe: 138 };
SPECIES_BY_ID[8]["cresselia"].baseStats = { hp: 120, atk: 70, def: 120, spa: 75, spd: 130, spe: 85 };
SPECIES_BY_ID[8]["kleavor"].baseStats = { hp: 70, atk: 130, def: 95, spa: 45, spd: 75, spe: 85 };
//correct the wrong moves
calc.MOVES[8]["Covet"].type = "Fairy";
calc.MOVES[8]["Absorb"].bp = 40;

//Make the calc print IVs instead of EVs
calc.getEVDescriptionText = function (gen, pokemon, stat, natureName) {
    var nature = gen.natures.get((0, util_1.toID)(natureName));
    return (pokemon.ivs[stat] +
        (nature.plus === nature.minus ? ''
            : nature.plus === stat ? '+'
                : nature.minus === stat ? '-'
                    : '') + ' ' +
        stats_1.Stats.displayStat(stat));
}