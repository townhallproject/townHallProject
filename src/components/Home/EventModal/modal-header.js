import React from 'react';

const ModalHeader = (({townhall}) => {
    return (
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
            <div class="modal-title">
                {
                townhall.eventName 
                    ? <h3 class="text-center">{townhall.eventName}</h3>
                    : <h3 class="text-center">{townhall.meetingType}</h3>
                }
                <span class="text-center">
                    <h4 class="hidden-xs">{townhall.dateString} 
                    <span class="profile-summary-value"> at {townhall.timeZone || ''}</span></h4>
                    <h4 class="visible-xs-block"></h4>
            <h4>{townhall.Location || ''}</h4>
                </span>
            </div>
        </div>
    )
});

export default ModalHeader;