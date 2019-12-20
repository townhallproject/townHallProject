import React from 'react';
import { Input, Button } from 'antd';

import './style.less';

const EmailSignup = (props) => {
  return (
    <div>
      <section className="background-email-signup email-signup--inline" id="email-signup">
        <Button type="button" className="close" data-dismiss="modal" aria-label="Close" id="close-email" shape="circle" icon="close" />
        <div className="container container-fluid">
          <h1 id="email-title" className="text-center extra-large">Sign up to receive updates on local events.</h1>
          <form id="email-signup-form">
            <div className="row">
              <div className="col-lg-8">
                <div className="col-sm-6">
                  <Input type="text" className="form-control input-lg" name="first" placeholder="First Name" />
                </div>
                <div className="col-sm-6">
                  <Input type="text" className="form-control input-lg" name="last" placeholder="Last Name" />
                </div>
                <div className="col-sm-6">
                  <Input type="email" className="form-control input-lg" name="email" placeholder="Email" />
                </div>
                <div className="col-sm-6">
                  <Input type="text" className="form-control input-lg" name="zipcode" placeholder="Zip Code" />
                </div>
                <div className="col-sm-6 hidden" id="district-subscribe">
                  <label htmlFor="districts" className="col-sm-4">Subscribe to districts:</label>
                  <Input type="text" className="form-control input-lg" name="districts" data-role="tagsinput" />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="col-xs-12">
                  <Button type="submit" name="button" id="sign-up-btn">Sign up</Button>
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