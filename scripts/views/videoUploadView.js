/*
Modified version of https://github.com/youtube/api-samples/blob/master/javascript/upload_video.js
Stripped out all of the gapi code and some of the post upload hooks

Copyright 2015 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


// Storing refresh tokens on a client is stupid 99.9% of the time,
// but we're dealing with the 0.1% case where it's secure here.
// This refresh token is locked down to youtube uploading and nothing else.
// Plus the account is a throwaway and would be completely useless even if compromised.
var authInfo = {
  client_id: '1060892537782-gsbi9kn8qf5t1370uc7lnhqqopt9e9d3.apps.googleusercontent.com',
  client_secret: '8vcglkf2blCtQM3p25hiyV21',
  refresh_token: '1/rP5-GhijcHtEPoqrCCrFe8TaWfM2dw4LqGUPr_zRLWI',
  grant_type: 'refresh_token'
};

var STATUS_POLLING_INTERVAL_MILLIS = 60 * 1000; // One minute.

function authWithYoutube() {
  $.post('https://www.googleapis.com//oauth2/v4/token?' + $.param(authInfo)).done(function(res, state) {
    if (state === 'success' && res.access_token) {
      var uploadVideo = window.uploadVideo = new UploadVideo();
      uploadVideo.ready(res.access_token);
    }
  });
}

/**
 * YouTube video uploader class
 *
 * @constructor
 */
var UploadVideo = function() {
  /**
   * The array of tags for the new YouTube video.
   *
   * @attribute tags
   * @type Array.<string>
   */
  this.tags = ['townhallproject'];

  /**
   * The numeric YouTube
   * [category id](https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.videoCategories.list?part=snippet&regionCode=us).
   *
   * @attribute categoryId
   * @type number
   * @default 22
   */
  this.categoryId = 25;

  /**
   * The id of the new video.
   *
   * @attribute videoId
   * @type string
   * @default ''
   */
  this.videoId = '';
  this.uploadStartTime = 0;
};


UploadVideo.prototype.ready = function(accessToken) {
  this.accessToken = accessToken;
  this.authenticated = true;
  eventHandler.uploadVideoStage3();
};

UploadVideo.prototype.handleUploadClicked = function() {
  this.uploadFile($('#video-file-field').get(0).files[0]);
};

/**
 * Uploads a video file to YouTube.
 *
 * @method uploadFile
 * @param {object} file File object corresponding to the video to upload.
 */
UploadVideo.prototype.uploadFile = function(file) {
  var metadata = {
    snippet: {
      title: $('#upload-video-form').find('input[name="title"]').val(),
      description: $('#upload-video-form').find('textarea[name="description"]').val(),
      tags: this.tags,
      categoryId: this.categoryId
    },
    status: {
      // Do NOT change this else it'll show up on the channel by default
      privacyStatus: 'private',
      // Do NOT change this else you won't be able to move it to the other channel without an extra step
      license: 'creativeCommon'
    }
  };
  var uploader = new MediaUploader({
    baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
    file: file,
    token: this.accessToken,
    metadata: metadata,
    params: {
      part: Object.keys(metadata).join(',')
    },
    onError: function(data) {
      var message = data;
      // Assuming the error is raised by the YouTube API, data will be
      // a JSON string with error.message set. That may not be the
      // only time onError will be raised, though.
      try {
        var errorResponse = JSON.parse(data);
        message = errorResponse.error.message;
      } finally {
        alert(message);
      }
    }.bind(this),
    onProgress: function(data) {
      var currentTime = Date.now();
      var bytesUploaded = data.loaded;
      var totalBytes = data.total;
      // The times are in millis, so we need to divide by 1000 to get seconds.
      var bytesPerSecond = bytesUploaded / ((currentTime - this.uploadStartTime) / 1000);
      var estimatedSecondsRemaining = (totalBytes - bytesUploaded) / bytesPerSecond;
      var percentageComplete = (bytesUploaded * 100) / totalBytes;

      $('#upload-video-progress').attr({
        value: bytesUploaded,
        max: totalBytes
      });

      $('#upload-video-percent-transferred').text(percentageComplete.toFixed(2));
      $('#upload-video-bytes-transferred').text(bytesUploaded.toFixed(0));
      $('#upload-video-total-bytes').text(totalBytes.toFixed(0));
    }.bind(this),
    onComplete: function(data) {
      eventHandler.uploadVideoStage5();
    }.bind(this)
  });
  // This won't correspond to the *exact* start of the upload, but it should be close enough.
  this.uploadStartTime = Date.now();
  uploader.upload();
};
