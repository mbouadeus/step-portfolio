package com.google.sps.servlets;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.Gson;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

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

    List<List<String>> comments = new ArrayList<>();

    // Interate through entities in query results
    for (Entity entity : results.asIterable()) {
      long id = entity.getKey().getId();
    
      // Retrieve comment inputs from entity
      String name = (String) entity.getProperty("name");
      String comment = (String) entity.getProperty("comment");
      long timestamp = (long) entity.getProperty("timestamp");

      // Store comment
      comments.add(Arrays.asList(Long.toString(timestamp), name, comment));
    }
    
    Gson gson = new Gson();

    // Return comments as Json
    return gson.toJson(comments);
  }

    /**
   * Post comment into datastore at specified ID
   */
  public static void postComment(String collectionID, HttpServletRequest request) {
    // Get the input from the form.
    String name = getParameter(request, "name", "");
    String comment = getParameter(request, "comment", "");
    long timestamp = System.currentTimeMillis();

    // Create datastore entity
    Entity commentEntity = new Entity(collectionID);

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
}