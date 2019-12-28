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

import PageComponent from '../PageComponent';

import Home from '../Home';

class App extends React.Component {
    componentDidMount() {
        init();
        // page();
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

export const renderApp = () => {
    ReactDom.render(<App />, document.getElementById("root"))
};

