

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
    });
    $(document).keydown(function (e) {
        // ESCAPE key pressed
        if (e.keyCode == 27) {
            $("#abilityWindow").css('display', 'none');
            $("#cypherWindow").css('display', 'none');
            $("#confirmWindow").css('display', 'none');
            $("#quickstartWindow").css('display', 'none');
            $("#popupMask").css('display', 'none');
        } else if (event.ctrlKey && event.keyCode == 83) {
            event.preventDefault()
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




    $("#quickstart").on("click", function () {
        $("#quickstartWindow").css('display', 'block');
        $("#popupMask").css('display', 'flex');
    });


    $("#quickstartRace").on("input", function () {
        if (this.value === "noble") {
            $("#quickstartNoble").parent().css('display', 'inline');
        } else {
            $("#quickstartNoble").parent().css('display', 'none');
            $("#quickstartNoble").val("none");
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

function getAbilityHtml(Json) {
    return `<div class="ability" abilityName="${Json.name}">

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
            noCallback();
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
                console.log("empty amount, add nothing");
            }
            console.log("[" + stat.id + "]adding " + listItem.querySelector(".bonusAmount").value + "(" + listItem.querySelector(".bonusSource").value + ") to temp total: " + tempTotal);
        }

        stat.querySelector('span.tempBonuses').innerHTML = tempTotal;

        console.log("temp span: " + stat.querySelector('span.tempBonuses'));

        let permTotal = 0;
        perm = stat.querySelector('.permBonuses .bonusList');
        for (const listItem of perm.getElementsByClassName('bonusListItem')) {
            if (listItem.querySelector(".bonusAmount").value != "") {
                permTotal += parseInt(listItem.querySelector(".bonusAmount").value);
            } else {
                console.log("empty amount, add nothing");
            }
            console.log("[" + stat.id + "]adding " + listItem.querySelector(".bonusAmount").value + "(" + listItem.querySelector(".bonusSource").value + ") to temp total: " + tempTotal);
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

/* experience */

function calculateExperience() {
    $("#tier").val(Math.floor(Math.log10($("#experienceSpent").val() / 500)) + 2);

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

function applyQuickstart() {
    /* validate - all points spent, everythign selected */



    let startStats = document.getElementById("quickstartStats");

    console.log("applying quickstart");
    for (const stat of startStats.children) {
        console.log("#base" + stat.querySelector("input").id.substring(5));
        $("#base" + stat.querySelector("input").id.substring(5)).val(stat.querySelector("input").value);

    }
    calculateStats();
    if ($("#quickstartRace").val() != "none") {
        window[$("#quickstartRace").val() + "_startAbilities"].forEach(ID => {
            var thisAbility = window[$("#quickstartRace").val() + "_abilities"].find(item => {
                return item.id == ID;
            })
            console.log(thisAbility);
            if (thisAbility != null) {
                $(getAbilityHtml(thisAbility)).appendTo("#abilitiesList");
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
        }

    }
}

/* saving/loading */
function saveForm() {
    localStorage.clear();
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
        // thisJSON.id = ability.getElementsByClassName("abilityid")[0].value;
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
        console.log(stat);
        console.log(stat.querySelector('.tempBonuses .bonusList'));
        for (const listItem of temp.getElementsByClassName('bonusListItem')) {
            tempBonuses[listItem.querySelector(".bonusSource").value] = listItem.querySelector(".bonusAmount").value;
        }


        setThisStorage("tempBonuses_" + stat.id, JSON.stringify(tempBonuses));

        let permBonuses = {}
        permanent = stat.querySelector('.permBonuses .bonusList');
        for (const listItem of temp.getElementsByClassName('bonusListItem')) {
            tempBonuses[listItem.querySelector(".bonusSource").value] = listItem.querySelector(".bonusAmount").value;
        }
        console.log("permbonuses: " + JSON.stringify(permBonuses));
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
        console.log("tempBonuses_" + stat.id + " = " + tempBonuses);
        if (tempBonuses != null) {
            for (const [key, value] of Object.entries(tempBonuses)) {
                addStatBonus(key, value, temp);
            }
        } else {
            addStatBonus("", "", temp);
        }

        let permBonuses = JSON.parse(getThisStorage("permBonuses_" + stat.id));
        perm = stat.querySelector('.permBonuses .bonusList');
        console.log("permBonuses_" + stat.id + " = " + permBonuses);
        if (permBonuses != null) {
            for (const [key, value] of Object.entries(permBonuses)) {
                addStatBonus(key, value, perm);
            }
        } else {
            addStatBonus("", "", perm);
        }


    }
}
