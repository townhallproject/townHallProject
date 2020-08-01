import React from "react";

import { Avatar, Button, List, Icon, Typography } from 'antd';
import classNames from 'classnames';

import tableHandler from "../../../scripts/views/tableView";
import { getFilteredEvents } from "./selectors";

import Activism from '../../../Images/map/circle-activism.svg';
import Campaign from '../../../Images/map/circle-campaign.svg';
import InPerson from '../../../Images/map/circle-in-person.svg';
import Staff from '../../../Images/map/circle-staff.svg';
import Tele from '../../../Images/map/circle-tele.svg';
import EventsTableHeader from './EventsTableHeader'
import EventsWarningBanner from '../EventsWarningBanner'
import { defaultSearchFilters } from './eventsConstants'
import { populateEventModal } from '../../../scripts/views/eventView'

import './style.less';

const iconFlagToIconMap = {
  activism: Activism, 
  campaign: Campaign,
  'in-person': InPerson,
  staff: Staff,
  tele: Tele,
}

class EventsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        meetingType: defaultSearchFilters.meetingType
      },
      sortOn: 'dateObj'
    }
  }

  updateSearchFilters = (value, type) => {
    if (!value[0]) {
      this.setState(prevState => delete prevState.filters[type])
    } else {
      this.setState(prevState => ({
        filters: {
          ...prevState.filters,
          [type]: value
        }
      }))
    }
  }

  renderMissingMemberTitle(townhall) {
    return (<h4 className="line-height-medium">
      {townhall.District === 'Senate' ?
        `<span class="discriptor-text d-inline-block">Home state MoC (not present): </span>${townhall.formattedMember} <small>  ${townhall.party ? `(${townhall.party})` : ''}${townhall.displayDistrict}</small>`
        :
        `<span class="discriptor-text d-inline-block">Home district MoC (not present): </span>${townhall.formattedMember} <small>  ${townhall.party ? `(${townhall.party})` : ''}${townhall.displayDistrict}</small>`
      }
      <br /><span className="discriptor-text d-inline-block">Visiting MoC (will be present): </span>${townhall.districtAdopter} <small> (${townhall.districtAdopterParty}) ${townhall.districtAdopterState}, ${townhall.districtAdopterDistrict}</small>
    </h4>)
  }

  renderTitle(townhall) {
    townhall.makeFormattedMember();
    return (
      <span className="member">
        {townhall.meetingType === 'Adopt-A-District/State' ?
          this.renderMissingMemberTitle(townhall)
          :
          (<h4 className="line-height-medium">
            {townhall.formattedMember} <small> {townhall.party && `(${townhall.party})`} {townhall.displayDistrict}</small>
          </h4>)
        }
      </span>
    )
  }

  onDetailsClickHandler(townhall) {
    populateEventModal(townhall)
    $('.event-modal').modal('show');
  }

  render() {
    const {
      filters, 
      sortOn
    } = this.state;
    const {
      allTownHalls
    } = this.props;

    const currentFilteredEvents = getFilteredEvents(allTownHalls, filters, sortOn)

    return (
    <div className="hidden-xs ">
      <section className="scroll-to-form text-center">
        <p>
          <a
            href="#events-table"
            className="scroll-button btn btn-white btn-lg"
          >
            <i className="fa fa-chevron-down fa-2x" aria-hidden="true"></i>
          </a>
        </p>
      </section>
      <a name="events-table" id="events-table"></a>
      <section className="container container-fluid events-table-container">
        <EventsWarningBanner />
        <EventsTableHeader
          updateSortOn={sortOn => this.setState({sortOn})}
          updateSearchFilters={this.updateSearchFilters}
        />
        <div className="row">
          <div className="col-md-12">
            <span className="pull-right">
              <button id="scrollBtn">
                <i className="fa fa-chevron-up fa-2x" aria-hidden="true"></i>
              </button>
            </span>
          </div>
        </div>
        <List
          itemLayout="vertical"
          loading={!allTownHalls.length}
          dataSource={currentFilteredEvents}
          renderItem={townhall => (
            <List.Item
              actions={[<Button type="link" onClick={() => this.onDetailsClickHandler(townhall)}>See Details</Button>]}
              extra={<span className={classNames("badge", "badge-default", "badge-pill", townhall.iconFlag)}> <Icon component={iconFlagToIconMap[townhall.iconFlag]} /> {townhall.meetingType}</span>}
            >
              <List.Item.Meta
                avatar={<Avatar src={ townhall.govtrack_id ? `https://www.govtrack.us/static/legislator-photos/${townhall.govtrack_id}-100px.jpeg` : "Images/map/circle-in-person.svg"} />}
                  title={this.renderTitle(townhall)}
                //  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
              <ul className="list-inline list-inline-separated">
                {townhall.repeatingEvent ? (<li>{townhall.repeatingEvent}</li>) : townhall.dateString ? (<li>{townhall.dateString}</li>): null}
                {townhall.Time ? <li>{townhall.Time} {townhall.timeZone ? townhall.timeZone : ''}</li> : null}
                {townhall.eventName && <li>{townhall.eventName}</li>}
                {townhall.Location && <li>{townhall.Location}</li>}
                {townhall.phoneNumber && <li>{townhall.phoneNumber}</li>}
                {townhall.address &&<li>{townhall.address}</li>}
                {townhall.ada_accessible && <li className="ada-logo ada-logo-table"></li>}
              </ul>
              {townhall.Notes && <Typography.Paragraph className="notes" ellipsis={{ rows: 1, expandable: true }}>{townhall.Notes}</Typography.Paragraph>}
              {townhall.disclaimer && <Typography.Text type="secondary" className='disclaimer'>{townhall.disclaimer}</Typography.Text>}
            </List.Item>
          )}
        />
      </section>
    </div>
  )}
};

export default EventsTable;
