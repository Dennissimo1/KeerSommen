// import * as Core from './core.js'; -- look at this some other time

const state = {
   Initial: Symbol("Initial"),
   Start: Symbol("Start"),
   Playing: Symbol("Playing"),
   EndOfGame: Symbol("EndOfGame"),
}

window.onload = () => {
   // let sums = []
   setMainWindow();
   stateObject.getOnChange = function() {
      if(this.value == state.Start) {
         gameStart();
      }
      if(this.value == state.Playing) {
         let passed_sums = gamePlaying();
      }
      if(this.value == state.EndOfGame) {
         console.log("passed sums = " + passed_sums)
         gameEnd(passed_sums)
      }
   }
   stateObject.set(state.Start);
}

function setMainWindow() {
   var mainWindow = document.createElement("div");
   mainWindow.classList.add("main");
   mainWindow.style.height = "600px"
   mainWindow.style.width = "800px"
   mainWindow.style.backgroundImage = "url('assets/sky.png')";
   document.body.appendChild(mainWindow);
}

function gameStart() {
   createMenu();
   document.getElementsByClassName("menu-button")[0].addEventListener("click", setStateToPlaying);
}

function gamePlaying() {
   // step 1 prepare sums
   let all_sums = getSelectedValueAndPrepareSums();
   let failed_sums = [];
   let passed_sums

   console.log(all_sums)

   // step 2 remove elements
   const main = document.getElementsByClassName("main")[0];
   const menu = document.getElementsByClassName("menu")[0];
   main.removeChild(menu);

   //step 3: create new elements
   const instruct = document.createElement("p");
   instruct.classList.add("instruction");
   instruct.innerText = "Los de volgende som op: hoeveel is ...";
   getFirstElementAndAdd("main", instruct);

   const pfield = document.createElement("div");
   pfield.classList.add("playing-field");
   getFirstElementAndAdd("main", pfield);

   all_sums.forEach((sum, index) => {
      var created = createSum(sum, index);
      getFirstElementAndAdd("playing-field", created);
   }); 
   document.getElementsByClassName("sum-0")[0].setAttribute("status", "active");

   for (const [index, sum] of all_sums.entries()) {
      document.getElementsByClassName(`answer-box-${index}`)[0].onchange = function() {
      let answer = parseInt(this.getAttribute("answer"));
      let input = parseInt(this.value);
      console.log("Answer: " + answer + " Input: " + input);
      if (answer !== input) {
         let skipButton = document.getElementsByClassName(`skip-button-${index}`)[0];
         skipButton.disabled = false;
         skipButton.addEventListener("click", function () {
            failed_sums.push(all_sums[index]);
            // console.log(failed_sums.map((sum) => console.log("dit zit er in failed sums" + sum) )); test this
            document.getElementsByClassName(`sum-${index}`)[0].setAttribute("status", "inactive");
            document.getElementsByClassName(`sum-${index + 1}`)[0].setAttribute("status", "active");
         }); 
      }
      if (answer === input) {
         this.setAttribute("passed", "true");
         this.disabled = true;
         if (index === 9) {
            document.getElementsByClassName(`sum-${index}`)[0].setAttribute("status", "inactive");
            passed_sums = all_sums.length - failed_sums.length
            console.log("number of sums passed: " + passed_sums)
            setStateToEndGame();
            return passed_sums // does not work, variable is not passed on. Work on this
         }
         document.getElementsByClassName(`sum-${index}`)[0].setAttribute("status", "inactive");
         document.getElementsByClassName(`sum-${index + 1}`)[0].setAttribute("status", "active");
         }      
      } 
   }
}

function gameEnd(passed_sums) {
   const main = document.getElementsByClassName("main")[0];
   const menu = document.getElementsByClassName("menu")[0];
   main.removeChild(menu);
}


function createSum(sum, indexNo) {
   const sumLine = document.createElement("div");
   sumLine.classList.add(`sum-${indexNo}`);
   sumLine.setAttribute("status", "inactive");
   
   const numberBoxLeft = document.createElement("div");
   numberBoxLeft.classList.add("numberbox-left");
   numberBoxLeft.innerHTML = sum.firstNumber;
   sumLine.appendChild(numberBoxLeft);

   const multiplyBox = document.createElement("div");
   multiplyBox.classList.add("multiply-box");
   multiplyBox.innerText = "X"
   sumLine.appendChild(multiplyBox);

   const numberBoxRight = document.createElement("div");
   numberBoxRight.classList.add("numberbox-right");
   numberBoxRight.innerHTML = sum.secondNumber;
   sumLine.appendChild(numberBoxRight);

   const answerBox = document.createElement("input");
   answerBox.classList.add(`answer-box-${indexNo}`);
   answerBox.setAttribute("type", "text");
   answerBox.setAttribute("answer", sum.outcome);
   answerBox.setAttribute("passed", sum.passed);
   sumLine.appendChild(answerBox);

   const skipSum = document.createElement("button");
   skipSum.classList.add(`skip-button-${indexNo}`);
   skipSum.disabled = true;
   skipSum.innerHTML = "Som overslaan";
   sumLine.append(skipSum);

   return sumLine;
}

//---------------MAIN MENU---------------
function createMenu() {
   var menu = document.createElement("div");
   menu.classList.add("menu");
   getFirstElementAndAdd("main", menu);

   var menuItems = createMenuItems();
   menuItems.forEach((item) => {
      getFirstElementAndAdd("menu", item)
   });
}

function createMenuItems(){
   const elements = []
   let title = createTitle();
   let dropdown = createDropdown();
   let button = createButton();
   elements.push(title, dropdown, button);
   return elements
   
}

function createTitle() {
   let title = document.createElement("p");
   title.classList.add("menu-title");
   title.innerText = "Welke tafel wil je oefenen?";
   return title;
}

function createDropdown(){
   let dropdown = document.createElement("select");
   dropdown.classList.add("menu-dropdown");
   for (let i = 1; i <= 10; i++) {
      var option = document.createElement("option");
      option.classList.add("menu-dropdown-option-"+ i);
      option.setAttribute("value", i);
      option.innerHTML = i;
      dropdown.appendChild(option);
   }
   let option_all = document.createElement("option");
   option_all.classList.add("menu-dropdown-option-all");
   option_all.setAttribute("value", "all");
   option_all.innerHTML = "Allemaal"
   dropdown.appendChild(option_all);

   return dropdown;
}

function createButton() {
   var button = document.createElement("button");
   button.classList.add("menu-button");
   button.innerHTML = "Kies!";
   return button;
}
//---------------MAIN MENU---------------
//---------------CORE---------------
function getSelectedValueAndPrepareSums() {
   var selected = document.getElementsByClassName("menu-dropdown")[0].value;
   const generated_sums = [];
   const sum = class {
      constructor(firstNumber, secondNumber) {
         this.firstNumber = firstNumber;
         this.secondNumber = secondNumber;
         this.outcome = firstNumber * secondNumber; 
         this.passed = false;
      }
   }
   for (let i = 0; i <= 10; i++) {
      const n = new sum(i, selected);
      generated_sums.push(n);
   }
   let shuffled = generated_sums
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
   
   return shuffled
}


//---------------CORE---------------

//helpers
function getFirstElementAndAdd(className, element) {
   document.getElementsByClassName(className)[0].appendChild(element);
}

function removeElement(className) {
   const element = document.getElementsByClassName(className)[0]
   element.remove;
}

var stateObject = {
   value: state.Initial,
   set: function (value) {
       this.value = value;
       this.getOnChange();
   }
}

function setStateToPlaying() {
   stateObject.set(state.Playing)
}

function setStateToEndGame() {
   stateObject.set(state.EndOfGame)
}
