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

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.setDistrict = this.setDistrict.bind(this);
    this.state = {
      currentDistrict: '',
      init: true,
      allTownHalls: [],
    }
  }

  componentDidMount() {

    const initialTownHalls = [];
    const { init, allTownHalls } = this.state;
    const app = this;
    var townHallsFB = firebasedb.ref('/townHalls/');
    townHallsFB.orderByChild('dateObj').on('child_added', function getSnapShot(snapshot) {
      var ele = new TownHall(snapshot.val());
      ///If no state filter show all results
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
      townHallsFB.once('value', function () {

        if (init) {
          app.setState({
            init: false,
            allTownHalls: initialTownHalls,
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
      currentDistrict
    } = this.state;
    return (
      <React.Fragment>
        <ZipSearchComponent 
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
