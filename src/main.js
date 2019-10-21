import React from 'react';
import ReactDom from 'react-dom';
import page from 'page';

import { init, populateEventModal } from './scripts/views/eventView';
window.populateModal = populateEventModal;

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
import ContactUsForm from './components/ContactUsForm';
import EndOfYearReport from './components/EndOfYearReport';
import Footer from './components/Footer';
import Header from './components/Header';
import Join from './components/Join';
import MissingMemberReport from './components/MissingMemberReport';
import MissingMembers from './components/MissingMembers';
import PrivacyPolicyComponent from './components/PrivacyPolicyComponent';
import RecessReport from './components/RecessReport';
import SubmitEventForm from './components/SubmitEventForm';
import TownHallPledgeAgreements from './components/TownHallPledgeAgreements';
import UploadVideo from './components/UploadVideo';

import PageComponent from './components/PageComponent';

// local styles
import './styles/customboot.less';

import './scripts/controllers/routes';
import Home from './components/Home';

class App extends React.Component {
  componentDidMount() {
    init();
    page();
  }
  render() {
    return (
      <div>
        <Header />

        {/** Main content & Pages */}
        <div className="tab-content">
          <PageComponent id="home" active activeBanner>
            <Home />
          </PageComponent>
          <PageComponent id="submit" active={false} activeBanner>
            <SubmitEventForm />
          </PageComponent>
          <PageComponent id="contact" active={false} activeBanner>
            <ContactUsForm />
          </PageComponent>
          <PageComponent id="about" active={false} activeBanner>
            <About />
          </PageComponent>
          <PageComponent id="join" active={false} activeBanner>
            <Join />
          </PageComponent>
          <PageComponent id="missing-members" active={false}>
            <MissingMembers />
          </PageComponent>
          <PageComponent id="upload-video" active={false} activeBanner>
            <UploadVideo />
          </PageComponent>
          <PageComponent id="privacy-policy" active={false}>
            <PrivacyPolicyComponent />
          </PageComponent>
          <TownHallPledgeAgreements />
          <PageComponent id="year-two" active={false}>
            <EndOfYearReport hashtag={'year-two'} imageSrc={'/Images/lookback2018-Desktop-nobg.png'} />
          </PageComponent>
          <PageComponent id="year-one" active={false}>
            <EndOfYearReport hashtag={'year-one'} imageSrc={'/Images/EOY_Report_Layout_noBG-01-01.png'} />
          </PageComponent>
        </div>
        {/** END Main content & Pages */}

        {/** Single Page Resources */}
        <MissingMemberReport imageSrc={'/Images/Missing_Member_Report.png'} link={'https://townhallproject.com/Images/Missing_Member_Report.png?text=Missing%20Members%20Report'} iframe={'https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Ftownhallproject.com%2FImages%2FMissing_Member_Report.png&layout=button&size=small&mobile_iframe=true&appId=1549118422076809&width=59&height=20'} />
        <RecessReport imageSrc={'/Images/report-2019.png'} link={'https://townhallproject.com/Images/report-2019.png?text=AccessibilityReport'} iframe={'https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Ftownhallproject.com%2FImages%2Freport-2019.png&layout=button&size=small&mobile_iframe=true&appId=1549118422076809&width=59&height=20'} />
        {/** END Single Page Resources */}

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

