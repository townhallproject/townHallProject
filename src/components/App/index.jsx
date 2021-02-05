import React from 'react';
import ReactDom from 'react-dom';
import page from 'page';

import { init, populateEventModal } from '../../scripts/views/eventView';
window.populateModal = populateEventModal;

// components
import About from '../About';
import ContactUsForm from '../ContactUsForm';
import EndOfYearReport from '../EndOfYearReport';
import Footer from '../Footer';
import Header from '../Header';
import Join from '../Join';
import MissingMemberReport from '../MissingMemberReport';
import MissingMembers from '../MissingMembers';
import PrivacyPolicyComponent from '../PrivacyPolicyComponent';
import RecessReport from '../RecessReport';
import SubmitEventForm from '../SubmitEventForm';
import TownHallPledgeAgreements from '../TownHallPledgeAgreements';
import UploadVideo from '../UploadVideo';
import IframeEmbed from '../IframeEmbed';
import PageComponent from '../PageComponent';

import Home from '../Home';
import { ORGANIZE_A_TOWN_HALL_ID, REPORT_2019_ID, REPORT_2019_LINK, REPORT_2020_ID, REPORT_2020_LINK } from '../Header/menuConstants';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.setLocation = this.setLocation.bind(this);
        this.setHash = this.setHash.bind(this);
        this.state = {
            location: location.pathname.split('/')[1]
        }
    }

    componentDidMount() {
        init();
        // page();
        this.setState({
            location: location.pathname.split('/')[1],
            hash: location.hash.replace('#', ''),
        })
    }

    setLocation(location) {
        this.setState({
            location
        })
    }

    setHash(hash) {
        if (hash === 'home') {
            location.hash = ''
        } else {
            location.hash = `#${hash}`;
        }
        this.setState({
            hash,
        })
    }

    render() {
        return (
          <div>
            <Header
              setLocation={this.setLocation}
              hash={this.state.hash}
              setHash={this.setHash}
            />

            {/** Main content & Pages */}
            <div className="tab-content">
              <PageComponent id="home" active={!this.state.hash}>
                <Home
                  stateUPSP={this.props.stateUPSP}
                  parentBB={this.props.parentBB}
                  bounds={this.props.bounds}
                  webGL={this.props.webGL}
                  feature={this.props.feature}
                  location={this.state.location}
                />
              </PageComponent>
              <PageComponent id="submit" active={this.state.hash === "submit"}>
                <SubmitEventForm />
              </PageComponent>
              <PageComponent
                id={ORGANIZE_A_TOWN_HALL_ID}
                active={this.state.hash === ORGANIZE_A_TOWN_HALL_ID}
                activeBanner
              >
                <IframeEmbed src="https://docs.google.com/document/u/1/d/e/2PACX-1vRB_BYUEiAJScIxrhlur5bDahqOWB3A_ZdPfrpVH9dduhGD-r-mqtJDpxxwUAFEcnO0y4tOLzo9wG2L/pub" />
              </PageComponent>
              <PageComponent
                id="contact"
                active={this.state.hash === "contact"}
              >
                <ContactUsForm />
              </PageComponent>
              <PageComponent id="about" active={this.state.hash === "about"}>
                <About />
              </PageComponent>
              <PageComponent id="join" active={this.state.hash === "join"}>
                <Join />
              </PageComponent>
              {/* <PageComponent id="missing-members" active={this.state.hash === 'missing-members'}>
                        <MissingMembers 
                            hash={this.state.hash}
                        />
                    </PageComponent> */}
              <PageComponent
                id="upload-video"
                active={this.state.hash === "upload-video"}
              >
                <UploadVideo />
              </PageComponent>
              <PageComponent
                id="privacy-policy"
                active={this.state.hash === "privacy-policy"}
              >
                <PrivacyPolicyComponent />
              </PageComponent>
              <TownHallPledgeAgreements />
              <PageComponent
                id={REPORT_2020_ID}
                active={this.state.hash === REPORT_2020_ID}
                activeBanner
              >
                <IframeEmbed src={REPORT_2020_LINK} />
              </PageComponent>
              <PageComponent
                id={REPORT_2019_ID}
                active={this.state.hash === REPORT_2019_ID}
              >
                <IframeEmbed src={REPORT_2019_LINK} />
              </PageComponent>
              <PageComponent id="year-four" active={false}>
                <EndOfYearReport
                  hashtag={"year-four"}
                  imageSrc={"/Images/EOY_2020_Desktop_noBG.png"}
                />
              </PageComponent>
              <PageComponent id="year-three" active={false}>
                <EndOfYearReport
                  hashtag={"year-three"}
                  imageSrc={"/Images/EOY_2019_Desktop.png"}
                />
              </PageComponent>
              <PageComponent id="year-two" active={false}>
                <EndOfYearReport
                  hashtag={"year-two"}
                  imageSrc={"/Images/lookback2018-Desktop-nobg.png"}
                />
              </PageComponent>
              <PageComponent id="year-one" active={false}>
                <EndOfYearReport
                  hashtag={"year-one"}
                  imageSrc={"/Images/EOY_Report_Layout_noBG-01-01.png"}
                />
              </PageComponent>
            </div>
            {/** END Main content & Pages */}

            {/** Single Page Resources */}
            <MissingMemberReport
              imageSrc={"/Images/Missing_Member_Report.png"}
              link={
                "https://townhallproject.com/Images/Missing_Member_Report.png?text=Missing%20Members%20Report"
              }
              iframe={
                "https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Ftownhallproject.com%2FImages%2FMissing_Member_Report.png&layout=button&size=small&mobile_iframe=true&appId=1549118422076809&width=59&height=20"
              }
            />
            <RecessReport
              imageSrc={"/Images/report-2019.png"}
              link={
                "https://townhallproject.com/Images/report-2019.png?text=AccessibilityReport"
              }
              iframe={
                "https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Ftownhallproject.com%2FImages%2Freport-2019.png&layout=button&size=small&mobile_iframe=true&appId=1549118422076809&width=59&height=20"
              }
            />
            {/** END Single Page Resources */}

            <Footer />
          </div>
        );
    }
}

export default App;

export const renderApp = (ctx) => {
    ReactDom.render(<App {...ctx}/>, document.getElementById("root"))
};

