import React from 'react';

const ModalHeader = (({townhall}) => {
    return (
        <div>
            <h3 className="text-center">{townhall.eventName ? townhall.eventName : townhall.meetingType}</h3>
            <span className="text-center">
                <h4 className="hidden-xs">{townhall.dateString} 
                <span className="profile-summary-value"> at {townhall.timeZone || ''}</span></h4>
                <h4 className="visible-xs-block"></h4>
                <h4>{townhall.Location || ''}</h4>
            </span>
        </div>
    )
});

export default ModalHeader;