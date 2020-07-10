// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


window.addEventListener('load', function () {
  addRandomBackground();
});


/**
 * Adds a random backgournd wallpaper to the page.
 */
function addRandomBackground() {
  // Pick a random wallpaper id.
  const id = Math.floor(Math.random() * 2);

  addBackground(id);
}

/**
 * Adds background wallpaper that corresponds with id.
 */
function addBackground(id) {
  const wallpapers = ['https://www.toptal.com/designers/subtlepatterns/patterns/y-so-serious-white.png',
  'https://www.toptal.com/designers/subtlepatterns/patterns/webb.png'];

  // Pick wallpaper.
  const wallpaper = wallpapers[id];

  // Add it to the page.
  const bodyElement = document.getElementsByTagName('body')[0];
  bodyElement.style.background = `url("${wallpaper}")`;
}

/**
 * Returns the id of the background that has been selected.
 */
function getSelectedBackgroundId() {
  // Gets index of wallpaper selected from DOM.
  const id = Array.from(document.querySelector('.modal-body > .list-group').childNodes)
    .findIndex(listItem => listItem.classList && listItem.classList.contains('active'));

  return Math.floor(id / 2);
}

function setBackground() {
  // Retrieves id of background option selected in menu.
  const id = getSelectedBackgroundId();

  // Sets background
  addBackground(id);

  // Closes background selection menu.
  $('#settingsModal').modal('hide');
}

/**
 * Retreives comments from server.
 */
async function getCommentFromServer(url) {
   return await fetch(url).then(response => response.json());
}

/**
* Dynamically appends comments from server to DOM.
*/
async function printComments(url) {
  const commentsJson = await getCommentFromServer(url);

  if (commentsJson.length === 0) {

    // If there are no comments.
    printEmpty();
  } else {
    
    // If comments have been posted, print it.

    const commentContainer = document.getElementById('comment-container');
    const mediaElem = document.querySelector('.media-template');

    // Print each comment group
    commentsJson.forEach(commentGroup => {

      // Print each individual comment
      for (let index = commentGroup.length-1; index >= 0; index--) {

        if (index == commentGroup.length-1) {
          // Original comment
          printComment(commentGroup[index], false, mediaElem, commentContainer);
        } else {
          // Reply comment
          printComment(commentGroup[index], true, mediaElem, commentContainer);
        }
      }

    });
  }
}

/**
* Dynamically appends comment from server to comments section.
*/
function printComment(commentObj, reply, mediaElem, commentContainer) {

  const name = commentObj[2];
  const comment = commentObj[3];

  // Create comment element
  const mediaClone = mediaElem.cloneNode(true);
  mediaClone.classList.remove('d-none');

  // Reply comments
  if (reply) {
    mediaClone.classList.add('ml-5');
    mediaClone.querySelector('.reply-btn').remove();
  }

  // Add name to comment element
  const nameElem = mediaClone.querySelector('h5');
  nameElem.innerText = name;

  // Add time since posted to comment element
  const timeElem = mediaClone.querySelector('.comment-timestamp');
  timeElem.innerText = timestampToString(commentObj[1]);
  
  // Add key to comment element
  const keyElem = mediaClone.querySelector('.comment-key');
  keyElem.value = commentObj[0];

  // Add comment text
  const commentElem = mediaClone.querySelector('.media-body');
  commentElem.append(comment);

  // Append comment element to comment section in DOM
  commentContainer.appendChild(mediaClone);
}

/**
* Dynamically appends empty message to comment section.
*/
function printEmpty(comment, reply) {

  // If comments have not been posted, print 'empty' message.
    const msgElement = document.createElement('p');
    msgElement.classList.add('lead');
    msgElement.innerText = "empty";
    document.getElementById('comment-container').appendChild(msgElement);
}


function timestampToString(timestamp) {
  // Get time difference from current time
  timestamp = new Date().getTime() - Number(timestamp);

  if (timestamp < 60000)
    return "just now";

    let time = "";

    // Establish break points for minutes, hours, days, and so on.
    const timesConv = [{time: 31557600000, tStr: ' year'},
        {time: 2629800000, tStr: ' month'},
        {time: 604800017, tStr: ' week'},
        {time: 86400000, tStr: ' day'},
        {time: 3600000, tStr: ' hour'},
        {time: 60000, tStr: ' minute'},
    ];

    // Break up the timestamp into time measurements.
    for (const timeConv of timesConv) {
        if (timestamp >= timeConv.time) {
            let num = timestamp / timeConv.time;

            if (num >= 2)
            time += Math.floor(num) + timeConv.tStr + 's';
            else
            time += Math.floor(num) + timeConv.tStr;
            break;
        }
    }
    return time + " ago";
}

 /**
 * Delete comment from datastore
 */

 function deleteComment(button) {
   // Get key from comment
   const keyElem = button.parentElement.querySelector('.comment-key');

   // Append key to form element
   const formElem = $("<form action='/portfolio-comment-delete' method='POST' class='d-none'></form>");
   formElem.append(keyElem);

   // Append form to DOM
   document.body.append(formElem.get(0));

   formElem.submit();
 }

/**
 * Set form to reply to comment.
 */

function setFormReply(button) {
  // Get name of comment to be replied to
  const commentName = button.parentNode.parentNode.querySelector('.comment-name').innerText;

  // Get key of comment to be replied to
  const commentKey = button.parentNode.querySelector('.comment-key').value;

  const replyContainer = document.getElementById('reply-container');

  // Add reply label to comment form
  const replyLabel = replyContainer.querySelector('span');
  replyLabel.classList.remove('d-none');
  replyLabel.innerText = `Reply to: ${commentName}`;

  // Add reply key to comment form
  const replyInput = replyContainer.querySelector('input');
  replyInput.value = commentKey;

  // Scroll comment form into window view
  replyContainer.parentNode.parentNode.querySelector('h3').scrollIntoView();
}