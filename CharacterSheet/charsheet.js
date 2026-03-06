// import { INVESTIGATOR_ABILITIES } from "./abilities";

// const { INVESTIGATOR_ABILITIES } = require('./abilities.js')
/* if (typeof(Storage) !== "undefined") {
  // Store
  localStorage.setItem("lastname", "Smith");
  localStorage.setItem("bgcolor", "yellow");
  // Retrieve
  x.innerHTML = localStorage.getItem("lastname");
  x.style.backgroundColor = localStorage.getItem("bgcolor");
} else {
  x.innerHTML = "Sorry, no Web storage support!";
} */

const forms = document.querySelectorAll('form');
const form = forms[0];
const inputs = forms[0].elements;

var test = 0;

const type = document.getElementById('type');
const descriptor = document.getElementById('descriptor');
const focus = document.getElementById('focus');
const abilities = document.getElementById('abilitiesList');
const cyphers = document.getElementById('cyphersList');
const skills = document.getElementById('skillsList');
const attacks = document.getElementById('attacksList');

const abilityWindow = document.getElementById("abilityWindow");

$(document).ready(function () {
    loadForm();

    CYPHERS.forEach(element => {
        $(getAddCypherHtml(element)).appendTo("#allCyphers");
    });

    var elements = document.getElementsByClassName("addCypher");
    Array.from(elements).forEach(function (element) {
        element.addEventListener('click', addThisCypher);
    });

    document.querySelector('input[name="source"]:checked').value = "type";

    let tierFilters = document.querySelectorAll('#tierSelection input[type="checkbox"]')
    /* for (let i = 0; i < tier.value; i++) {
        tierFilters[i].checked = true;
    } */
    tierFilters[5].checked = true;
});

$("#save").on("click", function () {
    saveForm();
});
$("#export").on("click", function () {
    exportSave();
});
$("form :input").on("input", function () {
    saveForm();
    updateInfo();
});
$(".closeSelector").on("click", function () {
    $("#abilityWindow").css('display', 'none');
    $("#cypherWindow").css('display', 'none');
    $("#popupMask").css('display', 'none');
});
$(document).keydown(function (e) {
    // ESCAPE key pressed
    if (e.keyCode == 27) {
        $("#abilityWindow").css('display', 'none');
        $("#cypherWindow").css('display', 'none');
        $("#confirmWindow").css('display', 'none');
        $("#quickstartWindow").css('display', 'none');
        $("#popupMask").css('display', 'none');
    }
});
$("#newAbility").on("click", function () {
    $("#abilityWindow").css('display', 'flex');
    $("#popupMask").css('display', 'flex');
    filterAbilities();
});
$("#newCypher").on("click", function () {
    $("#cypherWindow").css('display', 'flex');
    $("#popupMask").css('display', 'flex');
});
$("#addSkill").on("click", function () {
    $(getEmptySkillHtml()).appendTo("#skillsList");
    // console.log("adding empty skill");
});
$("#addAttack").on("click", function () {
    $(getEmptyAttackHtml()).appendTo("#attacksList");
    // console.log("adding empty skill");
});
$("#spendXP").on("click", function () {
    addNewLogItem();
});


$("#quickstart").on("click", function () {
    $("#quickstartWindow").css('display', 'block');
    $("#popupMask").css('display', 'flex');
});



$("#quickstartAutofill").on("click", function () {
    autofill()
    $("#quickstartWindow").css('display', 'none');
    $("#popupMask").css('display', 'none');
});


function autofill() {
    let quickstartForm = document.getElementById("quickstartWindow");
}

$(".reorderList").sortable({
    handle: ".dragHandle",
    snap: true,
    containment: "parent",
    snapMode: "outer",
    // helper: "clone",
    placeholder: "sortable-placeholder",
    forcePlaceholderSize: true,
    // forceHelperSize: true
})


function addNewLogItem() {
    // let selectedOption = $()
    let html = `<div class="logItem reorderItem">
              <div class="logOption"></div>
              <select class="logOption" value=>
                <option value="increaseCapabilities">Increase Capabilities</option>
                <option value="moveTowardPerfection">Move Toward Perfection</option>
                <option value="extraEffort">Extra Effort</option>
                <option value="skillTraining">Skill Training</option>
                <option value="otherOptions">Other Options</option>
              </select>
              <div class="logDescription"></div>
              <div class="dragHandle">≣</div>
            </div>`
    $(html).appendTo("#purchaseLog");
    let thisItem = document.getElementById("purchaseLog").lastChild;
    /* $(thisItem).draggable({
        handle: ".dragHandle",
        snap: true,
        containment: "parent",
        snapMode: "outer",
        drag: function (event, ui) {
            ui.position.left = Math.min(100, ui.position.left);
        }
    }); */
}



function confirm(yesCallback, noCallback) {
    console.log("confirming...?");
    $("#confirmWindow").css('display', 'grid');
    $("#popupMask").css('display', 'flex');

    $('#confirmYes').click(function () {
        console.log("confirmed");
        yesCallback();
        $("#confirmWindow").css('display', 'none');
        $("#popupMask").css('display', 'none');
    });
    $('#confirmNo').click(function () {
        console.log("canceled");
        noCallback();
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

/* $(".confirm").on("click", function () {
    confirm(
        function () { //yes
            // Do something
        },
        function () { //no
            // Do something else
        }
    );
    // console.log("adding empty skill");
}); */

/* $("textarea").on("input", function () {
    tx = $(this);
    tx.height(tx.prop('scrollHeight'));
}); */

$("textarea.resize").each(function () {
    this.style.height = this.scrollHeight + "px";
    this.style.overflowY = "hidden";
}).on("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
});


$("#save").on("click", function () {
    saveForm();
});
$("#filterAbilities").on("click", function () {
    filterAbilities();
});

$("#damage").on("input", function () {
    updateDamage();
});
$("#recovery").on("input", function () {
    updateRecovery();
});


function updateInfo() {
    document.getElementById("recoveryAmount").innerHTML = "1d6+" + tier.value;
    // updateDamage();
}

function updateDamage() {
    let damage = document.getElementById("damage");
    let text = "";
    if (damage.value == 0) {
        text = "HALE"
    } else if (damage.value == 1) {
        text = `HURT (only available for some characters)`
    } else if (damage.value == 2) {
        text = `IMPAIRED<br>
• +1 Effort per level<br>
• Ignore minor and major effect results on rolls<br>
• Combat roll of 17-20 deals only +1 damage`
    } else if (damage.value == 3) {
        text = `DEBILITATED<br>
• Can move only an immediate distance<br>
• Cannot move if Speed Pool is 0`
    } else if (damage.value == 4) {
        text = "DEAD"
    }
    document.getElementById("damageText").innerHTML = text;

}

/* function updateRecovery() {
"1 action"
"10 min"
"1 hour"
"10 hours"
} */

function updateRecovery() {
    let recovery = document.getElementById("recovery");
    let text = "";
    if (recovery.value == 0) {
        text = "1 action";
    } else if (recovery.value == 1) {
        text = "10 min";
    } else if (recovery.value == 2) {
        text = "1 hour";
    } else if (recovery.value == 3) {
        text = "10 hours";
    }
    // document.getElementById("recoveryText").innerHTML = text;

}


function filterAbilities() {
    let allAbilities = ["TEST", "test2"];
    let sourceSelector = document.querySelector('input[name="source"]:checked');


    if (sourceSelector == null) {
        return;
    } else if (sourceSelector.value == "type") {
        allAbilities = window[type.value + "_ABILITIES"];
        console.log("allAbilities = " + type.value + "_ABILITIES");
    } else if (sourceSelector.value == "focus") {
        allAbilities = window[focus.value + "_ABILITIES"];
    } else {
        return;
    }

    if (allAbilities == null) {
        return;
    }
    let abilities = [];
    // abilities = allAbilities;
    // let tierSelector = document.getElementById("tierSelection");
    console.log("abilities: " + abilities.length);

    let tierFilters = document.querySelectorAll('#tierSelection input[type="checkbox"]')
    useTier = false;
    for (let i = 0; i < tierFilters.length; i++) {
        if (tierFilters[i].checked) {
            useTier = true;
        }
        // console.log("tierselector " + i + " is " + tierFilters[i].checked);
    }

    if (useTier) {
        allAbilities.forEach(ability => {
            if (tierFilters[ability.tier - 1].checked) {
                abilities.push(ability);
                // console.log("tier " + ability.tier + " is checked? " + tierFilters[ability.tier - 1].checked);
            }
        });
    }
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
    typeAbilities = window[this.name + "_ABILITIES"];
    addNewAbility(typeAbilities.find(item => {
        return item.id == attribute
    }));
};

var addThisCypher = function () {
    var attribute = this.value; //getAttribute("data-myattribute");
    /* console.log("looking for " + this.name + "_ABILITIES");
    typeAbilities = window[this.name + "_ABILITIES"];
 */
    let html = getCypherHtml(CYPHERS.find(item => {
        return item.id == attribute
    }));

    addNewCypher(CYPHERS.find(item => {
        return item.id == attribute
    }));


};

function addNewAbility(abilityJson) {
    abilityJson.cost = abilityJson.cost.replace(/and/i, "+").replace(/intellect points|intellect point/i, "Intellect");
    abilityJson.cost = abilityJson.cost.replace(/speed points|speed point/i, "Speed");
    abilityJson.cost = abilityJson.cost.replace(/might points|might point/i, "Might");

    html = getAbilityHtml(abilityJson);
    $(html).appendTo("#abilitiesList");
    let thisAbility = abilities.lastChild;
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
    thisAbility.getElementsByClassName("isSupernatural")[0].checked = abilityJson.supernatural;


    let thisButton = thisAbility.getElementsByClassName("removeAbility")[0];
    thisButton.addEventListener('click', function () { confirmDelete(thisButton, "ability") }, false);

    /* $(".removeAbility").on("click", function () {
        thisButton = this;
        confirmDelete(this, "ability");
    }); */
}

function addNewCypher(cypherJson) {
    html = getCypherHtml(cypherJson);
    $(html).appendTo("#cyphersList");
    let thisCypher = cyphers.lastChild;
    let tbox = thisCypher.getElementsByClassName("cypherDescription")[0];
    tbox.style.height = tbox.scrollHeight + "px";
    tbox.style.overflowY = "hidden";
    // for (const element of thisCypher.getElementsByTagName("INPUT")) {
    for (const element of thisCypher.querySelectorAll("input.resize")) {
        // resizeInput(element);
        adjustWidthOfInput(element);
    }
    let thisButton = thisCypher.getElementsByClassName("removeCypher")[0];
    thisButton.addEventListener('click', function () { confirmDelete(thisButton, "cypher") }, false);
}
function resizeInput(element) {
    // console.log("resizing " + element);
    $(element).attr('size', $(element).val().length);
    // $(element).css('width', $(element).val().length+"em");
    // element.style.width = element.value.length + "em"
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

function adjustWidthOfInput(inputEl) {
    inputEl.style.width = getWidthOfInput(inputEl) + "px";
}



function deleteCypher(button) {
    console.log("this = " + this.className);
    console.log("parent = " + this.parentNode.className);
    console.log("parent parent= " + this.parentNode.parentNode.className);
    console.log("parent parent parent = " + this.parentNode.parentNode.parentNode.className);
}

function confirmDelete(thisButton, type) {
    console.log("confirming...?");
    $("#confirmWindow").css('display', 'grid');
    $("#popupMask").css('display', 'flex');

    $('#confirmYes').click(function () {
        console.log("confirmed");
        console.log("removing");
        if (type == "cypher") {
            thisButton.parentNode.parentNode.parentNode.remove();
        } else if (type == "ability") {
            thisButton.parentNode.parentNode.parentNode.remove();

        }
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



function getAbilityHtml(Json) {
    return `<div class="ability" abilityName=${Json.name} >
            <div class="abilityHeader">
              <div class="abilityNameBlock">
                <label class="toggle">
                    <input type="checkbox" class="isSupernatural" name="btnToggle" />
                    <span class="supernaturalIcon">&#10700;</span>
                  </label>
                <input class="abilityName resize" value="${Json.name}">
              </div>
              <div class="abilityDetails">
                <label class="abilityField"> <input class="abilityContext resize" value="${Json.context}"></label>
                <label class="abilityField">Cost: <input class="abilityCost resize" value="${Json.cost}"></label>
                <label class="abilityField">Tier: <input class="abilityTier" value="${Json.tier}"></label>
                <button type="button" class="removeAbility confirm" value="${Json.id}">X</button>
              </div>
            </div>
            <textarea class="abilityDescription resize" rows="2" cols="10">${Json.description}</textarea>
          </div>`
}




function getAddAbilityHtml(Json) {
    console.log("original description: " + Json.description);
    let newDesc = Json.description.replaceAll(/\r\n|\r|\n/gi, "<br>"); //•
    console.log("new description: " + newDesc);
    let supernaturalIcon = "";
    if (Json.supernatural) {
        supernaturalIcon = '<div class="fixedSupernatural">&#10700;</div>';
    }
    return `<div class="newAbility">
          <div class="abilityHeader">
            <div class="abilityNameBlock">
                ${supernaturalIcon}
                <div class="abilityName">${Json.name}</div>
            </div>
            <label class="abilityField">
              <div class="abilityContext">${Json.context}</div>
            </label>
            <label class="abilityField">Cost:  <div class="abilityCost">${Json.cost}</div></label>
            <label class="abilityField">Tier:  <div class="abilityTier">${Json.tier}</div></label>
          </div>
          <p class="abilityDescription" rows="1" cols="10">${newDesc}</p>
          <button type="button" class="addAbility" name="${Json.type}" value="${Json.id}">Add</button>
        </div>`
}

function getCypherHtml(Json) {
    return `<div class="cypher" cypherName=${Json.name}>
            <div class="cypherHeader">
              <input class="cypherName resize"  value="${Json.name}">
              <div class="cypherDetails">
                <label class="cypherField resize"> <input class="cypherUse" value="${Json.use}"></label>
                <label class="cypherField">Level: <input class="cypherLevel" value="${Json.level}"></label>
                <label class="cypherField"> <input class="cypherRange" value="${Json.range}"></label>
                <button type="button" class="removeCypher confirm" value="${Json.id}">X</button>
              </div>
            </div>
            <textarea class="cypherDescription resize" rows="2" cols="10">${Json.description}</textarea>
          </div>`
}



function getAddCypherHtml(Json) {
    return `<div class="newCypher">
        <div class="cypherHeader">
          <div class="cypherName">${Json.name}</div>
          <div class="cypherDetails">
            <label class="cypherField"><div class="cypherRange">${Json.range}</div></label>
            <label class="cypherField">Level: <div class="cypherLevel">${Json.level}</div></label>
            <label class="cypherField"><div class="cypherUse">${Json.use}</div></label>
          </div>
        </div>
        <p class="cypherDescription">${Json.description}</p>
        <button type="button" class="addCypher" value="${Json.id}">Add</button>
      </div>`
}

function addNewSkill(skillJson) {
    $(getSkillHtml(skillJson)).appendTo("#skillsList");
    let thisSkill = skills.lastChild;
    thisSkill.getElementsByClassName("skillLevel")[0].value = skillJson.level
    /* thisSkill.getElementsByClassName(skillJson.level)[0].value = skillJson.level */
    /*thisSkill.getElementsByClassName("trained")[0].checked = skillJson.trained;
    thisSkill.getElementsByClassName("specialized")[0].checked = skillJson.specialized;
    thisSkill.getElementsByClassName("inability")[0].checked = skillJson.inability; */
}
function getSkillHtml(Json) {
    return `<div class="skill">
              <input class="skillName" value="${Json.name}"></input>
              <input class="skillPool" value="${Json.pool}"></input>
              <select class="skillLevel">
                <option value="inability">Inability</option>
                <option value="trained">Trained</option>
                <option value="specialized">Specialized</option>
              </select>
              <div class="dragHandle" draggable="false">≣</div>
            </div>`;
}
function getEmptySkillHtml() {
    return `<div class="skill">
              <input class="skillName"></input>
              <input class="skillPool"></input>
              <select class="skillLevel">
                <option value="inability">Inability</option>
                <option value="trained">Trained</option>
                <option value="specialized">Specialized</option>
              </select>
              <div class="dragHandle" draggable="false">≣</div>
            </div>`;
}

function addNewAttack(attackJson) {
    $(getAttackHtml(attackJson)).appendTo("#attacksList");
}
function getAttackHtml(Json) {
    return `<div class="attack">
              <input class="attackName" value="${Json.name}"></input>
              <input class="attackDifficulty" value="${Json.difficulty}"></input>
              <input class="attackDamage" value="${Json.damage}"></input>
              <div class="dragHandle" draggable="false">≣</div>
            </div>`;
}
function getEmptyAttackHtml() {
    return `<div class="attack">
              <input class="attackName"></input>
              <input class="attackDifficulty"></input>
              <input class="attackDamage"></input>
              <div class="dragHandle" draggable="false">≣</div>
            </div>`;
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
        thisJSON.tier = ability.getElementsByClassName("abilityTier")[0].value;
        thisJSON.cost = ability.getElementsByClassName("abilityCost")[0].value;
        thisJSON.context = ability.getElementsByClassName("abilityContext")[0].value;
        thisJSON.supernatural = ability.getElementsByClassName("isSupernatural")[0].checked;
        thisJSON.description = ability.getElementsByClassName("abilityDescription")[0].value;
        abilitiesList.push(thisJSON);
    }
    localStorage.setItem("abilitiesList", JSON.stringify(abilitiesList));

    let cyphersList = [];
    for (const cypher of cyphers.getElementsByClassName('cypher')) {
        let thisJSON = {}
        // thisJSON.id = ability.getElementsByClassName("abilityName")[0].value;
        thisJSON.name = cypher.getElementsByClassName("cypherName")[0].value;
        thisJSON.range = cypher.getElementsByClassName("cypherRange")[0].value;
        thisJSON.level = cypher.getElementsByClassName("cypherLevel")[0].value;
        thisJSON.use = cypher.getElementsByClassName("cypherUse")[0].value;
        thisJSON.description = cypher.getElementsByClassName("cypherDescription")[0].value;
        cyphersList.push(thisJSON);
    }
    localStorage.setItem("cyphersList", JSON.stringify(cyphersList));


    let skillsList = [];
    for (const skill of skills.getElementsByClassName('skill')) {
        let thisJSON = {}
        thisJSON.name = skill.getElementsByClassName("skillName")[0].value;
        thisJSON.pool = skill.getElementsByClassName("skillPool")[0].value;
        thisJSON.level = skill.getElementsByClassName("skillLevel")[0].value;/* 
        thisJSON.trained = skill.getElementsByClassName("trained")[0].checked;
        thisJSON.specialized = skill.getElementsByClassName("specialized")[0].checked;
        thisJSON.inability = skill.getElementsByClassName("inability")[0].checked; */
        skillsList.push(thisJSON);
    }
    localStorage.setItem("skillsList", JSON.stringify(skillsList));

    let attacksList = [];
    for (const attack of attacks.getElementsByClassName('attack')) {
        let thisJSON = {}
        thisJSON.name = attack.getElementsByClassName("attackName")[0].value;
        thisJSON.difficulty = attack.getElementsByClassName("attackDifficulty")[0].value;
        thisJSON.damage = attack.getElementsByClassName("attackDamage")[0].value;
        attacksList.push(thisJSON);
    }
    localStorage.setItem("attacksList", JSON.stringify(attacksList));
    localStorage.setItem("supernaturalStress", document.querySelectorAll('#supernaturalStress > input[type=checkbox]:checked').length);

    let logItemsList = [];
    for (const logItem of document.getElementById("purchaseLog").children) {
        let thisJSON = {}
        if (logItem.classList.contains("logHeader")) {
            thisJSON.isHeader = true;
        } else {
            thisJSON.isHeader = false;
            thisJSON.source = logItem.getElementsByClassName("logSource")[0].value;
        }
        logItemsList.push(thisJSON);
    }
    localStorage.setItem("logItemsList", JSON.stringify(logItemsList));
}

var tierCount = 0;

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
                input.value = localStorage.getItem(input.id);
            }
        } else if (input.nodeName == "SELECT") {
            let selectedOption = localStorage.getItem(input.name);
            input.value = selectedOption;
        } else if (input.nodeName == "TEXTAREA") {
            input.value = localStorage.getItem(input.id);

        }
        // console.log("setting " + input.nodeName + " (" + input.type + ") " + input.id + " to " + input.value);
    }

    let abilitiesList = JSON.parse(localStorage.getItem("abilitiesList"));
    if (abilitiesList != null) {
        abilitiesList.forEach(thisAbility => {
            addNewAbility(thisAbility);
        });
    }
    let cyphersList = JSON.parse(localStorage.getItem("cyphersList"));
    if (cyphersList != null) {
        cyphersList.forEach(thisCypher => {
            addNewCypher(thisCypher);
        });
    }

    let skillsList = JSON.parse(localStorage.getItem("skillsList"));
    if (skillsList != null) {
        skillsList.forEach(thisSkill => {
            addNewSkill(thisSkill);
        });
    }
    let attacksList = JSON.parse(localStorage.getItem("attacksList"));
    if (attacksList != null) {
        attacksList.forEach(thisAttack => {
            addNewAttack(thisAttack);
        });
    }

    superStressBoxes = document.querySelectorAll('#supernaturalStress > input[type=checkbox]');
    for (let i = 0; i < localStorage.getItem("supernaturalStress"); i++) {
        superStressBoxes[i].checked = true;
    }

    let logItemsList = JSON.parse(localStorage.getItem("logItemsList"));
    if (logItemsList != null) {
        logItemsList.forEach(thislogItem => {
            addLogItem(thislogItem);
            // input.value = selectedOption;
        });
    }

    updateDamage();
    updateInfo();


}


function addLogItem(Json) {
    let html = ``;
    if (Json.isHeader) {
        html = `<div class="logHeader reorderItem">
              <span class="logDescription">Tier ${tierCount}</span>
              <div class="dragHandle" draggable="false">≣</div>
            </div>`
        tierCount++;
    } else {
        html = `<div class="logItem reorderItem">
              <input class="logSource" value="${Json.source}"></input>              
              <input class="logDescription" value="${Json.description}"></input>
              <div class="dragHandle" draggable="false">≣</div>
            </div>`
    }

    $(html).appendTo("#purchaseLog");

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
/* function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
} */


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
    download(JSON.stringify(localStorage), "MAGRPG save (" + document.getElementById('name').value + ")", ".txt")
}

function importSave(fileData) {
    if (document.getElementById('upload').value == null) {
        console.log("please put a file");
    } else {

        let newData = JSON.parse(fileData)
        console.log(newData);

        /* let fl_files = evt.target.files; // JS FileList object

        // use the 1st file from the list
        let fl_file = fl_files[0];

        let reader = new FileReader(); // built in API
        let display_file = (e) => { // set the contents of the <textarea>
            console.info('. . got: ', e.target.result.length, e);
            document.getElementById('upload_file').innerHTML = e.target.result;
        };

        let on_reader_load = (fl) => {
            console.info('. file reader load', fl);
            document.getElementById('upload_file').innerHTML = e.target.result;
            importSave();
        };

        // Closure to capture the file information.
        reader.onload = on_reader_load(fl_file);

        // Read the file as text.
        reader.readAsText(fl_file); */
    }
}

function handle_file_select(evt) {
    console.info("[Event] file chooser");

    let fl_files = evt.target.files; // JS FileList object

    // use the 1st file from the list
    let fl_file = fl_files[0];

    let reader = new FileReader(); // built in API
    // reader.addEventListener("loadend", handleEvent);

    let display_file = (e) => { // set the contents of the <textarea>
        console.info('. . got: ', e.target.result.length, e);
        document.getElementById('upload_file').innerHTML = e.target.result;
    };

    let on_reader_load = (fl) => {
        console.info('. file reader load', fl);
        document.getElementById('upload_file').innerHTML = f1.target.result;
        importSave(f1.target.result);
        // return display_file; // a function
    };

    // Closure to capture the file information.
    reader.onload = on_reader_load(fl_file);

    // Read the file as text.
    reader.readAsText(fl_file);

}

// add a function to call when the <input type=file> status changes, but don't "submit" the form
document.getElementById('upload').addEventListener('change', handle_file_select, false);
/* // function saveForm(form) {
let f = JSON.stringify(form);
window.localStorage.setItem('form', f);
// } */