import React from 'react';
import { Row, Col } from 'antd';

import mapboxView from '../../../scripts/views/mapboxView';
import mapController from '../../../scripts/controllers/map-controller';
import mapView from '../../../scripts/views/mapView';

import { getZoomLocationForMap } from '../Map/selectors';
import Map from '../Map';
import EventSidebar from '../EventSidebar';

export default class CurrentEventsMap extends React.Component {
  renderTwoColumns() {
    const {
      hasSearchResults,
      eventsToDisplay,
      feature,
      webGL,
      bounds,
      parentBB,
      stateUPSP,
      setDistrict,
      currentDistrict,
      allTownHalls
    } = this.props;
    return (
      <Row>
        <Col span={12}>
         <EventSidebar eventsToDisplay={eventsToDisplay} />
        </Col>
        <Col>
          <Map
            allTownHalls={allTownHalls}
            currentDistrict={currentDistrict}
            setDistrict={setDistrict}
            stateUPSP={stateUPSP}
            parentBB={parentBB}
            bounds={bounds}
            webGL={webGL}
            feature={feature}
            eventsToDisplay={eventsToDisplay}
            hasSearchResults={hasSearchResults}
          />
        </Col>
      </Row>
    )
  }


  render() {
    const { 
      hasSearchResults, 
      eventsToDisplay, 
      feature, 
      webGL, 
      bounds, 
      parentBB, 
      stateUPSP, 
      setDistrict, 
      currentDistrict, 
      allTownHalls
    } = this.props;
    console.log(eventsToDisplay)
    return (
      <section>
        <div>
              {eventsToDisplay.length ? this.renderTwoColumns() :
              (<Map 
                  allTownHalls={allTownHalls}
                  currentDistrict={currentDistrict}
                  setDistrict={setDistrict}
                  stateUPSP={stateUPSP}
                  parentBB={parentBB}
                  bounds={bounds}
                  webGL={webGL}
                  feature={feature}
                  eventsToDisplay={eventsToDisplay}
                  hasSearchResults={hasSearchResults}
              />)
              }
              <div className="map-legend hidden-xs">
                <ul className="list-inline">
                  <li className="map-legend-li hide-if-no-webgl">
                    <dt className="map-legend__senate"></dt>
                    <dd>U.S. Senator</dd>
                  </li>
                  <li className="map-legend-li hide-if-no-webgl">
                    <dt className="map-legend__district"></dt>
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
                      <dt className="map-legend__district"></dt>
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
          {/* </div> */}
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
      </section>
    )
  }
}
