import React from 'react';

const EndOfYearReport = (props) => {
  const {
    hashtag,
    imageSrc,
  } = props;
  return (
    <div role="tabpanel" className="tab-pane" id={hashtag}>
      <div className="container">
        <img src={imageSrc} alt="" />
      </div>
    </div>
  )
};

export default EndOfYearReport;