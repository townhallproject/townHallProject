import React from 'react';
import { map } from 'jquery';

import { MAP_ICON_NAMES } from '../../../constants';

export default class MapLegend extends React.Component {

    renderStateLines = () => (
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
    )

    renderIcons = () => {
        const { webGL, iconsToShow } = this.props;

        return (
            <ul className="list-inline">
                {webGL &&
                    <React.Fragment>
                        <li className="map-legend-li">
                            <dt className="map-legend__senate"></dt>
                            <dd>U.S. Senator</dd>
                        </li>
                        <li className="map-legend-li">
                            <dt className="map-legend__district"></dt>
                            <dd>U.S. Representative</dd>
                        </li>
                    </React.Fragment>
                }
                {iconsToShow.map((icon) => (
                    <li key={icon} className="map-legend-li">
                        <dt className={`map-legend-icon map-legend__${icon}`}></dt>
                        <dd>{MAP_ICON_NAMES[icon]}</dd>
                    </li>
                ))}

            </ul>
        )
    }
    render () {
        const { webGL, stateUPSP, isTwoColumns } = this.props;
        return (
            <React.Fragment>
                <div className={`map-legend hidden-xs ${isTwoColumns? "map-small": ""}`}>
                        {this.renderIcons()}
                </div>
                {webGL && stateUPSP && this.renderStateLines()}
            </React.Fragment> )
    }
}