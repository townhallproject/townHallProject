import React from 'react';

const MissingMemberReport = (props) => {
  const {
    imageSrc,
    link,
    iframe
  } = props;
  return (
    <div className="modal fade missing-members-modal" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
      <div className="modal-dialog modal-md" role="document">
        <div className="modal-content">
          <img src={imageSrc} alt="" />
          <a className="twitter-share-button"
            href={link}>
            Tweet</a>
          <iframe
            src={iframe}
            width="59" height="20" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0"
            allowtransparency="true"></iframe>
        </div>
      </div>
    </div>
  )
};

export default MissingMemberReport;