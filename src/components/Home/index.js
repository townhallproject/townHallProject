import React from 'react';

import {
  firebasedb
} from '../../scripts/lib/firebasedb';

import TownHall from '../../scripts/models/TownHall';

import ZipSearchComponent from './ZipSearch';
import NoEventsComponent from './NoEventsComponent';
import MapComponent from './MapComponent';
import EmailSignup from './EmailSignup';
import RepresentativeCards from './RepresentativeCards';
import EventsTable from './EventsTable';
import EventModal from './EventModal';
import { isState } from '../../utils';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.setDistrict = this.setDistrict.bind(this);
    this.state = {
      currentDistrict: '',
      init: true,
      allTownHalls: [],
      allStateTownHalls: [],
      usState: '',
    }
  }

  componentDidMount() {
    const usState = isState(location.pathname.split('/')[1]);
    const initialTownHalls = [];
    const initialStateTownHalls = [];
    const {
      init,
      allTownHalls,
      allStateTownHalls
    } = this.state;
    const app = this;
    let totalPromises = 1;
    let numberFinished = 0;

    const federalRef = firebasedb.ref('/townHalls/');
    if (usState) {
      totalPromises = 2;
      let stateRef = firebasedb.ref('/state_townhalls/' + usState.USPS + '/');
      stateRef.orderByChild('dateObj').on('child_added', function getSnapShot(snapshot) {
        var ele = new TownHall(snapshot.val());
        if (ele.district && !ele.chamber) {
          ele.chamber = ele.district.split('-')[0] === 'HD' ? 'lower' : 'upper';
        }
        ele.level = 'state';
        ele.makeDisplayDistrict();
        if (init) {
          initialStateTownHalls.push(ele);
        } else {
          app.setState({
            allStateTownHalls: [...allStateTownHalls, ele]
          })
        }
      });
      stateRef.once('value', function () {
        numberFinished++;
        if (init && numberFinished === totalPromises) {
          app.setState({
            init: false,
            allTownHalls: initialTownHalls,
            usState: usState ? usState.USPS : null,
            allStateTownHalls: initialStateTownHalls,
          })
        }

    });
    }
    federalRef.orderByChild('dateObj').on('child_added', function getSnapShot(snapshot) {
      var ele = new TownHall(snapshot.val());
      ele.level = 'federal';
      ele.makeDisplayDistrict();
      if (init) {
        initialTownHalls.push(ele);
      } else {
        app.setState({
          allTownHalls: [...allTownHalls, ele]
        })
      }
      TownHall.addFilterIndexes(ele);
    })
    federalRef.once('value', function () {
      numberFinished++;
      if (init && numberFinished === totalPromises) {
        app.setState({
          init: false,
          allTownHalls: initialTownHalls,
          usState: usState ? usState.USPS : null,
          allStateTownHalls: initialStateTownHalls,
        })
      }
    });
  }

  setDistrict(currentDistrict) {
    this.setState({
      currentDistrict
    })
  }

  render() {
    const {
      allTownHalls,
      allStateTownHalls,
      currentDistrict,
      usState,
    } = this.state;
    console.log(this.state)
    return (
      <React.Fragment>
        <ZipSearchComponent 
          usState={usState}
          setDistrict={this.setDistrict}
        />
        {/*Call to action when no events are present*/}
        <NoEventsComponent />
        <MapComponent 
          allTownHalls={allTownHalls}
          currentDistrict={currentDistrict}
        />
        <EmailSignup />
        {/*Cards showing representatives and their contact info*/}
        <RepresentativeCards />
        <EventsTable 
          allTownHalls={allTownHalls}
        />
        <EventModal />
      </React.Fragment>
    )
  }
};
