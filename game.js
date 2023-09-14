// import * as Core from './core.js'; -- look at this some other time

window.onload = main();



function main(){
   setMainWindow();
   
   const state = {
      Start: Symbol("Start"),
      Playing: Symbol("Playing"),
      EndNegative: Symbol("EndNegative"),
      EndPositive: Symbol("EndPositive")
   }

   let game_phase = state.Start;

   if (game_phase === state.Start) {
      createMenu();
      document.getElementsByClassName("menu-button")[0].addEventListener("click", getSelectedValueAndCalculate);

   }
}

function setMainWindow() {
   var mainWindow = document.createElement("div");
   mainWindow.classList.add("main");
   mainWindow.style.height = "600px"
   mainWindow.style.width = "800px"
   mainWindow.style.backgroundImage = "url('assets/sky.png')";
   document.body.appendChild(mainWindow);
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
   for (let i = 0; i <= 10; i++) {
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
function getSelectedValueAndCalculate() {
   var e = document.getElementsByClassName("menu-dropdown")[0].value;
   console.log(e)
}


//---------------CORE---------------

//helpers
function getFirstElementAndAdd(className, element) {
   document.getElementsByClassName(className)[0].appendChild(element);
}