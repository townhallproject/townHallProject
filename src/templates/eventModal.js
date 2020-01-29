import {
  dateFormat, 
  shortDateTime,
  addressQuery,
} from './templateUtils';

export default (eventInfo) => {
  return `<div class="modal-header">
  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <div class="modal-title">
    ${eventInfo.eventName ?
      `<h3 class="text-center">${eventInfo.eventName}</h3>` 
    :
      `<h3 class="text-center">${eventInfo.meetingType}</h3>`
    }
    <span class="text-center">
      <h4 class="hidden-xs">${eventInfo.dateString} <span class="profile-summary-value"> at ${eventInfo.Time}${eventInfo.timeZone ? `, ${eventInfo.timeZone}` : ''}</span></h4>
      <h4 class="visible-xs-block">${shortDateTime(eventInfo)}</h4>
      ${eventInfo.Location ? `<h4>${eventInfo.Location}</h4>`: ''}
    </span>
  </div>
</div>
<div class="modal-body">
  <div class="row">
    ${eventInfo.meetingType === 'Adopt-A-District/State' ? 
      `<h3 class="col-xs-10 col-md-9 line-height-medium">
        ${eventInfo.District === 'Senate' ?
          `<span class="discriptor-text d-inline-block">Home state MoC (not present): </span>
          ${eventInfo.displayName} <small>  ${eventInfo.party ? `(${eventInfo.party})` :''}${eventInfo.state}, ${eventInfo.displayDistrict}</small>`
        :
          `<span class="discriptor-text d-inline-block">Home district MoC (not present): </span>${eventInfo.displayName} <small>  ${eventInfo.party ? `(${eventInfo.party})` :''}${eventInfo.state}, ${eventInfo.displayDistrict}</small>`
        }
        <br>
        <span class="discriptor-text d-inline-block">Visiting MoC (will be present): </span>${eventInfo.districtAdopter} <small> (${eventInfo.districtAdopterParty}) ${eventInfo.districtAdopterState}, ${eventInfo.districtAdopterDistrict}</small>
      </h3>`
    :
      `<h3 class="col-xs-10 col-md-9">${eventInfo.formattedMember} <small>
        ${eventInfo.party ?
        `(${eventInfo.party})`
        : '' }
        ${eventInfo.displayDistrict}</small></h3>`
    }
    <h3 class="col-xs-2 col-md-3">
      <span class="addtocalendar pull-right">
        <a class="atcb-link btn btn-white btn-md"><span class="calendarButton">Add to Calendar </span><i class="fa fa-calendar-plus-o" aria-hidden="true"></i></a>
        <var class="atc_event">
          <var class="atc_date_start">${eventInfo.yearMonthDay} ${eventInfo.timeStart24}</var>
            <var class="atc_date_end">${eventInfo.yearMonthDay} ${eventInfo.timeEnd24}</var>
            <var class="atc_timezone">${eventInfo.zoneString}</var>
            <var class="atc_title">${eventInfo.meetingType}: ${eventInfo.displayName}</var>
            <var class="atc_description">${eventInfo.Notes}</var>
            <var class="atc_location">${eventInfo.address}</var>
            <var class="atc_organizer">${eventInfo.party}</var>
          </var>
        </var>
      </span>
    </div>
  </h3>

  ${eventInfo.Notes ?
    `<p>${eventInfo.Notes}</p>` : ''}
  <p>
    ${eventInfo.phoneNumber ? 
      `<div> Call in number: ${eventInfo.phoneNumber}</div>`: ''
      }
    ${eventInfo.link ?
      `<div><a href="${eventInfo.link}" target="_blank">
        ${eventInfo.linkName ? eventInfo.linkName : 'Find out more'}
      </a></div>` : ''}
    ${eventInfo.RSVP ? 
      `<div><a href="${eventInfo.RSVP}" target="_blank">${eventInfo.rsvpName}</a></div>` : ''}
  </p>
  ${eventInfo.address && eventInfo.address.match(/[0-9]{5}/g).length > 0 ? 
    `<p>
      <div class="map">
        <iframe
          width="600"
          height="450"
          frameborder="0" style="border:0"
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDQqJSJk6FsBRCtT3scm49ShAB5zZDFAys&q=${addressQuery(eventInfo.address)}" allowfullscreen>
        </iframe>
      </div>
    </p>`
    :
  `<p>Last Updated: ${dateFormat(eventInfo.lastUpdated)}</p>`
    }
    <div class="event-modal-ada">
      ${eventInfo.ada_accessible ?
        '<span>ADA Accessible</span><span class="ada-logo ada-logo-event-modal"></span>' : ""}
    </div>
</div>`
}
