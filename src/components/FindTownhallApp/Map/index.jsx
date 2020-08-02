import React from 'react';
import { isEqual } from 'lodash';
import mapboxView from '../../../scripts/views/mapboxView';
import mapController from '../../../scripts/controllers/map-controller';
import mapView from '../../../scripts/views/mapView';

import { getZoomLocationForMap } from './selectors';

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
        const { currentDistrict, eventsToDisplay } = this.props;
        if (currentDistrict && !isEqual(currentDistrict,prevProps.currentDistrict)) {
            mapboxView.highlightDistrict(currentDistrict.federal.selections);
            getZoomLocationForMap(currentDistrict, eventsToDisplay);

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
                () => {
                    mapController.setDistrict({ feature })
                }
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
        const { hasSearchResults } = this.props;
        return (<div id="map"></div>)
    }
}
