// Write a function named logType that expects a single argument and logs a different string depending on the type/value of the argument that is passed to it. The string it logs should be one of the following:
// "undefined!"
// "null!"
// "number!"
// "not a number!"
// "string!"
// "boolean!"
// "function!"
// "object!"
// "array!"
// "I have no idea!"

function logType(i){
    if (i == undefined) {
        console.log('undefined!');
    } else if (i == 'null') {
        console.log('null!');
    }  else if (typeof i == 'number') {
        console.log('number!');
    }else if (typeof i == 'string') {
        console.log('string!');
    } else if (typeof i === 'function') {
        console.log('function!');
    } else if (typeof i == 'array') {
        console.log('array!');
    } else if (typeof i == 'object') {
        console.log('object!');
    }   else if ( i == true || i == false) {
        console.log('boolean!');
    } else if (typeof i !== 'number') {
        console.log('not a number!');
    } else {
        console.log('I have no idea!');
    }
}


// Copy the following object into your code:
// var a = {
//     Berlin: 'Germany',
//     Paris: 'France',
//     'New York': 'USA'
// };
// Then create a new empty object b and use a for..in loop to iterate over all of a's properties. Give b properties whose names are the values from a and whose values are the property names from a. The result should be an object that looks like this:
//
// {
//     Germany: 'Berlin',
//     France: 'Paris',
//     USA: 'New York'
// }

var a = {
    Berlin: 'Germany',
    Paris: 'France',
    'New York': 'USA'
};


var b = {};

for (var p in a) {
    var value = a[p];
    b[value] = p;
}

console.log(b);


// Write a while or for loop that counts down from 10 to 1, logging each number to the console.

var i = 10;
while (i > 0) {
    console.log(i);
    i--;
}


// Write a function that takes any number of numbers as parameters and returns the sum of those numbers.

function sum() {
    var i = 0;
    for (var j = 0; j < arguments.length; j++) {
        i += arguments[j];
    }

    return i;
}


// Write a function that takes another function as a parameter. It should wait 1.5 seconds and then run the function that was passed in.

function waitThenRun(i) {
    setTimeout (i, 1500);
}


// Write a function that expects a number as a parameter. If the value that is passed in is less than 0, equal to 0, or not a number, the function should return the string 'ERROR'. If the number that is passed in is greater than or equal to 1000000 it should simply return the number. Otherwise it should multiply the number by 10 however many times it takes to get a number that is greater than or equal to 1000000 and return that.

function num(i) {
    if (i <= 0 || isNaN(i) === true) {
        console.log('ERROR!');
    } else if (i >= 1000000 ) {
        console.log(i);
    } else {
        while (i <= 1000000){
            //console.log(i); added this to see if program is working properly
            i *= 10;
        }
        return i;
    }
}


// Write a function that returns a function that can be called repeatedly and passed a number each time. Each time it is called it should return the sum of the number that is passed in and all other numbers that were passed in previous calls. That is, it should return the sum of all the numbers that were ever passed to it.


function getTotaler() {
    var total = 0;
    return function(arg){
        return (total += arg);
    };

}

var totaler = getTotaler();
totaler(1); //1
totaler(2); //3
totaler(5); //8


// Write a function called each that accepts either an object or an array as its first parameter and a callback as its second parameter.
// If the first parameter is an object, it should loop over the object's properties and call the callback for each one. The property value should be the first parameter passed to the callback and the property name should be the second.
// If the first parameter is an array, it should loop over the array's elements and call the callback for each one. The array element should be the first parameter passed to the callback and the index should be the second.

function each (i, fun) {
    if ( Array.isArray(i)) {
        for ( j = 0; j < i.length; j++) {
            fun (i[j], j);
        }
    } else if (typeof i === 'object') {
        for (var key in i) {
            fun (i[key], key);
        }
    }
}


// Write a function that takes an array as a parameter and returns a new array containing all of the items that are in the array that was passed in but in reverse order. Unlike the reverse method that all arrays have, this function should leave the original array unchanged.

function i(info) {
    var clone = info.slice();
    clone.reverse();
    return clone;
}


// Write a function called getLessThanZero that expects an array of numbers to be passed to it and returns a new array containing only those numbers from the array that was passed in that are less than zero.
//   getLessThanZero([1, 2, -1, -90, 10]); //[-1, -90]
//   getLessThanZero([1, 2]); //[]


function getLessThanZero(i) {
    var neg = [];
    for (j = 0; j < i.length; j++) {
        if (i[j] < 0) {
            neg.push(i[j]);
        }
    }
    return neg;
}


// Write a constructor called Rectangle that accepts two numbers (width and height) as parameters.
// Rectangle instances should have a method called getArea that returns the instance's width multiplied by its height.
// Write another constructor called Square that accepts one number (which will serve as both width and the height) as a parameter. Instances of Square should also have a getArea method but you should not rewrite the getArea function you wrote for Rectangle. Square instances should use the same getArea method that Rectangle instances do.

function Rectangle(w, h) {
    this.width = w;
    this.height = h;
    this.getArea = (function getArea(){
        return this.width * this.height;
    })

}

function Square(n) {
    Rectangle.call(this, n, n);
}

var square = new Square(4);
square.getArea();


// Write a function that expects a string representing a selector to be passed as a parameter. The function should find all the elements in the document that match the selector and change their style so that the text they contain is italic, underlined, and bold.

function b(selector) {
    var edit = document.body.querySelectorAll(selector);
    for (var i = 0; i < edit.length; i++) {
        edit[i].style.fontStyle = "italic";
        edit[i].style.textDecoration = "underlined";
        edit[i].style.fontWeight = "bold";
    }
}


// Write a function that expects a string representing a class name to be passed as a parameter. The function should return an array containing all the elements in the document that have the class that was passed in.

function a(className) {
    var store = [];
    var essence = document.getElementsByClassName(className);
    for (i = 0; i < essence.length; i++) {
        store.push(essence[i]);
    }

    return store;
}


// Write a function that inserts an element into the body of the currently loaded page.
// That element should have fixed position, z-index of 2147483647, left of 20px, top of 100px, font-size of 200px, and contain the text 'AWESOME'.

function insert(elem) {
    var add = document.createElement(elem);
    var text = document.createTextNode("AWESOME");
    add.appendChild(text);
    document.body.appendChild(add);

    add.style.position = "fixed";
    add.style.zIndex = "2147483647";
    add.style.left = "20px";
    add.style.top = "100px";
    add.style.fontSize = "200px";
}


// Write a function askForNumber that uses prompt to ask the user for a number between one and ten. It should check the result and if it is not a number between 1 and 10 it should throw an error with the message "not a valid number". Otherwise, it should return the number the user entered.
// Then, write a second function translateNumberToGerman that calls askForNumber and returns the German translation of that number as a string. If askForNumber throws an error, it should print the error's message to the console and prompt the user again.

// To restate this a bit differently:
// The process is started by calling translateNumberToGerman. It is translateNumberToGerman that calls askForNumber.
// askForNumber should call prompt and, depending on what prompt returns, either return a number or throw an exception.
// If askForNumber returns a number, translateNumberToGerman should return a string (a German translation of the number).
// If askForNumber throws an exception, translateNumberToGerman should catch that exception and restart the process.

// var useInput = prompt('Please tell me your age')
// userInput -- it would return the ans.
// as you the input will be string you can translate it parsIn();

function askForNumber() {
    var i = prompt("Input number betweek 1 & 10 : ");
    var info = parseInt(i);
    if (info < 1 || info > 10) {
        throw new Error("Not a valid number");
    } else if (isNaN(info)) {
        throw new Error("This is not a number!");
        askForNumber();
    }
    return info;
}

function translateNumberToGerman() {
    try {
        var result = askForNumber();
    } catch (e) {
        console.log(e);
        return translateNumberToGerman();
    }
    var german = [
        "Eins",
        "Zwei",
        "Drei",
        "Vier",
        "Fünf",
        "Sechs",
        "Sieben",
        "Acht",
        "Neun",
        "Zehn"
    ];

    console.log("Your translated number is; ");
    return german[result - 1];
}


// Make a static HTML page that has a large <textarea> on it. When the user types in it, save the value in localStorage. When the user comes back to the page after navigating away or closing the browser, the stored value should automatically appear in the <textarea>.

var info = $("textarea#text");
window.onload = function() {
    info.on("input", function(e) {
        var comment = info.val();
        localStorage.setItem("comment-save", comment);
    });
};


// info.val(localStorage.getItem("comment-save"));
//
//
// For your adventure, you can come up with any number of decisions and riddles. Set the scene and make it as big and difficult as you like!
//
// In general, your game should work as follows:
//
// When started, it should greet the player by name and ask them if they want to start.
// When the player confirms, it should start asking the player questions, displaying the available options if appropriate.
// It should react appropriately to the user's input. Your game shouldn't crash when the user input is something unexpected!
// Once the game is complete, the program should end.

const readline = require("readline");
const chalk = require("chalk");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var chatUpLines = {
    q:
        " Is it hot in here or is it just you?.....Hello there! I see that your love life went dry.. Would you like some pick-up lines? Just answer 'y' for yes and 'n' for no.. ",
    answers: {
        y: {
            q: chalk.red(
                "I’m not a photographer, but I can picture me and you together. Another one? "
            ),
            answers: {
                y: {
                    q: chalk.magenta(
                        "Do you know what my shirt is made of? Lover material? Come on... Just one more? "
                    ),
                    answers: {
                        y: {
                            q: chalk.rgb(160, 0, 0)(
                                "Aside from being sexy, what do you do for a living? Are you up for another? "
                            ),
                            answers: {
                                y: chalk.rgb(199, 21, 133)(
                                    "Can I follow you home? Cause my parents always told me to follow my dreams.... I know you want more, but I'm out for today"
                                ),

                                n: chalk.yellow("Alright.. Go get them Tiger! ")
                            }
                        },
                        n: chalk.green("You're invincible now!")
                    },
                    n: chalk.cyan(
                        "Go and sharpen up your new Skills! You sexy minx.."
                    )
                },
                n: chalk.blue(
                    "Well I was just getting started... such a Shame! Hope you enjoy your Single life!"
                )
            }
        },
        n: {
            q: chalk.white(
                "Jokes on you cause you are going through it, anyway.... You must be a broom, ‘cause you just swept me off my feet.... One more? "
            ),
            answers: {
                y: chalk.red(
                    " Is your name Google? Because you have everything I’ve been searching for... Ok, Ok I will leave you! Good Luck!"
                ),

                n: chalk.grey("Ok then.. have fun swiping...")
            }
        }
    }
};


function chatUp(cheesy) {
    rl.question(cheesy.q, function(line) {
        if (cheesy.answers[line]) {
            if (typeof cheesy.answers[line] == "string") {
                console.log(cheesy.answers[line]);
                rl.close();
            }

            if (typeof cheesy.answers[line] == "object") {
                chatUp(cheesy.answers[line]);
            }
        } else {
            console.log(
                `Wooops. Try again. This time with a 'n' or 'y' answer.`
            );
            chatUp(cheesy);
        }
    });
}

chatUp(chatUpLines);
