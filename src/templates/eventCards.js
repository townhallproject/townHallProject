import { dateFormat } from './templateUtils';

export default (townhall) => (`<div class="col-md-12 col-sm-6 event-card">
  <div class="panel panel-secondary">
    <div class="panel-heading panel-heading_${townhall.iconFlag}">
      <div class="row">
        <div class="col-xs-4">
          <div class="">

          </div>
          <p class="event-card-icon event-icon__${townhall.iconFlag} ${townhall.dateValid ? `event-icon__with-date` : ''}">${townhall.meetingType}</p>

        </div>
        <div class="col-xs-8">
          ${townhall.meetingType === 'Adopt-A-District/State' ? 
            `<h3 class="line-height-small">
              <div class="row">
                ${townhall.chamber === 'upper' && townhall.level === 'federal' ? 
                  `<span class="d-inline-block col-sm-6"> <span class="small-white">Home state MoC (not present):<br></span>${townhall.displayName} <small> (${townhall.displayDistrict})</small></span>`
                :
                  `<span class="d-inline-block col-sm-6"> <span class="small-white">Home district MoC (not present):<br></span>${townhall.displayName} <small> (${townhall.displayDistrict})</small></span>`
                }

                < span class = "d-inline-block col-sm-6" > < span class = "small-white" > Visiting MoC(will be present): < br > < /span>${townhall.districtAdopter} <small> (${townhall.districtAdopterParty}, ${townhall.districtAdopterDistrict})</small > < /span>
              </div>
            </h3>` :
            `<h3>${townhall.formattedMember} <small>${townhall.displayDistrict}</small></h3>`
            }
          
          ${townhall.dateValid ?
          `<span class="addtocalendar pull-right">
            <a class="atcb-link btn btn-white btn-md">
              <span class="calendarButton">Add to Calendar</span>
              <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
            </a>
            <var class="atc_event">
              <var class="atc_date_start">${townhall.yearMonthDay} ${townhall.timeStart24}</var>
                <var class="atc_date_end">${townhall.yearMonthDay} ${townhall.timeEnd24}</var>
                <var class="atc_timezone">${townhall.zoneString}</var>
                <var class="atc_title">${townhall.meetingType}: ${townhall.formattedMember}</var>
                <var class="atc_description">${townhall.Notes}</var>
                <var class="atc_location">${townhall.address}</var>
                <var class="atc_organizer">${townhall.party}</var>
              </var>
          </span>`: ''
                }

      </div>

      </div>
    </div>
    <div class="panel-body">
      ${townhall.eventName ? 
        `<h3 class="text-success text-center event-name">${townhall.eventName}</h3>`: ''
      }
      <span class="text-success text-center"><h4>
        <span class>
          ${townhall.repeatingEvent ?
            `${townhall.repeatingEvent}` :
        
            townhall.dateString ? 
              `${townhall.dateString}` : ''
            }
            
        </span>
      <span class="profile-summary-value"> at ${townhall.Time}${townhall.timeZone ?  `, ${townhall.timeZone}` : ''}</span></h4></span>
      <ul class="list-group list-group-flush">
        ${townhall.phoneNumber ? 
        `<li class="list-group-item list-item-no-border"> Call in number: ${townhall.phoneNumber}
        </li>`: ''
        }
        <div class="inset-line"></div>
        <li class="list-group-item list-item-no-border">
          <div class="row">
            <address class="col-xs-8 col-xs-offset-2">
              ${townhall.Location ? `${townhall.Location}<br>` : ''}
              ${townhall.address}<br>
              ${townhall.addressLink ? 
                `<a href=${townhall.addressLink} target="_blank">Directions</a></br>`
              :''}
            <address>
          </div>
        </li>
        <div class="inset-line"></div>
        ${townhall.Notes ? 
        `<li class="list-group-item list-item-no-border list-item-no-border">${townhall.Notes}
        </li>` : ''}
        ${townhall.iconFlag === 'campaign' ? `Town Hall Project lists this event and any third-party link as public information and not as an endorsement of a participating candidate, campaign, or party.` : ''}
        ${townhall.link ? 
        `<li class="list-group-item list-item-no-border pull-right">
          <a href="${townhall.link}" target="_blank">${townhall.linkName ? townhall.linkName : 'Find out more'}<i class="fa fa-chevron-right" aria-hidden="true"></i></a>
        </li>`: ''}
        ${townhall.RSVP ? 
        `<li class="list-group-item list-item-no-border pull-right">
          <a href="${townhall.RSVP}" target="_blank">${townhall.rsvpName} <i class="fa fa-chevron-right" aria-hidden="true"></i></a>
        </li>`: ''}
      </ul>
    </div>
    <div class="panel-footer">
        <small>Last Updated: ${dateFormat(townhall.lastUpdated)}</small>
              ${townhall.ada_accessible ? '<div class="ada-logo ada-logo-event-card" ></div>' : ""}

    </div>
    </div>
  </div>
</div>`
);

