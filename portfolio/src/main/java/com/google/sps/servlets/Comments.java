package com.google.sps.servlets;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.Gson;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.KeyFactory;

import java.sql.Timestamp;
import java.time.Instant;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;

import java.util.Enumeration;

public class Comments {

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

    Map<String, List<List<String>>> comments = new HashMap<>();
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

      // Store comment
      if (!comments.containsKey(key)) {
        comments.put(key, new ArrayList<List<String>>());
        arrangedKeys.add(key);
      }

      comments.get(key)
        .add(Arrays.asList(KeyFactory.keyToString(entity.getKey()), timestamp, name, comment));
    }

    List<List<List<String>>> arrangedComments = new ArrayList<>();

    for (String key: arrangedKeys) {
      arrangedComments.add(comments.get(key));
    }
    
    Gson gson = new Gson();

    // Return comments as Json
    return gson.toJson(arrangedComments);
  }

  /**
  * Post comment into datastore at specified ID
  */
  public static void postComment(String collectionID, HttpServletRequest request) {
    // Get the input from the form.
    String name = getParameter(request, "name", "");
    String comment = getParameter(request, "comment", "");
    String timestamp = new Long(Timestamp.from(Instant.now()).getTime()).toString();

    // Create datastore entity
    Entity commentEntity;
    String parentKey = getParameter(request, "reply", "");

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
    
    // Enter entity into database
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);
  }

  /**
  * @return the request parameter, or the default value if the parameter
  *         was not specified by the client
  */
  private static String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }

  /**
  * Delete comment from datastore at specified ID
  */
  public static void deleteComment(String collectionID, HttpServletRequest request) {
    // Get the key string from the form.
    String keyStr = getParameter(request, "key", "");

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
}