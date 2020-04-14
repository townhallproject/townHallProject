import React from 'react';

const MutualAidHubBanner = (props) => {
  return (
    <div className="time-sensitive">
      <div className="display-flex">
        <div className="happening-now-title">
          <h1><span className="break">Support local</span><span className="break"> communities</span></h1>
          <h1><i className="fa fa-chevron-right"></i></h1>
        </div>
        <div className="happening-now-content">
          <div className="text-center">
            <h3 className="text-primary">
              <a
                target="_blank"
                href="https://www.mutualaidhub.org/"
              >
                Across the country Americans are organizing Mutual Aid Networks to support their neighbors in need. Find community support efforts near you at mutualaidhub.org.
              </a>
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
};

export default MutualAidHubBanner;
