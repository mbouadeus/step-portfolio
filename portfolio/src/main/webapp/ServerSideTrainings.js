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
 * Retreives comments from server.
 */
async function getCommentFromServer() {
   return await fetch('/data').then(response => response.json());
}

 /**
 * Dynamically appends comments from server to DOM.
 */
async function printComments() {
  const commentsJson = await getCommentFromServer();

  if (commentsJson[0].length === 0) {

    // If comments have not been posted, print 'empty' message.
    const msgElement = document.createElement('p');
    msgElement.classList.add('lead');
    msgElement.innerText = "empty";
    document.getElementById('comment-container').appendChild(msgElement);

  } else {
    
    // If comments have been posted, print it.
    let name, nameElem, comment, commentElem, mediaClone;
    const commentContainer = document.getElementById('comment-container');
    const mediaElem = document.getElementsByClassName('media-template')[0];

    commentsJson.forEach(commentInfo => {
      name = commentInfo[1];
      comment = commentInfo[2];

      mediaClone = mediaElem.cloneNode(true);
      mediaClone.classList.remove('d-none');

      nameElem = mediaClone.querySelector('h5');
      nameElem.innerText = name;

      commentElem = mediaClone.querySelector('.media-body');
      commentElem.append(comment);

      commentContainer.appendChild(mediaClone);
    });
  }
}

window.addEventListener('load', async function () {
  await printComments();
});