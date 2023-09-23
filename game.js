// import * as Core from './core.js'; -- look at this some other time

const state = {
   Initial: Symbol("Initial"),
   Start: Symbol("Start"),
   Playing: Symbol("Playing"),
   EndNegative: Symbol("EndNegative"),
   EndPositive: Symbol("EndPositive")
}

window.onload = () => {
   // let sums = []
   setMainWindow();
   stateObject.getOnChange = function() {
      if(this.value == state.Start) {
         gameStart();
      }
      if(this.value == state.Playing) {
         gamePlaying();

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
   sums = getSelectedValueAndPrepareSums();
   // console.log(sums)
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
   var title = createTitle();
   var dropdown = createDropdown();
   var button = createButton();
   elements.push(title, dropdown, button);
   return elements
   
}

function createTitle() {
   var title = document.createElement("p");
   title.classList.add("menu-title");
   title.innerText = "Welke tafel wil je oefenen?";
   return title;
}

function createDropdown(){
   var dropdown = document.createElement("select");
   dropdown.classList.add("menu-dropdown");
   for (let i = 1; i <= 10; i++) {
      var option = document.createElement("option");
      option.classList.add("menu-dropdown-option-"+ i);
      option.setAttribute("value", i);
      option.innerHTML = i;
      dropdown.appendChild(option);
   }
   var option_all = document.createElement("option");
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
         this.SecondNumber = secondNumber;
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

// https://stackoverflow.com/questions/1759987/listening-for-variable-changes-in-javascript