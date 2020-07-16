window.addEventListener('load', async function () {

  // Retrieve and print portfolio comments.
  await printComments();
  
  // Set comment upload url from blobstore unto the comment form
  await setFormUploadUrl();
});
