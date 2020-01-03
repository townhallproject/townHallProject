import React from 'react';

// import './style.scss';

const EmailSignup = (props) => {
  return (
    <div>
      <section className="email-signup--inline hidden" id="missing-member-banner">
        <div className="container container-fluid">
          <div className="row">
            <h2 className="text-center extra-large">August Recess 2017</h2>
            <div className="col-sm-6 graphs">
              <h4 className="text-primary table-title text-center">Members of Congress holding town halls</h4>
              <dt>Senate</dt>
              <div className="progress">
                <div className="progress-bar progress-bar-dem-no-events dem-senate" data-count={48}>
                  <span className="sr-only">Democratic no events</span>
                </div>
                <div className="progress-bar progress-bar-dem-has-events dem-aug-progress-senate" data-count={0}>
                  <span className="sr-only">Democratic progress</span>
                </div>
                <div className="progress-bar progress-bar-rep-has-events rep-aug-progress-senate" data-count={0}>
                  <span className="sr-only">Republican progress</span>
                </div>
                <div className="progress-bar progress-bar-rep-no-events rep-senate" data-count={52}>
                  <span className="sr-only">Republican no events</span>
                </div>
              </div>
              <dt>House</dt>
              <div className="progress">
                <div className="progress-bar progress-bar-dem-no-events dem-house" data-count={194}>
                  <span className="sr-only">Democratic progress</span>
                </div>
                <div className="progress-bar progress-bar-dem-has-events dem-aug-progress-house" data-count={0}>
                  <span className="sr-only">Democratic progress</span>
                </div>
                <div className="progress-bar progress-bar-rep-has-events rep-aug-progress-house" data-count={0}>
                  <span className="sr-only">Republican progress</span>
                </div>
                <div className="progress-bar progress-bar-rep-no-events rep-house" data-count={240}>
                  <span className="sr-only">Republican progress</span>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-6">
                  <dl className="dl-horizontal progress-bar-key">
                    <dt className="key progress-bar-dem-no-events"></dt>
                    <dd>Democrats without town halls</dd>
                  </dl>
                  <dl className="dl-horizontal progress-bar-key">
                    <dt className="key progress-bar-dem-has-events"></dt>
                    <dd>Democrats holding town halls</dd>
                  </dl>
                </div>
                <div className="col-xs-6">
                  <dl className="dl-horizontal progress-bar-key">
                    <dt className="key progress-bar-rep-no-events"></dt>
                    <dd>Republicans without town halls</dd>
                  </dl>
                  <dl className="dl-horizontal progress-bar-key">
                    <dt className="key progress-bar-rep-has-events"></dt>
                    <dd>Republicans holding town halls</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="col-sm-6 graphs">
              <dl className="dl-horizontal graph">
                <h4 className="text-primary table-title text-center">Total number of town halls</h4>
                <dt>Senate</dt>
                <dd>
                  <div className="progress bar-graph">
                    <div className="progress-bar progress-bar-dem-has-events dem-aug-total-senate" data-count={0}
                      data-max={100}>
                      <span className="sr-only">Democratic progress</span>
                    </div>
                  </div>
                  <div className="progress bar-graph">
                    <div className="progress-bar progress-bar-rep-has-events rep-aug-total-senate" data-count={0}
                      data-max={100}>
                      <span className="sr-only">Democratic progress</span>
                    </div>
                  </div>
                </dd>
                <dt>House</dt>
                <dd>
                  <div className="progress bar-graph">
                    <div className="progress-bar progress-bar-dem-has-events dem-aug-total-house" data-count={0} data-max={100}>
                      <span className="sr-only">Democratic progress</span>
                    </div>
                  </div>
                  <div className="progress bar-graph">
                    <div className="progress-bar progress-bar-rep-has-events rep-aug-total-house" data-count={0} data-max={100}>
                      <span className="sr-only">Democratic progress</span>
                    </div>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </section>
      <section className="background-light-blue email-signup--inline" id="email-signup">
        <button type="button" className="close" data-dismiss="modal" aria-label="Close" id="close-email">
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="container container-fluid">
          <h1 id="email-title" className="text-center extra-large">Sign up to receive updates on local events.</h1>
          <form id="email-signup-form">
            <div className="row">
              <div className="col-lg-8">
                <div className="col-sm-6">
                  <input type="text" className="form-control input-lg" name="first" placeholder="First Name" />
                </div>
                <div className="col-sm-6">
                  <input type="text" className="form-control input-lg" name="last" placeholder="Last Name" />
                </div>
                <div className="col-sm-6">
                  <input type="email" className="form-control input-lg" name="email" placeholder="Email" />
                </div>
                <div className="col-sm-6">
                  <input type="text" className="form-control input-lg" name="zipcode" placeholder="Zip Code" />
                </div>
                <div className="col-sm-6 hidden" id="district-subscribe">
                  <label htmlFor="districts" className="col-sm-4">Subscribe to districts:</label>
                  <input type="text" className="form-control input-lg" name="districts" data-role="tagsinput" />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="col-xs-12">
                  <button type="submit" name="button" className="btn btn-primary btn-light-background btn-lg btn-block">Sign
                      up</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
      <div id="email-update" className="hidden background-light-blue container-fluid">
        <button id="open-email-form" className="btn btn-xs">Update your email subscription</button>
      </div>
    </div>
  )
};

export default EmailSignup;