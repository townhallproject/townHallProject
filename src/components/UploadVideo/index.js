import React from 'react';

const UploadVideo = (props) => {
  return (
    <React.Fragment>
      <section className="container">
        <h1 className="text-primary text-center">Share your Town Hall Videos</h1>
        <div className="col-sm-8 col-sm-offset-2 upload-video-stage-1 text-center">
          <h3 className="margin-bottom">Have a video from a town hall you want to share?</h3>
          <button className="btn btn-primary btn-lg btn-light-background upload-video-begin center-block">Click to begin
                uploading</button>
        </div>
        <div className="col-sm-8 col-sm-offset-2 upload-video-stage-2 hidden">
          <h3>Authorizing with youtube, please wait...</h3>
        </div>
        <div className="col-sm-8 col-sm-offset-2 upload-video-stage-3 hidden">
          <form id="upload-video-form">
            <h3>Video Information</h3>
            <div>
              <input type="text" className="form-control" name="title" placeholder="Title (event and date)" />
            </div>
            <div>
              <textarea className="form-control" name="description"
                placeholder="Please tell us about any particularly powerful questions, answers or other moments--and the relevant timecode when possible"></textarea>
            </div>
            <div>
              <input type="file" id="video-file-field" className="button form-control" accept="video/*" />
            </div>
            <div>
              <em>By uploading a video you grant the Town Hall Project permission to use the video and share it with
                the public.
                You also certify that you own all rights to the content or that you are authorized by the owner to
                make
                    the content publicly available.</em>
            </div>
            <button name="button" className="btn btn-primary btn-light-background btn-lg upload-video-upload"
              disabled={true}>Upload my video</button>
          </form>
        </div>
        <div className="col-sm-8 col-sm-offset-2 upload-video-stage-4 hidden">
          <h3>
            <div className="d-inline-block margin-bottom">Upload in progress:</div>
            <div className="d-inline-block margin-bottom">
              <progress id="upload-video-progress" max="1" value="0"></progress>
            </div>
            <div className="d-inline-block margin-bottom">
              <span id="upload-video-percent-transferred"></span>% complete.</div>
            <div className="d-inline-block margin-bottom">About
                  <span id="upload-video-seconds-remaining"></span> remaining.</div>
          </h3>
        </div>
        <div className="col-sm-8 col-sm-offset-2 upload-video-stage-5 hidden">
          <h3>Your video has been successfully uploaded. It will be reviewed by our team shortly. Thank you!</h3>
          <button className="btn btn-primary btn-lg btn-light-background upload-video-begin center-block" id="upload-another">Upload
                another video</button>
        </div>
      </section>
    </React.Fragment>
  )
}

export default UploadVideo;