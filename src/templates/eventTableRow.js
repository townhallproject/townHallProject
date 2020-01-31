import { json } from './templateUtils';

export default (townhall) => {
return `<li id="${townhall.eventId}"
  class="event-row list-group-item ${townhall.Notes ? 'has-notes' : ''}"
  data-Main_State-filter="${townhall.State}"
  data-Member-filter="${townhall.displayName}"
  ${townhall.Notes ? 
    `data-toggle="collapse"
    data-target="#notes-${townhall.eventId}"
    title="Click to toggle notes"` : '' }
  >
  <span class="member">
    ${townhall.meetingType === 'Adopt-A-District/State' ? 
      `<h4 class="line-height-medium">
        ${townhall.District === 'Senate' ? 
          `<span class="discriptor-text d-inline-block">Home state MoC (not present): </span>${townhall.formattedMember} <small>  ${townhall.party ? `(${townhall.party})`: ''}${townhall.displayDistrict}</small>`
        :
          `<span class="discriptor-text d-inline-block">Home district MoC (not present): </span>${townhall.formattedMember} <small>  ${townhall.party ? `(${townhall.party})` : ''}${townhall.displayDistrict}</small>`
        }
        <a data-toggle="modal" data-target=".event-modal" onclick="populateModal(${json(townhall)})">Details</a>
        <br/><span class="discriptor-text d-inline-block">Visiting MoC (will be present): </span>${townhall.districtAdopter} <small> (${townhall.districtAdopterParty}) ${townhall.districtAdopterState}, ${townhall.districtAdopterDistrict}</small>
      </h4>`
    :
      `<h4>
        ${townhall.formattedMember} <small> ${townhall.party ? `(${townhall.party})` : ''} ${townhall.displayDistrict}</small>
        <a data-toggle="modal" data-target=".event-modal" onclick="populateModal(${json(townhall)})">Details</a>
      </h4>`
      }
    <span class="badge badge-default badge-pill pull-right"> ${townhall.meetingType}</span>
  </span>
  <ul class="list-inline list-inline-separated">
    ${townhall.repeatingEvent ? `<li>${townhall.repeatingEvent}</li>` : 
      `${townhall.dateString ? 
        `<li>${townhall.dateString}
        </li>` : '' }`
    }
    ${townhall.Time ? 
      `<li>${townhall.Time}${townhall.timeZone ? `, ${townhall.timeZone}` : '' }</li>` : ''}
    ${townhall.eventName ?
      `<li>${townhall.eventName}</li>` : ''}
    ${townhall.Location ?
      `<li>${townhall.Location}</li>` : ''}
    ${townhall.phoneNumber ?
      `<li>${townhall.phoneNumber}</li>` : ''}
    ${townhall.address ? 
      `<li>${townhall.address}</li>` : ''}
    ${townhall.ada_accessible ? 
      `<li class="ada-logo ada-logo-table"t></li>` : ''}
  </ul>
  ${townhall.Notes ? 
    `<div id="notes-${townhall.eventId}" class="collapse notes">${townhall.Notes}</div>`: ''}
</li>`
}
