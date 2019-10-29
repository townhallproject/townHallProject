import React from 'react';

const SubmitEventForm = (props) => {
  return (
    <React.Fragment>
      <div className='embed-container submit-embed-container'>
        <iframe
          src='https://docs.google.com/forms/d/e/1FAIpQLSfvIJikraQCZcqUpYfDZHC7KvxDUp4zcfzlLQ7RoaDQcBZUbQ/viewform?c=0&w=1'
          style={{ borderWidth: 0, frameborder: 0 }}></iframe>
      </div>
    </React.Fragment>
  )
};

export default SubmitEventForm;