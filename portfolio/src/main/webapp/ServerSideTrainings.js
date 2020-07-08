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

 /**
 * Retreives comment from server.
 */
async function getCommentFromServer() {
   return await fetch('/data').then(response => response.json());
}

 /**
 * Dynamically appends comment from server to DOM.
 */
async function printComment() {
  const commentJson = await getCommentFromServer();

  if (commentJson[0].length === 0) {

    // If comment has not been posted, print 'empty' message.
    const msgElement = document.createElement('p');
    msgElement.classList.add('lead');
    msgElement.innerText = "empty";
    document.getElementById('comment-container').appendChild(msgElement);

  } else {
    
    // If comment has been posted, print it.
    const name = commentJson[0];
    const comment = commentJson[1];

    const nameElement = document.createElement('p');
    nameElement.classList.add('lead');
    nameElement.innerText = name;

    const commentElement = document.createElement('p');
    commentElement.innerText = comment;

    const commentContainer = document.getElementById('comment-container');
    commentContainer.appendChild(nameElement);
    commentContainer.appendChild(commentElement);
  }
}

window.addEventListener('load', async function () {
  await printComment();
});