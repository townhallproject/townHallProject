import React from 'react';
import ReactDom from 'react-dom';
import page from 'page';

import { init } from './scripts/views/eventView';

// vendor scripts
import './vendor/scripts/jquery-2.1.4';
import './vendor/scripts/jquery-ui';
import './vendor/scripts/cors-uploader';
import './vendor/scripts/geo-viewport';
import './vendor/scripts/mapbox-gl-v0.32.1';
import './vendor/scripts/tether';
import './vendor/scripts/bootstrap.min.js';
import './vendor/scripts/bootstrap3-typeahead.min.js';

// vendor style
import './vendor/styles/normalize.css';
import './vendor/styles/bootstrap-tagsinput.css';
import './vendor/styles/default.css';
import './vendor/styles/jquery-ui.min.css';
import './vendor/styles/jquery-ui.structure.min.css';
import './vendor/styles/normalize.css';
import './vendor/styles/railscasts.css';


// components
import About from './components/About';
import Banner from './components/Banner';
import ContactUsForm from './components/ContactUsForm';
import EmailSignup from './components/EmailSignup';
import EndOfYearReport from './components/EndOfYearReport';
import EventsTable from './components/EventsTable';
import Footer from './components/Footer';
import Header from './components/Header';
import Join from './components/Join';
import MapComponent from './components/MapComponent';
import MissingMemberReport from './components/MissingMemberReport';
import MissingMembers from './components/MissingMembers';
import NoEventsComponent from './components/NoEventsComponent';
import PrivacyPolicyComponent from './components/PrivacyPolicyComponent';
import RecessReport from './components/RecessReport';
import RepresentativeCards from './components/RepresentativeCards';
import SubmitEventForm from './components/SubmitEventForm';
import TownHallPledgeAgreements from './components/TownHallPledgeAgreements';
import UploadVideo from './components/UploadVideo';
import ZipSearchComponent from './components/ZipSearchComponent';

// TODO:
// fix table modals
// make components for event-modal
// make 'Home' component and import from there
// fix any lasting bugs, test reports


// local styles
import './styles/customboot.less';

import './scripts/controllers/routes';

class App extends React.Component {
  componentDidMount() {
    init();
    page();
  }
  render() {
    return (
      <div>
        <Header />
        <Banner />
        {/** TODO: Possible start of 'Home' component */}
        <div className="tab-content">
          <div role="tabpanel" className="tab-pane page active" id="home">
            <ZipSearchComponent />
            {/*Call to action when no events are present*/}
            <NoEventsComponent />
            <MapComponent />
            <EmailSignup />
            {/*Cards showing representatives and their contact info*/}
            <RepresentativeCards />
            <EventsTable />
          </div>
          <SubmitEventForm />
          <ContactUsForm />
          <About />
          <Join />
          <MissingMembers />
          <UploadVideo />
          <PrivacyPolicyComponent />
          <EndOfYearReport hashtag={'year-two'} imageSrc={'/Images/lookback2018-Desktop-nobg.png'} />
          <EndOfYearReport hashtag={'year-one'} imageSrc={'/Images/EOY_Report_Layout_noBG-01-01.png'} />
          <TownHallPledgeAgreements />

        </div>

        <div className="modal fade event-modal" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
            </div>
          </div>
        </div>

        <MissingMemberReport imageSrc={'/Images/Missing_Member_Report.png'} link={'https://townhallproject.com/Images/Missing_Member_Report.png?text=Missing%20Members%20Report'} iframe={'https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Ftownhallproject.com%2FImages%2FMissing_Member_Report.png&layout=button&size=small&mobile_iframe=true&appId=1549118422076809&width=59&height=20'} />
        <RecessReport imageSrc={'/Images/report-2019.png'} link={'https://townhallproject.com/Images/report-2019.png?text=AccessibilityReport'} iframe={'https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Ftownhallproject.com%2FImages%2Freport-2019.png&layout=button&size=small&mobile_iframe=true&appId=1549118422076809&width=59&height=20'} />
        <Footer />
      </div>
    );
  }
}

export default App;

const renderApp = () => {
  ReactDom.render(<App />, document.getElementById("root"))
};

renderApp();

