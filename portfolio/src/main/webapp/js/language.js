const divider = "^~¬";

function getAllText() {

  // Get all elements with text to translate
  const elements = document.querySelectorAll("[data-translate]");

  // Concatenate all text to one string separated by divider
  const text = elements.reduce((accumulator, current) => accumulator + divider + current.innerText, "");

  return text.substring(3);
}

function setAllText(translatedText) {
  
  // Split translated text into array
  const textList = translatedText.split(divider);

  // Get all elements
  const elements = document.querySelectorAll("[data-translate]");

  elements.forEach((elem, index) => {
    elem.innerText = textList[index+1];
  });
}