import React from 'react';
import Script from 'react-load-script'

const Join = (props) => {
  return (
    <React.Fragment>
      <Script
        url="https://actionnetwork.org/widgets/v2/form/stay-up-to-date-on-our-work?format=js&source=widget"
      />
      <header>
        <section className="container container-fluid">
          <div className="col-md-6 col-md-offset-3">
            <p className="lead">Sign up now for personalized event updates for your congressional district and state! </p>
            <p>We will email you town hall events with your members of Congress, as well as send the latest news on
              upcoming
                debates in Congress and updates on our project.</p>
          </div>
        </section>
      </header>
      <section className="container container-fluid">
        <div id='can-form-area-stay-up-to-date-on-our-work' className=" col-md-6 col-md-offset-3"></div>
      </section>
      <div className="banner" id="cover">
        <div className="photo-credit text-white">
          <small>Photo credit: Trang Dang</small>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Join;