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
 const wallpapers = ['https://www.toptal.com/designers/subtlepatterns/patterns/y-so-serious-white.png',
    'https://www.toptal.com/designers/subtlepatterns/patterns/webb.png'];

  // Pick a random wallpaper.
  const wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];
console.log(document.body);
console.log(document.getElementsByTagName("body").length);
console.log(document.getElementsByTagName("body").item(0));

  // Add it to the page.
  const bodyElement = document.getElementsByTagName('body')[0];
  bodyElement.style.background = `url("${wallpaper}")`;
}

function addBackground(id) {
    const wallpapers = ['https://www.toptal.com/designers/subtlepatterns/patterns/y-so-serious-white.png',
    'https://www.toptal.com/designers/subtlepatterns/patterns/webb.png'];
}
