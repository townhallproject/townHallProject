import React from 'react';
import './style.less';
const MutualAidHubBanner = (props) => {
  return (
    <div className="time-sensitive background-gray">
      <div className="display-flex">
        <div className="happening-now-title">
          <h1>
            <span className="break">Support local</span>
            <span className="break"> communities</span>
          </h1>
          <h1>
            <i className="fa fa-chevron-right"></i>
          </h1>
        </div>
        <div className="happening-now-content">
          <h4 className="text-primary">
            Across the country Americans are organizing{" "}
            <strong>Mutual Aid Networks</strong> to support their neighbors in
            need. Find community support efforts near you at{" "}
            <a target="_blank" href="https://www.mutualaidhub.org/">
              mutualaidhub.org.
            </a>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default MutualAidHubBanner;
