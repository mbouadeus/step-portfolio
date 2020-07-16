/**
 * Retreives comments from server.
*/
async function getCommentFromServer(url) {
  return await fetch(url).then(response => response.json());
}

/**
 * Get blobstore upload url from server and set it to form.
*/
async function setFormUploadUrl() {
  const url = await postRequest('comment-upload-url', {redirectUrl: getServletUrl()})
    .then(response => response.text());

  document.getElementById('comment-form').action = url;
}

/**
 * Get get the servlet url of the comment section.
*/
function getServletUrl() {
  return document.getElementById('comment-form').classList[0];
}

/**
* Dynamically appends comments from server to DOM.
*/
async function printComments() {

  const url = getServletUrl();

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

  const name = commentObj.name;
  const comment = commentObj.comment;

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
  timeElem.innerText = timestampToString(commentObj.timestamp);
  
  // Add key to comment element
  const keyElem = mediaClone.querySelector('.comment-key');
  keyElem.value = commentObj.key;

  // Add comment text
  const commentElem = mediaClone.querySelector('.media-body');
  commentElem.append(comment);

  // Add comment image if exists
  const imageUrl = commentObj.imageUrl;

  if (imageUrl !== "") {
    mediaClone.querySelector('img').src = imageUrl;
  }

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

/**
* Converts timestamp to text describing past time.
*/
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
  const keyValue = button.parentElement.querySelector('.comment-key').value;
  console.log(keyValue);

  // Get POST url from comment section form
  const url = getServletUrl() + '-delete';
  
  // Send POST request to delete comment and reload page
  const body = {key: keyValue};
  postRequest(url, body).then(() => location.reload());
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
