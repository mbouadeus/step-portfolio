package com.google.sps.data;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.KeyFactory;

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;

import java.net.MalformedURLException;
import java.net.URL;

import java.io.IOException;

import java.sql.Timestamp;
import java.time.Instant;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;

public final class CommentUtility {

  private CommentUtility(){}

  /**
  * Gets comments from datastore at specified ID
  */
  public static String getComments(String collectionID) {
    // Create datastore query
    Query query = new Query(collectionID).addSort("timestamp", SortDirection.DESCENDING);

    // Prepare database to be queried
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    // Get query results
    PreparedQuery results = datastore.prepare(query);

    Map<String, List<Comment>> commentsMap = new HashMap<>();
    List<String> arrangedKeys = new ArrayList<>();

    // Interate through entities in query results
    for (Entity entity : results.asIterable()) {
      String key;

      if (entity.getParent() != null) {
        key = KeyFactory.keyToString(entity.getParent());
      } else {
        key = KeyFactory.keyToString(entity.getKey());
      }

      // Retrieve comment inputs from entity
      String name = (String) entity.getProperty("name");
      String comment = (String) entity.getProperty("comment");
      String timestamp = (String) entity.getProperty("timestamp");
      String imageUrl = (String) entity.getProperty("image");

      // Store comment
      if (!commentsMap.containsKey(key)) {
        commentsMap.put(key, new ArrayList<Comment>());
        arrangedKeys.add(key);
      }

      commentsMap.get(key)
        .add(new Comment(name, comment, timestamp, imageUrl, KeyFactory.keyToString(entity.getKey())));
    }

    List<List<Comment>> arrangedCommentsList = new ArrayList<>();

    for (String key: arrangedKeys) {
      arrangedCommentsList.add(commentsMap.get(key));
    }
    
    Gson gson = new Gson();

    // Return comments as Json
    return gson.toJson(arrangedCommentsList);
  }

  /**
  * Post comment into datastore at specified ID
  */
  public static void postComment(String collectionID, HttpServletRequest request) {
    // Get the input from the form.
    String name = GeneralUtility.getParameter(request, "name", "");
    String comment = GeneralUtility.getParameter(request, "comment", "");
    String timestamp = new Long(Timestamp.from(Instant.now()).getTime()).toString();

    // Create datastore entity
    Entity commentEntity;
    String parentKey = GeneralUtility.getParameter(request, "reply", "");

    if (!(parentKey.isEmpty())) {
      // This is for reply comments
      commentEntity = new Entity(collectionID, KeyFactory.stringToKey(parentKey));
    } else {
      // This is for original comments
      commentEntity = new Entity(collectionID);
    } 

    // Save comment inputs to entity
    commentEntity.setProperty("name", name);
    commentEntity.setProperty("comment", comment);
    commentEntity.setProperty("timestamp", timestamp);

    // Save comment image if it exists
    String imageUrl = getUploadedFileUrl(request, "image");

    System.out.println(imageUrl);
    if (imageUrl != null) {
      commentEntity.setProperty("image", imageUrl);
    } else {
      commentEntity.setProperty("image", "");
    }
    
    // Enter entity into database
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);
  }

  /**
  * Delete comment from datastore at specified ID
  */
  public static void deleteComment(String collectionID, HttpServletRequest request) {
    // Get the key string from the form.
    String keyStr = GeneralUtility.getParameter(request, "key", "");
    
    // Get key of comment
    Key key = KeyFactory.stringToKey(keyStr);

    // Prepare database to be queried
    Query query = new Query(collectionID);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    // Get query results
    PreparedQuery results = datastore.prepare(query);

    Key parent;
    // Interate through entities in query results
    for (Entity entity : results.asIterable()) {

      parent = entity.getParent();

      if (parent != null && parent.equals(key)) {
        // If comment is a reply to original comment, delete it.
        datastore.delete(entity.getKey());
      }
    }

    // Delete original comment.
    datastore.delete(key);
  }

  /** Returns a URL that points to the uploaded file, or null if the user didn't upload a file. */
  private static String getUploadedFileUrl(HttpServletRequest request, String formInputElementName) {
    BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
    Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(request);
    List<BlobKey> blobKeys = blobs.get(formInputElementName);

    // User submitted form without selecting a file, so we can't get a URL. (dev server)
    if (blobKeys == null || blobKeys.isEmpty()) {
      return null;
    }

    // Our form only contains a single file input, so get the first index.
    BlobKey blobKey = blobKeys.get(0);

    // User submitted form without selecting a file, so we can't get a URL. (live server)
    BlobInfo blobInfo = new BlobInfoFactory().loadBlobInfo(blobKey);
    if (blobInfo.getSize() == 0) {
      blobstoreService.delete(blobKey);
      return null;
    }

    // We could check the validity of the file here, e.g. to make sure it's an image file
    // https://stackoverflow.com/q/10779564/873165

    // Use ImagesService to get a URL that points to the uploaded file.
    ImagesService imagesService = ImagesServiceFactory.getImagesService();
    ServingUrlOptions options = ServingUrlOptions.Builder.withBlobKey(blobKey);

    // To support running in Google Cloud Shell with AppEngine's dev server, we must use the relative
    // path to the image, rather than the path returned by imagesService which contains a host.
    try {
      URL url = new URL(imagesService.getServingUrl(options));
      return url.getPath();
    } catch (MalformedURLException e) {
      return imagesService.getServingUrl(options);
    }
  }
}
