import React from 'react';

const IFrameEmbed = (props) => {
  return (
    <React.Fragment>
      <div className='embed-container submit-embed-container'>
        <iframe
          src={props.src}
          style={{ borderWidth: 0, frameborder: 0 }}></iframe>
      </div>
    </React.Fragment>
  )
};

export default IFrameEmbed;