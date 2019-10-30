import React from 'react';
import ReactDom from 'react-dom';
import page from 'page';

import {
  embedMapInit,
  populateEventModal
} from './scripts/views/eventView';
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
import './vendor/scripts/iframeSizer.contentWindow.min.js'

// vendor style
import './vendor/styles/normalize.css';
import './vendor/styles/bootstrap-tagsinput.css';
import './vendor/styles/default.css';
import './vendor/styles/jquery-ui.min.css';
import './vendor/styles/jquery-ui.structure.min.css';
import './vendor/styles/normalize.css';
import './vendor/styles/railscasts.css';

// local styles
import './styles/customboot.less';

import './scripts/controllers/embed-routes.js';


class App extends React.Component {
  componentDidMount() {
    embedMapInit();
    page();
  }
  render() {
    return (
      <React.Fragment>
        <div class="tab-content">
          <div role="tabpanel" class="tab-pane active" id="home">
            <header class="site-header">
              <section class="container container-fluid">
                <div class="row">
              
                  <div class="col-md-12 right-panels">
                    <form id="look-up" class="form-inline text-center" action="mapEmbed.html">
                      <div class="form-group text-center">
                        <label for="zip"></label>
                        <input class="form-control input-lg " type="zip" name="" placeholder="Zip Code" />
                        <button type="submit" name="button" class="btn btn-primary btn-lg fath-button">Find An Event</button>
                        <div id="selection-results" class="text-center ">
                          <h4 class="selection-results_content"></h4>
                        </div>
                      </div>
                    </form>
                    <div id="textresults" class="text-center "></div>
                  </div>
                </div>
              </section>
            </header>

            <div class="container-fluid map-container-large">
              <div class="hidden show-if-no-webgl webgl-banner">
                <div class="webGl-warning" target="_blank">
                  <img class="webGl-compimg" src="../Images/map/ohno-computer.png"></img>
                  <p>Our interactive map feature uses WebGL, a plugin common in most modern browsers. Your browser does not
                    have WebGL
                    working currently.</p>
                  <p>You can learn how to enable WebGL on
                    <a href="https://get.webgl.org/" target="_blank">this website.</a>
                  </p>
                </div>
                <img class="webGL-kill" src="../Images/map/xmark.svg"></img>
              </div>
              <div class="row map-large">
                <div id="map"></div>
                <div class="map-legend">
                  <ul class="list-inline">
                    <li class="map-legend-li hide-if-no-webgl">
                      <dt class="map-legend__senate"></dt>
                      <dd>U.S. Senator</dd>
                    </li>
                    <li class="map-legend-li hide-if-no-webgl">
                      <dt class="map-legend__distrcit"></dt>
                      <dd>U.S. Representative</dd>
                    </li>
                    <li class="map-legend-li">
                      <dt class="map-legend-icon map-legend__person"></dt>
                      <dd>In-person</dd>
                    </li>
                    <li class="map-legend-li">
                      <dt class="map-legend-icon map-legend__hr"></dt>
                      <dd>H.R. 1</dd>
                    </li>
                    <li class="map-legend-li state-show hidden">
                      <dt class="map-legend-icon map-legend__staff"></dt>
                      <dd>Staff-only</dd>
                    </li>
                    <li class="map-legend-li state-show hidden">
                      <dt class="map-legend-icon map-legend__tele"></dt>
                      <dd>Call-in</dd>
                    </li>
                    <li class="map-legend-li state-show hidden">
                      <dt class="map-legend-icon map-legend__activ"></dt>
                      <dd>Activist Event</dd>
                    </li>
                    <li class="map-legend-li state-show hidden">
                      <dt class="map-legend-icon map-legend__campaign"></dt>
                      <dd>Campaign Event</dd>
                    </li>
                    <li class="map-legend-li state-show hidden">
                      <dt class="map-legend-icon map-legend__mfol"></dt>
                      <dd>THFOL</dd>
                    </li>
                  </ul>
                  <ul class="state-lines list-inline hide-if-no-webgl hidden">
                    <li class="map-legend-li">Showing: </li>
                    <button type="button" name="button" id="show-federal-borders" class="btn btn-xs btn-transparent border-toggle inactive" >
                      <li class="map-legend-li interactive federal">
                        <dt class="map-legend-line map-legend__federal"></dt>
                        <dd>Congressional districts</dd>
                      </li>
                    </button>
                    <button type="button" name="button" id="show-state-borders" class="btn btn-xs btn-transparent border-toggle active" >
                      <ul class="list-inline">
                        <li class="map-legend-li state">
                          <dt class="map-legend-line map-legend__state_lower"></dt>
                          <dd>State House districts</dd>
                        </li>
                        <li class="map-legend-li state">
                          <dt class="map-legend-line map-legend__state_upper"></dt>
                          <dd>State Senate districts</dd>
                        </li>
                      </ul>
                    </button>
                  </ul>
                </div>
              </div>
            </div>
            <div class="header-with-results map-container-split hidden">
              <div class="row">
                <div class="col-md-6">
                  <section class="results multipleResults">
                    <div id="nearest" class="flexcroll nearest-with-results"></div>
                  </section>
                </div>
                <div class="col-md-6 map-small map-fixing">
                </div>
              </div>
            </div>
            {/* <!-- Call to action when no events are present --> */}
            <section class="background-light-blue" id="no-events">
              <div class="container container-fluid">
                <div class="col-md-12">
                  <h2 class="weight-heavy">There are no events with your representatives right now &mdash; but you can still
                    make your voice heard!</h2>
                  <h3>
                    <a href="https://5calls.org" target="_blank">Call</a>, write, or email your Senators or
                    Representative. Write a letter to the editor in your local newspaper.
                    Join an
                    <a href="https://indivisible.org/groups" target="_blank">Indivisible group</a> or other
                    local activist organization to create change in your community.</h3>
                  <h3>If you hear of town halls or other events with your member of Congress, don’t hesitate to
                    <a class="hash-link" href="https://www.townhallproject.com#submit" target="_blank">submit them</a> to Town Hall
                    Project so we can spread the word.</h3>
                  <h3 class="weight-heavy">Show Up. Speak Out.</h3>
                </div>
              </div>
            </section>
            {/* <!-- Cards showing representatives and their contact info --> */}
            <div id="representativeCards">
              <section class="container container-fluid"></section>
            </div>
          </div>

        </div>
        <div class="modal fade event-modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
            </div>
          </div>
        </div>

      </React.Fragment>
    );
  }
}

export default App;

const renderApp = () => {
  ReactDom.render(<App />, document.getElementById("embed-root"))
};

renderApp();

