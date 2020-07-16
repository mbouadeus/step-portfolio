const divider = "^~¬";

function getAllText() {

  // Get all elements with text to translate
  const elements = document.querySelectorAll("[data-translate]");

  // Concatenate all text to one string separated by divider
  let text = "";
  elements.forEach(elem => {text += divider + elem.innerText;});

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

async function translate() {
  // Get all the text on the page
  const text = getAllText();

  // Temporarily set translate language to spanish
  const languageCode = "es";

  const body = {text: text, languageCode: languageCode};

  // Get translated text
  const translatedText = await postRequest('/translate', body)
  .then(res => res.text());

  // Change all the text on the page.
  setAllText(translatedaText);
}
