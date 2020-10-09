import React from 'react';
import ModalHeader from './modal-header';
import ModalBody from './modal-body';

const EventModal = ({townhall}) => {
  
  return (
    <React.Fragment>
    {
      townhall 
        ? <div className="modal fade event-modal" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <ModalHeader townhall={townhall}/>
              <ModalBody townhall={townhall}/>
            </div>
          </div>
        </div>
      : null
    }
    </React.Fragment>
  )
};

export default EventModal;