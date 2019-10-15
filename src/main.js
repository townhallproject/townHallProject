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
import MapComponent from './components/MapComponent';


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
        <nav className="navbar navbar-default navbar-main">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-nav"
                aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a data-toggle="tab" href="#home" className="navbar-brand hash-link" id="brand-icon">
                <img src="/Images/THP_logo_horizontal_simple.png" alt=""></img>
              </a>
            </div>
            <div className="collapse navbar-collapse" id="main-nav">
              <ul className="nav navbar-nav navbar-left" roll="tablists">
                <li className="dropdown dropdown--stateSelection">
                  <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="true">
                    <span className="button-text">State Legislatures</span>
                    <span className="caret"></span>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="/" className="stateNav-federal">Federal</a>
                    </li>
                    <li>
                      <a href="/arizona" className="stateNav-arizona">Arizona</a>
                    </li>
                    <li>
                      <a href="/colorado" className="stateNav-colorado">Colorado</a>
                    </li>
                    <li>
                      <a href="/florida" className="stateNav-florida">Florida</a>
                    </li>
                    <li>
                      <a href="/maine" className="stateNav-maine">Maine</a>
                    </li>
                    <li>
                      <a href="/maryland" className="stateNav-maryland">Maryland</a>
                    </li>
                    <li>
                      <a href="/michigan" className="stateNav-michigan">Michigan</a>
                    </li>
                    <li>
                      <a href="/nevada" className="stateNav-nevada">Nevada</a>
                    </li>
                    <li>
                      <a href="/north-carolina" className="stateNav-north-carolina">North Carolina</a>
                    </li>
                    <li>
                      <a href="/oregon" className="stateNav-oregon">Oregon</a>
                    </li>
                    <li>
                      <a href="/pennsylvania" className="stateNav-pennsylvania">Pennsylvania</a>
                    </li>
                    <li>
                      <a href="/virginia" className="stateNav-virginia">Virginia</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="hash-link" data-toggle="tab" href="#about">About</a>
                </li>
                <li>
                  <a className="hash-link" href="#missing-members" data-toggle="tab" id="missing-member-tab">Missing Members</a>
                </li>
                <li>
                  <a className="hash-link" href="#join" data-toggle="tab">Join us</a>
                </li>
                <li>
                  <a href="//www.townhallpledge.com/" target="_blank">Pledge</a>
                </li>
                <li>
                  <a className="hash-link" href="#upload-video" data-toggle="tab">Share a video</a>
                </li>
                <li>
                  <a className="hash-link" data-toggle="tab" href="#submit">Submit an event</a>
                </li>
                <li>
                  <a id="privacy-policy-link" className="hash-link hidden" data-toggle="tab" aria-hidden="true" href="#privacy-policy">Privacy
                Policy</a>
                </li>
                <li>
                  <a className="hash-link hidden" data-toggle="tab" aria-hidden="true" href="#thfol-guide">THFOL guide</a>
                </li>
                <li>
                  <a className="hash-link hidden" data-toggle="tab" aria-hidden="true" href="#year-one">Look back at 2017</a>
                </li>
                <li>
                  <a className="hash-link hidden" data-toggle="tab" aria-hidden="true" href="#year-two">Look back at 2018</a>
                </li>
                <li>
                  <a className="hash-link hidden" data-toggle="tab" aria-hidden="true" href="#town-hall-pledge"></a>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="https://secure.actblue.com/donate/thp" target="_blank" className="btn" id="donate-button" role="button"
                    target="_blank">Donate</a>
                </li>
                <li>
                  <a className="social-icons" href="https://twitter.com/townhallproject" target="_blank">
                    <i className="fab fa-twitter-square fa-2x" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a className="social-icons" href="https://www.facebook.com/TownHallProject/" target="_blank">
                    <i className="fab fa-facebook-square fa-2x" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a data-toggle="tab" className="social-icons hash-link text-white" href="#contact">
                    <i className="fas fa-envelope-square fa-2x"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </nav>

        <div className="time-sensitive background-gray">
          <div className=" display-flex">
            <div className="happening-now-title">
              <h1><span className="break">What's</span><span className="break"> happening</span> now</h1>
              <h1><i className="fa fa-chevron-right"></i></h1>
            </div>
            <div className="happening-now-content">
              <div className="text-center">
                <h2 className="text-primary">
                  <a className="text-primary"
                    target="_blank"
                    href="https://docs.google.com/document/u/1/d/e/2PACX-1vTWD9u5IF08YH6tt76Q_S6dTwQYmm7g_2jQbZ4JaXJpEBJV0srbUfS_MseuKudHeo6YDLdyk-x1A58Z/pub">Read our September 2019 Congressional Accessibility Report and see how this Congress stacks up <i className="fa fa fa-external-link-square"></i></a>
                </h2>
                {/*<button className="btn btn-primary " type="button" name="button" id="view-accessibility-report">Infographic</button>*/}
              </div>
            </div>
          </div>
        </div>

        <div className="tab-content">
          <div role="tabpanel" className="tab-pane page active" id="home">
            <header className="site-header clearfix">
              <section className="container container-fluid">
                <div className="row">
                  <div className="col-md-6 left-panels">
                    <div className=" text-left site-header clearfix displayoff ">
                      <div className="form-text-results col-md-12">
                        <div className="text-toggle header-large">
                          <img id="header-image" src="/Images/THP_logo_inverse.png" alt=""></img>
                        </div>
                        <div className="text-toggle header-small hidden">
                          {/*<img src="/Images/THP_logo_inverse_simple.png" alt=""></img>*/}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 right-panels">
                    <div className="spacer">
                    </div>
                    <form id="look-up" className="form-inline text-center" action="index.html">
                      <div className="form-group text-center">
                        <label htmlFor="zip"></label>
                        <input className="form-control input-lg" type="zip" name="" placeholder="Zip Code" />
                        <button type="submit" name="button" className="btn btn-primary btn-lg fath-button">Find A Town Hall</button>

                        <div id="selection-results" className="text-center ">
                          <h4 className="selection-results_content"></h4>
                        </div>

                      </div>
                    </form>
                    <div id="textresults" className="text-center "></div>
                  </div>
                </div>
              </section>
            </header>
            {/*Call to action when no events are present*/}
            <section className="background-light-blue" id="no-events">
              <div className="container container-fluid">
                <div className="col-md-12">
                  <h2 className="weight-heavy">There are no events with your representatives right now &mdash; but you can still
                make your voice heard!</h2>
                  <h3>
                    <a href=" https://5calls.org" target="_blank">Call</a>, write, or email your Senators or Representative.
                    Write a letter to the editor in your local newspaper.
                    Join an
                <a href="https://indivisible.org/groups" target="_blank">Indivisible group</a> or other local activist
                organization to create change in your community.</h3>
                  <h3>If you hear of town halls or other events with your member of Congress, don’t hesitate to
                <a className="hash-link" data-toggle="tab" href="#submit">submit them</a> to us so we can spread the word.
              </h3>
                  <h3 className="weight-heavy">Show Up. Speak Out.</h3>
                </div>
              </div>
            </section>
            <div className="container-fluid map-container-large">
              <div className="hidden show-if-no-webgl webgl-banner">
                <div className="webGl-warning" target="_blank">
                  <img className="webGl-compimg" src="../Images/map/ohno-computer.png"></img>
                  <p>Our interactive map feature uses WebGL, a plugin common in most modern browsers. Your browser does not
                    have WebGL
                working currently.</p>
                  <p>You can learn how to enable WebGL on
                <a href="https://get.webgl.org/" target="_blank">this website.</a>
                  </p>
                </div>
                <img className="webGL-kill" src="../Images/map/xmark.svg"></img>
              </div>
              <div className="row map-large">

                <MapComponent />
                <div className="map-legend hidden-xs">
                  <ul className="list-inline">
                    <li className="map-legend-li hide-if-no-webgl">
                      <dt className="map-legend__senate"></dt>
                      <dd>U.S. Senator</dd>
                    </li>
                    <li className="map-legend-li hide-if-no-webgl">
                      <dt className="map-legend__distrcit"></dt>
                      <dd>U.S. Representative</dd>
                    </li>
                    <li className="map-legend-li">
                      <dt className="map-legend-icon map-legend__person"></dt>
                      <dd>In-person</dd>
                    </li>
                    <li className="map-legend-li">
                      <dt className="map-legend-icon map-legend__staff"></dt>
                      <dd>Staff-only</dd>
                    </li>
                    <li className="map-legend-li">
                      <dt className="map-legend-icon map-legend__tele"></dt>
                      <dd>Call-in</dd>
                    </li>
                    <li className="map-legend-li">
                      <dt className="map-legend-icon map-legend__activ"></dt>
                      <dd>Activist Event</dd>
                    </li>
                    <li className="map-legend-li">
                      <dt className="map-legend-icon map-legend__campaign"></dt>
                      <dd>Campaign Event</dd>
                    </li>
                    <li className="map-legend-li">
                      <dt className="map-legend-icon map-legend__next-gen"></dt>
                      <dd>Youth Vote</dd>
                    </li>
                    <li className="map-legend-li">
                      <dt className="map-legend-icon map-legend__hr"></dt>
                      <dd>Voting Rights</dd>
                    </li>
                    <li className="map-legend-li">
                      <dt className="map-legend-icon map-legend__mfol"></dt>
                      <dd>THFOL</dd>
                    </li>
                  </ul>
                </div>
                <div className="map-legend visible-xs">
                  <div id="Legend" className="collapse">
                    <ul className="list-inline">
                      <li className="map-legend-li hide-if-no-webgl">
                        <dt className="map-legend__senate"></dt>
                        <dd>U.S. Senator</dd>
                      </li>
                      <li className="map-legend-li hide-if-no-webgl">
                        <dt className="map-legend__distrcit"></dt>
                        <dd>U.S. Representative</dd>
                      </li>
                      <li className="map-legend-li">
                        <dt className="map-legend-icon map-legend__person"></dt>
                        <dd>In-person</dd>
                      </li>
                      <li className="map-legend-li">
                        <dt className="map-legend-icon map-legend__staff"></dt>
                        <dd>Staff-only</dd>
                      </li>
                      <li className="map-legend-li">
                        <dt className="map-legend-icon map-legend__tele"></dt>
                        <dd>Call-in</dd>
                      </li>
                      <li className="map-legend-li">
                        <dt className="map-legend-icon map-legend__activ"></dt>
                        <dd>Activist Event</dd>
                      </li>
                      <li className="map-legend-li">
                        <dt className="map-legend-icon map-legend__campaign"></dt>
                        <dd>Campaign Event</dd>
                      </li>
                      <li className="map-legend-li">
                        <dt className="map-legend-icon map-legend__next-gen"></dt>
                        <dd>Youth Vote</dd>
                      </li>
                      <li className="map-legend-li">
                        <dt className="map-legend-icon map-legend__hr"></dt>
                        <dd>Voting Rights</dd>
                      </li>
                      <li className="map-legend-li">
                        <dt className="map-legend-icon map-legend__mfol"></dt>
                        <dd>THFOL</dd>
                      </li>
                    </ul>
                  </div>
                  <button data-target="#Legend" className="btn-xs btn-default visible-xs" data-toggle="collapse"><i className="fas fa-bars"></i></button>
                </div>
              </div>
            </div>
            <ul className="state-lines list-inline hide-if-no-webgl hidden">
              <li className="map-legend-li">Showing: </li>
              <button type="button" name="button" id="show-federal-borders"
                className="btn btn-xs btn-transparent border-toggle inactive">
                <li className="map-legend-li interactive federal">
                  <dt className="map-legend-line map-legend__federal"></dt>
                  <dd>Congressional districts</dd>
                </li>
              </button>
              <button type="button" name="button" id="show-state-borders"
                className="btn btn-xs btn-transparent border-toggle active">
                <ul className="list-inline">
                  <li className="map-legend-li state">
                    <dt className="map-legend-line map-legend__state_lower"></dt>
                    <dd>State House districts</dd>
                  </li>
                  <li className="map-legend-li state">
                    <dt className="map-legend-line map-legend__state_upper"></dt>
                    <dd>State Senate districts</dd>
                  </li>
                </ul>
              </button>
            </ul>
            <div className="header-with-results map-container-split hidden">
              <div className="row">
                <div className="col-md-6">
                  <section className="results multipleResults">
                    <div id="nearest" className="flexcroll nearest-with-results"></div>
                  </section>
                </div>
                <div className="col-md-6 map-small map-fixing">
                </div>
              </div>
            </div>
            <section className="email-signup--inline hidden" id="missing-member-banner">
              <div className="container container-fluid">
                <div className="row">
                  <h2 className="text-center extra-large">August Recess 2017</h2>
                  <div className="col-sm-6 graphs">
                    <h4 className="text-primary table-title text-center">Members of Congress holding town halls</h4>
                    <dt>Senate</dt>
                    <div className="progress">
                      <div className="progress-bar progress-bar-dem-no-events dem-senate" data-count={48}>
                        <span className="sr-only">Democratic no events</span>
                      </div>
                      <div className="progress-bar progress-bar-dem-has-events dem-aug-progress-senate" data-count={0}>
                        <span className="sr-only">Democratic progress</span>
                      </div>
                      <div className="progress-bar progress-bar-rep-has-events rep-aug-progress-senate" data-count={0}>
                        <span className="sr-only">Republican progress</span>
                      </div>
                      <div className="progress-bar progress-bar-rep-no-events rep-senate" data-count={52}>
                        <span className="sr-only">Republican no events</span>
                      </div>
                    </div>
                    <dt>House</dt>
                    <div className="progress">
                      <div className="progress-bar progress-bar-dem-no-events dem-house" data-count={194}>
                        <span className="sr-only">Democratic progress</span>
                      </div>
                      <div className="progress-bar progress-bar-dem-has-events dem-aug-progress-house" data-count={0}>
                        <span className="sr-only">Democratic progress</span>
                      </div>
                      <div className="progress-bar progress-bar-rep-has-events rep-aug-progress-house" data-count={0}>
                        <span className="sr-only">Republican progress</span>
                      </div>
                      <div className="progress-bar progress-bar-rep-no-events rep-house" data-count={240}>
                        <span className="sr-only">Republican progress</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-6">
                        <dl className="dl-horizontal progress-bar-key">
                          <dt className="key progress-bar-dem-no-events"></dt>
                          <dd>Democrats without town halls</dd>
                        </dl>
                        <dl className="dl-horizontal progress-bar-key">
                          <dt className="key progress-bar-dem-has-events"></dt>
                          <dd>Democrats holding town halls</dd>
                        </dl>
                      </div>
                      <div className="col-xs-6">
                        <dl className="dl-horizontal progress-bar-key">
                          <dt className="key progress-bar-rep-no-events"></dt>
                          <dd>Republicans without town halls</dd>
                        </dl>
                        <dl className="dl-horizontal progress-bar-key">
                          <dt className="key progress-bar-rep-has-events"></dt>
                          <dd>Republicans holding town halls</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 graphs">
                    <dl className="dl-horizontal graph">
                      <h4 className="text-primary table-title text-center">Total number of town halls</h4>
                      <dt>Senate</dt>
                      <dd>
                        <div className="progress bar-graph">
                          <div className="progress-bar progress-bar-dem-has-events dem-aug-total-senate" data-count={0}
                            data-max={100}>
                            <span className="sr-only">Democratic progress</span>
                          </div>
                        </div>
                        <div className="progress bar-graph">
                          <div className="progress-bar progress-bar-rep-has-events rep-aug-total-senate" data-count={0}
                            data-max={100}>
                            <span className="sr-only">Democratic progress</span>
                          </div>
                        </div>
                      </dd>
                      <dt>House</dt>
                      <dd>
                        <div className="progress bar-graph">
                          <div className="progress-bar progress-bar-dem-has-events dem-aug-total-house" data-count={0} data-max={100}>
                            <span className="sr-only">Democratic progress</span>
                          </div>
                        </div>
                        <div className="progress bar-graph">
                          <div className="progress-bar progress-bar-rep-has-events rep-aug-total-house" data-count={0} data-max={100}>
                            <span className="sr-only">Democratic progress</span>
                          </div>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </section>

            <section className="background-light-blue email-signup--inline" id="email-signup">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" id="close-email">
                <span aria-hidden="true">&times;</span>
              </button>
              <div className="container container-fluid">
                <h1 id="email-title" className="text-center extra-large">Sign up to receive updates on local events.</h1>
                <form id="email-signup-form">
                  <div className="row">
                    <div className="col-lg-8">
                      <div className="col-sm-6">
                        <input type="text" className="form-control input-lg" name="first" placeholder="First Name" />
                      </div>
                      <div className="col-sm-6">
                        <input type="text" className="form-control input-lg" name="last" placeholder="Last Name" />
                      </div>
                      <div className="col-sm-6">
                        <input type="email" className="form-control input-lg" name="email" placeholder="Email" />
                      </div>
                      <div className="col-sm-6">
                        <input type="text" className="form-control input-lg" name="zipcode" placeholder="Zip Code" />
                      </div>
                      <div className="col-sm-6 hidden" id="district-subscribe">
                        <label htmlFor="districts" className="col-sm-4">Subscribe to districts:</label>
                        <input type="text" className="form-control input-lg" name="districts" data-role="tagsinput" />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="col-xs-12">
                        <button type="submit" name="button" className="btn btn-primary btn-light-background btn-lg btn-block">Sign
                      up</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </section>

            <div id="email-update" className="hidden background-light-blue container-fluid">
              <button id="open-email-form" className="btn btn-xs">Update your email subscription</button>
            </div>


            {/*Cards showing representatives and their contact info*/}
            <div id="representativeCards">
              <section className="container container-fluid"></section>
            </div>
            <div className="hidden-xs">
              <section className="scroll-to-form text-center">
                <p>
                  <a href="#events-table" className="scroll-button btn btn-white btn-lg">
                    <i className="fa fa-chevron-down fa-2x" aria-hidden="true"></i>
                  </a>
                </p>
              </section>
              <a name="events-table" id="events-table"></a>
              <section className=" container container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    <span className="pull-right">
                      <button id="scrollBtn">
                        <i className="fa fa-chevron-up fa-2x" aria-hidden="true"></i>
                      </button>
                    </span>
                  </div>
                </div>
                <h2 className="text-primary table-title text-center">Upcoming Events</h2>
                <div className="row">
                  <small>
                    <ul className="list-unstyled container">
                      <li>
                        <span className="text-secondary">Town Hall</span>
                        <span> - A forum where lawmakers give legislative updates and answer open questions from constituents.</span>
                      </li>
                      <li>
                        <span className="text-secondary">"Empty Chair" Town Hall</span>
                        <span> - A citizen-organized town hall held with or without the invited lawmaker.</span>
                      </li>
                      <li>
                        <span className="text-secondary">Adopt-A-District/State</span>
                        <span> - A citizen-organized town hall featuring a member of Congress from another district.</span>
                      </li>
                      <li>
                        <span className="text-secondary">Office Hours </span>
                        <span> - Opportunity to meet and question a lawmaker's staff. Usually held in district offices but sometimes are
                "mobile office hours."</span>
                      </li>
                      <li>
                        <span className="text-secondary">Campaign Town Hall </span>
                        <span> - A town hall organized by a candidate for office - whether an incumbent or challenger. (Town Hall Project
                includes these events as a public resource--not to endorse a particular candidate or campaign).</span>
                      </li>
                      <li>
                        <span className="text-secondary">Ticketed Event</span>
                        <span> - Paid events. Typically fundraisers. (Town Hall Project includes these events as a public resource--not
                to endorse a particular candidate or campaign).</span>
                      </li>
                      <li>
                        <span className="text-secondary">TeleTown Hall Meeting </span>
                        <span> - A town hall conducted by conference call or online.</span>
                      </li>
                    </ul>
                  </small>
                </div>
                <div>
                  <ul id="all-events-table" className="list-group">
                    <li className="list-group-item list-group-heading">
                      <nav className="navbar navbar-default navbar-static-top ">
                        <ul className="nav navbar-nav navbar-left" id="filter-info">
                          <li>
                            <span id="current-state" data-current={0} data-total={0}></span>
                          </li>
                        </ul>
                        <ul id="all-events-table-dropdown-container" className="nav navbar-nav navbar-right">
                          <li className="dropdown hidden">
                            <a href="#" className="dropdown-toggle hide-on-state-view" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Member
                    <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu">
                              <li className="downdown-title">Search by member of Congress</li>
                              <li role="separator" className="divider"></li>
                              <li>
                                <input id="memberTypeahead" type="text" className="form-control dropdown-item filter" data-provide="typeahead"
                                  placeholder="Search by member" data-filter="displayName" autoComplete="off" />
                              </li>
                            </ul>
                          </li>
                          <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Party
                    <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu filter">
                              <li className="downdown-title">Filter by party</li>
                              <li role="separator" className="divider"></li>
                              <li>
                                <a data-filter="party" id="Democratic" className="dropdown-item" href="#">Democratic</a>
                              </li>
                              <li>
                                <a data-filter="party" id="Republican" className="dropdown-item" href="#">Republican</a>
                              </li>
                              <li>
                                <a data-filter="party" id="Independent" className="dropdown-item" href="#">Independent</a>
                              </li>
                              <li>
                                <a data-filter="party" id="All" className="dropdown-item" href="#">All</a>
                              </li>

                            </ul>
                          </li>
                          <li className="dropdown">
                            <a href="#" className="dropdown-toggle hide-on-state-view" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">State
                    <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu">
                              <li className="downdown-title">Search by State</li>
                              <li role="separator" className="divider"></li>
                              <li>
                                <input id="stateTypeahead" type="text" className="form-control dropdown-item filter" data-provide="typeahead"
                                  placeholder="Search by state" data-filter="stateName" autoComplete="off" />
                              </li>
                            </ul>
                          </li>
                          <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Event Type
                    <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu filter">
                              <li className="downdown-title">Filter by Event Type</li>
                              <li role="separator" className="divider"></li>
                              <li>
                                <a data-filter="meetingType" id="Town Hall" className="dropdown-item" href="#">Town Hall</a>
                              </li>
                              <li>
                                <a data-filter="meetingType" id="Empty Chair Town Hall" className="dropdown-item" href="#">Empty Chair Town Hall</a>
                              </li>
                              <li>
                                <a data-filter="meetingType" id="Adopt-A-District/State" href="#">Adopt-A-District/State</a>
                              </li>
                              <li>
                                <a data-filter="meetingType" id="Office Hours" className="dropdown-item" href="#">Office Hours</a>
                              </li>
                              <li>
                                <a data-filter="meetingType" id="Ticketed Event" className="dropdown-item" href="#">Ticketed Event</a>
                              </li>
                              <li>
                                <a data-filter="meetingType" id="Tele-Town Hall" className="dropdown-item" href="#">Tele-Town Hall</a>
                              </li>
                              <li>
                                <a data-filter="meetingType" id="Campaign Town Hall" className="dropdown-item" href="#">Campaign Town Hall</a>
                              </li>
                              <li>
                                <a data-filter="meetingType" id="Youth Vote" className="dropdown-item" href="#">Youth Vote</a>
                              </li>
                              <li>
                                <a data-filter="meetingType" id="Voting Rights" className="dropdown-item" href="#">Voting Rights</a>
                              </li>
                              <li>
                                <a data-filter="meetingType" id="Other" className="dropdown-item" href="#">Other</a>
                              </li>
                              <li>
                                <a data-filter="meetingType" id="All" className="dropdown-item" href="#">All</a>
                              </li>
                            </ul>
                          </li>
                          <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Sort
                    <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu sort">
                              <li className="downdown-title">Sort Table</li>
                              <li role="separator" className="divider"></li>
                              <li>
                                <a data-filter="dateObj" id="byDate" className="dropdown-item" href="#">By Date</a>
                              </li>
                              <li>
                                <a data-filter="stateName" id="byState" className="dropdown-item hide-on-state-view" href="#">By State</a>
                              </li>
                              <li>
                                <a data-filter="displayName" id="byName" className="dropdown-item" href="#">By Name</a>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </nav>
                    </li>
                    {/*end header*/}
                  </ul>
                  {/*end table*/}
                </div>
              </section>
              {/*end of hidden-xs div*/}
            </div>
          </div>
          <div role="tabpanel" className="tab-pane" id="submit">
            <div className='embed-container submit-embed-container'>
              <iframe
                src='https://docs.google.com/forms/d/e/1FAIpQLSfvIJikraQCZcqUpYfDZHC7KvxDUp4zcfzlLQ7RoaDQcBZUbQ/viewform?c=0&w=1'
                style={{ borderWidth:0, width:800, height:600, frameborder:0 }}></iframe>
            </div>
          </div>
          <div role="tabpanel" className="tab-pane" id="contact">
            <div className='embed-container contact-embed-container'>
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSffVaop5xVSxXFrRtAZsxMDqkvucAplMdC9-CPHiTXxPKQV0g/viewform?embedded=true"
                width="800" height="600" frameBorder="0" marginHeight="0" marginWidth="0">Loading...</iframe>
            </div>
          </div>
          <div role="tabpanel" className="tab-pane page" id="about">
            <header>
              <section className="container container-fluid quote-header">
                <blockquote className="col-sm-6 col-sm-offset-3">
                  <p className="text-white">"It falls to each of us to be those anxious, jealous guardians of our democracy.
                    Embrace the joyous task we have
                    been given to continually try to improve this great nation of ours because, for all our outward
                    differences,
                    we in fact all share the same proud type, the most important office in a democracy,
                <span className="text-secondary">citizen</span>."</p>
                  <footer className="text-success">President Obama,
                <cite title="Source Title">Farewell Address</cite>
                  </footer>
                </blockquote>
              </section>
            </header>
            <section className="container">
              <article className="center-block about">
                <h2 className="text-secondary-dark">About Town Hall Project</h2>
                <p className="lead">Town Hall Project empowers constituents across the country to have face-to-face conversations
                  with their elected
                  representatives. We are campaign veterans and first time volunteers. We come from a diversity of backgrounds
                  and live across the country. We share progressive values and believe strongly in civic engagement. We
                  research
                  every district and state for public events with members of Congress. Then we share our findings to promote
                  participation
              in the democratic process.</p>
                <p className="lead">This movement is diverse, open source, and powered by citizens. We are proud to be a part of
              it.</p>
                <p className="text-primary">
                  <strong>Show Up. Speak Out.</strong>
                </p>
              </article>
              <article className="row">
                <div className="col-sm-6">
                  <h3>About the Events</h3>
                  <p>Our project is currently focused on federal elected officials. We strongly believe that state
                    legislatures deserve
                attention and citizen engagement, but at the moment these events are outside our current mission.</p>

                  <p>Our event listing includes:</p>
                  <ul>
                    <li>Town halls</li>
                    <li>Other public events with members of Congress in their district/state</li>
                    <li>Ticketed events in the district/state</li>
                    <li>Staff office hours</li>
                    <li>Opportunities in Washington, D.C. to speak with your representative</li>
                  </ul>
                  <p>We do not currently include:</p>
                  <ul>
                    <li>Fundraisers outside the district/state</li>
                    <li>Inappropriate events to ask policy questions (e.g. funerals)</li>
                    <li>Campaign events where the member will not take questions</li>
                  </ul>
                </div>
                <div className="col-sm-6">
                  <h3>What to expect</h3>
                  <p>The most powerful thing you can do, as a constituent, is ask an earnest, pressing question on an issue
                    close
                    to you.
                <strong>Your personal story is incredibly valuable.</strong> It’s precisely how sometimes dry policy is
                                  connected with
                                  the lives of real people. It’s not always easy to speak up, but these times call for courage in all of us.
                Take the mic and tell your representative why she or he needs to act in your best interest.</p>
                  <p>The Town Hall Project strongly encourages you to only attend and ask questions of your own
                    representatives. Remember
                that any town hall has limited time, and a question you take is one less question for a constituent.</p>

                  <p>For more, we recommend:</p>
                  <ul>
                    <li>Indivisible's
                  <a href="https://indivisible.org/resource/town-hall-guide" target="_blank">Town Hall strategy resources</a>
                    </li>
                  </ul>
                </div>
              </article>
              <article className="row">
                <div className="col-sm-6">
                  <h3>Why Town Halls</h3>
                  <p>There is no better way to influence your representatives than in-person conversations. Town halls are a
                    longstanding
                    American tradition--where our elected representatives must listen and respond to the concerns of their
                    constituents.
                Remember: you are their boss.</p>
                  <p>We believe every citizen, no matter the party of their members of Congress, should have the opportunity
                    to speak
                with his or her representatives.</p>
                  <p>You have more power than you think. Town halls are one of the most effective ways to use it.</p>
                </div>
                <div className="col-sm-6">
                  <h3>Our Supporters</h3>
                  <p>Town Hall Project is possible because of the hard work of researchers, organizers, and developers across
                    country,
                and the generous support of hundreds of grassroots donors.</p>
                </div>
              </article>
            </section>
            <div className="banner" id="hand-raised"></div>
            <section className="container mt-5">
              <h3>Frequently Asked Questions</h3>
              <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                <div className="panel panel-default">
                  <div className="panel-heading" role="tab">
                    <h4 className="panel-title">
                      <a role="button" data-toggle="collapse" data-parent="#accordion" href="#canIJoin" aria-expanded="true"
                        aria-controls="canIJoin">
                        Can I join you?
                  </a>
                    </h4>
                  </div>
                  <div id="canIJoin" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="Can I Join You?">
                    <div className="panel-body">
                      Yes! If you are interested in joining our volunteer research team or have more specialized skills like
                      web development, contact
                      us at
                  <a href="mailto:info@townhallproject.com">info@townhallproject.com</a>.
                </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <div className="panel-heading" role="tab">
                    <h4 className="panel-title">
                      <a role="button" data-toggle="collapse" data-parent="#accordion" href="#canISupport" aria-expanded="true"
                        aria-controls="canISupport">
                        Can I support you?
                  </a>
                    </h4>
                  </div>
                  <div id="canISupport" className="panel-collapse collapse" role="tabpanel" aria-labelledby="Can I support you?">
                    <div className="panel-body">
                      Yes! Town Hall Project relies on grassroots donations like yours to continue to bring rapid event
                      research to citizens and
                      activists nationwide. Please make a donation
                  <a href="https://secure.actblue.com/donate/thp" target="_blank">here</a>. If you are interested in a larger or ongoing donation,
                                    or represent a granting foundation, please
                                    contact us at
                  <a href="mailto:info@townhallproject.com">info@townhallproject.com</a>.
                </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <div className="panel-heading" role="tab">
                    <h4 className="panel-title">
                      <a role="button" data-toggle="collapse" data-parent="#accordion" href="#ourStory" aria-expanded="true"
                        aria-controls="ourStory">
                        What’s your story?
                  </a>
                    </h4>
                  </div>
                  <div id="ourStory" className="panel-collapse collapse" role="tabpanel" aria-labelledby="What's your story?">
                    <div className="panel-body">
                      <p>At the beginning of 2017, our founder Jimmy Dahman believed that congressional town halls would play
                        an enormously
                        important role in this chapter of our democracy but was surprised to discover just how difficult
                        information
                    about these events was to find.</p>

                      <p>He recruited a small group of fellow organizers and activists who built a volunteer research team
                        and began
                        collecting these events in a google spreadsheet. Within days of launching we were completely
                        overwhelmed
                    by the intense public interest.</p>

                      <p>Throughout February, hundreds of thousands of people visited our spreadsheet--and then our
                        quickly-built
                        website--and tens of thousands attended congressional town halls. As Americans realized how the
                        radical
                    agenda being discussed in the halls of Congress was, citizens began to make their voices heard.</p>

                      <p>Today we are proud to research and public events with members of Congress, opportunities for civic
                        activism,
                    and other ways to Show Up and Speak Out. And there’s more to come...</p>
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <div className="panel-heading" role="tab">
                    <h4 className="panel-title">
                      <a role="button" data-toggle="collapse" data-parent="#accordion" href="#politicalPerspective"
                        aria-expanded="true" aria-controls="politicalPerspective">
                        What is your political perspective?
                  </a>
                    </h4>
                  </div>
                  <div id="politicalPerspective" className="panel-collapse collapse" role="tabpanel"
                    aria-labelledby="What is your political perspective?">
                    <div className="panel-body">
                      <p>We are transparent that the Town Hall Project team shares largely progressive policy views. We make
                        no secret
                        of our support of other progressive organizations and our opposition to this Administration’s most
                        extreme
                    policies.</p>

                      <p>But we don’t pull any punches with our research. We list every town hall held by Republicans,
                        Democrats,
                        and Independents. And we will call out “Missing Members” (those who refuse to hold town halls) of all
                    parties.</p>

                      <p>We encourage all Americans, regardless of partisan leanings, to attend public events with your
                        members of
                        Congress and make your voice heard. From the bluest district to the reddest, and everything in
                        between,
                    every single member of Congress will represent their constituents better by listening to them.</p>
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <div className="panel-heading" role="tab">
                    <h4 className="panel-title">
                      <a role="button" data-toggle="collapse" data-parent="#accordion" href="#townhallcom" aria-expanded="true"
                        aria-controls="townhallcom">
                        Are you affiliated with townhall.com?
                  </a>
                    </h4>
                  </div>
                  <div id="townhallcom" className="panel-collapse collapse" role="tabpanel"
                    aria-labelledby="Are you affiliated with townhall.com?">
                    <div className="panel-body">
                      Nope.
                </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <div className="panel-heading" role="tab">
                    <h4 className="panel-title">
                      <a role="button" data-toggle="collapse" data-parent="#accordion" href="#whoAreYou" aria-expanded="true"
                        aria-controls="whoAreYou">
                        Who are you?
                  </a>
                    </h4>
                  </div>
                  <div id="whoAreYou" className="panel-collapse collapse" role="tabpanel"
                    aria-labelledby="Are you affiliated with whoAreYou?">
                    <div className="panel-body">
                      <p>Town Hall Project would not be possible without the hard work and talent of dozens of research
                        volunteers,
                    web developers, communications experts, and advisors.</p>

                      <p>Our leadership team:</p>

                      <p>
                        Nathan Williams - Executive Director - Nathan co-founded Town Hall Project in 2017.
                        Previously Nathan worked on candidate and issue campaigns, including the 2008 Obama campaign.
                        He is also an award-winning independent filmmaker.
                  </p>

                      <p>
                        Megan Riel-Mehan - Lead Web Developer - Megan is a PhD chemical biologist and experienced web
                        developer,
                        currently specializing in visualizing cell biology at the Allen Institute in Seattle.
                  </p>

                      <p>
                        Jenita Igwealor - National Organizing Director - Jenita has worked in politics and labor for over ten
                        years,
                        including the 2008 and 2012 Obama campaigns. She has developed training programs for campaign staff
                        and
                        community activists interested in pay equity advocacy, civic engagement, and education affordability.
                  </p>

                      <p>
                        Robert Castaneda - National Research Director - Before joining Town Hall Project, Robert has organized
                        electoral and issue campaigns from the local to national level. In 2016, he led a team of organizers
                        in Summit County, Ohio. Robert speaks 4 languages fluently.
                  </p>

                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="container">
              <article className="row">
                <div className="col-sm-5 col-offset-1">
                  <h3>Can I send you town halls that I find?</h3>
                  <p>Yes! Please send town hall or any other congressional events to us
                <a href="#submit">here</a>. Please include as much detail as you can, including a date, time, and link or
                                  other source of the
                event information. </p>
                </div>
                <div className="col-sm-5 col-sm-offset-2">
                  <h3>What if my representatives have no public events scheduled?</h3>
                  <p>Call their
                <a href="https://www.govtrack.us/congress/members" target="_blank">district offices</a> and let them know
                                  you expect them to hold public events with their constituents. To have
                                  even more impact, join with other citizens in your district or state and organize group efforts. Visit the
                                  district office together, deliver petitions, inform your local press, or even hold an “Empty Chair” town
                                  hall
                and invite your member of Congress to fill that chair.</p>
                </div>
              </article>
              <article className="row text-center">
                <h3>Get connected locally!</h3>
                <p>
                  <a data-toggle="tab" className="hash-link" href="#contact">Contact us </a>and one of our organizers will connect
              you with groups in your area.</p>
                <a className="privacy-policy-button" data-toggle="tab" href="#privacy-policy">Privacy Policy</a>
              </article>
              <div className="col-sm-4">
              </div>
            </section>
            <section className="container">
              <div className="row">
                <div className="col-sm-12" id="disclaimer">
                  <small>The information available on or from this website is compiled by Town Hall Project volunteers and
                    provided for
                    general informational purposes only. While all efforts are made to verify accuracy of events, event
                    details
                    can change at short notice and are not guaranteed to be complete or up-to-date. Please contact your
                    representative’s
                    office to confirm. Town Hall Project shall not be liable for any special or consequential damages that
                    result
                from the direct or indirect use of, or the inability to use, the information on this site.</small>
                </div>
              </div>
            </section>
          </div>
          <div role="tabpanel" className="tab-pane" id="join">
            <header>
              <section className="container container-fluid">
                <div className="col-md-6 col-md-offset-3">
                  <p className="lead">Sign up now for personalized event updates for your congressional district and state! </p>
                  <p>We will email you town hall events with your members of Congress, as well as send the latest news on
                    upcoming
                debates in Congress and updates on our project.</p>
                </div>
              </section>
            </header>
            <section className="container container-fluid">
              <div id='can-form-area-stay-up-to-date-on-our-work' className=" col-md-6 col-md-offset-3"></div>
            </section>
            <div className="banner" id="cover">
              <div className="photo-credit text-white">
                <small>Photo credit: Trang Dang</small>
              </div>
            </div>
          </div>
          <div role="tabpanel" className="tab-pane" id="missing-members">
            <header>
              <section className="container container-fluid">
                <div className="col-md-6 col-md-offset-3">
                  <p className="lead">
                    <span id="mm-total-copy">Many</span> members of Congress have not held a single in-person town hall since
                    January 3, 2019.
              </p>
                  <p className="lead">
                    Is yours one of them?
              </p>
                </div>
              </section>
              <nav className="navbar navbar-default">
                <ul className="nav navbar-nav navbar-left filter-button-group">
                  <li className="block">
                    {/*<!-- <div className="col-sm-6">
                          <button className="btn btn-primary btn-block" type="button" name="button" id="view-missing-member-report">View 2017 Report</button>
                          </div> -->*/}
                    <div className="col-sm-6">
                      <p className="transparent" id="mm-current-state" data-current={0} data-total={0}>
                        Viewing ### of ### total missing members
                  </p>
                      {/*<!-- <p>
                          Click the
                    <i className="fas fa-address-book" aria-hidden="true"></i> icon on your member's card to download a poster
                        </p> -->*/}
                    </div>
                  </li>
                  <li className="block filter-button-group mm-filter-info-holder">
                    <ul className="nav navbar-nav" id="mm-filter-info">
                    </ul>
                  </li>
                </ul>
                <ul className="nav navbar-nav navbar-right btn-group">
                  <li className="nav-item dropdown filter-button-group btn-group">
                    <a href="#" className="btn btn-xs dropdown-toggle navbar-btn btn-group mm-btn-group" data-toggle="dropdown"
                      role="button" aria-haspopup="true" aria-expanded="false">Party
                  <span className="caret"></span>
                    </a>
                    <ul className="dropdown-menu button-group" data-filter-group="party">
                      <li className="downdown-title">Filter by party</li>
                      <li role="separator" className="divider"></li>
                      <li data-filter=".Democratic" id="Democratic" className="btn dropdown-item btn-filter btn-white">Democratic
                  </li>
                      <li data-filter=".Republican" id="Republican" className="btn dropdown-item btn-filter btn-white">Republican
                  </li>
                      {/*<!-- <li data-filter=".Independent" id="Independent" className="btn dropdown-item btn-filter btn-white">Independent</li> -->*/}
                      <li data-filter="" id="All" className="btn dropdown-item btn-filter btn-white">All</li>
                    </ul>
                  </li>
                  <li className=" nav-item dropdown filter-button-group btn-group">
                    <a href="#" className="btn btn-xs dropdown-toggle navbar-btn btn-group mm-btn-group" data-toggle="dropdown"
                      role="button" aria-haspopup="true" aria-expanded="false">Chamber
                  <span className="caret"></span>
                    </a>
                    <ul className="dropdown-menu button-group" data-filter-group="chamber">
                      <li className="downdown-title">Filter by chamber</li>
                      <li role="separator" className="divider"></li>
                      <li className="btn dropdown-item btn-filter btn-white" data-filter=".Senate">Senate</li>
                      <li className="btn dropdown-item btn-filter btn-white" data-filter=".House" id="Republican">House</li>
                      <li className="btn dropdown-item btn-filter btn-white" data-filter="" id="All">All</li>
                    </ul>
                  </li>
                  {/*<!-- <li className="nav-item filter-button-group button-group btn-group" data-filter-group="ahcaFilter">
                      <a className="btn btn-xs btn-filter navbar-btn mm-btn-group" data-filter=".ahca">Voted for AHCA</a>
                    </li>
                    <li className="nav-item filter-button-group button-group btn-group" data-filter-group="taxbillFilter">
                      <a className="btn btn-xs btn-filter navbar-btn mm-btn-group" data-filter=".taxBill">Voted for 2017 tax bill</a>
                      </li> -->*/}
                </ul>
                <ul className="nav navbar-nav state-button-holder filter-button-group ">
                  <ul id="state-buttons" className="button-group " data-filter-group="state">
                  </ul>
                </ul>
              </nav>
            </header>
            <div className="inset">
            </div>
            <div className="missing-member-cards-container">
              <div className="container">
                <div className="grid">
                </div>
              </div>
            </div>
          </div>
          <div role="tabpanel" className="tab-pane page" id="upload-video">
            <section className="container">
              <h1 className="text-primary text-center">Share your Town Hall Videos</h1>
              <div className="col-sm-8 col-sm-offset-2 upload-video-stage-1 text-center">
                <h3 className="margin-bottom">Have a video from a town hall you want to share?</h3>
                <button className="btn btn-primary btn-lg btn-light-background upload-video-begin center-block">Click to begin
                uploading</button>
              </div>
              <div className="col-sm-8 col-sm-offset-2 upload-video-stage-2 hidden">
                <h3>Authorizing with youtube, please wait...</h3>
              </div>
              <div className="col-sm-8 col-sm-offset-2 upload-video-stage-3 hidden">
                <form id="upload-video-form">
                  <h3>Video Information</h3>
                  <div>
                    <input type="text" className="form-control" name="title" placeholder="Title (event and date)" />
                  </div>
                  <div>
                    <textarea className="form-control" name="description"
                      placeholder="Please tell us about any particularly powerful questions, answers or other moments--and the relevant timecode when possible"></textarea>
                  </div>
                  <div>
                    <input input type="file" id="video-file-field" className="button form-control" accept="video/*" />
                  </div>
                  <div>
                    <em>By uploading a video you grant the Town Hall Project permission to use the video and share it with
                      the public.
                      You also certify that you own all rights to the content or that you are authorized by the owner to
                      make
                    the content publicly available.</em>
                  </div>
                  <button name="button" className="btn btn-primary btn-light-background btn-lg upload-video-upload"
                    disabled="true">Upload my video</button>
                </form>
              </div>
              <div className="col-sm-8 col-sm-offset-2 upload-video-stage-4 hidden">
                <h3>
                  <div className="d-inline-block margin-bottom">Upload in progress:</div>
                  <div className="d-inline-block margin-bottom">
                    <progress id="upload-video-progress" max="1" value="0"></progress>
                  </div>
                  <div className="d-inline-block margin-bottom">
                    <span id="upload-video-percent-transferred"></span>% complete.</div>
                  <div className="d-inline-block margin-bottom">About
                  <span id="upload-video-seconds-remaining"></span> remaining.</div>
                </h3>
              </div>
              <div className="col-sm-8 col-sm-offset-2 upload-video-stage-5 hidden">
                <h3>Your video has been successfully uploaded. It will be reviewed by our team shortly. Thank you!</h3>
                <button className="btn btn-primary btn-lg btn-light-background upload-video-begin center-block" id="upload-another">Upload
                another video</button>
              </div>
            </section>
          </div>
          <div role="tabpanel" className="tab-pane" id="privacy-policy">
            <header className="margin-bottom">
              <section className="container ">
                <div className="col-sm-6 col-sm-offset-4">
                  <h2>Privacy Policy</h2>
                </div>
              </section>
            </header>
            <section className="container ">
              <div className="col-sm-10 col-sm-offset-1">
                <p>This website, application or online tool is operated by Town Hall Project (“Town Hall Project”, “we” or
                  “us”).
                  This privacy policy (“Policy”) explains how personal information is collected, used, and disclosed by Town
                  Hall
                  Project with respect to your use of the townhallproject.com web site and other Town Hall Project or
                  co-branded
                  web sites, applications, online tools and other online products or services which link to this Policy (the
                  “Sites”)
                  so you can make an informed decision about using the Sites. We value your privacy and endeavor to provide
                  you
              with a safe and secure user experience.</p>
                <p>This website is operated by Town Hall Project. We are not performing any services on behalf of any member
                  of the
                  United States Congress or their offices. This website and tools are operated by Town Hall Project to help
                  you
              more easily connect with your elected representatives and better engage in the democratic process.</p>
                <p>We reserve the right to change the provisions of this Policy at any time. We will alert you that changes
                  have been
                  made by indicating on the Policy the date it was last updated. We encourage you to review this Policy from
                  time
              to time to make sure that you understand how any personal information you provide will be used.</p>
                <h3>What Personal Information Do We Collect?</h3>
                <p>Active Collection: Personal information may be collected in a number of ways when you visit our Sites. We
                  collect
                  certain information you voluntarily provide to us, such as if you join our email list, make a donation, fill
                  out a form, connect through a social feed, sign up to be a volunteer, use a tool on a Site or request
                  information.
                  Such information may include personal information, such as your name, mailing address, email address, phone
                  number,
                  and credit card information. We may also collect demographic information you may voluntarily provide from
                  time
                  to time, such as in response to questionnaires, surveys, and interactive tools such as calculators,
                  including
              gender, ethnicity, education, income and interest information.</p>
                <p>If this information is tied to personally identifiable information, it will be treated as personal
                  information.
                  Personal and demographic information may also be collected if you provide such information in connection
                  with
                  creating a profile or group, leaving comments, posting social media comments or other content, sending an
                  email
                  or message to another user, or participating in any interactive forums or features on the Sites. In
                  addition,
                  from time to time we may collect demographic, contact or other personal information you provide in
                  connection
                  with your participation in surveys, sweepstakes, games, promotions and other activities on the Sites. We may
                  also obtain information from other sources and combine that with information we collect on our Sites. This
                  information
              is not stored with any personally identifiable information you voluntarily provide.</p>
                <p>Passive Collection: When you use the Sites, some information is also automatically collected, such as your
                  Internet
                  Protocol (IP) address, your operating system, the browser type, pages viewed, the address of a referring web
                  site, and your activity on our Sites. If you access the Sites from a mobile device, we may also collect
                  information
                  about the type of mobile device you use and the type of mobile Internet browsers you use. We treat this
                  information
                  as personal information if we combine it with or link it to any of the identifying information mentioned
                  above.
              Otherwise, it is used in the aggregate only.</p>
                <p>We may also automatically collect certain information through the use of “cookies” or web beacons. Cookies
                  are
                  small data files stored on your hard drive at the request of a website. Among other things, cookies help us
                  improve
                  our Sites and your experience. Information obtained from cookies and linked to personally identifying
                  information
                  is treated as personal information. If you wish to block, erase, or be warned of cookies, please refer to
                  your
                  browser manufacturer to learn about these functions. However, if you choose to remove or reject browser
                  cookies,
                  this could affect certain features on our Sites. Web beacons are small, invisible graphic images that may be
                  used on the Sites or in emails relating to the Sites to collect certain information about usage and program
                  effectiveness
              and monitor user activity on the Sites.</p>
                <p>Advertising and Analytics Services Provided by Others. We may allow others to serve advertisements on our
                  behalf
                  across the Internet and to provide analytics services. These entities may use cookies, web beacons and other
                  technologies to collect information about your use of the Sites and other websites, including your IP
                  address,
                  web browser, pages viewed, time spent on pages, links clicked and conversion information. This information
                  may
                  be used by Town Hall Project and others to, among other things, analyze and track data, determine the
                  popularity
                  of certain content, deliver advertising and content targeted to your interests on the Sites and other
                  websites,
                  and better understand your online activity. For more information about Internet-based ads, or to opt out of
                  having
                  your web browsing information used for behavioral advertising purposes, please visit
              <a href="www.networkadvertising.org/managing/opt_out.asp">Network Advertising</a> and
              <a href="www.aboutads.info/choices">About Ads</a>.</p>
                <h4>What Personal Information Do We Share With Third Parties?</h4>
                <p>It is our policy not to share the personal information we collect from you through our Sites with third
                  parties,
                  except as described in this Policy or as otherwise disclosed on the Sites. For example, we may share
                  personal
              information as follows:</p>
                <ul>
                  <li>with vendors, consultants, and other service providers or volunteers who are engaged by or working with
                    us and
                who need access to such information to carry out their work for us;</li>
                  <li>with organizations, groups or causes that we believe have similar viewpoints, principles, activities or
                objectives;</li>
                  <li>when you give us your consent to do so, including if we notify you on the Sites, that the information
                    you provide
                will be shared or used in a particular manner and you provide such information;</li>
                  <li>when you register to get connected locally, the information you provide to Town Hall Project and our
                    organizers
                may be shared with Town Hall Project’s partner organizations;</li>
                  <li>when we are operating a co-branded site, application or tool, we may share the information you provide
                    with the
                party with whom we are co-branding;</li>
                  <li>when we believe in good faith that we are lawfully authorized or required to do so or that doing so is
                    reasonably
                    necessary or appropriate to comply with the law or legal processes or respond to lawful requests, claims
                    or
                legal authorities, including responding to lawful subpoenas, warrants, or court orders;</li>
                  <li>when we believe in good faith that doing so is reasonably necessary or appropriate to respond to claims
                    or to
                    protect the rights, property, or safety of Town Hall Project, our users, our employees, our volunteers,
                    copyright
                    owners, third parties or the public, including without limitation to protect such parties from fraudulent,
                abusive, inappropriate, or unlawful activity or use of our Site;</li>
                  <li>to enforce or apply this Policy, our Terms of Service, or our other policies or agreements; and</li>
                  <li> in connection with, or during negotiations of, any merger, reorganization, acquisition, asset sale,
                    financing
                    or lending transaction or in any other situation where personal information may be disclosed or
                    transferred
                as one of the assets of Town Hall Project.</li>
                </ul>
                <p>We are not responsible for the actions of any service providers or other third parties, nor are we
                  responsible
                  for any additional information you provide directly to any third parties, and we encourage you to become
                  familiar
                  with their privacy practices before disclosing information directly to any such parties. Nothing herein
                  restricts
                  the sharing of aggregated or anonymized information, which may be shared with third parties without your
              consent.</p>
                <p>Town Hall Project is volunteer driven and your experience is important to us. If you have any questions or
                  concerns,
                  please feel free to
              <a data-toggle="tab" className="hash-link" href="#contact">contact us</a>.</p>
              </div>
            </section>
            <div className="banner" id="cover">
            </div>
          </div>

          <div role="tabpanel" className="tab-pane" id="year-two">
            <div className="container">
              <img src="/Images/lookback2018-Desktop-nobg.png" alt="" />
            </div>
          </div>

          <div role="tabpanel" className="tab-pane" id="year-one">
            <div className="container">
              <img src="/Images/EOY_Report_Layout_noBG-01-01.png" alt="" />
            </div>
          </div>

          <div role="tabpanel" className="tab-pane" id="town-hall-pledge">
            <div className="container">
              <div className="row">
                <div className="col-md-6 img-holder">
                  <img src="../Images/svgs/THP_Pledge_House.svg" />
                </div>
                <div className="col-md-6 img-holder">
                  <img src="../Images/svgs/THP_Pledge_Senate.svg" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade event-modal" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
            </div>
          </div>
        </div>
        <div className="modal fade missing-members-modal" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <img src="/Images/Missing_Member_Report.png" alt="" />
              <a className="twitter-share-button"
                href="https://townhallproject.com/Images/Missing_Member_Report.png?text=Missing%20Members%20Report">
                Tweet</a>
              <iframe
                src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Ftownhallproject.com%2FImages%2FMissing_Member_Report.png&layout=button&size=small&mobile_iframe=true&appId=1549118422076809&width=59&height=20"
                width="59" height="20" style={{border:'none', overflow:'hidden'}} scrolling="no" frameBorder="0"
                allowtransparency="true"></iframe>
            </div>
          </div>
        </div>
        <div className="modal fade recess-report-modal" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <img src="/Images/report-2019.png" alt="" />
              <a className="twitter-share-button"
                href="https://townhallproject.com/Images/report-2019.png?text=AccessibilityReport">
                Tweet</a>
              <iframe
                src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Ftownhallproject.com%2FImages%2Freport-2019.png&layout=button&size=small&mobile_iframe=true&appId=1549118422076809&width=59&height=20"
                width="59" height="20" style={{border:'none', overflow:'hidden'}} scrolling="no" frameBorder="0"
                allowTransparency="true"></iframe>
            </div>
          </div>
        </div>
        <div className="modal fade recess-report-modal" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <img src="/Images/report-2019.png" alt="" />
              <a className="twitter-share-button"
                href="https://townhallproject.com/Images/report-2019.png?text=AccessibilityReport">
                Tweet</a>
              <iframe
                src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Ftownhallproject.com%2FImages%2Freport-2019.png&layout=button&size=small&mobile_iframe=true&appId=1549118422076809&width=59&height=20"
                width="59" height="20" style={{border:'none', overflow:'hidden'}} scrolling="no" frameBorder="0"
                allowTransparency="true"></iframe>
            </div>
          </div>
        </div>
        <footer className="footer">
          <div className="container text-center">
            <ul className="list-unstyled">
              <li>
                <a data-toggle="tab" className="hash-link text-white" href="#contact">
                  <i className="fas fa-envelope-square fa-3x"></i>
                </a>
                <a href="https://twitter.com/townhallproject" className="text-white" target="_blank">
                  <i className="fab fa-twitter-square fa-3x" aria-hidden="true"></i>
                </a>
                <a href="https://www.facebook.com/TownHallProject/" className="text-white" target="_blank">
                  <i className="fab fa-facebook-square fa-3x" aria-hidden="true"></i>
                </a>
              </li>
              <li>
                <small>Compiled by Town Hall Project volunteers. All efforts are made to verify accuracy of events.</small>
              </li>
              <li>
                <small>Event details can change at short notice, please contact your representative to confirm.</small>
              </li>
              <li>
                <a className="privacy-policy-button" data-toggle="tab" href="#privacy-policy">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;

const renderApp = () => {
  ReactDom.render(<App />, document.getElementById("root"))
};

renderApp();

