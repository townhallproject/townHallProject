import React from 'react';
import ModalHeader from './modal-header';
import ModalBody from './modal-body';
import {Modal} from 'antd';

const EventModal = ({visible, townhall, onCancel}) => {
  
  return (
    <React.Fragment>
    {
      townhall 
        ? 
          <Modal 
          visible={visible} 
          title={<ModalHeader townhall={townhall} />}
          onCancel={onCancel}
          footer={null}
          >
            <ModalBody townhall={townhall}/>
          </Modal>
      : null
    }
    </React.Fragment>
  )
};

export default EventModal;