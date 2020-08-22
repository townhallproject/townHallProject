import React from 'react';
import { dateFormat } from '../../templates/templateUtils';
import './style.less';


export default (props) => {
  const {
    townhall
  } = props;
  const adoptADistrict = (
    <h3 className="line-height-small">
      <div className="row">
        {townhall.chamber === 'upper' && townhall.level === 'federal' ?
          (<span className="d-inline-block col-sm-6"> <span className="small-white">Home state MoC (not present):<br /></span>{townhall.Member} <small> ({townhall.displayDistrict})</small></span>)
          :
          (<React.Fragment>
            <span className="d-inline-block col-sm-6"> <span className="small-white">Home district MoC (not present):<br /></span>{townhall.Member} <small> ({townhall.displayDistrict})</small></span>
            <span className="d-inline-block col-sm-6"> <span className="small-white"> Visiting MoC(will be present): <br /> </span>{townhall.districtAdopter} <small> ({townhall.districtAdopterParty}, {townhall.districtAdopterDistrict})</small> </span>
          </React.Fragment>
          )
        }
      </div>
    </h3>
  );

  const addToCalendar = (
    <span className="addtocalendar pull-right">
      <a className="atcb-link btn btn-white btn-md">
        <span className="calendarButton">Add to Calendar</span>
        <i className="fa fa-calendar-plus-o" aria-hidden="true"></i>
      </a>
      <var className="atc_event">
        <var className="atc_date_start">{townhall.yearMonthDay} {townhall.timeStart24}</var>
        <var className="atc_date_end">{townhall.yearMonthDay} {townhall.timeEnd24}</var>
        <var className="atc_timezone">{townhall.zoneString}</var>
        <var className="atc_title">{townhall.meetingType}: {townhall.formattedMember}</var>
        <var className="atc_description">{townhall.Notes}</var>
        <var className="atc_location">{townhall.address}</var>
        <var className="atc_organizer">{townhall.party}</var>
      </var>
    </span>
  );
  return (
      <div className="panel panel-secondary">
        <div className={`panel-heading panel-heading_${townhall.iconFlag}`}>
          <div className="row">
            <div className="col-xs-4">
              <div className="">
              </div>
              <p className={`event-card-icon event-icon__${townhall.iconFlag} ${townhall.dateValid ? `event-icon__with-date` : ''}`}>{townhall.meetingType}</p>
            </div>
            <div className="col-xs-8">
              {townhall.meetingType === 'Adopt-A-District/State' ?
                adoptADistrict
                :
                (<h3>{townhall.formattedMember || townhall.displayName} <small>{townhall.displayDistrict}</small></h3>)
              }
              {
                townhall.dateValid
                &&
                addToCalendar
              }
            </div>

          </div>
        </div>
        <div className="panel-body">
          {townhall.eventName &&
            (<h3 className="text-success text-center event-name">{townhall.eventName}</h3>)
          }
          <span className="text-success text-center"><h4>
            <span class>
              {
                townhall.repeatingEvent ? townhall.repeatingEvent : townhall.dateString
              }
            </span>
            <span className="profile-summary-value"> at {townhall.Time} {townhall.timeZone ?  `, ${townhall.timeZone}` : ''}</span></h4></span>
          <ul className="list-group list-group-flush">
            {townhall.phoneNumber &&
              (<li className="list-group-item list-item-no-border"> Call in number: {townhall.phoneNumber} </li>)
            }
            <div className="inset-line"></div>
            <li className="list-group-item list-item-no-border">
              <div className="row">
                <address className="col-xs-8 col-xs-offset-2">
                  {townhall.Location || null}<br />
                  {townhall.address}<br />
                  {townhall.addressLink &&
                    (<a href={townhall.addressLink} target="_blank">Directions</a>)
                  }
                  <br />
                </address>
              </div>
            </li>
            <div className="inset-line"></div>
            {townhall.Notes &&
              (<li className="list-group-item list-item-no-border list-item-no-border">{townhall.Notes}</li>)}
            {townhall.link &&
              (<li className="list-group-item list-item-no-border pull-right">
                <a href="{townhall.link}" target="_blank">{townhall.linkName ? townhall.linkName : 'Find out more'}<i className="fa fa-chevron-right" aria-hidden="true"></i></a>
              </li>)}
            {townhall.RSVP &&
              (<li className="list-group-item list-item-no-border pull-right">
                <a href="{townhall.RSVP}" target="_blank">{townhall.rsvpName} <i className="fa fa-chevron-right" aria-hidden="true"></i></a>
              </li>)}
          </ul>
        </div>
        <div className="panel-footer">
          <small>Last Updated: {dateFormat(townhall.lastUpdated)}</small>
        </div>
      </div>
  );
}