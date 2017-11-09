(function(module) {
  videoUploadHandler = {};

  videoUploadHandler.uploadVideoStage2 = function(e) {
    $('.upload-video-stage-1').addClass('hidden');
    $('.upload-video-stage-2').removeClass('hidden');
    authWithYoutube();
  };

  videoUploadHandler.uploadVideoStage3 = function(e) {
    $('.upload-video-upload').unbind('click');
    $('.upload-video-upload').click(eventHandler.uploadVideoStage4);
    $('.upload-video-stage-2').addClass('hidden');
    $('.upload-video-stage-3').removeClass('hidden');
    $('.upload-video-stage-5').addClass('hidden');
  };

  videoUploadHandler.resetVideoForm = function(e) {
    $('#upload-video-form input[type=text]').val('');
    $('#upload-video-form textarea').val('');
  };

  videoUploadHandler.uploadVideoStage4 = function(e) {
    $('.upload-video-upload').attr('disabled', true);
    uploadVideo.handleUploadClicked();
    $('.upload-video-stage-3').addClass('hidden');
    $('.upload-video-stage-4').removeClass('hidden');
  };

  videoUploadHandler.uploadVideoStage5 = function(e) {
    $('.upload-video-stage-4').addClass('hidden');
    $('.upload-video-stage-5').removeClass('hidden');
  };

  $(document).ready(function() {
    init();
  });

  function init() {
    
    $('button.upload-video-begin').click(eventHandler.uploadVideoStage2);
    $('#upload-another').on('click', eventHandler.resetVideoForm);
    $('#video-file-field').change(function(){
      $('.upload-video-upload').attr('disabled', false);
    });
  }

  module.videoUploadHandler = videoUploadHandler;
})(window);
