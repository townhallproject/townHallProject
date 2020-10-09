import React from 'react';

const ModalHeader = (({townhall}) => {
    return (
        <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
            <div className="modal-title">
                {
                townhall.eventName 
                    ? <h3 className="text-center">{townhall.eventName}</h3>
                    : <h3 className="text-center">{townhall.meetingType}</h3>
                }
                <span className="text-center">
                    <h4 className="hidden-xs">{townhall.dateString} 
                    <span className="profile-summary-value"> at {townhall.timeZone || ''}</span></h4>
                    <h4 className="visible-xs-block"></h4>
            <h4>{townhall.Location || ''}</h4>
                </span>
            </div>
        </div>
    )
});

export default ModalHeader;