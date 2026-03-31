const race = document.getElementById('race');
const noble = document.getElementById('noble');
const position = document.getElementById('position');

let stats = document.getElementById("stats");
let rolls = document.getElementById("rolls");
const abilities = document.getElementById('abilitiesList');
const items = document.getElementById('itemsList');
let toggles = document.getElementsByClassName("dropdownToggle");
// const cyphers = document.getElementById('cyphersList');
// const skills = document.getElementById('skillsList');

let useSessionStorage = false;

let disableSaving = false;

let viewingSharedSheet = false;



const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDOGFUZMt3IKyY9_6BRHexL-3YdwMH4VOM",
    authDomain: "tog-charsheets.firebaseapp.com",
    projectId: "tog-charsheets",
    storageBucket: "tog-charsheets.firebasestorage.app",
    messagingSenderId: "242438580086",
    appId: "1:242438580086:web:707620862fbfcf685a7c57"
});
const db = firebaseApp.firestore();

$(document).ready(function () {
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.size != 0) {
        useSessionStorage = true;
        viewingSharedSheet = true;
        loadSharedSheet(searchParams.get("id"));
    } else {
        loadForm();
    }
    getConditions();
    // getPremadeItems();
    $("#newAbility").on("click", function () {
        $("#abilityWindow").css('display', 'flex');
        $("#popupMask").css('display', 'flex');
        filterAbilities();
        console.log("new ability");
    });

    $("#showHiddenAbilities").on("input", function () {
        if (document.styleSheets[0].cssRules[0] === undefined) {
            console.log("stylesheet is broken?");
            console.log("sheet 0: " + document.styleSheets[0]);
            console.log("cssRules: " + document.styleSheets[0].cssRules);
            console.log("sheets: " + JSON.stringify(document.styleSheets));
            return;
        }
        // console.log("rule 0: " + document.styleSheets[0].cssRules[0]);
        // console.log("style 0: " + document.styleSheets[0].cssRules[0].style);
        if ($("#showHiddenAbilities").is(':checked')) {
            document.styleSheets[0].cssRules[0].style.display = "block";
            console.log("showing abilities");
        } else {
            document.styleSheets[0].cssRules[0].style.display = "none";
            console.log("hiding abilities");
        }
    });
    $("#buyCanineStage").on("click", function () {
        $("#caninePurchaseWindow").css('display', 'flex');
        $("#popupMask").css('display', 'flex');
        getTransformationPurchases();
    });

    $("#purchaseCanineUpgrade").on("click", function () {
        buyCanineUpgrade();
    });

    if (parseInt($("#canineMaxLevel").val()) == 0) {
        $("#raiseCanineLevel").prop("disabled", true);
        $("#lowerCanineLevel").prop("disabled", true);
    } else if ($("#canineLevel").val() >= $("#canineMaxLevel").val()) {
        $("#canineLevel").val($("#canineMaxLevel").val());
        $("#raiseCanineLevel").prop("disabled", true);
        $("#lowerCanineLevel").prop("disabled", false);

    } else if (parseInt($("#canineLevel").val()) < 1) {
        $("#canineLevel").val(0);
        $("#raiseCanineLevel").prop("disabled", false);
        $("#lowerCanineLevel").prop("disabled", true);

    } else {
        $("#raiseCanineLevel").prop("disabled", false);
        $("#lowerCanineLevel").prop("disabled", false);
    }

    $("#raiseCanineLevel").on("click", function () {
        changeCanineLevel(1);
    });
    $("#lowerCanineLevel").on("click", function () {
        changeCanineLevel(-1);
    });

    $("#rolls input").on("input", function () {
        if (this.value === "") {
            this.value = '0';
        }
    });


    $(".closeSelector").on("click", function () {
        $("#abilityWindow").css('display', 'none');
        $("#cypherWindow").css('display', 'none');
        $("#popupMask").css('display', 'none');
        $("#quickstartWindow").css('display', 'none');
        $(".popup").css('display', 'none');
    });
    $(document).keydown(function (e) {
        // ESCAPE key pressed
        if (e.keyCode == 27) {
            $("#abilityWindow").css('display', 'none');
            $("#cypherWindow").css('display', 'none');
            $("#confirmWindow").css('display', 'none');
            $("#quickstartWindow").css('display', 'none');
            $("#popupMask").css('display', 'none');
            $(".popup").css('display', 'none');
        } else if (e.ctrlKey && e.keyCode == 83) {
            e.preventDefault()
            saveForm();
        }
    });
    $("#showLog").on("click", function () {
        $("#purchaseLog").css('display', 'flex');
        $("#popupMask").css('display', 'flex');
    });
    $("#openSettings").on("click", function () {
        $("#settingsWindow").css('display', 'flex');
        $("#popupMask").css('display', 'flex');
        console.log("shareId: " + getThisStorage("shareId"));
        if (viewingSharedSheet) {
            $("#shareSection label span").html("You are currently viewing a shared sheet.<br>To upload your modifications to this sheet, please enter its password: ");
            $("#shareLink").css('display', 'none');
            $("#localSave").css('display', 'inline');
        } else if (getThisStorage("shareId") != null) {
            $("label.modifyExistingSave").css('display', 'inline');
            $("label.sharePassword span").html("If not, enter a password to restrict who can edit this sheet:");
            $("#uploadSheet").html('Upload new sheet');

        } else {
            $("#uploadSheet").html('Upload sheet for sharing');

        }
    });



    $("#applyColorChange").on("click", function () {
        applyColors();
    });
    $("#save").on("click", function () {
        saveForm();
    });
    $(".save").on("input", function () {
        if ($("#savingMode").val() == "input") {
            saveForm();
        }
    });
    $("#savingMode").on("input", function () {


    });
    $("#export").on("click", function () {
        exportSave();
    });
    $("#copy").on("click", function () {
        copySave();
    });
    $("#import").on("click", function () {
        if (document.getElementById('upload_file').value == null) {
            console.log("please put a file");
        } else {
            importSave(document.getElementById('upload_file').value);
        }
    });
    $("#clearData").on("click", function () {
        $("#settingsWindow").css('display', 'none');
        confirmDelete(null, "saveData", "all saved data")
    });

    $("#share").on("click", function () {
        console.log(makeShareLink());
    });
    $("#uploadSheet").on("click", function () {
        uploadSave();
    });
    $("#modifyExistingSave").on("click", function () {
        uploadSave(true);
    });

    $("#transferData").on("click", function () {
        transferData();
    });


    $("#calculatestats").on("click", function () {
        calculateStats();
    });
    $("#calculateexp").on("click", function () {
        calculateExperience();
    });
    $("#calculaterolls").on("click", function () {
        calculateRolls();
    });
    $("#rolls input").on("input", function () {
        calculateRolls();
    });
    $("#newCondition").on("click", function () {
        $("#conditionsWindow").css('display', 'flex');
        $("#popupMask").css('display', 'flex');

    });
    $("#addCustomAbility").on("click", function () {
        addCustomAbility();
    });
    $("#sourceSelection").on("input", function () {
        filterAbilities();
    });


    $("#race").on("input", function () {
        if (this.value === "noble") {
            $("#noble").parent().css('display', 'inline');
        } else if (this.value === "canine") {
            $("#canineTransformations").css('display', 'block');
            $("#noble").parent().css('display', 'none');
            $("#noble").val("none");
        } else {
            $("#canineTransformations").css('display', 'none');
            $("#noble").parent().css('display', 'none');
            $("#noble").val("none");
        }
    });



    $("#buyStats").on("click", function () {
        $("#mightOutcome .originalStat, #mightOutcome .newStat").html($("#mightBase").val());
        $("#agilityOutcome .originalStat, #agilityOutcome .newStat").html($("#agilityBase").val());
        $("#heartsOutcome .originalStat, #heartsOutcome .newStat").html($("#heartsBase").val());
        $("#witsOutcome .originalStat, #witsOutcome .newStat").html($("#witsBase").val());
        $("#resistanceOutcome .originalStat, #resistanceOutcome .newStat").html($("#resistanceBase").val());

        $("#statPurchaseWindow").css('display', 'flex');
        $("#popupMask").css('display', 'flex');
        $("#raiseToNextTier").prop("disabled", false);
        $("#tierUpMessage").css('display', 'none');
    });

    $(".raiseStat").on("click", function () {
        changeBoughtStat(this, 1);
    });
    $(".lowerStat").on("click", function () {
        changeBoughtStat(this, -1);
    });
    $(".statPurchase").on("input", function () {
        changeBoughtStat(this, 0);
    });
    $("#applyStatPurchase").on("click", function () {
        purchaseStats();
    });
    $("#raiseToNextTier").on("click", function () {
        raiseToNextTier();
    });

    $("#addEmptyItem").on("click", function () {
        addItem({ name: "", amount: "", rank: "", description: "", type: "", tags: "" })
    });
    /* $("#addPremadeItem").on("click", function () {
        // addItem({ name: "", amount: "", rank: "", description: "", type:"", tags:"" })
    
        $("#exampleItemsWindow").css('display', 'flex');
        $("#popupMask").css('display', 'flex');
    }); */

    $("#addPremadeItem").on("input", function () {
        $("#exampleItemsWindow").css('display', 'flex');
        $("#popupMask").css('display', 'flex');
    });



    $("#quickstart").on("click", function () {
        $("#quickstartWindow").css('display', 'flex');
        $("#popupMask").css('display', 'flex');
        getStarterAbilities();
        calculateStarterStats(document.querySelector("#startMight"));

    });

    $("#applyQuickstart").on("click", function () {
        applyQuickstart();
    });




    $("#quickstartRace").on("input", function () {
        if (this.value === "noble") {
            $("#quickstartNoble").parent().css('display', 'inline');
        } else {
            $("#quickstartNoble").parent().css('display', 'none');
            $("#quickstartNoble").val("none");
        }

        if (this.value === "irregular") {
            let startStats = document.getElementById("quickstartStats");
            for (const stat of startStats.children) {
                stat.querySelector("input").value = 2;
            }
            document.getElementById("statPoints").innerHTML = 0;

        }
    });

    $("#quickstartPosition").on("input", function () {
        if (this.value === "fisherman") {
            $("#fishermanStartWeapon").parent().css('display', 'inline');
        } else {
            $("#fishermanStartWeapon").parent().css('display', 'none');
            $("#fishermanStartWeapon").val("none");
        }
    });

    if ($("#quickstartRace").val() === "noble") {
        $("#quickstartNoble").parent().css('display', 'inline');
    } else {
        $("#quickstartNoble").parent().css('display', 'none');
        $("#quickstartNoble").val("none");
    }
    if ($("#quickstartPosition").val() === "fisherman") {
        $("#fishermanStartWeapon").parent().css('display', 'inline');
    } else {
        $("#fishermanStartWeapon").parent().css('display', 'none');
        $("#fishermanStartWeapon").val("none");
    }

    $("#quickstartStats input").on("input", function () {
        calculateStarterStats(this);
    });
    $(".quickstartDropdown").on("input", function () {
        getStarterAbilities();
    });



    // only allow one bonus dropdown to be open
    $(".dropdownToggle").on("input", function () {
        for (const element of toggles) {
            if (element != this) {
                element.checked = false;
            }
        }
    });
    /* $(".addBonus").on("click", function () {
        addNewStatBonus(this);
    }); */

    var elements = document.getElementsByClassName("addBonus");
    Array.from(elements).forEach(function (element) {
        element.addEventListener('click', addNewStatBonus);
    });
    /* var popup = document.querySelector("#might .bonusList");
    
        for (const element of document.querySelectorAll(".bonusList *, .bonusList")) {
            element.style.backgroundColor = "red";
        }
     */

    // When the user clicks anywhere outside a bonus list, hide it
    window.onclick = function (event) {
        // console.log("clicked: " + event.target+"("+event.target.className+") matches? " + event.target.matches(".bonusList *, .bonusList, .bonusToggler, .bonusToggler *, .dropdownToggle"));

        if (document.querySelector(".dropdownToggle:checked") != null) {
            if (event.target.matches(".bonusList *, .bonusList, .bonusToggler, .bonusToggler *, .dropdownToggle")) {
                console.log("clicked popup");
                // popup.style.display = "none";
            } else {
                console.log("clicked off popup");
                // $(".dropdownToggle:checked").css('display', 'none');
                document.querySelector(".dropdownToggle:checked").checked = false;
            }
        }
        // console.log("checked toggles: "+document.querySelectorAll(".dropdownToggle:checked").length);
        // 

    }

    /* 
    
    $(".bonusToggler").on("click", function () {
        // addStatBonus();
        console.log("bonus toggler clicked, list: "+this.parentNode.querySelector(".bonusList"));
        this.parentNode.querySelector(".bonusList").focus();
        this.parentNode.querySelector(".bonusList").style();
    });
     */
    $(".reorderList").sortable({
        axis: "y",
        handle: ".dragHandle",
        snap: true,
        containment: "parent",
        snapMode: "outer",
        // helper: 
        // "clone",
        placeholder: "sortable-placeholder",
        forcePlaceholderSize: true,
        tolerance: "pointer",
        // forceHelperSize: 
        // true
    })
    document.styleSheets[0].cssRules[0].style.display = "none";
    // calculateStats();
});


setInterval(function () {
    if ($("#savingMode").val() == "timed") {
        saveForm();
    }
}, 300_000); // in ms

/* Canine transformation */


function changeCanineLevel(direction) {
    document.getElementById("canineLevel").value -= -direction;
    let mobilityLevel = Math.min(parseInt($("#canineMaxMobility").val()), parseInt($("#canineLevel").val()));
    let weaponLevel = Math.min(parseInt($("#canineMaxWeapon").val()), parseInt($("#canineLevel").val()));

    if (parseInt($("#canineMaxLevel").val()) == 0) {
        $("#raiseCanineLevel").prop("disabled", true);
        $("#lowerCanineLevel").prop("disabled", true);
    } else if ($("#canineLevel").val() >= $("#canineMaxLevel").val()) {
        $("#canineLevel").val($("#canineMaxLevel").val());
        $("#raiseCanineLevel").prop("disabled", true);
        $("#lowerCanineLevel").prop("disabled", false);

    } else if (parseInt($("#canineLevel").val()) < 1) {
        $("#canineLevel").val(0);
        $("#raiseCanineLevel").prop("disabled", false);
        $("#lowerCanineLevel").prop("disabled", true);

    } else {
        $("#raiseCanineLevel").prop("disabled", false);
        $("#lowerCanineLevel").prop("disabled", false);
    }
    $("#canineAbilities").html("");
    if (weaponLevel > 0) {
        $("#canineAbilities").append(getAbilityHtml(canine_transformation_abilities.find(item => {
            return item.id == "WEAPON_" + weaponLevel;
        })))

    }
    if (mobilityLevel > 0) {
        $("#canineAbilities").append(getAbilityHtml(canine_transformation_abilities.find(item => {
            return item.id == "MOBILITY_" + mobilityLevel;
        })))
        /* $(getAbilityHtml(canine_transformation_abilities.find(item => {
            return item.id == "MOBILITY_" + mobilityLevel;
        }))).appendTo("#canineAbilities"); */
    }


    console.log($("#canineLevel").val() + "<? 1 = " + ($("#canineLevel").val() < 1));
}

function buyCanineUpgrade() {
    let type = "weapon ";
    if (document.querySelector('input[name="caninePurchase"]:checked') == null) {
        return;
    } else if (document.querySelector('input[name="caninePurchase"]:checked').value === "mobility") {
        document.getElementById("canineMaxMobility").value++;
        type = "mobility " + document.getElementById("canineMaxMobility").value;

    } else if (document.querySelector('input[name="caninePurchase"]:checked').value === "weapon") {

        document.getElementById("canineMaxWeapon").value++;
        type += document.getElementById("canineMaxWeapon").value;
    }
    document.getElementById("canineMaxLevel").value++;

    $("#caninePurchaseWindow").css('display', 'none');
    $("#popupMask").css('display', 'none');

    if (parseInt($("#canineLevel").val()) < 1) {
        $("#lowerCanineLevel").prop("disabled", true);
    } else {
        $("#lowerCanineLevel").prop("disabled", false);
    }
    $("#raiseCanineLevel").prop("disabled", false);

    let cost = parseInt(document.querySelector("#newCanineStageCost span").innerHTML);
    $("#currentExperience").val($("#currentExperience").val() - cost);
    $("#experienceSpent").val($("#experienceSpent").val() - (cost * -1));
    $("#abilitiesBought").val(parseInt($("#abilitiesBought").val()) + 1);

    /* technically an ability? */
    addLogItem(parseInt($("#newCanineStageCost span").innerHTML), "canine", "stage " + $("#canineMaxLevel").val() + " (" + type + " " + ")");
}

function getTransformationPurchases() {
    let canineAbilities = document.getElementById("canineAbilities").children;
    let weaponLevel = parseInt($("#canineMaxWeapon").val());
    let mobilityLevel = parseInt($("#canineMaxMobility").val());
    // console.log("stageDesc: canineStageInfo[" + $("#canineMaxLevel").val());
    document.querySelector("#canineStageDescription").innerHTML = canineStageInfo[$("#canineMaxLevel").val()]
    // console.log("mobility choice: " + (document.querySelector("#mobilityChoice + label")));
    if (mobilityLevel < 7) {
        document.querySelector("#mobilityDescription").innerHTML = canineMobilityChoices[mobilityLevel]
    } else {
        document.querySelector("#mobilityDescription").innerHTML = "all mobility abilities purchased"
    }

    if (weaponLevel < 7) {
        document.querySelector("#weaponDescription").innerHTML = canineWeaponChoices[weaponLevel]
    } else {
        document.querySelector("#weaponDescription").innerHTML = "all weapon abilities purchased"
    }

    // document.querySelector("#newCanineStageCost span").innerHTML = Math.pow(3, 1 + Math.floor($("#abilitiesBought").val() / 4)) * (mobilityLevel + weaponLevel + 1);
    document.querySelector("#newCanineStageCost span").innerHTML = Math.pow(3, 1 + Math.floor($("#abilitiesBought").val() / 4)) * (parseInt($("#canineMaxLevel").val()) + 1);
}



function filterAbilities() {
    let abilities = ["TEST", "test2"];
    let sourceSelector = document.querySelector('input[name="source"]:checked');
    console.log("filtering abilities");

    if (sourceSelector == null) {
        return;
    } else if (sourceSelector.value == "race") {
        abilities = window[race.value + "_abilities"];
        console.log("race abilities");
        console.log("abilities = " + race.value + "_abilities");
    } else {
        abilities = window[sourceSelector.value + "_abilities"];
        // console.log("abilities = " + focus.value + "_abilities");
    }

    if (abilities == null) {
        return;
    }
    // abilities = abilities;
    // let tierSelector = document.getElementById("tierSelection");
    // console.log("abilities: 
    // " + abilities.length);
    console.log("abilities: " + abilities.length);
    document.getElementById("filteredAbilities").innerHTML = "";

    abilities.forEach(element => {
        /* thisAbility = element;
        thisAbility.description = thisAbility.description.replace(/(\r\n|\r|\n)/i, "<br>"); */
        if (!checkForAbility(element.id)) {
            $(getAddAbilityHtml(element)).appendTo("#filteredAbilities");
            if (!checkAbilityBuyable(element.id)) {
                filteredAbilities.lastChild.querySelector(".addAbility").disabled = true;
                filteredAbilities.lastChild.querySelector(".addAbility").innerHTML = "you don't meet the requirements for this ability";
            }
        }

    });
    let cost = Math.pow(3, 1 + Math.floor($("#abilitiesBought").val() / 4));
    if (cost > $("#currentExperience").val()) {
        costMessage = "Cannot afford"
    }
    var elements = document.getElementsByClassName("addAbility");
    Array.from(elements).forEach(function (element) {
        element.addEventListener('click', addThisAbility);
    });
    updateAbilityCosts();
}


function checkAbilityBuyable(abilityID) {
    // console.log("abilityID=speed?: "+(abilityID === "OVERWHELMING_SPEED"));

    // console.log("agility<50?: "+(parseInt($("#agilityBase").val()) < 50));
    // console.log("agility = "+$("#agilityBase").val());
    // console.log("wits<50?: "+($("#witsBase").val() < 50));


    // (abilityID === "OVERWHELMING_SPEED") && $("#agilityBase").val() < 50 && $("#witsBase").val() < 50
    // console.log("is quality? "+abilityID.substring(0, 14))
    if ((abilityID === "SUPERHUMAN_STRENGTH" && $("#mightBase").val() < 50) ||
        (abilityID === "SUPERHUMAN_SPEED" && $("#agilityBase").val() < 50) ||
        (abilityID === "OVERWHELMING_FORCE" && $("#mightBase").val() < 50 && $("#resistanceBase").val() < 50) ||
        (abilityID === "OVERWHELMING_MIND" && $("#witsBase").val() < 50 && $("#heartBase").val() < 50) ||
        (abilityID === "OVERWHELMING_SPEED" && $("#agilityBase").val() < 50 && $("#witsBase").val() < 50) ||
        (abilityID === "OVERWHELMING_ACCURACY" && $("#agilityBase").val() < 50 && $("#mightBase").val() < 50) ||
        (abilityID === "OVERWHELMING_CONTROL" && $("#agilityBase").val() < 50 && $("#heartBase").val() < 50) ||
        (abilityID === "SPIDER_FOOT" && !checkForAbility("FEATHER_FOOT"))) {
        return false;
    } else if ($("#noble").val() === "lemarque" && abilityID.substring(0, 14) === "SHINSU_QUALITY") {
        return false;
    } else if ((abilityID === "LIGHTNING_STRIKE" || abilityID === "CHAIN_LIGHTNING" || abilityID === "BOLT_RIDER")
        && !checkForAbility("SHINSU_QUALITY_LIGHTNING")) {
        return false;
    } else if ((abilityID === "WHIRLWIND_EXTENDED" || abilityID === "GUST" || abilityID === "STILL_AND_STIR_THE_AIR")
        && !checkForAbility("SHINSU_QUALITY_WIND")) {
        return false;
    } else if ((abilityID === "ICE_RINK" || abilityID === "POLAR_MIDNIGHT" || abilityID === "FROZEN_GRAPESHOT")
        && !checkForAbility("SHINSU_QUALITY_ICE")) {
        return false;
    } else if ((abilityID === "INFERNO_EXTENDED" || abilityID === "FIREBALL" || abilityID === "FLARE_EXTENDED")
        && !checkForAbility("SHINSU_QUALITY_FIRE")) {
        return false;
    } else if ((abilityID === "STONE_SKIN" || abilityID === "TOUGHNESS" || abilityID === "CLOSED_MIND")
        && !checkForAbility("SHINSU_QUALITY_ROCK")) {
        return false;
    } else if ((abilityID === "CRASHING_WAVE" || abilityID === "MAELSTROM_EXTENDED" || abilityID === "PURIFY_BODY")
        && !checkForAbility("SHINSU_QUALITY_WATER")) {
        return false;
    } else if ((abilityID === "PLACEHOLDER" || abilityID === "ARMED_AND_READY" || abilityID === "ARMOR_STORM")
        && !checkForAbility("SHINSU_QUALITY_STEEL")) {
        return false;
    }
    return true;
}


/* 
LIGHTNING_STRIKE
CHAIN_LIGHTNING
BOLT_RIDER
WHIRLWIND_EXTENDED
GUST
STILL_AND_STIR_THE_AIR
ICE_RINK
POLAR_MIDNIGHT
FROZEN_GRAPESHOT
INFERNO_EXTENDED
FIREBALL
FLARE_EXTENDED
STONE_SKIN
TOUGHNESS
CLOSED_MIND
CRASHING_WAVE
MAELSTROM_EXTENDED
PURIFY_BODY
PLACEHOLDER
ARMED_AND_READY
ARMOR_STORM
 */

function addCustomAbility() {
    console.log("adding custom ability");
    addNewAbility({
        name: "", source: "any", type: "custom", id: "", description: ""
    });
    let cost = Math.pow(3, 1 + Math.floor($("#abilitiesBought").val() / 4));
    $("#currentExperience").val($("#currentExperience").val() - cost);
    $("#experienceSpent").val($("#experienceSpent").val() - (cost * -1));
    $("#abilitiesBought").val(parseInt($("#abilitiesBought").val()) + 1);
    updateAbilityCosts();
    addLogItem(cost, "ability", "custom");
}

function updateAbilityCosts() {
    let cost = Math.pow(3, 1 + Math.floor($("#abilitiesBought").val() / 4));
    if (cost > $("#currentExperience").val()) {
        document.getElementById("addCustomAbility").disabled = true;
        document.getElementById("addCustomAbility").innerHTML = "Add custom ability (Cannot afford)";
    } else {
        document.getElementById("addCustomAbility").innerHTML = "Add custom ability (cost: " + cost + ") ";
        document.getElementById("addCustomAbility").disabled = false;
    }
    var elements = document.getElementsByClassName("addAbility");
    Array.from(elements).forEach(function (element) {
        cost = Math.pow(3, 1 + Math.floor($("#abilitiesBought").val() / 4));
        /* var thisAbility = typeAbilities.find(item => {
            return item.id == this.value;
        })
        
        if (thisAbility.source === "position" && thisAbility.type != position.value) {
            cost = cost * 2;
        } */
        // console.log("source: " + element.getAttribute("source") + " name: " + element.name);
        if (element.getAttribute("source") === "position" && element.name != position.value && element.id != "addCustomAbility") {
            cost = cost * 2;
        } else if (element.value.includes("SHINSU_QUALITY")) { //element.getAttribute("name") === "shinsu"
            let totalQualities = 0; // abilities.querySelectorAll(".ability").filter((el) => el.id.includes("SHINSU_QUALITY")).length;
            for (const ability of abilities.querySelectorAll(".ability")) {
                if (ability.id.includes("SHINSU_QUALITY")) {
                    totalQualities++;
                }
            }
            if ($("#race").val() === "noble" && $("#shinsuQuality").val() != element.value.substring(15, element.value.length)) {
                cost *= 2;
            }
            // if ($("#race").val() === "noble") {
            //     console.log($("#shinsuQuality").val() + "=?" + element.value.substring(15, element.value.length));
            // }

            cost = cost * Math.pow(3, totalQualities);
        } /* else if (element.id.includes("SHINSU_QUALITY")){

        } */

        // let totalQualities = abilities.children.filter((el) => el.id.includes("SHINSU_QUALITY")).length;
        // console.log("total qualities: " + totalQualities);

        let buttonMessage = "Purchase this ability (Cost: " + cost + ")"

        if (cost > $("#currentExperience").val()) {
            buttonMessage = "Purchase this ability (Cannot afford)"
            element.disabled = true;
        }
        element.innerHTML = buttonMessage;

        if (!checkAbilityBuyable(element.value)) {
            element.disabled = true;
            element.innerHTML = "you don't meet the requirements for this ability";
            console.log(element.value + " is unbuyable");
        } else {

        }

    });
    /* if (cost > $("#currentExperience").val()) {
        document.getElementById("addCustomAbility").disabled = true;
        document.getElementById("addCustomAbility").innerHTML = "Add custom ability (Cannot afford)";
    } else {
        document.getElementById("addCustomAbility").innerHTML = "Add custom ability (cost: " + cost + ") ";
    } */
}

function addLogItem(cost, source, name) {
    let html = `<div class="logItem">
                    <span class="logItemCost">${cost}</span> for 
                    <span class="logItemSource">${source}</span>:
                    <span class="logItemName">${name}</span>
                </div>`
    $(html).appendTo("#purchasesList");
}


var addThisAbility = function () {

    // updateAbilityCosts();
    var thisID = this.value; //getAttribute("data-myattribute");

    // console.log("looking for " + this.name + "_ABILITIES");
    typeAbilities = window[this.name + "_abilities"];
    // console.log(this.name + "_abilities: " + typeAbilities);
    if (typeAbilities != null) {
        var thisAbility = typeAbilities.find(item => {
            return item.id == thisID;
        })

        let cost = Math.pow(3, 1 + Math.floor($("#abilitiesBought").val() / 4));
        if (thisAbility.source === "position" && thisAbility.type != position.value) {
            cost = cost * 2;
        }
        $("#currentExperience").val($("#currentExperience").val() - cost);
        $("#experienceSpent").val($("#experienceSpent").val() - (cost * -1));
        $("#abilitiesBought").val(parseInt($("#abilitiesBought").val()) + 1);

        addLogItem(cost, "ability", thisAbility.name);

        // updateAbilityCosts();
        console.log(thisAbility);
        if (thisAbility != null) {
            addNewAbility(thisAbility);
            bootstrap.Tooltip(thisAbility.querySelector('[data-bs-toggle="tooltip"]'))
        }
        // console.log("check for ability ("+thisID+"): "+checkForAbility(thisID));
        filterAbilities();
    }


};
function addNewAbility(abilityJson) {
    html = getAbilityHtml(abilityJson);
    $(html).appendTo("#abilitiesList");
    let thisAbility = abilities.lastChild;
    // console.log(thisAbility.getElementsByClassName("abilityDescription"));
    let tbox = thisAbility.getElementsByClassName("abilityDescription")[0];
    tbox.style.height = tbox.scrollHeight + "px";
    // console.log(abilityJson.name + " scrollheight: " + tbox.scrollHeight);
    tbox.style.overflowY = "hidden";
    /*$(tbox).on("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    }); */
    // for (const element of thisAbility.getElementsByTagName("INPUT")) {
    for (const element of thisAbility.querySelectorAll("input.resize")) {
        // resizeInput(element);
        if (element.value != "") {
            adjustWidthOfInput(element);
        }
    }
    $(thisAbility).attr("hidden-ability", abilityJson.hidden)
    // console.log(abilityJson.name + " shinsu: " + abilityJson.shinsu);

    /* if (abilityJson.shinsu == true) {
        thisAbility.querySelector(".isShinsu").checked = true;
    } else  */

    thisAbility.querySelector(".isShinsu").checked = abilityJson.shinsu;
    // console.log("shinsu checkbox: " + thisAbility.querySelector(".isShinsu"));

    addAbilityBonuses(thisAbility);
    let thisButton = thisAbility.getElementsByClassName("removeAbility")[0];
    thisButton.addEventListener('click', function () { confirmDelete(thisButton, "ability", abilityJson.name) }, false);
    thisAbility.querySelector(".hideThisAbility").addEventListener('click', function () { toggleAbility(thisAbility) }, false);
}
function toggleAbility(ability) {
    if ($(ability).attr("hidden-ability") === "true") {
        $(ability).attr("hidden-ability", "false")
    } else {
        $(ability).attr("hidden-ability", "true")
    }
    console.log(ability.id);
}

function showAbilities(params) {

    document.styleSheets[0].cssRules[0].style.display = "block";
}


function addAbilityBonuses(Json) {
    /* var thisAbility = window[$("#quickstartRace").val() + "_abilities"].find(item => {
        return item.id == ID;
    }) */
    // console.log(document.querySelector("#mightPermBonusList + ul"));
    if (Json.id === "TOUGH") {
        addStatBonus("Tough (Crocodile)", 3, document.querySelector("#mightPermBonusList + ul"));
        addStatBonus("Tough (Crocodile)", 3, document.querySelector("#resistancePermBonusList + ul"));
    } else if (Json.id === "TRAINED") {
        addStatBonus("Trained (Human)", 1, document.querySelector("#mightPermBonusList + ul"));
        addStatBonus("Trained (Human)", 1, document.querySelector("#agilityPermBonusList + ul"));
        addStatBonus("Trained (Human)", 1, document.querySelector("#heartsPermBonusList + ul"));
        addStatBonus("Trained (Human)", 1, document.querySelector("#witsPermBonusList + ul"));
        addStatBonus("Trained (Human)", 1, document.querySelector("#resistancePermBonusList + ul"));
    } else if (Json.id === "BORN_FIGHTER") {
        addStatBonus("Born Fighter (Canine)", 2, document.querySelector("#mightPermBonusList + ul"));
        addStatBonus("Born Fighter (Canine)", 2, document.querySelector("#agilityPermBonusList + ul"));
        addStatBonus("Born Fighter (Canine)", 2, document.querySelector("#resistancePermBonusList + ul"));
    } else if (Json.id === "ROYAL_BLOOD") {
        addStatBonus("Royal Blood (Heir)", 3, document.querySelector("#mightPermBonusList + ul"));
        addStatBonus("Royal Blood (Heir)", 3, document.querySelector("#agilityPermBonusList + ul"));
        addStatBonus("Royal Blood (Heir)", 3, document.querySelector("#heartsPermBonusList + ul"));
        addStatBonus("Royal Blood (Heir)", 3, document.querySelector("#witsPermBonusList + ul"));
        addStatBonus("Royal Blood (Heir)", 3, document.querySelector("#resistancePermBonusList + ul"));
    } else if (Json.id === "TOUGH") {
        addStatBonus("Tough (Crocodile)", 3, document.querySelector("#mightPermBonusList + ul"));
        addStatBonus("Tough (Crocodile)", 3, document.querySelector("#resistancePermBonusList + ul"));
    } else {
        return;
    }
    calculateStats();
}

function getAbilityHtml(Json) {

    return `<div class="ability" abilityName="${Json.name}" id="${Json.id}">
  <div class="abilityHeader">
    <div class="abilityNameBlock">
      <div class="dragHandle" draggable="false">↕</div>
      <div contentEditable="true" class="abilityName editable-div overflow-auto" role="textbox" aria-multiline=" true">${Json.name}</div>
      <label class="toggle" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="This ability uses Shinsu">
        <input type="checkbox" class="isShinsu" name="btnToggle" />
        <span class="shinsuIcon" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="This ability uses Shinsu">💧</span>
      </label>
      <div class="abilityOrigin">
        <input class="abilitySource resize" value="${Json.source}">:<input class="abilityType resize" value="${Json.type}">
      </div>
    </div>

    <div class="abilityButtons">
      <button type="button" class="hideThisAbility" title="hide this ability">👁</button>&nbsp;
      <button type="button" class="removeAbility confirm" value="${Json.id}">✕</button>
    </div>
  </div>
  <textarea class="abilityDescription resize field" rows="2" cols="10">${Json.description}</textarea>
</div>`;
}


/*

hidden-ability="${Json.hidden}" 

<div class="ability" hidden-ability="${Json.hidden}" abilityName="${Json.name}" id="${Json.id}">
            <div class="abilityHeader">
                <div class="abilityNameBlock">
                <div class="dragHandle" draggable="false">↕</div>
                <div contentEditable="true" class="abilityName editable-div overflow-auto" role="textbox" aria-multiline=" true">${Json.name}</div>
                <label class="toggle" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="This ability uses Shinsu">
                    <input type="checkbox" class="isShinsu" name="btnToggle"/>
                    <span class="shinsuIcon"  data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="This ability uses Shinsu">💧</span>
                </label>
                </div>
                <div class="abilityOrigin">
                <input class="abilitySource resize" value="${Json.source}">:<input class="abilityType resize" value="${Json.type}">
                </div>
                <div class="abilityButtons">
                <button type="button" class="hideThisAbility" title="hide this ability">👁</button>&nbsp;
                <button type="button" class="removeAbility confirm" value="${Json.id}">✕</button>
                </div>
            </div>
            <textarea class="abilityDescription resize field" rows="2" cols="10">${Json.description}</textarea>
            </div> */

/* 
                <button data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="This ability uses Shinsu">

<span class="shinsuHover">This ability uses Shinsu</span>

title="This ability uses Shinsu"
 title="This ability does not use Shinsu"
*/

function getAddAbilityHtml(Json) {
    // console.log("original description: 
    // " + Json.description);
    let newDesc = Json.description.replaceAll(/\r\n|\r|\n/gi, "<br>"); //•
    // console.log("new description: 
    // " + newDesc);
    let cost = Math.pow(3, 1 + Math.floor($("#abilitiesBought").val() / 4));
    if (Json.source == "position" && Json.type != $("#position").val()) {
        cost = cost * 2;
    }
    let costMessage = "Cost: " + cost
    if (cost > $("#currentExperience").val()) {
        costMessage = "Cannot afford"
    }
    let shinsuIcon = "";
    if (Json.shinsu == true) {
        shinsuIcon = '<div class="fixedShinsuIcon">💧</div>';
    }
    // console.log(Json.name + " shinsu: " + Json.shinsu);

    return `<div class="newAbility">
          <div class="abilityHeader">
            <div class="abilityNameBlock">
                <div class="abilityName">${Json.name}</div>
                ${shinsuIcon}
            </div>
            <div class="abilityOrigin">
                <div class="abilitySource">${Json.source}</div> : <div class="abilityType">${Json.type}</div>
            </div>
          </div>
          <p class="abilityDescription" rows="1" cols="10">${newDesc}</p>
          <button type="button" class="addAbility" name="${Json.type}" source="${Json.source}" value="${Json.id}">Purchase this ability (${costMessage})</button>
        </div>`
}

function getPreviewAbilityHtml(Json) {
    let newDesc = Json.description.replaceAll(/\r\n|\r|\n/gi, "<br>");

    return `<div class="newAbility">
          <div class="abilityHeader">
            <div class="abilityNameBlock">
                <div class="abilityName">${Json.name}</div>
            </div>
            <div class="abilityOrigin">
                <div class="abilitySource">${Json.source}</div> : <div class="abilityType">${Json.type}</div>
            </div>
          </div>
          <p class="abilityDescription" rows="1" cols="10">${newDesc}</p>
        </div>`
}

/* 

`<div class="newAbility">
          <div class="abilityHeader">
            <div class="abilityNameBlock">
                <div class="abilityName">${Json.name}</div>
            </div>
            <div class="abilityOrigin">
            <div class="abilityType">${Json.source}</div>
<div class="abilityType">${Json.type}</div>
                <label class="abilityField"><div class="abilityType">${Json.source}</div></label>:
                <label class="abilityField"><div class="abilityType">${Json.type}</div></label>
            </div>
          </div>
          <p class="abilityDescription" rows="1" cols="10">${newDesc}</p>
          <button type="button" class="addAbility" name="${Json.type}" value="${Json.id}">Add</button>
        </div>`
*/



function confirmDelete(thisButton, type, messageIn = "") {
    console.log("confirming...?");
    $("#confirmWindow").css('display', 'grid');
    $("#popupMask").css('display', 'flex');

    let parent = null;
    let message = messageIn;
    if (messageIn != "") {
        message = messageIn;
    } else {
        parent = thisButton.parentNode.parentNode.parentNode;

        console.log("parent: " + parent.className);

        message = parent.getElementsByClassName(type + "Name")[0].value
    }
    document.getElementById("confirmTarget").innerHTML = "This can't be undone. Are you sure you want to delete \"" + message + "\" ?";
    $('#confirmYes').click(function () {
        console.log("confirmed");
        console.log("removing");
        if (type === "ability") {
            thisButton.parentNode.parentNode.parentNode.remove();
        } else if (type === "saveData") {
            clearData();
        } else if (type == "item") {
            thisButton.parentNode.parentNode.remove();
        }
        // parent.remove();
        $("#confirmWindow").css('display', 'none');
        $("#popupMask").css('display', 'none');
    });

    $('#confirmNo').click(function () {
        console.log("canceled");
        $("#confirmWindow").css('display', 'none');
        $("#popupMask").css('display', 'none');
    });

    $(document).keydown(function (e) {
        // ESCAPE key pressed
        if (e.keyCode == 27) {
            // noCallback();
            $("#confirmWindow").css('display', 'none');
            $("#popupMask").css('display', 'none');
        }
    });
}

function resizeInput(element) {
    if (element.nodeName === "INPUT") {
        adjustWidthOfInput(element)
    } else if (element.nodeName == "TEXTAREA") {
        element.style.height = "0px";
        element.style.height = element.scrollHeight + "px";
    }
}

function adjustWidthOfInput(inputEl) {
    inputEl.style.width = getWidthOfInput(inputEl) + "px";
}


function getWidthOfInput(inputEl) {
    var tmp = document.createElement("span");
    tmp.className = "input-element tmp-element";
    tmp.innerHTML = inputEl.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let style = getComputedStyle(inputEl);
    $(tmp).css("font-size", style.fontSize);
    $(tmp).css("padding", style.padding);
    document.body.appendChild(tmp);
    var theWidth = tmp.getBoundingClientRect().width;
    document.body.removeChild(tmp);
    return theWidth;
}



function calculateStats() {
    // console.log("calculating stats, called by " + calculateStats.caller);
    for (const stat of stats.children) {
        let tempTotal = 0;
        temp = stat.querySelector('.tempBonuses .bonusList');
        for (const listItem of temp.getElementsByClassName('bonusListItem')) {
            // tempTotal += parseInt(listItem.querySelector(".bonusAmount").value);
            if (listItem.querySelector(".bonusAmount").value != "") {
                tempTotal += parseInt(listItem.querySelector(".bonusAmount").value);
            } else {
                // console.log("empty amount, add nothing");
            }
            // console.log("[" + stat.id + "]adding " + listItem.querySelector(".bonusAmount").value + "(" + listItem.querySelector(".bonusSource").value + ") to temp total: 
            // " + tempTotal);
        }

        stat.querySelector('span.tempBonuses').innerHTML = "+" + tempTotal;
        // stat.querySelector('input.tempBonuses').value = "+"+tempTotal;
        // console.log(stat.querySelector('span.tempBonuses') + " => " + tempTotal);
        // console.log("temp span: 
        // " + stat.querySelector('span.tempBonuses'));

        let permTotal = 0;
        perm = stat.querySelector('.permBonuses .bonusList');
        for (const listItem of perm.getElementsByClassName('bonusListItem')) {
            if (listItem.querySelector(".bonusAmount").value != "") {
                permTotal += parseInt(listItem.querySelector(".bonusAmount").value);
            } else {
                // console.log("empty amount, add nothing");
            }
            // console.log("[" + stat.id + "]adding " + listItem.querySelector(".bonusAmount").value + "(" + listItem.querySelector(".bonusSource").value + ") to temp total: 
            // " + tempTotal);
        }

        stat.querySelector('span.permBonuses').innerHTML = "+" + permTotal;
        // stat.querySelector('input.permBonuses').value = "+"+permTotal;


        base = stat.querySelector('input.baseStat');
        current = stat.querySelector('input.currentStat');
        edge = stat.querySelector('input.edge');
        if (base.value == "") {
            current.value = (parseInt(permTotal) + parseInt(tempTotal));
        } else {
            current.value = (parseInt(base.value) + parseInt(permTotal) + parseInt(tempTotal));
        }
        edge.value = Math.floor(parseInt(current.value) / 10);


        let conditionName = "";
        let threshold = 0.9;

        if (stat.id === "might") {
            conditionName = "Fragile";
        } else if (stat.id === "agility") {
            conditionName = "Weakened";
        } else if (stat.id === "heart") {
            conditionName = "Volatile";
        } else if (stat.id === "wits") {
            conditionName = "Anxious";
            threshold == 0.75;
        }
        // console.log("conditions: " + document.querySelectorAll('.condition').length);

        let thisCondition = document.querySelector('.condition[name="' + conditionName + '"]');
        // console.log(conditionName + " = " + thisCondition);
        if (stat.querySelector('input.harm').value > (current.value * threshold) && thisCondition == null) {
            addCondition(conditions.find(item => { return item.name == conditionName; }));
            // console.log("adding condition: " + conditionName);

        } else if (stat.querySelector('input.harm').value < (current.value * threshold) && thisCondition != null) {
            thisCondition.remove();
        }
        // console.log("this condition: "+thisCondition);
        if (stat.id === "resistance") {
            if (document.querySelector('.condition[name="Fragile"]') != null || document.querySelector('.condition[name="Weakened"]') != null || document.querySelector('.condition[name="Volatile"]') != null || document.querySelector('.condition[name="Anxious"]') != null || $("#exhaustion").val() > 0) {
                current.value = parseInt(current.value) / 2
            }

        }
    }

    // console.log("fragile amount: " + document.querySelectorAll('.condition[name="Fragile"]').length);


    // let maxTrauma = 4+Math.floor(parseInt($("#witsBase").value) / 25);
    // $("#maxTraumas").val(4 + Math.floor(parseInt($("#witsBase").val()) / 25));
    $("#maxTraumas").html(4 + Math.floor(parseInt($("#witsBase").val()) / 25));
    calculateRolls();

}

function addStatBonus(source, amount, parent) {
    if (parent.querySelector(".bonusSource[value='" + source + "']") != null) {
        // prevent duplicates
        return;
    }

    html = `<li class="bonusListItem">
                    +<input type="number" class="bonusAmount"  value=${amount}>
                    <input class="bonusSource" value="${source}"><button type="button" class="removeBonus" value="">✕</button>
                  </li>`;
    $(parent).append(html);

    let thisButton = parent.lastChild.getElementsByClassName("removeBonus")[0];
    thisButton.addEventListener('click', function () { this.parentNode.remove(); calculateStats(); }, false);
    /* thisButton.addEventListener('click', () => {
        this.parentNode.remove();
        calculateStats();
        console.log("removed added bonus");
    }, false); */
}

function addNewStatBonus() {
    console.log("adding stat bonus");
    html = `<li class="bonusListItem">
                    +<input type="number" class="bonusAmount">
                    <input class="bonusSource"><button type="button" class="removeBonus" value="">✕</button>
                  </li>`;
    // $(html).appendTo("#abilitiesList");
    console.log("this: " + this);
    console.log("adding stat bonus to " + this.parentNode.parentNode);
    $(this.parentNode.parentNode).append(html);

    let thisButton = this.parentNode.parentNode.lastChild.getElementsByClassName("removeBonus")[0];

    /* thisButton.addEventListener('click', () => {
        this.parentNode.remove();
        calculateStats();
        console.log("removed new bonus");
    }, false); */
    thisButton.addEventListener('click', function () { this.parentNode.remove(); calculateStats(); }, false);
    // thisButton.addEventListener('click', function () { this.parentNode.remove(); calculateStats();}, false);
}
function removeBonus(thisButton) {
    this.parentNode.remove();
    calculateStats();
}

/* skills */

/* function calculateSkills(params) {
    let skills = document.getElementById("skills");
    for (const skill of skills.children) {
    }
} */



function calculateRolls() {

    if (document.querySelector('.condition[name="Slowed"]') != null) {
        document.querySelector("#rolls #brawl .hinderedRoll input").checked = true;
        document.querySelector("#rolls #throw .hinderedRoll input").checked = true;
        document.querySelector("#rolls #move .hinderedRoll input").checked = true;
    }
    if (document.querySelector('.condition[name="Pinned"]') != null) {
        document.querySelector("#rolls #agilityRoll .hinderedRoll input").checked = true;
        document.querySelector("#rolls #finesse .hinderedRoll input").checked = true;
        document.querySelector("#rolls #throw .hinderedRoll input").checked = true;
        document.querySelector("#rolls #move .hinderedRoll input").checked = true;
    }
    if (document.querySelector('.condition[name="Paralyzed"]') != null) {
        // document.querySelectorAll("#rolls .hinderedRoll input").checked = true;
        document.querySelectorAll("#rolls .hinderedRoll input").forEach(element => {
            element.checked = true;
        });
        // console.log(document.querySelectorAll("#rolls .hinderedRoll input"));
    }
    if (document.querySelector('.condition[name="Blind"]') != null) {
        document.querySelector("#rolls #brawl .hinderedRoll input").checked = true;
        document.querySelector("#rolls #finesse .hinderedRoll input").checked = true;
        document.querySelector("#rolls #move .hinderedRoll input").checked = true;
    }
    if (document.querySelector('.condition[name="Weakened"]') != null) {
        document.querySelector("#rolls #mightRoll .hinderedRoll input").checked = true;
        document.querySelector("#rolls #brawl .hinderedRoll input").checked = true;
        document.querySelector("#rolls #threatenM .hinderedRoll input").checked = true;
        document.querySelector("#rolls #agilityRoll .hinderedRoll input").checked = true;
        document.querySelector("#rolls #finesse .hinderedRoll input").checked = true;
        document.querySelector("#rolls #throw .hinderedRoll input").checked = true;
        document.querySelector("#rolls #move .hinderedRoll input").checked = true;
    }
    if (document.querySelector('.condition[name="Anxious"]') != null) {
        document.querySelector("#rolls #heartsRoll .hinderedRoll input").checked = true;
        document.querySelector("#rolls #reachOut .hinderedRoll input").checked = true;
        document.querySelector("#rolls #attune .hinderedRoll input").checked = true;
    }



    if (checkForAbility("BRUISER")) {
        document.querySelector("#rolls #brawl .addEdge").innerHTML = "+" + $("#mightEdge").val();
    }
    if (checkForAbility("SNEAKY")) {
        document.querySelector("#rolls #finesse .addEdge").innerHTML = "+" + $("#agilityEdge").val();
    }
    if (checkForAbility("SPEEDY")) {
        document.querySelector("#rolls #move .addEdge").innerHTML = "+" + $("#agilityEdge").val();
    }
    if (checkForAbility("THROWER")) {
        if ($("#agilityEdge").val > $("#mightEdge").val) {
            document.querySelector("#rolls #throw .addEdge").innerHTML = "+" + $("#agilityEdge").val();
        } else {
            document.querySelector("#rolls #throw .addEdge").innerHTML = "+" + $("#mightEdge").val();
        }
    }
    if (checkForAbility("PRECISION")) {
        document.querySelector("#rolls #attune .addEdge").innerHTML = "+" + $("#heartsEdge").val();
    }
    if (checkForAbility("BRAINS")) {
        document.querySelector("#rolls #think .addEdge").innerHTML = "+" + $("#witsEdge").val();
    }
    if (checkForAbility("SMOOTH_TALKER")) {
        document.querySelector("#rolls #manipulate .addEdge").innerHTML = "+" + $("#witsEdge").val();
    }






    let rolls = document.querySelector("#rolls table");
    let thisStat = "might"
    let parentStat = document.querySelector("#" + thisStat + "Roll");
    // console.log("rolls: " + rolls.querySelectorAll("tbody tr") + " length = " + rolls.querySelectorAll("tbody tr").length);
    for (const roll of rolls.querySelectorAll("tbody tr")) {
        // console.log(roll.id.substring(roll.id.length - 4, roll.id.length));
        // console.log(roll.id.substring(roll.id.length - 4, roll.id.length) + "=? Roll");
        let hindered = roll.querySelector(".hinderedRoll input").checked;
        if (roll.id.substring(roll.id.length - 4, roll.id.length) === "Roll") {
            thisStat = roll.id.substring(0, roll.id.length - 4);
            parentStat = document.querySelector("#" + thisStat + "Roll");
        } else if ($("#" + thisStat + "Roll .hinderedRoll input").is(':checked')) {
            roll.querySelector(".hinderedRoll input").disabled = true;
            hindered = true;
        } else {
            roll.querySelector(".hinderedRoll input").disabled = false;
        }


        roll.querySelector(".baseDice").innerHTML = 1 + Math.floor($("#" + thisStat + "Base").val() / 5);
        let diceAmount = 1 + Math.floor($("#" + thisStat + "Base").val() / 5);
        diceAmount += parseInt(roll.querySelector("input.bonusDice").value) + parseInt(roll.querySelector("span.bonusDice").innerHTML);
        diceAmount -= parseInt(roll.querySelector("input.impairedRoll").value);
        if (roll.id.substring(roll.id.length - 4, roll.id.length) != "Roll") {
            diceAmount += parseInt(parentStat.querySelector("input.bonusDice").value) + parseInt(parentStat.querySelector("span.bonusDice").innerHTML);
            diceAmount -= parseInt(parentStat.querySelector("input.impairedRoll").value)
        }
        // console.log("parent stat impaired: " + parentStat.querySelector("input.impairedRoll").value);
        if (hindered) {
            diceAmount = Math.floor(diceAmount / 2);
        }

        // console.log(roll.id + " bonusDice: " + parseInt(roll.querySelector("input.bonusDice").value));
        // console.log(roll.id + " bonusDice: " + roll.querySelector("input.bonusDice"));
        // console.log(roll.id + " bonusDice2: " + parseInt(roll.querySelector("span.bonusDice").innerHTML));

        /*  if (thisStat.querySelector(".hinderedRoll input").checked) {
 
         }
  */
        roll.querySelector(".totalDice").innerHTML = "=" + diceAmount;

        let statAutoSuccesses = Math.floor($("#" + thisStat + "Base").val() / 20)
        roll.querySelector(".statAutoSuccesses").innerHTML = statAutoSuccesses;

        roll.querySelector(".totalAutoSuccesses").innerHTML = "=" + (parseInt(statAutoSuccesses) + parseInt(roll.querySelector("input.bonusSuccesses").value) + parseInt(roll.querySelector(".addEdge").innerHTML));
        // console.log("autosuccessses inner: "+(parseInt(autoSuccesses) + parseInt(roll.querySelector("input.bonusSuccesses").value)));


        // $("#"+thisStat+"Base").val();
    }
    if (checkForAbility("OVERWHELMING_FORCE")) {
        // $("#brawl .overwhelm span").css('display', 'inline');
        $("#brawl .overwhelm span").css('opacity', '100%');
    } else {
        $("#brawl .overwhelm span").css('opacity', '0%');
    }

    if (checkForAbility("OVERWHELMING_MIND")) {
        // $("#think .overwhelm span").css('display', 'inline');
        $("#think .overwhelm span").css('opacity', '100%');
    } else {
        $("#think .overwhelm span").css('opacity', '0%');
    }

    if (checkForAbility("OVERWHELMING_SPEED")) {
        // $("#move .overwhelm span").css('display', 'inline');
        $("#move .overwhelm span").css('opacity', '100%');
    } else {
        $("#move .overwhelm span").css('opacity', '0%');
    }

    if (checkForAbility("OVERWHELMING_ACCURACY")) {
        // $("#throw .overwhelm span").css('display', 'inline');
        $("#throw .overwhelm span").css('opacity', '100%');
    } else {
        $("#throw .overwhelm span").css('opacity', '0%');
    }

    if (checkForAbility("OVERWHELMING_CONTROL")) {
        // $("#attune .overwhelm span").css('display', 'inline');
        $("#attune .overwhelm span").css('opacity', '100%');
    } else {
        $("#attune .overwhelm span").css('opacity', '0%');
    }


    /* OVERWHELMING_FORCE
    OVERWHELMING_MIND
    OVERWHELMING_SPEED
    OVERWHELMING_ACCURACY
    OVERWHELMING_CONTROL */

    /* auto fail conditions */
    if (document.querySelector('.condition[name="Pinned"]') != null) {
        document.querySelector("#rolls #move .totalDice").innerHTML = "=0";
    }
    if (document.querySelector('.condition[name="Paralyzed"]') != null) {
        document.querySelector("#rolls #mightRoll .totalDice").innerHTML = "=0";
        document.querySelector("#rolls #brawl .totalDice").innerHTML = "=0";
        document.querySelector("#rolls #threatenM .totalDice").innerHTML = "=0";
        document.querySelector("#rolls #agilityRoll .totalDice").innerHTML = "=0";
        document.querySelector("#rolls #finesse .totalDice").innerHTML = "=0";
        document.querySelector("#rolls #throw .totalDice").innerHTML = "=0";
        document.querySelector("#rolls #move .totalDice").innerHTML = "=0";
    }
    if (document.querySelector('.condition[name="Blind"]') != null) {
        document.querySelector("#rolls #throw .totalDice").innerHTML = "=0";
    }
}

/* conditions */
function getConditions() {
    conditions.forEach(element => {
        $(getAddConditionHtml(element)).appendTo("#allConditions");
    });
    var elements = document.getElementsByClassName("addCondition");
    Array.from(elements).forEach(function (element) {
        element.addEventListener('click', addThisCondition);
    });
}

function addCondition(json) {
    let html = getConditionHtml(json);

    $(html).appendTo("#conditionsList");
    let thisCondition = document.getElementById("conditionsList").lastChild;
    let tbox = thisCondition.getElementsByClassName("conditionDescription")[0];
    tbox.style.height = tbox.scrollHeight + "px";
    tbox.style.overflowY = "hidden";
    for (const element of thisCondition.querySelectorAll("input.resize")) {
        if (element.value != "") {
            adjustWidthOfInput(element);
        }
    }

    if (thisCondition.querySelector(".conditionName").value != "") {
        adjustWidthOfInput(thisCondition.querySelector(".conditionName"));
    }

    let thisButton = thisCondition.getElementsByClassName("removeCondition")[0];
    thisButton.addEventListener('click', function () { thisCondition.remove(); }, false);
    calculateRolls();
}

var addThisCondition = function () {
    addCondition({ name: this.name, description: $(this).attr("desc") });
    /* let html = getConditionHtml({ name: this.name, description: $(this).attr("desc") });
 
    $(html).appendTo("#conditionsList");
    let thisCondition = document.getElementById("conditionsList").lastChild;
    let tbox = thisCondition.getElementsByClassName("conditionDescription")[0];
    tbox.style.height = tbox.scrollHeight + "px";
    tbox.style.overflowY = "hidden";
    for (const element of thisCondition.querySelectorAll("input.resize")) {
        if (element.value != "") {
            adjustWidthOfInput(element);
        }
    }
    let thisButton = thisCondition.getElementsByClassName("removeCondition")[0];
    thisButton.addEventListener('click', function () { thisCondition.remove(); }, false);
    calculateRolls(); */
};


function getConditionHtml(conditionJson) {
    return `<div class="condition" name="${conditionJson.name}">
                <div class="conditionHeader">
                    <div class="conditionNameBlock">
                    <div class="dragHandle" draggable="false">↕</div>
                    <input class="conditionName resize" value="${conditionJson.name}">
                    </div>
                    <button type="button" class="removeCondition confirm" value="${conditionJson.name}">✕</button>
                </div>
                <textarea class="conditionDescription" rows="1" cols="10">${conditionJson.description}</textarea>
                
            </div>`
}

function getAddConditionHtml(conditionJson) {
    let newDesc = conditionJson.description.replaceAll(/\r\n|\r|\n/gi, "<br>"); //•
    return `<div class="newCondition" name="${conditionJson.name}">
                <div class="conditionHeader">
                    <div class="conditionNameBlock">
                        <div class="conditionName">${conditionJson.name}</div>
                    </div>
                </div>
                <p class="conditionDescription" rows="1" cols="10">${newDesc}</p>
                <button type="button" class="addCondition" name="${conditionJson.name}" desc="${conditionJson.description}">Add this condition</button>
            </div>`
}


/* experience */

function calculateExperience() {
    $("#tier").val(getTier($("#experienceSpent").val()));

}

function getTier(exp) {
    if (checkForAbility("ROYAL_BLOOD")) {
        if (exp < 5000) {
            return 2;
        } else {
            return Math.floor(Math.log10(exp / 500)) + 2
        }
    } else if (checkForAbility("RAPID_GROWTH")) {
        if (exp < 5) {
            return 1;
        }
        return Math.floor(Math.log(exp / 500) / Math.log(5)) + 2;
        // Math.log(x) / Math.log(otherBase)
    }
    if (exp < 5) {
        return 1;
    }
    return Math.floor(Math.log10(exp / 500)) + 2;

}
/* leveling modifiers:
 
Tough: 
You increase your Might and Resistance increase by your Tier plus one.
Born Fighter: 
Might, Resistance, and Agility scores by 2 increase  by your Tier plus one
Royal Blood: 
 Whenever you spend experience to increase one of your attributes, you increase that attribute by your Tier plus one
 
*/

function purchaseStats() {
    let cost = getStatCost();
    let description = ""
    for (const stat of document.getElementById("statPurchaseSection").children) {
        let input = stat.querySelector("input");
        let statName = input.id.substring(0, input.id.length - 8);
        let baseID = "#" + statName + "Base"
        $(baseID).val(parseInt($(baseID).val()) + parseInt(input.value));
        description += statName + "+" + input.value + ", ";
        input.value = 0;
    }
    $("#currentExperience").val($("#currentExperience").val() - cost);
    $("#experienceSpent").val($("#experienceSpent").val() - (cost * -1));
    $("#tier").val(getTier($("#experienceSpent").val()))
    addLogItem(cost, "stats", description.substring(0, description.length - 2));

    $("#popupMask").css('display', 'none');
    $(".popup").css('display', 'none');
    calculateStats();

}

function changeBoughtStat(origin, direction) {
    let stat = origin.parentNode.querySelector("input");
    // console.log("parent: 
    // " + origin.parentNode);
    // console.log("changing " + stat.id + " by " + direction);
    let increaseAmount = parseInt($("#tier").val());
    console.log("changed stat: " + stat.id.substring(0, stat.id.length - 8));
    let thisStat = stat.id.substring(0, stat.id.length - 8);
    if (checkForAbility("TOUGH")) {
        if (thisStat === "might" || thisStat === "resistance") {
            increaseAmount++;
        }
    } else if (checkForAbility("BORN_FIGHTER")) {
        if (thisStat === "might" || thisStat === "agility" || thisStat === "resistance") {
            increaseAmount++;
        }
    } else if (checkForAbility("ROYAL_BLOOD")) {
        increaseAmount++;
    }

    if (direction == 0) {
        // console.log("floor ("+parseInt(stat.value) +"/"+increaseAmount+") = "+Math.floor(parseInt(stat.value) / increaseAmount));
        // stat.value = Math.floor(parseInt(stat.value) / increaseAmount);
        stat.value -= parseInt(stat.value) % increaseAmount;
    } else {
        stat.value = parseInt(stat.value) + parseInt(increaseAmount * direction);
        stat.value = Math.max(0, parseInt(stat.value))
    }
    let cost = getStatCost(stat);

    if ($("#tierUpMessage").css('display') === 'inline') {
        console.log("this stat: " + stat.id);

        console.log("this cost: " + $(stat).attr("cost") + ", or " + $(stat).data("cost"));
        let otherLevels = cost + parseInt($("#experienceSpent").val()) - parseInt($(stat).data("cost"));
        console.log("other levels: " + otherLevels);
        let overflowAmount = 0;
        let thisExpCost = 0;
        let initialValue = parseInt($("#" + thisStat + "Base").val());
        let levels = parseInt(stat.value);
        for (let i = 0; i < Math.floor(levels / increaseAmount); i++) {
            thisExpCost = parseInt(thisExpCost) + parseInt((increaseAmount * i)) + initialValue;
            // costMessage += (parseInt((increaseAmount * i)) + parseInt(initialValue)) + " + ";
            if (getTier(thisExpCost + otherLevels) > parseInt($("#tier").val())) {
                // document.getElementsByClassName("raiseStat").disabled = true;
                overflowAmount++;
                console.log("overflow at lvl " + i);
                stat.value = (i + 1) * increaseAmount;
                cost = getStatCost(stat);
                break;
            }
        }
        console.log("overflow amount: " + overflowAmount);
    }
    if (cost > $("#currentExperience").val()) {
        $("#applyStatPurchase").html("Cannot afford");
        $("#applyStatPurchase").prop("disabled", true);
    } else {
        $("#applyStatPurchase").html("Spend Experience!");
        $("#applyStatPurchase").prop("disabled", false);
    }


    $("#" + thisStat + "Outcome .newStat").html(parseInt($("#" + thisStat + "Outcome .originalStat").html()) + parseInt(stat.value))
    /* while ($("#tierUpMessage").css('display') === 'inline') {
        stat.value = parseInt(stat.value) - parseInt(increaseAmount);
        getStatCost();
        console.log("overflowed stat");
    }
    stat.value = parseInt(stat.value) + parseInt(increaseAmount);
    getStatCost(); */
}

function raiseToNextTier() {
    let raiseButtons = document.querySelectorAll(".raiseStat");
    $(".raiseStat").val(0);
    console.log("raisebuttons: " + raiseButtons + "(" + raiseButtons.length + ")");
    // while (getTier(thisExpCost + otherLevels) <= parseInt($("#tier").val())) {
    let limit = 20;
    while ($("#tierUpMessage").css('display') != 'inline') {
        for (let i = 0; i < raiseButtons.length; i++) {
            changeBoughtStat(raiseButtons[i], 1);
            console.log("raising stat: " + raiseButtons[i]);
            if ($("#tierUpMessage").css('display') === 'inline') {
                break;
            }
            // limit--;
        }

        // limit--;
        // if (limit <= 0) { break; }
    }
    $("#raiseToNextTier").prop("disabled", true);
    // stat.value = (i + 1) * increaseAmount;
    // cost = getStatCost(stat);
    // break;
}


// checkForAbility("WEAPON_SKILLS_[HOOK]");
function checkForAbility(abilityID) {
    if (abilities.querySelector("#" + abilityID) != null) {
        return true;
    } else {
        return false;
    }
}


function getStatCost(changedStat) {
    let totalExpCost = 0;
    let statPurchases = document.getElementById("statPurchaseSection");
    let tier = $("#tier").val();
    $(".raiseStat").prop("disabled", false);
    $("#tierUpMessage").css('display', 'none');

    for (const stat of statPurchases.children) {
        let input = stat.querySelector("input");
        increaseAmount = tier;
        let statName = input.id.substring(0, input.id.length - 8)
        if (checkForAbility("TOUGH")) {
            if (statName === "might" || statName === "resistance") {
                increaseAmount++;
            }
        } else if (checkForAbility("BORN_FIGHTER")) {
            if (statName === "might" || statName === "agility" || statName === "resistance") {
                increaseAmount++;
            }
        } else if (checkForAbility("ROYAL_BLOOD")) {
            increaseAmount++;
        }

        // console.log("input: 
        // "+input);
        let levels = input.value;
        let thisExpCost = 0;
        let initialValue = $("#" + statName + "Base").val();
        // let costMessage = statName + " cost: 
        // "
        // console.log(levels + " / " + increaseAmount + " = " + (levels / increaseAmount));
        // let overflowLevels = 0;
        for (let i = 0; i < Math.floor(levels / increaseAmount); i++) {
            thisExpCost = parseInt(thisExpCost) + parseInt((increaseAmount * i)) + parseInt(initialValue);
            // costMessage += (parseInt((increaseAmount * i)) + parseInt(initialValue)) + " + ";
            /* if (stat == changedStat && getTier(totalExpCost +thisExpCost+ parseInt($("#experienceSpent").val())) > parseInt($("#tier").val())) {
                // document.getElementsByClassName("raiseStat").disabled = true;
                overflowLevels++;
            } */
        }
        $(input).data("cost", thisExpCost);
        totalExpCost += thisExpCost;
        // console.log(costMessage.substring(0, costMessage.length - 2) + "= " + thisExpCost);
    }
    console.log("total exp spent: " + (totalExpCost + parseInt($("#experienceSpent").val())));
    console.log(getTier(totalExpCost + parseInt($("#experienceSpent").val())) + " >? " + $("#tier").val());

    if (getTier(totalExpCost + parseInt($("#experienceSpent").val())) > parseInt($("#tier").val())) {
        // document.getElementsByClassName("raiseStat").disabled = true;
        $(".raiseStat").prop("disabled", true);
        $("#tierUpMessage").css('display', 'inline');
        console.log("raised tier");
    } else {

        $("#raiseToNextTier").prop("disabled", false);
    }
    document.querySelector("#statCost span").innerHTML = totalExpCost;
    return totalExpCost;

}

/* inventory */

/* function getPremadeItems() {
    premade_items.forEach(element => {
        $("<option value="misc">Misc</option>").appendTo("#addPremadeItem");
    });
    var elements = document.getElementsByClassName("addCondition");
    Array.from(elements).forEach(function (element) {
        element.addEventListener('click', addThisCondition);
    });
} */

function addItem(itemJson) {
    // $(getItemHtml(itemJson)).appendTo("#itemsList");
    $(getItemHtml(itemJson)).appendTo("#itemsList");
    let thisItem = document.querySelector("#itemsList").lastChild;
    // thisItem.getElementsByClassName("itemDifficulty")[0].value = itemJson.difficulty
    thisItem.querySelector(".itemType").value = itemJson.type;
    let thisButton = thisItem.getElementsByClassName("removeItem")[0];
    thisButton.addEventListener('click', function () { confirmDelete(thisButton, "item") }, false);

    resizeInput(thisItem.querySelector(".itemDescription"));

    $(thisItem).on("keyup", function (event) {
        if ($(document.activeElement).is("input") && $(document.activeElement).parent().is("summary") && event.keyCode == 32) {
            if ($(this).attr("open")) {
                $(this).removeAttr("open");
            } else {
                $(this).attr("open", "");
            }
        }
    });

}



function getItemHtml(Json) {
    return `<details class="item">
            <summary>
              <div class="dragHandle" draggable="false">↕</div>
              <input class="itemName field" value="${Json.name}">
              <label class="itemAmount">(x<input type="number" class="itemAmount noArrows field" value="${Json.amount}">)</label>
              <button type="button" class="removeItem confirm" value="${Json.name}">✕</button>
            </summary>
            <div>
                <label>rank <input class="itemRank field" value="${Json.rank}"></label>
                <label><select class="itemType field">
                    <option value="misc">Misc</option>
                    <option value="shield">Shield</option>
                    <option value="weapon">Weapon</option>
                    <option value="armor">Armor</option>
                    <option value="ring">Ring</option>
                    <option value="inventory">Arms Inventory</option>
                    <option value="lighthouse">Lighthouse</option>
                    <option value="weapon">Weapon</option>
                  </select></label>
                <label class="itemTags">(<input class="itemTags field" value="${Json.tags}">)</label>
            </div>
            <textarea class="itemDescription field resize">${Json.description}</textarea>
          </details>`;
    /* return `<tr class="item">
              <td class="handle"><div class="dragHandle" draggable="false">↕</div></td>
              <td class="itemName"> <input class="itemName" value="${Json.name}"></input></td>
              <td class="itemRank"> <input class="itemRank" value="${Json.rank}"></input></td>
              <td class="itemAmount"> <input class="itemAmount" value="${Json.amount}"></input></td>
              <td class="itemDescription"> <input class="itemDescription" value="${Json.description}"></input></td>
              <td class="removeItem"> <button type="button" class="removeItem confirm" value="${Json.name}">✕</button></td>
            </tr>` */
    // return `<div class="item">
    //             <div class="dragHandle" draggable="false">↕</div>
    //             <input class="itemName" value="${Json.name}"></input>
    //             <input class="itemAmount" value="${Json.amount}"></input>
    //             <input class="itemRank" value="${Json.rank}"></input>
    //             <input class="itemDescription" value="${Json.description}"></input>
    //             <button type="button" class="removeItem confirm" value="${Json.name}">✕</button>
    //         </div>`;
}

/* 
function getItemHtml(Json) {
    return `<div class="item">
                <div class="dragHandle" draggable="false">↕</div>
                <input class="itemName" value="${Json.name}"></input>
                <input class="itemAmount" value="${Json.amount}"></input>
                <input class="itemRank" value="${Json.rank}"></input>
                <input class="itemDescription" value="${Json.description}"></input>
                <button type="button" class="removeItem confirm" value="${Json.name}">✕</button>
            </div>`;
} */
/* <select class="itemDifficulty">
                <option value="eased">Eased</option>
                <option value="-">    -Normal</option>
                <option value="hindered">Hindered</option>
              </select> */

/* quickstart */

function getStarterAbilities() {
    console.log("getting starter abilities for ");
    let startAbilityIDs = []
    document.getElementById("startAbilitiesList").innerHTML = "";
    if ($("#quickstartRace").val() != "none") {
        // startAbilityIDs = startAbilityIDs.concat(window[$("#quickstartRace").val() + "_startAbilities"]);
        window[$("#quickstartRace").val() + "_startAbilities"].forEach(ID => {
            var thisAbility = window[$("#quickstartRace").val() + "_abilities"].find(item => {
                return item.id == ID;
            })
            // console.log(thisAbility);
            if (thisAbility != null) {
                $(getPreviewAbilityHtml(thisAbility)).appendTo("#startAbilitiesList");
            }
        });
        // console.log("(1)"+window[$("#quickstartRace").val() + "_startAbilities"]+" from " +$("#quickstartRace").val() + "_startAbilities");
    }
    if ($("#quickstartNoble").val() != "none") {
        // startAbilityIDs = startAbilityIDs.concat(window[$("#quickstartNoble").val() + "_startAbilities"]);
        window[$("#quickstartNoble").val() + "_startAbilities"].forEach(ID => {
            var thisAbility = window[$("#quickstartNoble").val() + "_abilities"].find(item => {
                return item.id == ID;
            })
            // console.log(thisAbility);
            if (thisAbility != null) {
                $(getPreviewAbilityHtml(thisAbility)).appendTo("#startAbilitiesList");
            }
        });
        // console.log("(2)"+window[$("#quickstartNoble").val() + "_startAbilities"]+" from " +$("#quickstartNoble").val() + "_startAbilities");
    }
    if ($("#quickstartPosition").val() != "none") {
        // startAbilityIDs = startAbilityIDs.concat(window[$("#quickstartPosition").val() + "_startAbilities"]);
        window[$("#quickstartPosition").val() + "_startAbilities"].forEach(ID => {
            var thisAbility = window[$("#quickstartPosition").val() + "_abilities"].find(item => {
                return item.id == ID;
            })
            // console.log(thisAbility);
            if (thisAbility != null) {
                $(getPreviewAbilityHtml(thisAbility)).appendTo("#startAbilitiesList");
            }
        });
        // console.log("(3)"+window[$("#quickstartPosition").val() + "_startAbilities"]+" from " +$("#quickstartPosition").val() + "_startAbilities");
    }
    if ($("#fishermanStartWeapon").val() != "none") {
        // startAbilityIDs = startAbilityIDs.concat(window[$("#fishermanStartWeapon").val() + "_startAbilities"]);
        // console.log("fish: 
        // " + window["fisherman_abilities"]);
        // let ID = window[$("#fishermanStartWeapon").val() + "_startAbilities"]
        var thisAbility = window["fisherman_abilities"].find(item => {
            return item.id == $("#fishermanStartWeapon").val();
        })
        // console.log(thisAbility);
        if (thisAbility != null) {
            $(getPreviewAbilityHtml(thisAbility)).appendTo("#startAbilitiesList");
        }

    }
    // console.log(startAbilityIDs);
}

function calculateStarterStats(modifiedStat) {
    let totalPoints = 10;
    if ($("#quickstartRace").val() === "irregular") {
        totalPoints = 0;
    }
    let pointsSpent = 0;
    let startStats = document.getElementById("quickstartStats");
    for (const stat of startStats.children) {
        pointsSpent += stat.querySelector("input").value - 2;
    }

    if (pointsSpent > totalPoints) {
        modifiedStat.value = 2 + totalPoints - (pointsSpent - (modifiedStat.value - 2));
    } else {
        document.getElementById("statPoints").innerHTML = totalPoints - pointsSpent;
    }
    // console.log("points remaining: 
    // "+(totalPoints-pointsSpent));
}




function validateQuickstart() {
    let message = "";
    if ($("#quickstartRace").val() === "none") {
        message += "You need to select a race!\n";
    }
    if ($("#quickstartRace").val() === "fisherman" && $("#quickstartNoble").val() === "none") {
        message += "You need to select a noble family!\n";
    }
    if ($("#quickstartPosition").val() === "none") {
        message += "You need to select a position!\n";
    }
    if ($("#quickstartPosition").val() === "fisherman" && $("#fishermanStartWeapon").val() === "none") {
        message += "You need to select a starting weapon!\n";
    }

    if (parseInt(document.getElementById("statPoints").innerHTML) > 0) {
        message += "You have unspent stat points!\n";
    }

    /* if (parseInt(document.getElementById("statPoints").innerHTML) > 0) {
        message += "You have unspent stat points!\n";
    } */

    document.getElementById("quickstartMessage").innerHTML = message;
    if (message === "") {
        return true;
    } else {
        return false;
    }
}

function applyQuickstart() {
    /* validate - all points spent, everythign selected */

    if (!validateQuickstart()) {
        return;
    }

    let startStats = document.getElementById("quickstartStats");

    console.log("applying quickstart");
    for (const stat of startStats.children) {
        // console.log("#base" + stat.querySelector("input").id.substring(5));
        // console.log("#" + stat.querySelector("input").id.substring(5).toLowerCase()+"Base");
        // $("#base" + stat.querySelector("input").id.substring(5)).val(stat.querySelector("input").value);
        let baseStat = "#" + stat.querySelector("input").id.substring(5).toLowerCase() + "Base"
        $(baseStat).val(stat.querySelector("input").value);
        // document.querySelector("#mightPermBonusList + ul").innerHTML = "";



        // var paras = document.querySelectorAll("#" + stat.querySelector("input").id.substring(5).toLowerCase() + "PermBonusList + ul li")
        /* removing all bonuses */
        /* var bonuses = document.querySelectorAll("ul.bonusList li")
        while (bonuses[0]) {
            console.log("removing " + bonuses[0].outerHTML +" from "+bonuses[0].parentNode);
            bonuses[0].parentNode.removeChild(bonuses[0]);
        } */

        var bonuses = document.getElementsByClassName("removeBonus");
        while (bonuses[0]) {
            console.log("removing " + bonuses[0].parentNode + " from " + bonuses[0].parentNode.parentNode);
            bonuses[0].parentNode.remove();
        }

    }



    document.getElementById("abilitiesList").innerHTML = "";
    if ($("#quickstartRace").val() != "none") {
        window[$("#quickstartRace").val() + "_startAbilities"].forEach(ID => {
            var thisAbility = window[$("#quickstartRace").val() + "_abilities"].find(item => {
                return item.id == ID;
            })
            // console.log(thisAbility);
            if (thisAbility != null) {
                // $(getAbilityHtml(thisAbility)).appendTo("#abilitiesList");
                // addAbilityBonuses(thisAbility);
                addNewAbility(thisAbility);
            }
        });
    }
    if ($("#quickstartNoble").val() != "none") {
        window[$("#quickstartNoble").val() + "_startAbilities"].forEach(ID => {
            var thisAbility = window[$("#quickstartNoble").val() + "_abilities"].find(item => {
                return item.id == ID;
            })
            // console.log(thisAbility);
            if (thisAbility != null) {
                // $(getAbilityHtml(thisAbility)).appendTo("#abilitiesList");
                // addAbilityBonuses(thisAbility);
                addNewAbility(thisAbility);
            }
        });
    }
    if ($("#quickstartPosition").val() != "none") {
        window[$("#quickstartPosition").val() + "_startAbilities"].forEach(ID => {
            var thisAbility = window[$("#quickstartPosition").val() + "_abilities"].find(item => {
                return item.id == ID;
            })
            // console.log(thisAbility);
            if (thisAbility != null) {
                // $(getAbilityHtml(thisAbility)).appendTo("#abilitiesList");
                // addAbilityBonuses(thisAbility);
                addNewAbility(thisAbility);
            }
        });
    }
    if ($("#fishermanStartWeapon").val() != "none") {
        // console.log("fish: 
        // " + window["fisherman_abilities"]);
        var thisAbility = window["fisherman_abilities"].find(item => {
            return item.id == $("#fishermanStartWeapon").val();
        })
        // console.log(thisAbility);
        if (thisAbility != null) {
            // $(getAbilityHtml(thisAbility)).appendTo("#abilitiesList");
            // addAbilityBonuses(thisAbility);
            addNewAbility(thisAbility);
        }
    }
    $("#abilitiesBought").val(0);
    $("#experienceSpent").val(0);
    $("#tier").val(1);
    calculateStats();
    // calculateRolls();
    if ($("#race").val() === "noble") {
        $("#noble").parent().css('display', 'inline');
    } else if ($("#race").val() === "canine") {
        $("#canineTransformations").css('display', 'block');
        $("#noble").parent().css('display', 'none');
        $("#noble").val("none");
    } else {
        $("#canineTransformations").css('display', 'none');
        $("#noble").parent().css('display', 'none');
        $("#noble").val("none");
    }
    let thisInfo = {};
    if ($("#quickstartNoble").val() != "none") {
        thisInfo = quickstart_values.find(item => {
            return item.source == $("#quickstartNoble").val();
        })
    } else {
        thisInfo = quickstart_values.find(item => {
            return item.source == $("#quickstartRace").val();
        })
        /* $("#experienceTrigger").val(quickstart_values.find(item => {
            return item.source == $("#quickstartRace").val();
        }).trigger); */
        /* console.log("trigger: " + exp_triggers.find(item => {
            return item.source == $("#quickstartRace").val();
        }).trigger); */
    }
    $("#experienceTrigger").val(thisInfo.trigger);
    $("#credits").val(thisInfo.credits);
    $("#shinsuQuality").val(thisInfo.quality);


    $("#race").val($("#quickstartRace").val());
    $("#position").val($("#quickstartPosition").val());

    $("#popupMask").css('display', 'none');
    $(".popup").css('display', 'none');
    addItem({ name: "Pocket", rank: "", amount: "1", tags: "", description: "A universal translator, wallet, phone, timer, watch, ID, journal, and voice recorder. Every Regular receives one at no cost when they enter the Tower. Having one allows someone to make a contract with the Administrator (for example, for the ability to compress themselves or their weapons to a manageable size).", })
    for (const element of document.querySelectorAll(".resize")) {
        resizeInput(element);
    }

}

/* settings */

function setShareInfo(newMessage, selector = "#sharingInfo") {
    if (newMessage === "") {
        $(selector).css('display', 'none');
    } else {
        $(selector).html(newMessage);
        $(selector).css('display', 'inline');
    }
}

var functionforscroll = function (id) {
    var reqId = "#" + id;
    window.scrollTo(0, $(reqId).offset().top - 85);
}



/* document.documentElement.style.setProperty('--somevar', 'green');
--background: #97928e;
--backgroundDarker: #595855;
--card: #cdcac3;
--field: #bab5aa; */

function applyColors() {
    console.log("background color: " + $("#background").val());
    document.documentElement.style.setProperty('--background', $("#background").val());
    // document.documentElement.style.setProperty('--background-darker', $("#backgroundDarker").val());
    // document.documentElement.style.setProperty('--background-darker', "hsl(from var(--background) h s calc(l - 23))");
    document.documentElement.style.setProperty('--card', $("#card").val());
    document.documentElement.style.setProperty('--field', $("#field").val());

    /* 
        document.documentElement.style.setProperty('--might-dark', ColorLuminance($("#mightColor").val(), -0.2));
        document.documentElement.style.setProperty('--might-main', $("#mightColor").val());
        document.documentElement.style.setProperty('--might-light', ColorLuminance($("#mightColor").val(), 0.2)); */

    document.documentElement.style.setProperty('--might-main', $("#mightColor").val());
    document.documentElement.style.setProperty('--agility-main', $("#agilityColor").val());
    document.documentElement.style.setProperty('--hearts-main', $("#heartsColor").val());
    document.documentElement.style.setProperty('--wits-main', $("#witsColor").val());
    document.documentElement.style.setProperty('--resistance-main', $("#resistanceColor").val());







}

//from https://www.sitepoint.com/javascript-generate-lighter-darker-color/
function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}

/* saving/loading */
function saveForm() {
    if (disableSaving) {
        return;
    }
    // localStorage.clear();
    inputsToSave = document.getElementsByClassName("save");
    for (const input of inputsToSave) {
        // console.log("saving " + input.nodeName);
        if (input.nodeName === "INPUT" /* && input.type === "text" */) {
            if (input.type === "checkbox") {
                setThisStorage(input.id, input.checked);
            } else {
                setThisStorage(input.id, input.value);
            }
        } else if (input.nodeName == "SELECT") {
            if (input.value != "NONE") {
                setThisStorage(input.id, input.value);
            }
        } else if (input.nodeName == "TEXTAREA") {
            if (input.value != "NONE") {
                setThisStorage(input.id, input.value);
            }
        }
        // console.log("saving " + input.nodeName + " (" + input.type + ") " + input.id + " as " + input.value);
    }

    let abilitiesList = [];
    for (const ability of abilities.getElementsByClassName('ability')) {
        let thisJSON = {}
        // thisJSON.name = ability.querySelector(".abilityName").value;
        thisJSON.name = ability.querySelector(".abilityName").innerHTML;
        thisJSON.id = ability.id;
        thisJSON.shinsu = ability.querySelector(".isShinsu").checked;
        thisJSON.description = ability.querySelector(".abilityDescription").value;
        thisJSON.source = ability.querySelector(".abilitySource").value;
        thisJSON.type = ability.querySelector(".abilityType").value;
        thisJSON.hidden = $(ability).attr("hidden-ability");
        abilitiesList.push(thisJSON);
    }
    setThisStorage("abilitiesList", JSON.stringify(abilitiesList));


    let conditionsList = [];
    for (const condition of document.querySelectorAll(".condition")) {
        let thisJSON = {}
        thisJSON.name = condition.querySelector(".conditionName").value;
        thisJSON.description = condition.querySelector(".conditionDescription").value;
        conditionsList.push(thisJSON);
    }
    setThisStorage("conditionsList", JSON.stringify(conditionsList));


    let itemsList = [];
    for (const item of document.querySelectorAll(".item")) {
        let thisJSON = {}
        thisJSON.name = item.querySelector("input.itemName").value;
        thisJSON.amount = item.querySelector("input.itemAmount").value;
        thisJSON.rank = item.querySelector("input.itemRank").value;
        // console.log("type: "+item.querySelector(".itemType"));
        thisJSON.type = item.querySelector(".itemType").value;
        thisJSON.tags = item.querySelector("input.itemTags").value;
        thisJSON.description = item.querySelector(".itemDescription").value;
        itemsList.push(thisJSON);
    }
    setThisStorage("itemsList", JSON.stringify(itemsList));

    for (const stat of stats.children) {
        let tempBonuses = {}
        temp = stat.querySelector('.tempBonuses .bonusList');
        // console.log(stat);
        // console.log(stat.querySelector('.tempBonuses .bonusList'));
        for (const listItem of temp.getElementsByClassName('bonusListItem')) {
            tempBonuses[listItem.querySelector(".bonusSource").value] = listItem.querySelector(".bonusAmount").value;
        }

        setThisStorage("tempBonuses_" + stat.id, JSON.stringify(tempBonuses));

        let permBonuses = {}
        permanent = stat.querySelector('.permBonuses .bonusList');
        for (const listItem of permanent.getElementsByClassName('bonusListItem')) {
            permBonuses[listItem.querySelector(".bonusSource").value] = listItem.querySelector(".bonusAmount").value;
        }
        // console.log("permbonuses: 
        // " + JSON.stringify(permBonuses));
        setThisStorage("permBonuses_" + stat.id, JSON.stringify(permBonuses));
        // console.log("temp: 
        // "+ tempBonuses+", perm: "+permBonuses);
        // console.log("temp: 
        // " + JSON.stringify(tempBonuses) + ", perm: " + JSON.stringify(permBonuses));
    }


    let logItemsList = [];
    // console.log("log items amount: " + document.querySelectorAll(".logItem").length);
    for (const logItem of document.querySelectorAll(".logItem")) {
        let thisJSON = {}
        thisJSON.cost = logItem.querySelector(".logItemCost").innerHTML;
        thisJSON.source = logItem.querySelector(".logItemSource").innerHTML;
        thisJSON.name = logItem.querySelector(".logItemName").innerHTML;
        logItemsList.push(thisJSON);
    }
    setThisStorage("logItemsList", JSON.stringify(logItemsList));

    let rollsList = [];
    for (const roll of document.querySelectorAll("#rolls tbody tr")) {
        let thisJSON = {}
        thisJSON.id = roll.id;
        thisJSON.hindered = roll.querySelector("input.hinderedCheckbox").checked;
        thisJSON.impaired = roll.querySelector("input.impairedRoll").value;
        thisJSON.bonusDice = roll.querySelector("input.bonusDice").value;
        thisJSON.bonusSuccesses = roll.querySelector("input.bonusSuccesses").value;
        rollsList.push(thisJSON);
    }
    setThisStorage("rollsList", JSON.stringify(rollsList));

}

function getThisStorage(key) {
    if (useSessionStorage) {
        return sessionStorage.getItem("ToG_" + key);
    }
    return localStorage.getItem("ToG_" + key);
}

function setThisStorage(key, value) {
    if (useSessionStorage) {
        return sessionStorage.setItem("ToG_" + key, value);
    }
    return localStorage.setItem("ToG_" + key, value);
}

function clearAllFields() {
    /* inputsToSave = document.getElementsByClassName("save");
    for (const input of inputsToSave) {
        // console.log("saving " + input.nodeName);
        if (input.nodeName === "INPUT" ) { //&& input.type === "text"
            if (input.type === "checkbox") {
                setThisStorage(input.id, input.checked);
            } else {
                setThisStorage(input.id, input.value);
            }
        } else if (input.nodeName == "SELECT") {
            if (input.value != "NONE") {
                setThisStorage(input.id, input.value);
            }
        } else if (input.nodeName == "TEXTAREA") {
            if (input.value != "NONE") {
                setThisStorage(input.id, input.value);
            }
        }
        // console.log("saving " + input.nodeName + " (" + input.type + ") " + input.id + " as " + input.value);
    } */
    $("#abilitiesList").html("");
    $("#conditionsList").html("");
    $("#itemsList").html("");
    $("#logItemsList").html("");
    // $('.tempBonuses .bonusList').html("");
}


function loadForm() {
    /* let searchParams = new URLSearchParams(window.location.search);
    console.log("searchParams: " + searchParams);
    // makeShareLink();
    searchParams.forEach((value, key) => {
        console.log(value, key);
    });
    console.log("searchParams: " + searchParams.size);
    if (searchParams.size != 0) {
        loadSharedSheet(searchParams.get("id"));
        return;
    } */
    let hasSavedData = false;
    for (var i = 0; i < localStorage.length; i++) {
        let thiskey = localStorage.key(i);
        if (thiskey.substring(0, 4) === "ToG_") {
            hasSavedData = true;
            break;
        }
    }
    // if (localStorage.length == 0 && !useSessionStorage) {
    if (!hasSavedData && !useSessionStorage) {

        $("#quickstartWindow").css('display', 'flex');
        $("#popupMask").css('display', 'flex');
        getStarterAbilities();
        calculateStarterStats(document.querySelector("#startMight"));
        return;
    }
    clearAllFields();

    inputsToLoad = document.getElementsByClassName("save");
    for (const input of inputsToLoad) {
        if (input.nodeName === "INPUT" /* && input.type === "text" */) {
            if (input.type === "checkbox") {
                if (getThisStorage(input.id) === "true") {
                    input.checked = getThisStorage(input.id);
                    // console.log(input.id + " saved as 'true' ");
                }
                // console.log("setting " + input.id + ".checked to " + getThisStorage(input.id));
                // console.log(input.id + ".checked = " + input.checked);
            } else if (input.type === "color") {
                if (getThisStorage(input.id) != null) {
                    input.value = getThisStorage(input.id);
                }                // if (getThisStorage(input.id) === "true") {
                //     input.checked = getThisStorage(input.id);
                //     // console.log(input.id + " saved as 'true' ");
                // }
            } else {
                // console.log("");
                if (getThisStorage(input.id) == null) {
                    input.value = -1;
                } if (getThisStorage(input.id) === "") {
                    input.value = 0;
                    // console.log(input.nodeName + " is empty ");
                } else {
                    input.value = getThisStorage(input.id);
                    // console.log(getThisStorage(input.id));

                }
            }
        } else if (input.nodeName == "SELECT") {
            let selectedOption = getThisStorage(input.name);
            input.value = selectedOption;
        } else if (input.nodeName == "TEXTAREA") {
            input.value = getThisStorage(input.id);
            input.style.height = input.scrollHeight + "px";
            input.style.overflowY = "hidden";

        } else if (input.nodeName == "div") {
            console.log("is editable: " + input.isContentEditable);
            input.value = getThisStorage(input.id);
            input.style.height = input.scrollHeight + "px";
            input.style.overflowY = "hidden";

        }
        // console.log("setting " + input.nodeName + " (" + input.type + ") " + input.id + " to [" + input.value + "]");
    }

    for (const element of document.querySelectorAll(".resize")) {
        resizeInput(element);
        // if (element.value != "") {
        //     adjustWidthOfInput(element);
        // }
    }

    let conditionsList = JSON.parse(getThisStorage("conditionsList"));
    if (conditionsList != null) {
        conditionsList.forEach(thisConditionJson => {
            let html = getConditionHtml(thisConditionJson);
            $(html).appendTo("#conditionsList");
            let thisCondition = document.getElementById("conditionsList").lastChild;
            let tbox = thisCondition.getElementsByClassName("conditionDescription")[0];
            tbox.style.height = tbox.scrollHeight + "px";
            tbox.style.overflowY = "hidden";
            for (const element of thisCondition.querySelectorAll("input.resize")) {
                if (element.value != "") {
                    adjustWidthOfInput(element);
                }
            }
            let thisButton = thisCondition.getElementsByClassName("removeCondition")[0];
            thisButton.addEventListener('click', function () { thisCondition.remove(); }, false);
        });
    }

    let abilitiesList = JSON.parse(getThisStorage("abilitiesList"));
    if (abilitiesList != null) {
        abilitiesList.forEach(thisAbility => {
            addNewAbility(thisAbility);
        });
    }


    var abilityTooltipTriggerList = [].slice.call(document.querySelectorAll('.ability [data-bs-toggle="tooltip"]'))
    var abilityTooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })


    let itemsList = JSON.parse(getThisStorage("itemsList"));
    if (itemsList != null) {
        itemsList.forEach(thisItem => {
            addItem(thisItem);
        });
    }

    for (const stat of stats.children) {
        let tempBonuses = JSON.parse(getThisStorage("tempBonuses_" + stat.id));
        temp = stat.querySelector('.tempBonuses .bonusList');
        // console.log("tempBonuses_" + stat.id + " = " + tempBonuses);
        if (tempBonuses != null) {
            for (const [key, value] of Object.entries(tempBonuses)) {
                addStatBonus(key, value, temp);
            }
        } else {
            addStatBonus("", "", temp);
        }

        let permBonuses = JSON.parse(getThisStorage("permBonuses_" + stat.id));
        perm = stat.querySelector('.permBonuses .bonusList');
        // console.log("permBonuses_" + stat.id + " = " + permBonuses);
        if (permBonuses != null) {
            for (const [key, value] of Object.entries(permBonuses)) {
                addStatBonus(key, value, perm);
            }
        } else {
            addStatBonus("", "", perm);
        }
    }
    let rollsList = JSON.parse(getThisStorage("rollsList"));

    for (const roll of rollsList) {
        let thisRoll = document.querySelector("#" + roll.id);
        thisRoll.querySelector(".hinderedCheckbox").checked = roll.hindered;
        thisRoll.querySelector("input.impairedRoll").value = roll.impaired;
        thisRoll.querySelector("input.bonusDice").value = roll.bonusDice;
        thisRoll.querySelector("input.bonusSuccesses").value = roll.bonusSuccesses;
    }
    if ($("#race").val() === "noble") {
        $("#noble").parent().css('display', 'inline');
    } else if ($("#race").val() === "canine") {
        $("#canineTransformations").css('display', 'block');
        $("#noble").parent().css('display', 'none');
        $("#noble").val("none");
    } else {
        $("#canineTransformations").css('display', 'none');
        $("#noble").parent().css('display', 'none');
        $("#noble").val("none");
    }

    let logItemsList = JSON.parse(getThisStorage("logItemsList"));
    if (logItemsList != null) {
        logItemsList.forEach(item => {
            addLogItem(item.cost, item.source, item.name);
        });
    }


    calculateExperience();
    // calculateRolls();
    calculateStats();
}



function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}


function exportSave() {
    /* amount = localStorage.length;
    for (let i = 0; i < amount; i++) {
        const element = localStorage.key(i);   
    } */
    /* var a = document.createElement("a");
    console.log(JSON.stringify(localStorage));
    var json = JSON.stringify(localStorage),
        blob = new Blob([json], { type: "octet/stream" }),
        url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "exported save";
    a.click(); */
    // download()
    // download(JSON.stringify(localStorage), "MAGRPG save (" + document.getElementById('name').value + ")", ".txt")

    // download(JSON.stringify(localStorage), "Tower of God save (" + document.getElementById('name').value + ")", ".json")
    let downloadName = document.getElementById('name').value.replaceAll(/(\.| )/gi, "_");
    download(getSaveData(), "Tower of God save (" + downloadName + ")", ".json")
}


function getSaveData() {
    let data = new Map();
    for (var i = 0; i < localStorage.length; i++) {

        let thiskey = localStorage.key(i);
        if (thiskey.startsWith("ToG_ToG_")) {
            console.log("found bad key: " + thiskey);
        } else if (thiskey.startsWith("ToG_")) {
            data.set(thiskey.substring(4, thiskey.length), localStorage.getItem(thiskey));
        }

    }
    console.log("save data: " + JSON.stringify(Object.fromEntries(data)));
    return JSON.stringify(Object.fromEntries(data));
}

function copySave() {
    getSaveData();
    // navigator.clipboard.writeText(JSON.stringify(localStorage));
    navigator.clipboard.writeText(getSaveData());
}


function importSave(fileData) {
    clearData(); // risky?
    console.log("fileData: " + fileData);
    let data = JSON.parse(fileData);
    // for (const [key, value] of Object.entries(fileData)) {
    for (const [key, value] of Object.entries(data)) {
        // console.log(`${key}: ${value}`);
        console.log("key: " + key + ", value: " + value);
        // setThisStorage(key.substring(4, key.length), value);
        setThisStorage(key, value);
        // setThisStorage(key, value);
        // localStorage.setItem(key, value)
    }

    loadForm();
    // console.log("localstorage: "+JSON.stringify(localStorage));
    /* 
    if
    console.log("importing save");
    if (document.getElementById('upload_file').value == null) {
        console.log("please put a file");
    } else {
 
        // let newData = JSON.parse(fileData)
        let newData = document.getElementById('upload_file').value;
        console.log(newData);
        for (const [key, value] of Object.entries(newData)) {
            // console.log(`${key}: ${value}`);
            setThisStorage(key.substring(4, key.length), value);
            // setThisStorage(key, value);
            // localStorage.setItem(key, value)
        }
        loadForm();
 
    } */
}


function handle_file_select(evt) {

    let fl_file = evt.target.files[0];

    let reader = new FileReader(); // built in API
    reader.readAsText(fl_file);
    reader.onload = function () {
        console.log(reader.result);
        // importSave(reader.result);
        document.getElementById('upload_file').value = reader.result
    };


}

function clearData() {
    console.log("clearing savedata");
    let keysToRemove = [];
    for (var i = 0; i < localStorage.length; i++) {
        console.log("substring = " + localStorage.key(i).substring(0, 4));
        if (localStorage.key(i).substring(0, 4) === "ToG_") {
            keysToRemove.push(localStorage.key(i))
        }
    }
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });
}

const charCollection = db.collection("Characters")

async function uploadSave(uploadOverride = false) {
    saveForm();
    let searchParams = new URLSearchParams(window.location.search);
    if (uploadOverride) {
        await charCollection.doc("morgan").get().then((doc) => {
            if (doc.exists) {
                sharePassword = doc.data().password;
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });


        console.log("sharePassword: " + $("#modifyPassword").val() + "=?" + sharePassword);
        if ($("#modifyPassword").val() === sharePassword) {
            setShareInfo("uploading modifications", "#sharingInfoTwo");
            await db.collection("Characters").doc(getThisStorage("shareId").toLowerCase()).update({
                name: $("#name").val(),
                data: getSaveData(),
            }).then(() => {
                let shareLink = "https://ramblingcreator.github.io/ToG_charsheet/ToG_charsheet.html" + "?id=" + getThisStorage("shareId");

                setShareInfo("Character sheet updated: <a href='" + shareLink + "'>" + shareLink + "</a>", "#sharingInfoTwo");

            }).catch((error) => {
                console.error("Error writing document: ", error);
            });
        } else {
            setShareInfo("incorrect password", "#sharingInfoTwo");
        }
    } else if (viewingSharedSheet) {
        // $("#sharePassword");
        console.log("sharePassword: " + $("#sharePassword").val() + "=?" + sharePassword);
        if ($("#sharePassword").val() === sharePassword) {
            console.log("uploading modifications...");
            setShareInfo("uploading modifications");
            await db.collection("Characters").doc(searchParams.get("id").toLowerCase()).update({
                name: $("#name").val(),
                data: getSaveData(),
            }).then(() => {
                console.log("Document successfully written!");
                $("#sharingInfo").html("Character sheet updated");
            }).catch((error) => {
                console.error("Error writing document: ", error);
            });
        } else {
            // console.log("incorrect password");
            setShareInfo("incorrect password");
        }
    } else {
        var amount = "0";
        setShareInfo("uploading character...");
        // console.log("new id is: " + amount);
        let idName = document.getElementById('name').value.replaceAll(/(\.| )/gi, "_").toLowerCase();
        var idAvailable = false;
        await charCollection.doc(idName).get().then((doc) => {
            if (doc.exists) {
                console.log("id already in use");
                idAvailable = false;
            } else {
                console.log("id is available");
                idAvailable = true;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        console.log("idAvailable: " + idAvailable);
        idNumber = 0;
        while (!idAvailable) {
            idNumber++;
            await charCollection.doc(idName + idNumber).get().then((doc) => {
                if (doc.exists) {
                    console.log("id already in use");
                    idAvailable = false;
                } else {
                    console.log("id is available");
                    idAvailable = true;
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
        if (idNumber != 0) {
            idName = idName + idNumber;
        }
        await db.collection("Characters").doc(idName).set({
            name: $("#name").val(),
            // data: JSON.stringify(localStorage),
            data: getSaveData(),
            password: $("#sharePassword").val()
        }).then(() => {
            console.log("Document successfully written!");

        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
        await db.collection("Characters").doc("totalCharacters").set({
            count: parseInt(amount) + 1
        }).then(() => {
            console.log("count updated");
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
        // let shareLink = location.origin + location.pathname + "?id=" + idName;
        let shareLink = "https://ramblingcreator.github.io/ToG_charsheet/ToG_charsheet.html" + "?id=" + idName;
        $("#shareLink").html("<a href='" + shareLink + "'>" + shareLink + "</a>");
        setShareInfo("Character info uploaded! Use this link to view it:");
        setThisStorage("shareId", idName);
    }

}

function checkifCharacterExists(idName) {
    charCollection.doc(idName + idNumber).get().then((doc) => {
        if (doc.exists) {
            console.log("id already in use");
            return true;
        } else {
            console.log("id is available");
            return false;
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

let sharePassword = "";

function loadSharedSheet(id) {
    id = id.toLowerCase();
    console.log("loading shared sheet: " + id);


    // let charData = "";
    charCollection.doc(id).get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            // amount = doc.data();
            console.log("loading " + doc.data().name);

            sharePassword = doc.data().password;
            importSave(doc.data().data);

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });


}


function transferData() {
    for (var i = 0; i < sessionStorage.length; i++) {
        if (sessionStorage.key(i).substring(0, 4) === "ToG_") {
            localStorage.setItem(sessionStorage.key(i), sessionStorage.getItem(sessionStorage.key(i)));
        }
    }
    setShareInfo('This sheet is now saved locally');
}

// add a function to call when the <input type=file> status changes, but don't "submit" the form
document.getElementById('upload').addEventListener('change', handle_file_select, false);

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})


columnHeaders("rolls");
// columnHeaders("itemsTable");

function columnHeaders(tableId) {
    $("#" + tableId + " td").on("mouseenter", function () {
        $("#" + this.className + "Header span").css('display', 'block');
        $("." + this.className).attr('hovered', "true");
    });
    $("#" + tableId + " td").on("mouseleave", function () {
        $("#" + this.className + "Header span").css('display', 'none');
        $("." + this.className).attr('hovered', "false");
    });
}

function resizedw() {
    let tboxes = document.querySelectorAll("textarea");
    tboxes.forEach(tbox => {
        console.log("resizing " + tbox.className + " from " + tbox.style.height + " to " + tbox.scrollHeight + "px");
        tbox.style.height = "0px";
        tbox.style.height = tbox.scrollHeight + "px";
    });
    console.log("resizing");


}

var doit;
window.onresize = function () {
    clearTimeout(doit);
    doit = setTimeout(resizedw, 200);
};




