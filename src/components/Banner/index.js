import React from 'react';

// import './style.scss';

const Banner = (props) => {
  return (
    <div className="time-sensitive background-gray">
      <div className=" display-flex">
        <div className="happening-now-title">
          <h1><span className="break">What's</span><span className="break"> happening</span> now</h1>
          <h1><i className="fa fa-chevron-right"></i></h1>
        </div>
        <div className="happening-now-content">
          <div className="text-center">
            <h2 className="text-primary">
              <a className="text-primary"
                target="_blank"
                href="https://docs.google.com/document/u/1/d/e/2PACX-1vTWD9u5IF08YH6tt76Q_S6dTwQYmm7g_2jQbZ4JaXJpEBJV0srbUfS_MseuKudHeo6YDLdyk-x1A58Z/pub">Read our September 2019 Congressional Accessibility Report and see how this Congress stacks up <i className="fa fa fa-external-link-square"></i></a>
            </h2>
            {/*<button className="btn btn-primary " type="button" name="button" id="view-accessibility-report">Infographic</button>*/}
          </div>
        </div>
      </div>
    </div>
  )
};

export default Banner;