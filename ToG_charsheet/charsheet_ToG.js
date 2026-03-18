

/* window.addEventListener('load', function () {
  calculateStats()
}) */



const race = document.getElementById('race');
const noble = document.getElementById('noble');
const position = document.getElementById('position');

let stats = document.getElementById("stats");
const abilities = document.getElementById('abilitiesList');

let toggles = document.getElementsByClassName("dropdownToggle");
// const cyphers = document.getElementById('cyphersList');
// const skills = document.getElementById('skillsList');
// const attacks = document.getElementById('attacksList');

$(document).ready(function () {
    loadForm();
    $("#newAbility").on("click", function () {
        $("#abilityWindow").css('display', 'flex');
        $("#popupMask").css('display', 'flex');
        filterAbilities();
        console.log("add ability");
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
    $("#save").on("click", function () {
        saveForm();
    });
    $("#calculatestats").on("click", function () {
        calculateStats();
    });
    $("#calculateexp").on("click", function () {
        calculateExperience();
    });
    $("#addCustomAbility").on("click", function () {
        addCustomAbility();
    });
    $("#sourceSelection").on("input", function () {
        filterAbilities();
    });
    $("#applyQuickstart").on("click", function () {
        applyQuickstart();
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


    $("#quickstart").on("click", function () {
        $("#quickstartWindow").css('display', 'flex');
        $("#popupMask").css('display', 'flex');
    });

    $("#buyStats").on("click", function () {
        $("#statPurchaseWindow").css('display', 'flex');
        $("#popupMask").css('display', 'flex');
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


    $("#race").on("input", function () {
        if (this.value === "noble") {
            $("#noble").parent().css('display', 'inline');
        } else {
            $("#noble").parent().css('display', 'none');
            $("#noble").val("none");
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




    $(".dropdownToggle").on("input", function () {
        /* toggles.forEach(element => {
            element.checked = false;
        }); */

        for (const element of toggles) {
            if (element != this) {
                element.checked = false;
            }
        }
    });
    /* $(".addBonus").on("click", function () {
        addStatBonus();
    }); */

    var elements = document.getElementsByClassName("addBonus");
    Array.from(elements).forEach(function (element) {
        element.addEventListener('click', addNewStatBonus);
    });
    $(".reorderList").sortable({
        axis: "y",
        handle: ".dragHandle",
        snap: true,
        containment: "parent",
        snapMode: "outer",
        // helper: "clone",
        placeholder: "sortable-placeholder",
        forcePlaceholderSize: true,
        tolerance: "pointer",
        // forceHelperSize: true
    })
    calculateStats();
});

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
    // console.log("abilities: " + abilities.length);
    console.log("abilities: " + abilities.length);
    document.getElementById("filteredAbilities").innerHTML = "";

    abilities.forEach(element => {
        /* thisAbility = element;
        thisAbility.description = thisAbility.description.replace(/(\r\n|\r|\n)/i, "<br>"); */
        $(getAddAbilityHtml(element)).appendTo("#filteredAbilities");
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

function addCustomAbility() {
    addNewAbility({ name: "", source: "any", type: "custom", id: "", description: "" });

}

function updateAbilityCosts() {
    let cost = Math.pow(3, 1 + Math.floor($("#abilitiesBought").val() / 4));
    var elements = document.getElementsByClassName("addAbility");
    Array.from(elements).forEach(function (element) {

        let buttonMessage = "Purchase this ability (Cost: " + cost + ")"
        if (cost > $("#currentExperience").val()) {
            buttonMessage = "Purchase this ability (Cannot afford)"
            element.disabled = true;
        }
        element.innerHTML = buttonMessage;
    });
    if (cost > $("#currentExperience").val()) {
        document.getElementById("addCustomAbility").disabled = true;
        document.getElementById("addCustomAbility").innerHTML = "Add custom ability (Cannot afford)";
    } else {
        document.getElementById("addCustomAbility").innerHTML = "Add custom ability (cost: " + cost + ")";
    }
}

var addThisAbility = function () {
    let cost = Math.pow(3, 1 + Math.floor($("#abilitiesBought").val() / 4));
    $("#currentExperience").val($("#currentExperience").val() - cost);

    $("#experienceSpent").val($("#experienceSpent").val() - (cost * -1));
    $("#abilitiesBought").val($("#abilitiesBought").val() + 1);
    updateAbilityCosts();
    var attribute = this.value; //getAttribute("data-myattribute");
    // console.log("looking for " + this.name + "_ABILITIES");
    typeAbilities = window[this.name + "_abilities"];
    console.log(this.name + "_abilities: " + typeAbilities);
    if (typeAbilities != null) {
        var thisAbility = typeAbilities.find(item => {
            return item.id == attribute
        })
        console.log(thisAbility);
        if (thisAbility != null) {
            addNewAbility(thisAbility);
        }
    }

    // addAbilityBonuses(abilityJson);


};
function addNewAbility(abilityJson) {
    html = getAbilityHtml(abilityJson);
    $(html).appendTo("#abilitiesList");
    let thisAbility = abilities.lastChild;
    console.log(thisAbility.getElementsByClassName("abilityDescription"));
    let tbox = thisAbility.getElementsByClassName("abilityDescription")[0];
    tbox.style.height = tbox.scrollHeight + "px";
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


    let thisButton = thisAbility.getElementsByClassName("removeAbility")[0];
    thisButton.addEventListener('click', function () { confirmDelete(thisButton, "ability", abilityJson.name) }, false);
}

function addAbilityBonuses(Json) {
    /* var thisAbility = window[$("#quickstartRace").val() + "_abilities"].find(item => {
        return item.id == ID;
    }) */
    console.log(document.querySelector("#mightPermBonusList + ul"));
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
    } /* else if (Json.id === "TOUGH") {
        addStatBonus("Tough (Crocodile)", 3, document.querySelector("#mightPermBonusList + ul"));
        addStatBonus("Tough (Crocodile)", 3, document.querySelector("#resistancePermBonusList + ul"));
    } */
    calculateStats();
}

function getAbilityHtml(Json) {
    return `<div class="ability" abilityName="${Json.name}" id="${Json.id}">

            <div class="abilityHeader">
              <div class="abilityNameBlock">
                <div class="dragHandle" draggable="false">↕</div>
                <input class="abilityName resize" value="${Json.name}">
              </div>
              <div class="abilityOrigin">
                  <input class="abilitySource resize" value="${Json.source}">:
                  <input class="abilityType resize" value="${Json.type}">
              </div>
              <button type="button" class="removeAbility confirm" value="${Json.id}">X</button>
            </div>
            <textarea class="abilityDescription resize" rows="2" cols="10">${Json.description}</textarea>
          </div>`;
}

function getAddAbilityHtml(Json) {
    // console.log("original description: " + Json.description);
    let newDesc = Json.description.replaceAll(/\r\n|\r|\n/gi, "<br>"); //•
    // console.log("new description: " + newDesc);
    let cost = Math.pow(3, 1 + Math.floor($("#abilitiesBought").val() / 4));
    if (Json.source == "position" && Json.type != $("#position").val()) {
        cost = cost * 2;
    }
    let costMessage = "Cost: " + cost
    if (cost > $("#currentExperience").val()) {
        costMessage = "Cannot afford"
    }

    return `<div class="newAbility">
          <div class="abilityHeader">
            <div class="abilityNameBlock">
                <div class="abilityName">${Json.name}</div>
            </div>
            <div class="abilityOrigin">
                <div class="abilitySource">${Json.source}</div>:
                <div class="abilityType">${Json.type}</div>
            </div>
          </div>
          <p class="abilityDescription" rows="1" cols="10">${newDesc}</p>
          <button type="button" class="addAbility" name="${Json.type}" value="${Json.id}">Purchase this ability (${costMessage})</button>
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
                <div class="abilitySource">${Json.source}</div>:
                <div class="abilityType">${Json.type}</div>
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



function confirmDelete(thisButton, type) {
    console.log("confirming...?");
    $("#confirmWindow").css('display', 'grid');
    $("#popupMask").css('display', 'flex');

    let parent = thisButton.parentNode.parentNode;

    let message = "";

    message = parent.getElementsByClassName(type + "Name")[0].value
    document.getElementById("confirmTarget").innerHTML = "This can't be undone. Are you sure you want to delete \"" + message + "\" ?";
    $('#confirmYes').click(function () {
        console.log("confirmed");
        console.log("removing");
        /* if (type == "cypher") {
            // thisButton.parentNode.parentNode.parentNode.remove();

        } else if (type == "ability") {
            thisButton.parentNode.parentNode.parentNode.remove();
        } else if (type == "skill") {
            thisButton.parentNode.parentNode.parentNode.remove();
        } else if (type == "attack") {
            thisButton.parentNode.parentNode.parentNode.remove();
        } */
        parent.remove();
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
    console.log("calculating stats");
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
            // console.log("[" + stat.id + "]adding " + listItem.querySelector(".bonusAmount").value + "(" + listItem.querySelector(".bonusSource").value + ") to temp total: " + tempTotal);
        }

        stat.querySelector('span.tempBonuses').innerHTML = tempTotal;

        console.log("temp span: " + stat.querySelector('span.tempBonuses'));

        let permTotal = 0;
        perm = stat.querySelector('.permBonuses .bonusList');
        for (const listItem of perm.getElementsByClassName('bonusListItem')) {
            if (listItem.querySelector(".bonusAmount").value != "") {
                permTotal += parseInt(listItem.querySelector(".bonusAmount").value);
            } else {
                // console.log("empty amount, add nothing");
            }
            // console.log("[" + stat.id + "]adding " + listItem.querySelector(".bonusAmount").value + "(" + listItem.querySelector(".bonusSource").value + ") to temp total: " + tempTotal);
        }

        stat.querySelector('span.permBonuses').innerHTML = permTotal;


        base = stat.querySelector('input.baseStat');
        current = stat.querySelector('input.currentStat');
        edge = stat.querySelector('input.edge');
        if (base.value == "") {
            current.value = (parseInt(permTotal) + parseInt(tempTotal));
        } else {
            current.value = (parseInt(base.value) + parseInt(permTotal) + parseInt(tempTotal));
        }
        edge.value = Math.floor(parseInt(current.value) / 10);

    }
}

function addStatBonus(source, amount, parent) {
    // console.log("parent is " + parent);
    // [object HTMLUListElement]
    html = `<li class="bonusListItem">
                    <input type="number" class="bonusAmount"  value=${amount}>
                    <input class="bonusSource" value="${source}">
                    <button type="button" class="removeBonus" value="">X</button>
                  </li>`;
    $(parent).append(html);

    let thisButton = parent.lastChild.getElementsByClassName("removeBonus")[0];
    thisButton.addEventListener('click', function () { this.parentNode.remove() }, false);
}

function addNewStatBonus() {

    html = `<li class="bonusListItem">
                    <input type="number" class="bonusAmount">
                    <input class="bonusSource">
                    <button type="button" class="removeBonus" value="">X</button>
                  </li>`;
    // $(html).appendTo("#abilitiesList");
    console.log("adding stat bonus to " + this.parentNode.parentNode);
    $(this.parentNode.parentNode).append(html);

    let thisButton = this.parentNode.parentNode.lastChild.getElementsByClassName("removeBonus")[0];
    thisButton.addEventListener('click', function () { this.parentNode.remove() }, false);
}


/* skills */

function calculateSkills(params) {
    let skills = document.getElementById("skills");
    for (const skill of skills.children) {
    }
}

/* experience */

function calculateExperience() {
    $("#tier").val(getTier($("#experienceSpent").val()));

}

console.log("tier(2) = " + getTier(2));
console.log("tier(250) = " + getTier(250));
console.log("tier(1250) = " + getTier(1250));
console.log("tier(6250) = " + getTier(6250));

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
        console.log("base tier");
        return Math.floor(Math.log(exp / 500)/Math.log(5)) + 2;
        // Math.log(x) / Math.log(otherBase)
    }
    if (exp < 5) {
        return 1;
    }
    console.log("base tier");
    return Math.floor(Math.log10(exp / 500)) + 2;

}
/* leveling modifiers:

Tough: You increase your Might and Resistance increase by your Tier plus one.
Born Fighter: Might, Resistance, and Agility scores by 2 increase  by your Tier plus one
Royal Blood:  Whenever you spend experience to increase one of your attributes, you increase that attribute by your Tier plus one

*/

function purchaseStats() {
    for (const stat of document.getElementById("statPurchaseSection").children) {
        let input = stat.querySelector("input");
        let statName = input.id.substring(0, input.id.length - 8);
        let baseID = "#base" + statName.charAt(0).toUpperCase() + statName.substring(1)
        $(baseID).val(parseInt($(baseID).val()) + parseInt(input.value));
        input.value = 0;
    }
    getStatCost();
    $("#popupMask").css('display', 'none');
    $(".popup").css('display', 'none');
    calculateStats();
}

function changeBoughtStat(origin, direction) {
    let stat = origin.parentNode.querySelector("input");
    // console.log("parent: " + origin.parentNode);
    // console.log("changing " + stat.id + " by " + direction);
    let increaseAmount = parseInt($("#tier").val());

    if (checkForAbility("TOUGH")) {
        if (stat.id.substring(0, 5) === "might" || stat.id.substring(0, 5) === "resistance") {
            increaseAmount++;
        }
    } else if (checkForAbility("BORN_FIGHTER")) {
        if (stat.id.substring(0, 5) === "might" || stat.id.substring(0, 5) === "agility" || stat.id.substring(0, 5) === "resistance") {
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
    getStatCost();
}

function checkForAbility(abilityID) {
    if (abilities.querySelector("#" + abilityID) != null) {
        return true;
    } else {
        return false;
    }
}


function getStatCost() {
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

        // console.log("input: "+input);
        let levels = input.value;
        let thisExpCost = 0;
        let initialValue = $("#base" + statName.charAt(0).toUpperCase() + statName.substring(1)).val();
        // let costMessage = statName + " cost: "
        // console.log(levels + " / " + increaseAmount + " = " + (levels / increaseAmount));

        for (let i = 0; i < Math.floor(levels / increaseAmount); i++) {
            thisExpCost = parseInt(thisExpCost) + parseInt((increaseAmount * i)) + parseInt(initialValue);
            // costMessage += (parseInt((increaseAmount * i)) + parseInt(initialValue)) + " + ";
        }
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
    }
    document.querySelector("#statCost span").innerHTML = totalExpCost;
}
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
            console.log(thisAbility);
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
            console.log(thisAbility);
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
            console.log(thisAbility);
            if (thisAbility != null) {
                $(getPreviewAbilityHtml(thisAbility)).appendTo("#startAbilitiesList");
            }
        });
        // console.log("(3)"+window[$("#quickstartPosition").val() + "_startAbilities"]+" from " +$("#quickstartPosition").val() + "_startAbilities");
    }
    if ($("#fishermanStartWeapon").val() != "none") {
        // startAbilityIDs = startAbilityIDs.concat(window[$("#fishermanStartWeapon").val() + "_startAbilities"]);
        console.log("fish: " + window["fisherman_abilities"]);
        // let ID = window[$("#fishermanStartWeapon").val() + "_startAbilities"]
        var thisAbility = window["fisherman_abilities"].find(item => {
            return item.id == $("#fishermanStartWeapon").val();
        })
        console.log(thisAbility);
        if (thisAbility != null) {
            $(getPreviewAbilityHtml(thisAbility)).appendTo("#startAbilitiesList");
        }

    }
    console.log(startAbilityIDs);
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
    // console.log("points remaining: "+(totalPoints-pointsSpent));
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
        console.log("#base" + stat.querySelector("input").id.substring(5));
        $("#base" + stat.querySelector("input").id.substring(5)).val(stat.querySelector("input").value);

    }
    calculateStats();

    document.getElementById("abilitiesList").innerHTML = "";
    if ($("#quickstartRace").val() != "none") {
        window[$("#quickstartRace").val() + "_startAbilities"].forEach(ID => {
            var thisAbility = window[$("#quickstartRace").val() + "_abilities"].find(item => {
                return item.id == ID;
            })
            console.log(thisAbility);
            if (thisAbility != null) {
                $(getAbilityHtml(thisAbility)).appendTo("#abilitiesList");
                addAbilityBonuses(thisAbility);
            }
        });
    }
    if ($("#quickstartNoble").val() != "none") {
        window[$("#quickstartNoble").val() + "_startAbilities"].forEach(ID => {
            var thisAbility = window[$("#quickstartNoble").val() + "_abilities"].find(item => {
                return item.id == ID;
            })
            console.log(thisAbility);
            if (thisAbility != null) {
                $(getAbilityHtml(thisAbility)).appendTo("#abilitiesList");
                addAbilityBonuses(thisAbility);
            }
        });
    }
    if ($("#quickstartPosition").val() != "none") {
        window[$("#quickstartPosition").val() + "_startAbilities"].forEach(ID => {
            var thisAbility = window[$("#quickstartPosition").val() + "_abilities"].find(item => {
                return item.id == ID;
            })
            console.log(thisAbility);
            if (thisAbility != null) {
                $(getAbilityHtml(thisAbility)).appendTo("#abilitiesList");
                addAbilityBonuses(thisAbility);
            }
        });
    }
    if ($("#fishermanStartWeapon").val() != "none") {
        console.log("fish: " + window["fisherman_abilities"]);
        var thisAbility = window["fisherman_abilities"].find(item => {
            return item.id == $("#fishermanStartWeapon").val();
        })
        console.log(thisAbility);
        if (thisAbility != null) {
            $(getAbilityHtml(thisAbility)).appendTo("#abilitiesList");
            addAbilityBonuses(thisAbility);
        }

    }
    $("#abilitiesBought").val(0);
    $("#experienceSpent").val(0);
    $("#tier").val(1);
}

/* saving/loading */
function saveForm() {
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
        thisJSON.name = ability.getElementsByClassName("abilityName")[0].value;
        thisJSON.id = ability.id;
        thisJSON.description = ability.getElementsByClassName("abilityDescription")[0].value;
        thisJSON.source = ability.getElementsByClassName("abilitySource")[0].value;
        thisJSON.type = ability.getElementsByClassName("abilityType")[0].value;
        abilitiesList.push(thisJSON);
    }
    setThisStorage("abilitiesList", JSON.stringify(abilitiesList));
    // console.log(stats);
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
        for (const listItem of temp.getElementsByClassName('bonusListItem')) {
            tempBonuses[listItem.querySelector(".bonusSource").value] = listItem.querySelector(".bonusAmount").value;
        }
        // console.log("permbonuses: " + JSON.stringify(permBonuses));
        setThisStorage("permBonuses_" + stat.id, JSON.stringify(permBonuses));
        // console.log("temp: "+ tempBonuses+", perm: "+permBonuses);
        // console.log("temp: " + JSON.stringify(tempBonuses) + ", perm: " + JSON.stringify(permBonuses));

    }
}

function getThisStorage(key) {
    return localStorage.getItem("ToG_" + key);
}

function setThisStorage(key, value) {
    return localStorage.setItem("ToG_" + key, value);
}

function loadForm() {
    inputsToLoad = document.getElementsByClassName("save");
    for (const input of inputsToLoad) {
        if (input.nodeName === "INPUT" /* && input.type === "text" */) {
            if (input.type === "checkbox") {
                if (getThisStorage(input.id) === "true") {
                    input.checked = getThisStorage(input.id);
                    console.log(input.id + " saved as 'true' ");
                }
                // console.log("setting " + input.id + ".checked to " + getThisStorage(input.id));
                // console.log(input.id + ".checked = " + input.checked);
            } else {
                // console.log("");
                if (getThisStorage(input.id) == null) {
                    input.value = -1;
                } if (getThisStorage(input.id) === "") {
                    input.value = 0;
                    console.log(input.nodeName + " is empty ");
                } else {
                    input.value = getThisStorage(input.id);
                    console.log(getThisStorage(input.id));

                }
            }
        } else if (input.nodeName == "SELECT") {
            let selectedOption = getThisStorage(input.name);
            input.value = selectedOption;
        } else if (input.nodeName == "TEXTAREA") {
            input.value = getThisStorage(input.id);

        }
        // console.log("setting " + input.nodeName + " (" + input.type + ") " + input.id + " to [" + input.value + "]");
    }

    let abilitiesList = JSON.parse(getThisStorage("abilitiesList"));
    if (abilitiesList != null) {
        abilitiesList.forEach(thisAbility => {
            addNewAbility(thisAbility);
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
}
