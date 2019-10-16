import React from 'react';

const SubmitEventForm = (props) => {
  return (
    <div role="tabpanel" className="tab-pane" id="submit">
      <div className='embed-container submit-embed-container'>
        <iframe
          src='https://docs.google.com/forms/d/e/1FAIpQLSfvIJikraQCZcqUpYfDZHC7KvxDUp4zcfzlLQ7RoaDQcBZUbQ/viewform?c=0&w=1'
          style={{ borderWidth: 0, width: 800, height: 600, frameborder: 0 }}></iframe>
      </div>
    </div>
  )
};

export default SubmitEventForm;