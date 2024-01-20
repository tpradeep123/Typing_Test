const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const reset = document.getElementById("reset-btn");

let quote = "";
let time = 60;
let timer = 0;
let mistakes = 0;

const renderNewQuote = async () => {
  const response = await fetch(quoteApiUrl);
  let data = await response.json();
  quote = data.content;
  // console.log(quote.split(''))

  let arr = quote.split("").map((value) => {
    return "<span class='quote-chars'>" + value + "</span>";
  });
  // console.log(arr)
  quoteSection.innerHTML += arr.join("");
};

userInput.addEventListener("input", function () {
  let quoteChars = document.querySelectorAll(".quote-chars");
  // console.log(quoteChars)
  quoteChars = Array.from(quoteChars);
  console.log(quoteChars.innerText);

  let userInputChars = userInput.value.split("");
  // console.log(userInputChars)

  quoteChars.forEach((char, index) => {
    if (char.innerText == userInputChars[index]) {
      char.classList.add("success");
    } else if (userInputChars[index] == null) {
      if (char.classList.contains("success")) {
        char.classList.remove("success");
      } else {
        char.classList.remove("fail");
      }
    } else {
      if (!char.classList.contains("fail")) {
        mistakes += 1;
        char.classList.add("fail");
      }
      document.getElementById("mistakes").innerHTML = mistakes;
    }
    let check = quoteChars.every((element) => {
      return element.classList.contains("success");
    });
    if (check) {
      displayResult();
    }
  });
});

const updateTimer = () => {
  if (time == 0) {
    displayResult();
  } else {
    document.getElementById("timer").innerHTML = --time + "s";
  }
};
const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};
const displayResult = () => {
  document.querySelector(".result").style.display = "block";
  clearInterval(timer);
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  let timeTaken = 1;
  if (time != 0) {
    timeTaken = (60 - time) / 100;
  }
  document.getElementById("wpm").innerText =
    (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm";
  document.getElementById("accuracy").innerText =
    Math.round(
      ((userInput.value.length - mistakes) / userInput.value.length) * 100
    ) + "%";
};

const startTest = () => {
  mistakes = 0;
  timer = "";
  timeReduce();
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";

  document.getElementById("stop-test").style.backgroundColor = "#D24545";

  userInput.disabled = false;
};
window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
};

const body = document.querySelector(".mainBody");
const toggle = document.querySelector(".toggle");

let isDarkMode = "";

toggle.onclick = function () {
  const darkModeEnabled = body.classList.toggle("dark");
  localStorage.setItem("darkMode", darkModeEnabled);
};

const setDarkMode = () => {
  isDarkMode = localStorage.getItem("darkMode") === "true";
  body.classList.toggle("dark", isDarkMode);
};

function reloadPage() {
  location.reload();
}
window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;

  // Check local storage for dark mode state
  isDarkMode = localStorage.getItem("darkMode");

  if (isDarkMode === "true") {
    body.classList.add("dark");
  }

  renderNewQuote();
};
