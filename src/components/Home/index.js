import React from 'react';

import ZipSearchComponent from './ZipSearch';
import NoEventsComponent from './NoEventsComponent';
import MapComponent from './MapComponent';
import EmailSignup from './EmailSignup';
import RepresentativeCards from './RepresentativeCards';
import EventsTable from './EventsTable';
import EventModal from './EventModal';

const Home = (props) => {
  return (
    <React.Fragment>
      <ZipSearchComponent />
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
};

export default Home;