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

package com.google.sps.servlets;

import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import java.io.IOException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This servlet returns the blobstore upload url for comments posted on the portfolio page.
 */
@WebServlet("/comment-upload-url")
public class CommentUploadServlet extends HttpServlet {

  /**
   * Returns the upload url.
   */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    // Get the Blobstore URL
    BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

    // Set redirect url for after blobstore upload
    String redirectUrl = request.getParameter("redirectUrl");
    String uploadUrl = blobstoreService.createUploadUrl(redirectUrl);

    response.setContentType("text/html");
    response.getWriter().println(uploadUrl);
  }
}
