/**
 * Retreives quote from server.
 */

 function getQuote() {
     fetch('/data').then(response => response.text()).then(quote => {
         document.getElementById('quote-container').innerText = quote;
     });
 }