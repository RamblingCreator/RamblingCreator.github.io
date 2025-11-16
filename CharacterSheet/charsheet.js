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
    // $("input:text").focus(function () { $(this).select(); });
    // const inputs = form.elements;

    // Iterate over the form controls
    /* for (const input of inputs) {
        if (input.nodeName === "INPUT" && input.type === "text") {
            // Update text input
            console.log("class: " + input.className + ", value: " + input.value);
            // input.value = input.value.toLocaleUpperCase();
        }
    } */
    loadForm();

    CYPHERS.forEach(element => {
        // console.log(element);
        $(getAddCypherHtml(element)).appendTo("#allCyphers");
    });

    var elements = document.getElementsByClassName("addCypher");
    Array.from(elements).forEach(function (element) {
        // console.log("adding listener to: ", element.value);
        element.addEventListener('click', addThisCypher);
    });

    document.querySelector('input[name="source"]:checked').value = "type";



});

$("#save").on("click", function () {
    saveForm();
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
        $("#popupMask").css('display', 'none');
    }
});
$("#newAbility").on("click", function () {
    $("#abilityWindow").css('display', 'block');
    $("#popupMask").css('display', 'flex');
    filterAbilities();
});
$("#newCypher").on("click", function () {
    $("#cypherWindow").css('display', 'block');
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

    console.log("sourceSelector = " + sourceSelector.value);

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
    abilities = allAbilities;
    let tierSelector = document.getElementById("tierSelection");

    /*  for (const ability of allAbilities) {
 
     } */

    allAbilities.forEach(ability => {
        if (tierSelector.children[ability.tier].checked) {
            abilities.push(ability);
        }
    });

    document.getElementById("filteredAbilities").innerHTML = "";

    abilities.forEach(element => {
        $(getAddAbilityHtml(element)).appendTo("#filteredAbilities");
    });
    /* $(".addAbility").on("click", function () {
        console.log("adding " + $(this).name);
    }); */
    var elements = document.getElementsByClassName("addAbility");
    Array.from(elements).forEach(function (element) {
        // console.log("adding listener to: ", element.value);
        element.addEventListener('click', addThisAbility);
    });
}




var addThisAbility = function () {
    var attribute = this.value; //getAttribute("data-myattribute");
    console.log("looking for " + this.name + "_ABILITIES");
    typeAbilities = window[this.name + "_ABILITIES"];
    console.log("");
    let html = getAbilityHtml(typeAbilities.find(item => {
        return item.id == attribute
    }));

    addNewAbility(typeAbilities.find(item => {
        return item.id == attribute
    }));


    /* 
    
        $(html).appendTo("#abilitiesList");
    
        console.log(attribute);
    
        let tbox = abilities.lastChild.getElementsByClassName("abilityDescription")[0];
        console.log("tbox = " + tbox);
        tbox.style.height = tbox.scrollHeight + "px";
        tbox.style.overflowY = "hidden";
        $(tbox).on("input", function () {
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
        }); */
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
    for (const element of thisAbility.getElementsByTagName("INPUT")) {
        resizeInput(element);
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
    /*$(tbox).on("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    }); */
    for (const element of thisCypher.getElementsByTagName("INPUT")) {
        resizeInput(element);
    }
    let thisButton = thisCypher.getElementsByClassName("removeCypher")[0];
    thisButton.addEventListener('click', function () { confirmDelete(thisButton, "cypher") }, false);
    /* $(".removeCypher").on("click", function () {
        thisButton = this;
        confirmDelete(this, "cypher");
    }); */
    /*  $(".removeAbility").on("click", function () {
        thisButton = this;
        confirmDelete(this, "cypher");
    }); */
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
        // yesCallback();
        console.log("removing");
        if (type == "cypher") {
            // console.log("removing parent parent parent = " + thisButton.parentNode.parentNode.parentNode.getAttribute("cypherName"));
            thisButton.parentNode.parentNode.parentNode.remove();
        } else if (type == "ability") {
            // console.log("removing parent parent parent = " + thisButton.parentNode.parentNode.parentNode.getAttribute("abilityName"));
            thisButton.parentNode.parentNode.parentNode.remove();

        }
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


function resizeInput(element) {
    // console.log("resizing " + element);
    $(element).attr('size', $(element).val().length);
}


function getAbilityHtml(Json) {
    return `<div class="ability" abilityName=${Json.name} >
            <div class="abilityHeader">
              <div class="abilityNameBlock">
                <label class="toggle">
                    <input type="checkbox" class="isSupernatural" name="btnToggle" />
                    <span class="supernaturalIcon">&#10700;</span>
                  </label>
                <input class="abilityName" value="${Json.name}">
              </div>
              <div class="abilityDetails">
                <label for="abilityContext" class="abilityField"> <input class="abilityContext" value="${Json.context}"></label>
                <label for="abilityCost" class="abilityField">Cost: <input class="abilityCost" value="${Json.cost}"></label>
                <label for="abilityTier" class="abilityField">Tier: <input class="abilityTier" value="${Json.tier}"></label>
                <button type="button" class="removeAbility confirm" value="${Json.id}">X</button>
              </div>
            </div>
            <textarea class="abilityDescription resize" rows="2" cols="10">${Json.description}</textarea>
          </div>`
}

function getAddAbilityHtml(Json) {
    return `<div class="newAbility">
          <div class="abilityHeader">
            <div class="abilityName">${Json.name}</div>
            <div class="isSupernatural"></div>
            <label for="abilityContext" class="abilityField">
              <div class="abilityContext">${Json.context}</div>
            </label>
            <label for="abilityCost" class="abilityField">Cost:  <div class="abilityCost">${Json.cost}</div></label>
            <label for="abilityTier" class="abilityField">Tier:  <div class="abilityTier">${Json.tier}</div></label>
          </div>
          <p class="abilityDescription" rows="1" cols="10">${Json.description}</p>
          <button type="button" class="addAbility" name="${Json.type}" value="${Json.id}">Add</button>
        </div>`
}

function getCypherHtml(Json) {
    return `<div class="cypher" cypherName=${Json.name}>
            <div class="cypherHeader">
              <input class="cypherName" value="${Json.name}">
              <div class="cypherDetails">
                <label for="cypherUse" class="cypherField"> <input class="cypherUse" value="${Json.use}"></label>
                <label for="cypherLevel" class="cypherField">Level: <input class="cypherLevel" value="${Json.level}"></label>
                <label for="cypherRange" class="cypherField"> <input class="cypherRange" value="${Json.range}"></label>
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
            <label for="cypherRange" class="cypherField"><div class="cypherRange">${Json.range}</div></label>
            <label for="cypherLevel" class="cypherField">Level: <div class="cypherLevel">${Json.level}</div></label>
            <label for="cypherUse" class="cypherField"><div class="cypherUse">${Json.use}</div></label>
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
              <input class="skillName" value=${Json.name}></input>
              <input class="skillPool" value=${Json.pool}></input>
              <select class="skillLevel">
                <option value="inability">Inability</option>
                <option value="trained">Trained</option>
                <option value="specialized">Specialized</option>
              </select>
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
            </div>`;
}

function addNewAttack(attackJson) {
    $(getAttackHtml(attackJson)).appendTo("#attacksList");
}
function getAttackHtml(Json) {
    return `<div class="attack">
              <input class="attackName" value=${Json.name}></input>
              <input class="attackDifficulty" value=${Json.difficulty}></input>
              <input class="attackDamage" value=${Json.damage}></input>
            </div>`;
}
function getEmptyAttackHtml() {
    return `<div class="attack">
              <input class="attackName"></input>
              <input class="attackDifficulty"></input>
              <input class="attackDamage"></input>
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



    updateDamage();
    updateInfo();


}



/* // function saveForm(form) {
let f = JSON.stringify(form);
window.localStorage.setItem('form', f);
// } */