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