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
  const id = Array.from(document.querySelector('#backgroundModal .modal-body > .list-group').childNodes)
    .findIndex(listItem => listItem.classList && listItem.classList.contains('active'));

  return Math.floor(id / 2);
}

function setBackground() {
  // Retrieves id of background option selected in menu.
  const id = getSelectedBackgroundId();

  // Sets background
  addBackground(id);

  // Closes background selection menu.
  $('#backgroundModal').modal('hide');
}
