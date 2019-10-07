import { authWithYoutube } from '../models/UploadVideo';
import { UploadVideo } from '../models/UploadVideo';

const videoUploadHandler = {};

videoUploadHandler.uploadVideoStage2 = function (e) {
  $('.upload-video-stage-1').addClass('hidden');
  $('.upload-video-stage-2').removeClass('hidden');
  authWithYoutube();
};

videoUploadHandler.uploadVideoStage3 = function (e) {
  $('.upload-video-upload').unbind('click');
  $('.upload-video-upload').click(videoUploadHandler.uploadVideoStage4);
  $('.upload-video-stage-2').addClass('hidden');
  $('.upload-video-stage-3').removeClass('hidden');
  $('.upload-video-stage-5').addClass('hidden');
};

videoUploadHandler.resetVideoForm = function (e) {
  $('#upload-video-form input[type=text]').val('');
  $('#upload-video-form textarea').val('');
};

videoUploadHandler.uploadVideoStage4 = function (e) {
  $('.upload-video-upload').attr('disabled', true);
  UploadVideo.handleUploadClicked();
  $('.upload-video-stage-3').addClass('hidden');
  $('.upload-video-stage-4').removeClass('hidden');
};

videoUploadHandler.uploadVideoStage5 = function (e) {
  $('.upload-video-stage-4').addClass('hidden');
  $('.upload-video-stage-5').removeClass('hidden');
};

export default videoUploadHandler;
