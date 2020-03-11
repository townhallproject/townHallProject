import React from 'react';

import mapboxView from '../../../scripts/views/mapboxView';
import mapController from '../../../scripts/controllers/map-controller';

export default class CurrentEventsMap extends React.Component {

  componentDidMount() {
    const {
      parentBB,
      bounds,
      webGL,
      stateUPSP,
    } = this.props;
    this.map = mapController.setMap({
      parentBB,
      bounds,
      webGL,
      stateUPSP,
    })
    if (stateUPSP) {
      this.initStateMap();
    } else {
      this.initFederalMap();
    }
  }
  
  componentDidUpdate(prevProps) {
    const { currentDistrict } = this.props;
    if (currentDistrict && currentDistrict !== prevProps.currentDistrict) {
      mapboxView.highlightDistrict(currentDistrict.federal.selections);
    }
  }

  initFederalMap() {
    const {
      webGL,
      feature,
      setDistrict,
    } = this.props;

    mapboxView.setDistrict = setDistrict;
    mapController.readData({ webGL, map: this.map },
      () => mapController.addDistrictListener({ webGL },
        () => mapController.setDistrict({ feature })
      )
    );
  }

  initStateMap() {
    const {
      webGL,
      stateUPSP,
      setDistrict
    } = this.props;
    mapboxView.setDistrict = setDistrict;

    mapController.readStateData({ webGL, map: this.map, stateUPSP },
      () => mapController.maskCountry({ webGL, stateUPSP, map: this.map },
        () => mapController.addStateDistrictListener({ webGL })
      )
    )
  }

  render() {
    return (
      <section>
        <div>
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
              <div id="map"></div>
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
      </section>
    )
  }
}
