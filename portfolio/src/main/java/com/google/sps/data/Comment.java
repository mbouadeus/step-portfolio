package com.google.sps.data;

public class Comment {
  private String name;
  private String comment;
  private String timestamp;
  private String key;

  /*
  * Initialize comment object with name, comment, timestamp, and key param.
  */
  public Comment(String name, String comment, String timestamp, String key) {
    this.name = name;
    this.comment = comment;
    this.timestamp = timestamp;
    this.key = key;
  }

  /*
  * Return String representation of comment.
  */
  @Override
  public String toString() {
    return String.format("[%s, %s, %s, %s]", name, comment, timestamp, key);
  }
}