import React from 'react';
import { Dropdown, Button, Menu, Icon } from 'antd';
import Isotope from 'isotope-layout';
import { isEmpty, map, filter} from 'lodash';

import missingMemberView from '../../scripts/views/missingMembersView';
import { MISSING_MEMBER_LINK } from '../Header/menuConstants';

import './style.less';
import StateFilterButton from './StateFilterButton';
import FilterTag from './FilterTag';

class MissingMembers extends React.Component {
  static concatValues(obj) {
      let value = '.element-item';
      for (let prop in obj) {
        value += obj[prop];
      }
      return value;
    }

  constructor(props) {
    super(props);
    this.removeFilter = this.removeFilter.bind(this);
    this.state = {
      filters: {

      },
      stateCounts: [],
    }
  }

  componentDidMount() {
    missingMemberView.init()
      .then((stateCounts) => {
        this.setState({
          stateCounts,
        })
      })
      .then(() => {
        this.$grid = new Isotope('.grid', {
          itemSelector: '.element-item',
          getSortData: {
            townhall: '.townHallNumber parseInt' // text from querySelector
          },
          sortBy: 'townhall',
          sortAscending: false
        });
      })
  }

  componentDidUpdate() {
    const { filters } = this.state;
    if (this.props.hash === MISSING_MEMBER_LINK) {
      if (!missingMemberView.loading && !missingMemberView.loaded) {
        missingMemberView.init()
          .then(() => {
            this.$grid = new Isotope('.grid', {
              itemSelector: '.element-item',
              getSortData: {
                townhall: '.townHallNumber parseInt' // text from querySelector
              },
              sortBy: 'townhall',
              sortAscending: false
            });
          })
      }
    }
    // combine filters
    let filterValue = MissingMembers.concatValues(filters);
    missingMemberView.addFilter(filters, filterValue);
      
    if(this.$grid) {
      this.$grid.arrange({
        filter: filterValue
      });
    }
  }

  removeFilter(filterGroup, value) {
    const newFilters = { ...this.state.filters }
    delete newFilters[filterGroup];
    this.setState({
      filters: newFilters
    })
  }

  handleClick(filterGroup, value) {
    this.setState({
      filters: {
        ...this.state.filters,
        [filterGroup]: value
      }
    })
  }

  render() {
    const partyMenu = (
      <Menu
        onClick={(value) => this.handleClick('party', value.item.props['data-filter'])}
        data-filter-group="party"
      >
        <Menu.Item key="Democratic" data-filter=".Democratic">
          Democratic
        </Menu.Item>
        <Menu.Item key="Republican" data-filter=".Republican" >
          Republican
        </Menu.Item>
        <Menu.Item key="All" data-filter="">
          All
        </Menu.Item>
      </Menu>
    );
    const chamberMenu = (
      <Menu 
        onClick={(value) => this.handleClick('chamber', value.item.props['data-filter'])} 
        data-filter-group="chamber"
      >
        <Menu.Item key="Senate" data-filter=".Senate">
          Senate
        </Menu.Item>
        <Menu.Item key="House" data-filter=".House" >
              House
        </Menu.Item>
        <Menu.Item key="All" data-filter="">
              All
        </Menu.Item>
      </Menu>
    );
    return (
      <React.Fragment>
        <header className="missing-member-header">
          <section className="container container-fluid">
            <div className="col-md-6 col-md-offset-3">
              <p className="lead">
                <span id="mm-total-copy">Many</span> members of Congress have not held a single in-person town hall since
                January 3, 2019.
              </p>
              <p className="lead">
                Is yours one of them?
              </p>
            </div>
          </section>
          <nav className="navbar navbar-default">
            <ul className="nav navbar-nav navbar-left filter-button-group">
              <li className="block">
                {/*<!-- <div className="col-sm-6">
                          <button className="btn btn-primary btn-block" type="button" name="button" id="view-missing-member-report">View 2017 Report</button>
                          </div> -->*/}
                <div className="col-sm-6">
                  <p className="transparent" id="mm-current-state" data-current={0} data-total={0}>
                    Viewing ### of ### total missing members
                  </p>
                  {/*<!-- <p>
                          Click the
                    <i className="fas fa-address-book" aria-hidden="true"></i> icon on your member's card to download a poster
                        </p> -->*/}
                </div>
              </li>
              <li className="block filter-button-group mm-filter-info-holder">
                <ul className="nav navbar-nav" id="mm-filter-info">
                  {map(this.state.filters, (filter, key) => {
                    return (<FilterTag 
                      filter={filter}
                      category={key}
                      key={filter}
                      handleClick={this.removeFilter}
                    />)
                  })}
                </ul>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right btn-group">
           
              <Dropdown overlay={partyMenu}>
                <Button ghost>
                  Party <Icon type="down" />
                </Button>
              </Dropdown>
              <Dropdown overlay={chamberMenu}>
                <Button ghost>
                  Chamber <Icon type="down" />
                </Button>
              </Dropdown>
            </ul>
            <ul 
              className="nav navbar-nav button-group state-button-holder filter-button-group"
              onClick={({ target }) => 
                this.handleClick('state', target.getAttribute('data-filter')),
                console.log("Why do you fire without a click!")
              }
              data-filter-group="state"
              >
       
                {this.state.stateCounts.map((ele) => {
                  return (
                    <StateFilterButton 
                      category={ele.Category}
                      count={ele.count}
                      key={ele.categoryID}
                      categoryID={ele.categoryID}
                    /> 
                  )
                })}
            </ul>
          </nav>
        </header>
        <div className="inset">
        </div>
        <div className="missing-member-cards-container">
          <div className="container">
            <div className="grid">
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default MissingMembers;