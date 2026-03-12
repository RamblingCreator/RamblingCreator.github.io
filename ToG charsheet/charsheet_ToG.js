

/* window.addEventListener('load', function () {
  calculateStats()
}) */



const race = document.getElementById('race');
const noble = document.getElementById('noble');
const position = document.getElementById('position');

let stats = document.getElementById("stats");
const abilities = document.getElementById('abilitiesList');
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
    $("#sourceSelection").on("input", function () {
        filterAbilities();
    });
    /* $(".addBonus").on("click", function () {
        addStatBonus();
    }); */

    var elements = document.getElementsByClassName("addBonus");
    Array.from(elements).forEach(function (element) {
        element.addEventListener('click', addNewStatBonus);
    });

    // calculateStats();
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


    var elements = document.getElementsByClassName("addAbility");
    Array.from(elements).forEach(function (element) {
        element.addEventListener('click', addThisAbility);
    });
}

var addThisAbility = function () {
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
        adjustWidthOfInput(element);
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
          <button type="button" class="addAbility" name="${Json.type}" value="${Json.id}">Add</button>
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
            tempTotal += parseInt(listItem.querySelector(".bonusAmount").value);
            console.log("adding " + listItem.querySelector(".bonusAmount").value + "(" + listItem.querySelector(".bonusSource").value + ") to temp total: " + tempTotal);
        }

        stat.querySelector('span.tempBonuses').innerHTML = tempTotal;

        console.log("temp span: " + stat.querySelector('span.tempBonuses'));

        let permTotal = 0;
        perm = stat.querySelector('.permBonuses .bonusList');
        for (const listItem of perm.getElementsByClassName('bonusListItem')) {
            permTotal += parseInt(listItem.querySelector(".bonusAmount").value);
            console.log("adding " + listItem.querySelector(".bonusAmount").value + "(" + listItem.querySelector(".bonusSource").value + ") to temp total: " + tempTotal);
        }

        stat.querySelector('span.permBonuses').innerHTML = permTotal;


        base = stat.querySelector('input.baseStat');
        current = stat.querySelector('input.currentStat');
        edge = stat.querySelector('input.edge');
        current.value = (parseInt(base.value) + parseInt(permTotal) + parseInt(tempTotal));
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

function deleteStatBonus() {

}


function saveForm() {
    localStorage.clear();
    inputsToSave = document.getElementsByClassName("save");
    for (const input of inputsToSave) {
        // console.log("saving " + input.nodeName);
        if (input.nodeName === "INPUT" /* && input.type === "text" */) {
            if (input.type === "checkbox") {
                localStorage.setItem(input.id, input.checked);
            } else {
                localStorage.setItem(input.id, input.value);
            }
        } else if (input.nodeName == "SELECT") {
            if (input.value != "NONE") {
                localStorage.setItem(input.id, input.value);
            }
        } else if (input.nodeName == "TEXTAREA") {
            if (input.value != "NONE") {
                localStorage.setItem(input.id, input.value);
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
        thisJSON.type = ability.getElementsByClassName("abilityType")[0].checked;
        abilitiesList.push(thisJSON);
    }
    localStorage.setItem("abilitiesList", JSON.stringify(abilitiesList));
    // console.log(stats);
    for (const stat of stats.children) {
        let tempBonuses = {}
        temp = stat.querySelector('.tempBonuses .bonusList');
        console.log(stat);
        console.log(stat.querySelector('.tempBonuses .bonusList'));
        for (const listItem of temp.getElementsByClassName('bonusListItem')) {
            tempBonuses[listItem.querySelector(".bonusSource").value] = listItem.querySelector(".bonusAmount").value;
        }


        localStorage.setItem("tempBonuses_" + stat.id, JSON.stringify(tempBonuses));

        let permBonuses = {}
        permanent = stat.querySelector('.permBonuses .bonusList');
        for (const listItem of temp.getElementsByClassName('bonusListItem')) {
            tempBonuses[listItem.querySelector(".bonusSource").value] = listItem.querySelector(".bonusAmount").value;
        }
        console.log("permbonuses: " + JSON.stringify(permBonuses));
        localStorage.setItem("permBonuses_" + stat.id, JSON.stringify(permBonuses));
        // console.log("temp: "+ tempBonuses+", perm: "+permBonuses);
        // console.log("temp: " + JSON.stringify(tempBonuses) + ", perm: " + JSON.stringify(permBonuses));

    }
}

function loadForm() {
    inputsToLoad = document.getElementsByClassName("save");
    for (const input of inputsToLoad) {
        if (input.nodeName === "INPUT" /* && input.type === "text" */) {
            if (input.type === "checkbox") {
                if (localStorage.getItem(input.id) === "true") {
                    input.checked = localStorage.getItem(input.id);
                    console.log(input.id + " saved as 'true' ");
                }
                console.log("setting " + input.id + ".checked to " + localStorage.getItem(input.id));
                console.log(input.id + ".checked = " + input.checked);
            } else {
                // console.log("");
                if (localStorage.getItem(input.id) == null) {
                    input.value = -1;
                } if (localStorage.getItem(input.id) === "") {
                    input.value = 0;
                    console.log(input.nodeName + " is empty ");
                } else {
                    input.value = localStorage.getItem(input.id);

                }
            }
        } else if (input.nodeName == "SELECT") {
            let selectedOption = localStorage.getItem(input.name);
            input.value = selectedOption;
        } else if (input.nodeName == "TEXTAREA") {
            input.value = localStorage.getItem(input.id);

        }
        console.log("setting " + input.nodeName + " (" + input.type + ") " + input.id + " to [" + input.value + "]");
    }

    let abilitiesList = JSON.parse(localStorage.getItem("abilitiesList"));
    if (abilitiesList != null) {
        abilitiesList.forEach(thisAbility => {
            addNewAbility(thisAbility);
        });
    }

    for (const stat of stats.children) {
        let tempBonuses = JSON.parse(localStorage.getItem("tempBonuses_" + stat.id));
        temp = stat.querySelector('.tempBonuses .bonusList');
        console.log("tempBonuses_" + stat.id + " = " + tempBonuses);
        for (const [key, value] of Object.entries(tempBonuses)) {
            addStatBonus(key, value, temp);
        }
        /* for (const listItem of tempBonuses) {
            console.log(listItem);
        }

        let permBonuses = localStorage.getItem("tempBonuses_" + stat.id);
        permanent = stat.querySelector('input.permBonuses .bonusList');
        for (const listItem of temp.getElementsByClassName('bonusListItem')) {

        } */

    }
}
