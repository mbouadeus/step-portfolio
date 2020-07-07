/**
 * Retreives quote from server.
 */
function getQuote() {
  fetch('/data').then(response => response.text()).then(quote => {
    document.getElementById('quote-container').innerText = quote;
  });
}

 /**
 * Retreives inspirational quotes from server.
 */
async function getQuotes() {
  const quotes = await fetch('/data').then(response => response.json());
  return quotes;
}

 /**
 * Dynamically appends quotes from server to DOM.
 */
async function printQuotes() {
  // Get quotes
  const quotes = await getQuotes();

  // Select quote container
  const quotesContainer = document.getElementById('quotes-container');

  let quoteElement;

  // Apppend quotes to container
  quotes.forEach(quote => {
    quoteElement = document.createElement('p');
    quoteElement.classList.add('lead');
    quoteElement.innerText = "\"" + quote + "\"";
    quotesContainer.appendChild(quoteElement);
  });

  // Disable quote button
  document.querySelector('#quotes-container > button').setAttribute('disabled', '');
}
