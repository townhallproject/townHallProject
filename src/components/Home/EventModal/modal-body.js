import React from 'react';

const ModalBody = (({townhall}) => {
    return(
        <div className="modal-body">
            <div className="row">
                {
                townhall.meetingType === 'Adopt-A-District/State' 
                    ? <h3 className="col-xs-10 col-md-9 line-height-medium">
                        <span className="discriptor-text d-inline-block">  Home {townhall.District === 'Senate' ? 'state' : 'district'} MoC (not present): </span>
                        {townhall.displayName} <small> {townhall.party || ''}{townhall.state}, {townhall.displayDistrict}</small>
                        <br/>
                        <span className="discriptor-text d-inline-block">Visiting MoC (will be present):</span>
                        {townhall.districtAdopter} <small> ({townhall.districtAdopterParty}) {townhall.districtAdopterState}, {townhall.districtAdopterDistrict}</small>
                      </h3>
                    : <h3 className="col-xs-10 col-md-9">{townhall.formattedMember} <small>
                        {townhall.party || ''}
                        {townhall.displayDistrict}</small>
                      </h3>
                }
                <h3 className="col-xs-2 col-md-3">
                    <span className="addtocalendar pull-right">
                        <a className="atcb-link btn btn-white btn-md"><span className="calendarButton">Add to Calendar </span>
                        <i className="fa fa-calendar-plus-o" aria-hidden="true"/></a>
                        <var className="atc_event">
                            <var className="atc_date_start">{townhall.yearMonthDay} {townhall.timeStart24}</var>
                            <var className="atc_date_end">{townhall.yearMonthDay} {townhall.timeEnd24}</var>
                            <var className="atc_timezone">{townhall.zoneString}</var>
                            <var className="atc_title">{townhall.meetingType}: {townhall.displayName}</var>
                            <var className="atc_description">{townhall.Notes}</var>
                            <var className="atc_location">{townhall.address}</var>
                            <var className="atc_organizer">{townhall.party}</var>
                        </var>
                    </span>
              </h3>
          </div>
        { townhall.Notes ? <p>{townhall.Notes}</p> : null }
        {
            townhall.iconFlag === 'campaign' 
            ? <p className="disclaimer-text">Town Hall Project lists this event and any
                third-party link as public information and not as an endorsement of a participating candidate, campaign, or
                party.
              </p> 
            : null
        }
    <span>
        {
          townhall.phoneNumber 
            ? <div> Call in number: {townhall.phoneNumber}</div> 
            : null
        }
        {
          townhall.link 
          ? <div><a href="{townhall.link}" target="_blank">
                  {townhall.linkName ? townhall.linkName : 'Find out more'}
            </a></div> 
          : null
        }
        {
          townhall.RSVP 
          ? <div><a href="{townhall.RSVP}" target="_blank">{townhall.rsvpName}</a></div>
          : null
        }
    </span>
    {
        townhall.address && townhall.address.match(/[0-9]{5}/g).length > 0 
        ? <span>
            <div className="map">
                <iframe width="600" height="450" frameBorder="0" style={{border:0}}
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDQqJSJk6FsBRCtT3scm49ShAB5zZDFAys&q={addressQuery(townhall.address)}"
                    allowFullScreen>
                </iframe>
            </div>
          </span>
      : null
    }
    <p>Last Updated: {townhall.lastUpdated}</p>
    <div className="event-modal-ada">
            {
              townhall.ada_accessible 
              ? <React.Fragment> 
                  <span>ADA Accessible</span>
                  <span className="ada-logo ada-logo-event-modal"></span> 
                </React.Fragment>
              : null
            }
    </div>
</div >
    )
})

export default ModalBody;