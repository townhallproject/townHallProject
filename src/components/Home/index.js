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
import MutualAidHubBanner from './MutualAidHubBanner'
import { isState } from '../../utils';

export default class Home extends React.Component {
  static getStateAbr(stateData) {
    if(stateData) {
      return stateData.USPS
    }
    return '';
  }
  constructor(props) {
    super(props);
    this.setDistrict = this.setDistrict.bind(this);
    this.setZip = this.setZip.bind(this);
    this.state = {
      currentDistrict: '',
      currentZip: '',
      init: true,
      allTownHalls: [],
      allStateTownHalls: [],
    }
  }

  componentDidMount() {
    const usState = isState(this.props.location);
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

  setZip(currentZip) {
    this.setState({
      currentZip
    })
  }

  render() {
    const {
      allTownHalls,
      allStateTownHalls,
      currentDistrict,
    } = this.state;
    const usState = Home.getStateAbr(isState(this.props.location));
    return (
      <React.Fragment>
        <MutualAidHubBanner />
        <ZipSearchComponent 
          usState={usState}
          setDistrict={this.setDistrict}
          setZip={this.setZip}
        />
        {/*Call to action when no events are present*/}
        <NoEventsComponent />
        <MapComponent 
          allTownHalls={allTownHalls}
          currentDistrict={currentDistrict}
          setDistrict={this.setDistrict}
          stateUPSP={this.props.stateUPSP}
          parentBB={this.props.parentBB}
          bounds={this.props.bounds}
          webGL={this.props.webGL}
          feature={this.props.feature}
        />
        <EmailSignup />
        {/*Cards showing representatives and their contact info*/}
        <RepresentativeCards 
          currentDistrict={this.state.currentDistrict}
          currentZip={this.state.currentZip}
        />
        <EventsTable 
          allTownHalls={allStateTownHalls.length ? allStateTownHalls : allTownHalls} // if state town halls are present, it's because we are on a state site
        />
        <EventModal />
      </React.Fragment>
    )
  }
};
