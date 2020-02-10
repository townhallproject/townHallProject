import React from "react";

import { Avatar, List, Icon } from 'antd';
import classNames from 'classnames';

import tableHandler from "../../../scripts/views/tableView";
import { getFilteredEvents } from "./selectors";

import Activism from '../../../Images/map/circle-activism.svg';
import Campaign from '../../../Images/map/circle-campaign.svg';
import InPerson from '../../../Images/map/circle-in-person.svg';
import Staff from '../../../Images/map/circle-staff.svg';
import Tele from '../../../Images/map/circle-tele.svg';

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
      },
      sortOn: 'dateObj'
    }
  }

  componentDidMount() {
    // tableHandler.initialFilters();

  }

  renderMissingMemberTitle(townhall) {
    return (<h4 class="line-height-medium">
      {townhall.District === 'Senate' ?
        `<span class="discriptor-text d-inline-block">Home state MoC (not present): </span>${townhall.formattedMember} <small>  ${townhall.party ? `(${townhall.party})` : ''}${townhall.displayDistrict}</small>`
        :
        `<span class="discriptor-text d-inline-block">Home district MoC (not present): </span>${townhall.formattedMember} <small>  ${townhall.party ? `(${townhall.party})` : ''}${townhall.displayDistrict}</small>`
      }
      <br /><span class="discriptor-text d-inline-block">Visiting MoC (will be present): </span>${townhall.districtAdopter} <small> (${townhall.districtAdopterParty}) ${townhall.districtAdopterState}, ${townhall.districtAdopterDistrict}</small>
    </h4>)
  }

  renderTitle(townhall) {
    townhall.makeFormattedMember();
    console.log(iconFlagToIconMap[townhall.iconFlag])
    return (
      <span class="member">
        {townhall.meetingType === 'Adopt-A-District/State' ?
          this.renderMissingMemberTitle(townhall)
          :
          (<h4 class="line-height-medium">
            {townhall.formattedMember} <small> {townhall.party && `(${townhall.party})`} {townhall.displayDistrict}</small>
          </h4>)
        }
      </span>
    )
  }

  render() {
    const {
      filters, 
      sortOn
    } = this.state;
    const {
      allTownHalls
    } = this.props;

    const currentFilteredEvents = getFilteredEvents(allTownHalls, filters, sortOn )

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

        <section className=" container container-fluid events-table-container">
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
      dataSource={currentFilteredEvents}
      renderItem={townhall => (
      <List.Item
          extra={<span className={classNames("badge", "badge-default", "badge-pill", townhall.iconFlag)}> <Icon component={iconFlagToIconMap[townhall.iconFlag]} /> {townhall.meetingType}</span>}
      >
        <List.Item.Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
            title={this.renderTitle(townhall)}
          //  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        />
          <ul class="list-inline list-inline-separated">
            {townhall.repeatingEvent ? (<li>{townhall.repeatingEvent}</li>) : townhall.dateString ? (<li>{townhall.dateString}</li>): null}
            {townhall.Time ? <li>{townhall.Time} {townhall.timeZone ? townhall.timeZone : ''}</li> : null}
            {townhall.eventName && <li>{townhall.eventName}</li>}
            {townhall.Location && <li>{townhall.Location}</li>}
            {townhall.phoneNumber && <li>{townhall.phoneNumber}</li>}
            {townhall.address &&<li>{townhall.address}</li>}
            {townhall.ada_accessible && <li className="ada-logo ada-logo-table"></li>}

          </ul>    
      </List.Item>
    )}
    />
    </section>
    </div>
  )
    return (
      <div className="hidden-xs">
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
        <section className=" container container-fluid">
          <div className="row">
            <div className="col-md-12">
              <span className="pull-right">
                <button id="scrollBtn">
                  <i className="fa fa-chevron-up fa-2x" aria-hidden="true"></i>
                </button>
              </span>
            </div>
          </div>
          <h2 className="text-primary table-title text-center">
            Upcoming Events
        </h2>
          <div className="row">
            <small>
              <ul className="list-unstyled container">
                <li>
                  <span className="text-secondary">Town Hall</span>
                  <span>
                    {" "}
                    - An open forum where lawmakers give legislative updates and
                    answer unfiltered questions from constituents.
                </span>
                </li>
                <li>
                  <span className="text-secondary">"Empty Chair" Town Hall</span>
                  <span>
                    {" "}
                    - A constituent-organized town hall held with or without the
                    invited lawmaker.
                </span>
                </li>
                <li>
                  <span className="text-secondary">Adopt-A-District/State</span>
                  <span>
                    {" "}
                    - A constituent-organized town hall featuring a lawmaker from
                    another district.
                </span>
                </li>
                <li>
                  <span className="text-secondary">Office Hours </span>
                  <span>
                    {" "}
                    - Opportunity to meet and question a lawmaker's staff. Usually
                    held in district offices but sometimes are "mobile office
                    hours."
                </span>
                </li>
                <li>
                  <span className="text-secondary">Campaign Town Hall </span>
                  <span>
                    {" "}
                    - A town hall organized by a candidate for office - whether an
                    incumbent or challenger. (Town Hall Project includes these
                    events as a public resource--not to endorse a particular
                    candidate or campaign).
                </span>
                </li>
                <li>
                  <span className="text-secondary">Ticketed Event</span>
                  <span>
                    {" "}
                    - Paid events. Typically fundraisers. (Town Hall Project
                    occasionally includes these events as a public resource--not
                    to endorse a particular candidate or campaign).
                </span>
                </li>
                <li>
                  <span className="text-secondary">TeleTown Hall Meeting </span>
                  <span>
                    {" "}
                    - A town hall conducted by conference call or online.
                </span>
                </li>
              </ul>
            </small>
          </div>
          <div>
            <ul id="all-events-table" className="list-group">
              <li className="list-group-item list-group-heading">
                <nav className="navbar navbar-default navbar-static-top ">
                  <ul className="nav navbar-nav navbar-left" id="filter-info">
                    <li>
                      <span
                        id="current-state"
                        data-current={0}
                        data-total={0}
                      ></span>
                    </li>
                  </ul>
                  <ul
                    id="all-events-table-dropdown-container"
                    className="nav navbar-nav navbar-right"
                  >
                    <li className="dropdown hidden">
                      <a
                        href="#"
                        className="dropdown-toggle hide-on-state-view"
                        data-toggle="dropdown"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Member
                      <span className="caret"></span>
                      </a>
                      <ul className="dropdown-menu">
                        <li className="downdown-title">
                          Search by member of Congress
                      </li>
                        <li role="separator" className="divider"></li>
                        <li>
                          <input
                            id="memberTypeahead"
                            type="text"
                            className="form-control dropdown-item filter"
                            data-provide="typeahead"
                            placeholder="Search by member"
                            data-filter="displayName"
                            autoComplete="off"
                          />
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown">
                      <a
                        href="#"
                        className="dropdown-toggle"
                        data-toggle="dropdown"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Party
                      <span className="caret"></span>
                      </a>
                      <ul className="dropdown-menu filter">
                        <li className="downdown-title">Filter by party</li>
                        <li role="separator" className="divider"></li>
                        <li>
                          <a
                            data-filter="party"
                            id="Democratic"
                            className="dropdown-item"
                            href="#"
                          >
                            Democratic
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="party"
                            id="Republican"
                            className="dropdown-item"
                            href="#"
                          >
                            Republican
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="party"
                            id="Independent"
                            className="dropdown-item"
                            href="#"
                          >
                            Independent
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="party"
                            id="All"
                            className="dropdown-item"
                            href="#"
                          >
                            All
                        </a>
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown">
                      <a
                        href="#"
                        className="dropdown-toggle hide-on-state-view"
                        data-toggle="dropdown"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        State
                      <span className="caret"></span>
                      </a>
                      <ul className="dropdown-menu">
                        <li className="downdown-title">Search by State</li>
                        <li role="separator" className="divider"></li>
                        <li>
                          <input
                            id="stateTypeahead"
                            type="text"
                            className="form-control dropdown-item filter"
                            data-provide="typeahead"
                            placeholder="Search by state"
                            data-filter="stateName"
                            autoComplete="off"
                          />
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown">
                      <a
                        href="#"
                        className="dropdown-toggle"
                        data-toggle="dropdown"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Event Type
                      <span className="caret"></span>
                      </a>
                      <ul className="dropdown-menu filter">
                        <li className="downdown-title">Filter by Event Type</li>
                        <li role="separator" className="divider"></li>
                        <li>
                          <a
                            data-filter="meetingType"
                            id="Town Hall"
                            className="dropdown-item"
                            href="#"
                          >
                            Town Hall
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="meetingType"
                            id="Empty Chair Town Hall"
                            className="dropdown-item"
                            href="#"
                          >
                            Empty Chair Town Hall
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="meetingType"
                            id="Adopt-A-District/State"
                            href="#"
                          >
                            Adopt-A-District/State
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="meetingType"
                            id="Office Hours"
                            className="dropdown-item"
                            href="#"
                          >
                            Office Hours
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="meetingType"
                            id="Ticketed Event"
                            className="dropdown-item"
                            href="#"
                          >
                            Ticketed Event
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="meetingType"
                            id="Tele-Town Hall"
                            className="dropdown-item"
                            href="#"
                          >
                            Tele-Town Hall
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="meetingType"
                            id="Campaign Town Hall"
                            className="dropdown-item"
                            href="#"
                          >
                            Campaign Town Hall
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="meetingType"
                            id="Youth Vote"
                            className="dropdown-item"
                            href="#"
                          >
                            Youth Vote
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="meetingType"
                            id="Voting Rights"
                            className="dropdown-item"
                            href="#"
                          >
                            Voting Rights
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="meetingType"
                            id="Other"
                            className="dropdown-item"
                            href="#"
                          >
                            Other
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="meetingType"
                            id="All"
                            className="dropdown-item"
                            href="#"
                          >
                            All
                        </a>
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown">
                      <a
                        href="#"
                        className="dropdown-toggle"
                        data-toggle="dropdown"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Sort
                      <span className="caret"></span>
                      </a>
                      <ul className="dropdown-menu sort">
                        <li className="downdown-title">Sort Table</li>
                        <li role="separator" className="divider"></li>
                        <li>
                          <a
                            data-filter="dateObj"
                            id="byDate"
                            className="dropdown-item"
                            href="#"
                          >
                            By Date
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="stateName"
                            id="byState"
                            className="dropdown-item hide-on-state-view"
                            href="#"
                          >
                            By State
                        </a>
                        </li>
                        <li>
                          <a
                            data-filter="displayName"
                            id="byName"
                            className="dropdown-item"
                            href="#"
                          >
                            By Name
                        </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </li>
              {/*end header*/}
            </ul>
            {/*end table*/}
          </div>
        </section>
        {/*end of hidden-xs div*/}
      </div>
    );
  }
};

export default EventsTable;
