import React from 'react';
import {
  Menu,
  Icon
} from 'antd';

import './style.less';

const Header = (props) => {
  return (
    <Menu className="main-nav-menu" selectedKeys={[1]} mode="horizontal" style={{ lineHeight: '60px' }}>
      <Menu.Item key="home">
        <a data-toggle="tab" href="#home" className="navbar-brand hash-link brand-icon">
          <img src="/Images/THP_logo_horizontal_simple.png" alt=""></img>
        </a>
      </Menu.Item>
      <Menu.Item key="get-involved">
        Get Involved
      </Menu.Item>
      <Menu.Item key="submit-event">
        Submit an Event
      </Menu.Item>
      <Menu.Item key="share">
        Share Your Experience
      </Menu.Item>
      <Menu.Item key="learn">
        Learn about Congress
      </Menu.Item>
      <Menu.Item key="news">
        In the News
      </Menu.Item>
      <Menu.Item key="about">
        <a href="#about">
          About us
        </a>
      </Menu.Item>
      <Menu.Item key="states">
        States
        </Menu.Item>
      <Menu.Item key="donate">
        <Icon type="mail" />
        Donate
      </Menu.Item>
    </Menu>
  )
}

// const Header = (props) => {
//   return (
//     <nav className="navbar navbar-default navbar-main">
//       <div className="container-fluid">
//         <div className="navbar-header">
//           <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-nav"
//             aria-expanded="false">
//             <span className="sr-only">Toggle navigation</span>
//             <span className="icon-bar"></span>
//             <span className="icon-bar"></span>
//             <span className="icon-bar"></span>
//           </button>
//           <a data-toggle="tab" href="#home" className="navbar-brand hash-link" id="brand-icon">
//             <img src="/Images/THP_logo_horizontal_simple.png" alt=""></img>
//           </a>
//         </div>
//         <div className="collapse navbar-collapse" id="main-nav">
//           <ul className="nav navbar-nav navbar-left" roll="tablists">
//             <li className="dropdown dropdown--stateSelection">
//               <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true"
//                 aria-expanded="true">
//                 <span className="button-text">State Legislatures</span>
//                 <span className="caret"></span>
//               </button>
//               <ul className="dropdown-menu">
//                 <li>
//                   <a href="/" className="stateNav-federal">Federal</a>
//                 </li>
//                 <li>
//                   <a href="/arizona" className="stateNav-arizona">Arizona</a>
//                 </li>
//                 <li>
//                   <a href="/colorado" className="stateNav-colorado">Colorado</a>
//                 </li>
//                 <li>
//                   <a href="/florida" className="stateNav-florida">Florida</a>
//                 </li>
//                 <li>
//                   <a href="/maine" className="stateNav-maine">Maine</a>
//                 </li>
//                 <li>
//                   <a href="/maryland" className="stateNav-maryland">Maryland</a>
//                 </li>
//                 <li>
//                   <a href="/michigan" className="stateNav-michigan">Michigan</a>
//                 </li>
//                 <li>
//                   <a href="/nevada" className="stateNav-nevada">Nevada</a>
//                 </li>
//                 <li>
//                   <a href="/north-carolina" className="stateNav-north-carolina">North Carolina</a>
//                 </li>
//                 <li>
//                   <a href="/oregon" className="stateNav-oregon">Oregon</a>
//                 </li>
//                 <li>
//                   <a href="/pennsylvania" className="stateNav-pennsylvania">Pennsylvania</a>
//                 </li>
//                 <li>
//                   <a href="/virginia" className="stateNav-virginia">Virginia</a>
//                 </li>
//               </ul>
//             </li>
//             <li>
//               <a className="hash-link" data-toggle="tab" href="#about">About</a>
//             </li>
//             <li>
//               <a className="hash-link" href="#missing-members" data-toggle="tab" id="missing-member-tab">Missing Members</a>
//             </li>
//             <li>
//               <a className="hash-link" href="#join" data-toggle="tab">Join us</a>
//             </li>
//             <li>
//               <a href="//www.townhallpledge.com/" target="_blank">Pledge</a>
//             </li>
//             <li>
//               <a className="hash-link" href="#upload-video" data-toggle="tab">Share a video</a>
//             </li>
//             <li>
//               <a className="hash-link" data-toggle="tab" href="#submit">Submit an event</a>
//             </li>
//             <li>
//               <a id="privacy-policy-link" className="hash-link hidden" data-toggle="tab" aria-hidden="true" href="#privacy-policy">Privacy
//                 Policy</a>
//             </li>
//             <li>
//               <a className="hash-link hidden" data-toggle="tab" aria-hidden="true" href="#thfol-guide">THFOL guide</a>
//             </li>
//             <li>
//               <a className="hash-link hidden" data-toggle="tab" aria-hidden="true" href="#year-one">Look back at 2017</a>
//             </li>
//             <li>
//               <a className="hash-link hidden" data-toggle="tab" aria-hidden="true" href="#year-two">Look back at 2018</a>
//             </li>
//             <li>
//               <a className="hash-link hidden" data-toggle="tab" aria-hidden="true" href="#town-hall-pledge"></a>
//             </li>
//           </ul>
//           <ul className="nav navbar-nav navbar-right">
//             <li>
//               <a href="https://secure.actblue.com/donate/thp" target="_blank" className="btn" id="donate-button" role="button"
//                 target="_blank">Donate</a>
//             </li>
//             <li>
//               <a className="social-icons" href="https://twitter.com/townhallproject" target="_blank">
//                 <i className="fab fa-twitter-square fa-2x" aria-hidden="true"></i>
//               </a>
//             </li>
//             <li>
//               <a className="social-icons" href="https://www.facebook.com/TownHallProject/" target="_blank">
//                 <i className="fab fa-facebook-square fa-2x" aria-hidden="true"></i>
//               </a>
//             </li>
//             <li>
//               <a data-toggle="tab" className="social-icons hash-link text-white" href="#contact">
//                 <i className="fas fa-envelope-square fa-2x"></i>
//               </a>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   )
// };

export default Header;
