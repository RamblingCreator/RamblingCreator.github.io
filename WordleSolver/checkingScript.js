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


/* document.querySelector("form").addEventListener("button", (event) => {
    var inputWord = new Array()
    var constructedExpression = "/^"
    inputs.forEach(element => {
        inputWord.add(element.value);
        if (element.value == "") {
            constructedExpression += "."
        } else {
            constructedExpression += "[" + element.value + "]";
        }
    });
    constructedExpression += "$/";
    var isMatch = new RegExp(constructedExpression);



    var validWords = new Array();
    for (let i = 0; i < allWords.length; i++) { */
/* for (let j = 0; j < wordLength; j++) {
    if (inputWord[j] == "") {
        continue;
    } else if (inputWord[j] !=) {

    }
} *//* 
if (isMatch.test(allWords[i])) {
    validWords.Add(allWords[i]);
}
}
console.log("valid words: " + validWords.length);
//output.value = allWords.toString();
event.preventDefault();
}); */

function filterWords() {
    var inputWord = new Array()
    var constructedExpression = "";//"/^"
    //inputs.forEach(element => {
    for (let i = 0; i < inputs.length; i++) {
        const element = inputs[i];

        //inputWord.Add(element.value);
        if (element.value == "") {
            constructedExpression += "."
        } else {
            constructedExpression += "[" + element.value + "]";
        }
        //});
    }
    //constructedExpression += "$/";
    var isMatch = new RegExp(constructedExpression);

    console.log("regex: "+isMatch);

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
    allWords = new Array()
}