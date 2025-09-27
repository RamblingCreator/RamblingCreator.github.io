var inputs = document.getElementsByClassName("letter");
var output = document.getElementsByClassName("wordList");
var allWords = new Array();

var wordLength = 5;
allWords = getAllWords();

console.log(allWords.length);
//console.log(text);
$(".search").on("click", function () {
    filterWords();
});


function filterWords() {
    var inputWord = new Array()
    var constructedExpression = "";//"/^"
    //inputs.forEach(element => {
    for (let i = 0; i < inputs.length; i++) {
        const thisLetter = inputs[i].value.toLowerCase();
        console.log(thisLetter);
        //inputWord.Add(element.value);
        if (thisLetter == "" || thisLetter == " ") {
            constructedExpression += "."
        } else {
            constructedExpression += "[" + thisLetter + "]";
        }
        //});
    }
    //constructedExpression += "$/";
    var isMatch = new RegExp(constructedExpression, "i");

    console.log("regex: " + isMatch);

    var validWords = new Array();

    for (let i = 0; i < allWords.length; i++) {
        if (isMatch.test(allWords[i])) {
            //validWords.Add(allWords[i]);
            validWords.push(allWords[i]);

        }
    }
    console.log("valid words: " + validWords.length);
    //output.validWords = allWords.toString();

    document.getElementById('outputList').innerHTML = validWords.map((word) => {
        return `<li>${word}</li>`;
    }).join('');
}

function setAllWords() {
    allWords = new Array();
}

/* inputs.forEach(input => {
    input.addEventListener("keyup", () => {
        if (input.value.length === input.maxLength && parseInt(input.id) < inputLists.length) {

            document.getElementById(parseInt(input.id) + 1).focus();
            console.log("Advancing cursor");
        }
    })
}) */

for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];

    input.addEventListener("keyup", handleInput);
    /* input.addEventListener("keyup", (event) => {
        //console.log("letter entered");
        console.log("key: "+KeyboardEvent.key);
        //console.log(input.value.length+" =? "+input.maxLength);
       // console.log("id int: "+parseInt(input.id));
        if (input.value.length === input.maxLength && parseInt(input.id) < inputs.length) {

            document.getElementById(parseInt(input.id) + 1).focus();
            console.log("Advancing cursor");
        }
    }) */

}

function handleInput(e) {
    console.log("key: " + e.code);
    console.log("this: " + this);
    document.getElementById("debug").innerHTML +="<li>key: " + e.code+"</li>";
    const input = this;
    //console.log(input.value.length+" =? "+input.maxLength);
    // console.log("id int: "+parseInt(input.id));


    if (e.code == "Backspace"&& parseInt(input.id) > 0 && input.value.length ===0) {
        document.getElementById(parseInt(input.id) - 1).focus();
    } else if (e.code == "ArrowLeft"&& parseInt(input.id) > 0) {
        document.getElementById(parseInt(input.id) - 1).focus();
    } else if (e.code == "ArrowRight"&& parseInt(input.id) < inputs.length) {
        document.getElementById(parseInt(input.id) + 1).focus();
    } else if (input.value.length === input.maxLength && parseInt(input.id) < inputs.length) {

        document.getElementById(parseInt(input.id) + 1).focus();
        console.log("Advancing cursor");
    }
}