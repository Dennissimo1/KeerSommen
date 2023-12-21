// import * as Core from './core.js'; -- look at this some other time

const state = {
   Initial: Symbol("Initial"),
   Start: Symbol("Start"),
   Playing: Symbol("Playing"),
   EndOfGame: Symbol("EndOfGame"),
}

let total_passed_sums = 0

window.onload = () => {
   setMainWindow();
   stateObject.getOnChange = function() {
      if(this.value == state.Start) {
         gameStart();
      }
      if(this.value == state.Playing) {
         gamePlaying();
      }
      if(this.value == state.EndOfGame) {
         console.log("passed sums = " + total_passed_sums)
         gameEnd(total_passed_sums)
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
   createKeerSommenTitle();
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
   const titleBox = document.getElementsByClassName("title-box")[0];
   main.removeChild(menu);
   main.removeChild(titleBox);

   //step 3: create new elements
   const instruct = document.createElement("p");
   const instructBox = document.createElement("span");
   instruct.classList.add("instruction");
   instructBox.classList.add("instruction-span");
   instructBox.innerText = "Los de volgende som op: hoeveel is ...";
   instruct.appendChild(instructBox);
   getFirstElementAndAdd("main", instruct);

   const pfield = document.createElement("div");
   pfield.classList.add("playing-field");
   getFirstElementAndAdd("main", pfield);

   all_sums.forEach((sum, index) => {
      let created = createSum(sum, index);
      getFirstElementAndAdd("playing-field", created);
   }); 
   document.getElementsByClassName("sum-0")[0].setAttribute("status", "active");

   for (const [index, sum] of all_sums.entries()) {
      document.getElementsByClassName(`answer-box-${index}`)[0].focus();
      document.getElementsByClassName(`answer-box-${index}`)[0].oninput = function() {
      
      let answer = parseInt(this.getAttribute("answer"));
      let input = parseInt(this.value);
      console.log("Answer: " + answer + " Input: " + input);
      if (answer !== input) {
         let skipButton = document.getElementsByClassName(`skip-button-${index}`)[0];
         skipButton.disabled = false;
         skipButton.addEventListener("click", function () {
            failed_sums.push(all_sums[index]);
            document.getElementsByClassName(`answer-box-${index}`)[0].blur();
            document.getElementsByClassName(`sum-${index}`)[0].setAttribute("status", "inactive");
            if (index != 9) {
               document.getElementsByClassName(`sum-${index + 1}`)[0].setAttribute("status", "active");
               document.getElementsByClassName(`answer-box-${index + 1}`)[0].focus();
            } else {
               passed_sums = all_sums.length - failed_sums.length
               total_passed_sums = passed_sums
               setStateToEndGame();
               return
            }
         }); 
      }
      if (answer === input) {
         this.disabled = true;
         this.setAttribute("passed", "true");
         setTimeout(() => {
            if (index === 9) {
               document.getElementsByClassName(`sum-${index}`)[0].setAttribute("status", "inactive");
               passed_sums = all_sums.length - failed_sums.length
               console.log("number of sums passed: " + passed_sums)
               total_passed_sums = passed_sums
               setStateToEndGame();
               return
            }
            document.getElementsByClassName(`answer-box-${index}`)[0].blur();
            document.getElementsByClassName(`sum-${index}`)[0].setAttribute("status", "inactive");
            document.getElementsByClassName(`sum-${index + 1}`)[0].setAttribute("status", "active");
            document.getElementsByClassName(`answer-box-${index + 1}`)[0].focus();
         }, 500)
         }      
      } 
   }
}

function gameEnd(total_passed_sums) {
   //first we remove old stuff
   const main = document.getElementsByClassName("main")[0];
   const pfield = document.getElementsByClassName("playing-field")[0];
   const instruction = document.getElementsByClassName("instruction")[0];
   main.removeChild(pfield);
   main.removeChild(instruction);

   const modal = document.createElement("div");
   modal.classList.add("end-modal");
   main.appendChild(modal);

   const congratsText = document.createElement("div");
   congratsText.classList.add("congrats-text");
   congratsText.innerText = "Je hebt de tafel afgerond!";
   modal.appendChild(congratsText);

   const congratsImage = document.createElement("div");
   congratsImage.classList.add("congrats-image");

   const image = document.createElement("img");
   image.classList.add("actual-image")
   image.src = "assets/dancing_unicorn.gif";
   
   congratsImage.appendChild(image);

   

   const resultsText = document.createElement("div");
   resultsText.classList.add("results-text");
   if (total_passed_sums <= 5) {
      resultsText.innerText = `Je hebt ${total_passed_sums} van de 10 sommen goed. Volgende keer beter?`;
   };
   if (between(total_passed_sums, 6, 9)) {
      resultsText.innerText = `Je hebt ${total_passed_sums} van de 10 sommen goed. Goed gedaan hoor!`
   };
   if (total_passed_sums > 9) {
      resultsText.innerText = `Wow! Je hebt alles goed, topper!! Kan je dit ook met een andere tafel?`
      modal.appendChild(congratsImage);
   };
   modal.appendChild(resultsText);

   const restartButton = document.createElement("button");
   restartButton.classList.add(`restart-button`);
   restartButton.innerHTML = "Begin opnieuw!";
   modal.append(restartButton);

   restartButton.addEventListener("click", function () {
      const modal = document.getElementsByClassName("end-modal")[0];
      modal.remove();
      setStateToStart();
   }); 
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
   multiplyBox.innerText = "X";
   sumLine.appendChild(multiplyBox);

   const numberBoxRight = document.createElement("div");
   numberBoxRight.classList.add("numberbox-right");
   numberBoxRight.innerHTML = sum.secondNumber;
   sumLine.appendChild(numberBoxRight);

   const equalsBox = document.createElement("div");
   equalsBox.classList.add("equals-box");
   equalsBox.innerText = "=";
   sumLine.appendChild(equalsBox);

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
function createKeerSommenTitle() {
   let titleDiv = document.createElement("div");
   titleDiv.classList.add("title-box");

   let titleSpan = document.createElement("span");
   titleSpan.classList.add("title-span");
   titleSpan.innerText = "Keersommen oefenen!";

   titleDiv.appendChild(titleSpan);
   getFirstElementAndAdd("main", titleDiv);

}

function createMenu() {
   let menu = document.createElement("div");
   menu.classList.add("menu");
   getFirstElementAndAdd("main", menu);

   let menuItems = createMenuItems();
   menuItems.forEach((item) => {
      getFirstElementAndAdd("menu", item);
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
   let titleSpan = document.createElement("span");

   title.classList.add("menu-title");
   titleSpan.classList.add("menu-title-span");
   
   titleSpan.innerText = "Welke tafel wil je oefenen?";
   title.appendChild(titleSpan);
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
   let dropDownBox = document.createElement("div");
   dropDownBox.classList.add("menu-box-dropdown");
   dropDownBox.appendChild(dropdown);
   // let option_all = document.createElement("option");
   // option_all.classList.add("menu-dropdown-option-all");
   // option_all.setAttribute("value", "all");
   // option_all.innerHTML = "Allemaal"
   // dropdown.appendChild(option_all);
   // maybe later...

   return dropDownBox;
}

function createButton() {
   let button = document.createElement("button");
   button.classList.add("menu-button");

   let buttonText = document.createElement("span");
   buttonText.classList.add("menu-button-text");

   buttonText.innerHTML = "Kies!";

   button.appendChild(buttonText);
   return button;
}
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
   for (let i = 0; i <= 9; i++) {
      const n = new sum(i, selected);
      generated_sums.push(n);
   }
   let shuffled = generated_sums
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
   
   return shuffled
}

//---------------HELPERS---------------
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

function setStateToStart() {
   stateObject.set(state.Start)
}

function setStateToPlaying() {
   stateObject.set(state.Playing)
}

function setStateToEndGame() {
   stateObject.set(state.EndOfGame)
}

function between(x, min, max) {
   return x >= min && x <= max;
 }