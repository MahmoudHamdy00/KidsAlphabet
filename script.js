var image = document.getElementsByTagName("img")[0];
var generateBtn = document.getElementById("generate");
var letters = document.getElementById("letters");
var numOfLetters = document.getElementById("numOfLetters");
var infoBtn = document.getElementById("infoBtn");
var infoDetails = document.getElementById("infoDetails");
var styles = document.getElementById("style");
var currentStyle = getSelectedStyle();
var currentLetter = null;
var defaultLetterColor = "#efefef";
var selectedLetterColor = "darkgray";
var audio = document.getElementById("letterSound");
window.addEventListener("load", (e) => saveEvent(e));
window.addEventListener("unload", (e) => saveEvent(e));

generateBtn.addEventListener("click", (e) => {
  addLetters();
  changeImageSource((src = null));
  saveEvent(e);
});

numOfLetters.addEventListener("blur", validateNumberOfLetters);

image.addEventListener("error", () => showPic((imgName = "notFound")));

letters.addEventListener("click", (e) => {
  if (e.target.type != "submit") return; //the type of the button is 'submit' so doesn't trigger the function the click is not on one button only;
  changeLetter(e);
  saveEvent(e);
});

infoBtn.addEventListener("mouseover", showInfoDetails);
infoBtn.addEventListener("mouseleave", hideInfoDetails);

styles.addEventListener("change", (e) => {
  changeStyle(e);
});
//functions
function addLetters() {
  letters.innerHTML = "";
  var numOfLetters = getNumOfLetters();
  var lettersToAdd = generateLetters(numOfLetters);
  for (var cur of lettersToAdd) {
    var newButton = document.createElement("button");
    var text = document.createTextNode(cur);
    newButton.append(text);
    //newButton.style.margin = "5px";
    //newButton.style.width = "25px";
    // newButton.style.backgroundColor = defaultLetterColor;

    letters.appendChild(newButton);
  }
}
function generateLetters(numOfLetters) {
  var allCharachters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var letters = new Set();
  letters.innerHTML = "";
  while (numOfLetters--) {
    var currentChar;
    do {
      let idx = Math.floor(Math.random() * allCharachters.length);
      currentChar = allCharachters[idx];
    } while (letters.has(currentChar));
    letters.add(currentChar);
  }
  var SortedLetters = [...letters];
  SortedLetters.sort();
  return SortedLetters;
}
function getNumOfLetters() {
  validateNumberOfLetters();
  return numOfLetters.value;
}
function validateNumberOfLetters() {
  if (
    numOfLetters.value == "" ||
    numOfLetters.value < 1 ||
    numOfLetters.value > 26
  )
    numOfLetters.value = 26;
}
function changeLetter(e) {
  const letterName = e.target.textContent;
  const letterBtn = e.target;
  if (currentLetter != null) {
    currentLetter.style.backgroundColor = defaultLetterColor;
    currentLetter.removeAttribute("selected");
  }
  letterBtn.setAttribute("selected", "true");
  letterBtn.style.backgroundColor = selectedLetterColor;
  currentLetter = letterBtn;
  showPic(letterName);
  playSound(letterName);
}
function playSound(letterName) {
  if (currentStyle == "style1")
    audio.setAttribute("src", `resources/style1/sounds/${letterName}.mp3`);
}
function showPic(imgName) {
  // console.log("show " + letter);
  try {
    var src = `resources/${currentStyle}/pictures/${imgName}.png`;
    changeImageSource(src);
  } catch (err) {
    console.error(err);
  }
}

function changeImageSource(src) {
  if (src == null || src == "") image.removeAttribute("src");
  else image.setAttribute("src", src);
}
function changeStyle(e) {
  const oldStyle = currentStyle;
  currentStyle = getSelectedStyle();
  var src = image.getAttribute("src");
  if (src == null) return;
  const imgName = currentLetter.textContent;
  showPic(imgName);
}
function getSelectedStyle() {
  for (var i = 0; i < styles.children.length; ++i) {
    if (styles.children[i].type == "radio" && styles.children[i].checked) {
      return styles.children[i].value;
    }
  }
}

function saveEvent(e) {
  //  console.log(e.type + "\n" + e.target + "\n" + e.timeStamp);
  var ret = localStorage.getItem("interactions");
  if (ret == null || ret == "") ret = "[]";
  var jsonObj = JSON.parse(ret);
  var newEvent = new eventToSave(e);
  jsonObj.push(newEvent);
  ret = JSON.stringify(jsonObj);
  localStorage.setItem("interactions", ret);
  //console.log(localStorage.interactions);
}

function eventToSave(e) {
  this.type = e.type;
  this.target = e.target;
  this.time = Date(); //e.timeStamp;

  if (this.target.value == "Generate") this.target = "Generate";
  //this is becuase the target is set to '{}' when parse to JSON
  else if (this.target.textContent >= "A" && this.target.textContent <= "Z")
    this.target = "letter " + this.target.textContent;
  else {
    this.target = "page";
  }
}

function toggeleInfo() {
  var currentState = infoDetails.style.display;
  if (currentState == "block") infoDetails.style.display = "none";
  else infoDetails.style.display = "block";
}
function showInfoDetails() {
  infoDetails.style.display = "block";
}
function hideInfoDetails() {
  infoDetails.style.display = "none";
}
generateBtn.click();
