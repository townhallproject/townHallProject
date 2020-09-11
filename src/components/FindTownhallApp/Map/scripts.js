import mapView from '../../../scripts/views/mapView';
import mapboxView from '../../../scripts/views/mapboxView';
import TownHall from '../../../scripts/models/TownHall';
import stateView from '../../../scripts/views/stateView';

export const setMap = function (ctx) {
    if (ctx.webGL) {
        var style = null;
        if (ctx.stateUPSP) {
            style = 'mapbox://styles/townhallproject/cjbqzhc4b8c1x2trz43dk8spj';
        }
        return mapView.setMap(style, ctx.parentBB, ctx.bounds);
    }
};

export const setDistrict = function (ctx, next) {
    if (ctx.feature) {
        mapboxView.districtSelect(ctx.feature);
    }
}

export const readData = function (ctx, next) {
    if (!ctx.webGL) {
        mapView.readData(false);
        return next();
    }
    ctx.map.on('load', function () {
        mapboxView.onLoad();
        mapView.readData(true);
        TownHall.isMap = true;
        next();
    });
};

export const addDistrictListener = function (ctx, next) {
    if (ctx.webGL) {
        mapboxView.addDistrictListener();
    }
    next();
};

// add state legislature district listener
export const addStateDistrictListener = function (ctx) {
    if (ctx.webGL) {
        mapboxView.addStateDistrictListener();
    }
};


export const readStateData = function (ctx, next) {
        if (!ctx.webGL) {
            mapView.readStateData(false, ctx.stateUPSP);
            return next();
        }
        ctx.map.on('load', function () {
            mapboxView.onLoad(ctx.stateUPSP);
            mapboxView.addStateLayer();
            mapView.readStateData(true, ctx.stateUPSP);
            TownHall.isMap = true;
            next();
        });
    };

export const maskCountry = function (ctx, next) {
        if (ctx.webGL) {
            stateView.maskCountry(ctx.map, ctx.stateUPSP);
        }
        next();
    };


export default {
    setMap,
    setDistrict,
    readData,
    addDistrictListener,
    readStateData,
    maskCountry,
    addStateDistrictListener
}