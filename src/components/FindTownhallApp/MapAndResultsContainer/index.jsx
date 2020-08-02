import React from 'react';
import { Row, Col } from 'antd';

import Map from '../Map';
import MapLegend from '../MapLegend';
import EventSidebar from '../EventSidebar';
import { getListOfLegendIcons } from '../selectors';

import './style.less';

export default class MapAndResultsContainer extends React.Component {
  render() {
    const { 
      hasSearchResults, 
      eventsToDisplay,
      setZip,
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
      <section className="map-and-results-container">
        <Row>
          {eventsToDisplay.length > 0 && <Col
            span={24}
            lg={12}
            className="events-container"
          >
            <EventSidebar eventsToDisplay={eventsToDisplay} />
          </Col>}
          <Col
            span={24}
            lg={eventsToDisplay.length> 0? 12: 24}
            className="map-container"
          >
            <Map
              allTownHalls={allTownHalls}
              currentDistrict={currentDistrict}
              setDistrict={setDistrict}
              setZip={setZip}
              stateUPSP={stateUPSP}
              parentBB={parentBB}
              bounds={bounds}
              webGL={webGL}
              feature={feature}
              eventsToDisplay={eventsToDisplay}
              hasSearchResults={hasSearchResults}
            />
            <MapLegend
              stateUPSP={stateUPSP}
              webGL={webGL}
              isTwoColumns={eventsToDisplay.length > 0}
              iconsToShow={getListOfLegendIcons(allTownHalls)}
            />
          </Col>
        </Row>
    )
      
      </section>
    )
  }
}
