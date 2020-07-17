/**
 * Get all elements with text to translate
*/
function getElements() {
  return document.querySelectorAll("[data-translate]");
}

/**
 * Get language code of selected language
*/
function getLanguageCode() {
  return document.querySelector('#languageModal .list-group-item.active').value;
}

/**
 * Translate text to specified language
*/
async function translate(text, languageCode) {

  const body = {text: text, languageCode: languageCode};

  // Get translated text
  const translatedText = await postRequest('/translate', body)
  .then(res => res.text());

  return translatedText;
}

/**
 * Change the language of webpage.
*/
async function setLanguage(button) {
  // Disable change language button
  button.disabled = true;

  // Hide language selection model
  $('#languageModal').modal('hide');

  // Get language code to translate to
  const languageCode = getLanguageCode();

  // Get all elements with translatable text
  const elements = getElements();

  // Translate each of the element's text
  for (const element of elements) {
    const translatedText = await translate(element.innerText, languageCode);
    element.innerText = translatedText;
  }

  // Re-enable change language button
  button.disabled = false;
}
