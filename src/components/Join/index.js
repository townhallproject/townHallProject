import React from "react";

const Join = props => {
  return (
    <React.Fragment>
      <header>
        <section className="container container-fluid">
          <div className="col-md-6 col-md-offset-3">
            <p className="lead">
              Sign up now for personalized event updates for your
              representatives!{" "}
            </p>
            <p>
              We will email you town hall events with your members of Congress
              (plus state lawmakers in certain states), as well as send the
              latest news on upcoming debates in Congress and updates on our
              project.
            </p>
          </div>
        </section>
      </header>
      <section className="container container-fluid">
        <div
          id="can-form-area-stay-up-to-date-on-our-work"
          className=" col-md-6 col-md-offset-3"
        ></div>
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
