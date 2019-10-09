export default (eventInfo) => {
  return `<div class="text-info map-popup">
  <h4 class="mapbox-popup-title">
    ${eventInfo.stateIcon ? 
    `<span class="pull-left state-icon state-icon__${eventInfo.stateAbbr}">`: ''
    }
    </span>${eventInfo.formattedMember} <small>${eventInfo.displayDistrict}</small></h4>
  ${eventInfo.Location ? `<p>${eventInfo.Location}</p>` : ''}
  <span>${eventInfo.Time} </span>
  <span>
    ${eventInfo.repeatingEvent ? `on ${eventInfo.repeatingEvent}` : `${eventInfo.date ? `on ${eventInfo.date}`: ''}`}
  </span><br>
    ${eventInfo.addressLink ?
      `<span><a href="${eventInfo.addressLink}" target="_blank">${eventInfo.address}</a></span>` :
      `${eventInfo.address ? 
        `<span>${eventInfo.address}</span>` : ''
    }`}
  </div>`
}