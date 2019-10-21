import React from 'react';

const EndOfYearReport = (props) => {
  const {
    imageSrc,
  } = props;
  return (
    <div className="container">
      <img src={imageSrc} alt="" />
    </div>
  )
};

export default EndOfYearReport;