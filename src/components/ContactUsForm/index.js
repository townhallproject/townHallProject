import React from 'react';

const ContactUsForm = (props) => {
  return (
    <React.Fragment>
      <div className='embed-container contact-embed-container'>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSffVaop5xVSxXFrRtAZsxMDqkvucAplMdC9-CPHiTXxPKQV0g/viewform?embedded=true"
          width="800" height="600" frameBorder="0" marginHeight="0" marginWidth="0">Loading...</iframe>
      </div>
    </React.Fragment>
  )
};

export default ContactUsForm;