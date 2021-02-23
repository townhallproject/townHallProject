import React from 'react';

import './style.less';

const Banner = (props) => {
  return (
    <div className="time-sensitive background-gray">
      <div className=" display-flex">
        <div className="happening-now-title">
          <h1>What's happening now</h1>
          <h2><i className="fa fa-chevron-right"></i></h2>
        </div>
        <div className="happening-now-content">
          <div className="text-center">
            <h3 className="text-primary">
              Exciting news! Town Hall Project is joining forces with Indivisible.{" "}
              <a
                target="_blank"
                href="https://indivisible.org/statement/town-hall-project-will-join-indivisible"
                >Learn more. <i className="fas fa-external-link-alt"></i></a>
            </h3>
            {/*<button className="btn btn-primary " type="button" name="button" id="view-accessibility-report">Infographic</button>*/}
          </div>
        </div>
      </div>
    </div>
  )
};

export default Banner;