import React from 'react';

const ModalBody = (({townhall}) => {
    return(
        <div class="modal-body">
            <div class="row">
                {
                townhall.meetingType === 'Adopt-A-District/State' 
                    ? <h3 class="col-xs-10 col-md-9 line-height-medium">
                        <span class="discriptor-text d-inline-block">  Home {townhall.District === 'Senate' ? state : district} MoC (not present): </span>
                        {townhall.displayName} <small> {townhall.party || ''}{townhall.state}, {townhall.displayDistrict}</small>
                        <br/>
                        <span class="discriptor-text d-inline-block">Visiting MoC (will be present):</span>
                        {townhall.districtAdopter} <small> ({townhall.districtAdopterParty}) {townhall.districtAdopterState}, {townhall.districtAdopterDistrict}</small>
                      </h3>
                    : <h3 class="col-xs-10 col-md-9">{townhall.formattedMember} <small>
                        {townhall.party || ''}
                        {townhall.displayDistrict}</small>
                      </h3>
                }
                <h3 class="col-xs-2 col-md-3">
                    <span class="addtocalendar pull-right">
                        <a class="atcb-link btn btn-white btn-md"><span class="calendarButton">Add to Calendar </span>
                        <i class="fa fa-calendar-plus-o" aria-hidden="true"></i></a>
                        <var class="atc_event">
                            <var class="atc_date_start">{townhall.yearMonthDay} {townhall.timeStart24}</var>
                            <var class="atc_date_end">{townhall.yearMonthDay} {townhall.timeEnd24}</var>
                            <var class="atc_timezone">{townhall.zoneString}</var>
                            <var class="atc_title">{townhall.meetingType}: {townhall.displayName}</var>
                            <var class="atc_description">{townhall.Notes}</var>
                            <var class="atc_location">{townhall.address}</var>
                            <var class="atc_organizer">{townhall.party}</var>
                        </var>
                    </span>
              </h3>
          </div>
        { townhall.Notes ? <p>{townhall.Notes}</p> : null }
        {
            townhall.iconFlag === 'campaign' 
            ? <p class="disclaimer-text">Town Hall Project lists this event and any
                third-party link as public information and not as an endorsement of a participating candidate, campaign, or
                party.
              </p> 
            : null
        }
    <p>
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
    </p>
    {
        townhall.address && townhall.address.match(/[0-9]{5}/g).length > 0 
        ? <p>
            <div class="map">
                <iframe width="600" height="450" frameborder="0" style="border:0"
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDQqJSJk6FsBRCtT3scm49ShAB5zZDFAys&q={addressQuery(townhall.address)}"
                    allowfullscreen>
                </iframe>
            </div>
          </p>
      : null
    }
    <p>Last Updated: {townhall.lastUpdated}</p>
    <div class="event-modal-ada">
            {
              townhall.ada_accessible 
              ? <React.Fragment> 
                  <span>ADA Accessible</span>
                  <span class="ada-logo ada-logo-event-modal"></span> 
                </React.Fragment>
              : null
            }
    </div>
</div >
    )
})

export default ModalBody;