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

    // If comments have not been posted, print 'empty' message.
    const msgElement = document.createElement('p');
    msgElement.classList.add('lead');
    msgElement.innerText = "empty";
    document.getElementById('comment-container').appendChild(msgElement);

  } else {
    
    // If comments have been posted, print it.
    let name, nameElem, comment, commentElem, timeElem, mediaClone;
    const commentContainer = document.getElementById('comment-container');
    const mediaElem = document.getElementsByClassName('media-template')[0];
    commentsJson.forEach(commentInfo => {
      name = commentInfo[1];
      comment = commentInfo[2];

      mediaClone = mediaElem.cloneNode(true);
      mediaClone.classList.remove('d-none');

      nameElem = mediaClone.querySelector('h5');
      nameElem.innerText = name;

      timeElem = mediaClone.querySelector('.comment-timestamp');
      timeElem.innerText = timestampToString(commentInfo[0]);
      console.log(commentInfo[0]);

      commentElem = mediaClone.querySelector('.media-body');
      commentElem.append(comment);

      commentContainer.appendChild(mediaClone);
    });
  }
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