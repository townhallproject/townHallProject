import React from 'react';

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
      currentDistrict: ''
    }
  }

  setDistrict(currentDistrict) {
    this.setState({
      currentDistrict
    })
  }
  render() {
    return (
      <React.Fragment>
        <ZipSearchComponent 
          setDistrict={this.setDistrict}
        />
        {/*Call to action when no events are present*/}
        <NoEventsComponent />
        <MapComponent />
        <EmailSignup />
        {/*Cards showing representatives and their contact info*/}
        <RepresentativeCards />
        <EventsTable />
        <EventModal />
      </React.Fragment>
    )
  }
};

