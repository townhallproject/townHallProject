import React from 'react';

import './style.less';

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
            <h3 className="text-primary">
              <a
                target="_blank"
                href="https://secure.actblue.com/donate/townhallproject2019"
                >Help Town Hall Project hold lawmakers accountable in 2020. Stand up for democracy and support us today. <i className="fas fa-external-link-alt"></i></a>
            </h3>
            {/*<button className="btn btn-primary " type="button" name="button" id="view-accessibility-report">Infographic</button>*/}
          </div>
        </div>
      </div>
    </div>
  )
};

export default Banner;