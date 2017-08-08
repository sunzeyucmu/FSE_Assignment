/**
 *  Fuck FUck FUCK FFFFFUUUUCCCk
 */

"use strict";
//Using an Object Constructor 
function person(first, last, age, eye) {
    this.firstName = first;
    this.lastName = last;
    this.age = age;
    this.eyeColor = eye;
}
var myFather = new person("John", "Doe", 50, "blue");
var myMother = new person("Sally", "Rally", 48, "green"); 
/*
 * The above function (person) is an object constructor.
 * Once have an object constructor, create new objects of the same type
 */
var txt = "";
for (x in myFather) {
	//The JavaScript for/in statement loops through the properties of an object:
    txt += myFather[x] + " ";
}

function myFunction() {
   document.getElementById("demo").innerHTML = "Paragraph changed.";
   //JS statements can be grouped together in code blocks, inside curly brackets {...}.

   //The purpose: to define statements to be Executed TOGETHER.

   //One place you will find statements grouped together in blocks, is in JavaScript functions:
}

function toCelsius(f) {
    return (5/9) * (f-32);
    //return value to caller
}

function myArrayMax(arr) {
    return Math.max.apply(null, arr);
}

function myArrayMin(arr) {
    return Math.min.apply(null, arr);
}

function myArrayMax(arr) {
    var len = arr.length
    var max = -Infinity;
    while (len--) {
        if (arr[len] > max) {
            max = arr[len];
        }
    }
    return max;
} 
function myArrayMin(arr) {
    var len = arr.length
    var min = Infinity;
    while (len--) {
        if (arr[len] < max) {
            min = arr[len];
        }
    }
    return min;
} 
var fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
var citrus = fruits.slice(1);