import React from 'react';
import {
  Button,
  Menu,
  Icon
} from 'antd';

// import './style.scss';

const EmailSignup = (props) => {
  return (
    <div>
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
                  <button type="submit" name="button" className="btn btn-primary btn-light-background btn-lg btn-block">Sign up</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
      <div id="email-update" className="hidden background-light-blue container-fluid">
          <p id="town-hall-paragraph"
          style={{marginTop: '1%', width: '49%', display: 'inline-block', fontWeight: 'bold'}}
          >To receive automated alerts by text, text "TOWN HALL" to 202-849-7377</p>
        <Button
          style={{verticalAlign: 'top' }}
            type="danger"
            shape="round"
            size="large"
            id="open-email-form" className="btn btn-xs">
            Update your email subscription
          </Button>
          <p id="thank-you-message" className="hidden"
         style={{marginTop: '1%', width: '49%', fontWeight: 'bold'}}
         >Thank you for signing up to receive email alerts for town halls near you and other opportunities to show up and speak out.</p>
      </div>
    </div>
  )
};

export default EmailSignup;