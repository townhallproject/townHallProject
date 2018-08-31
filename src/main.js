import { firebase, firebasedb } from './scripts/lib/firebasedb';
import { mapHelperFunctions } from './scripts/lib/map-helper-functions';
import { urlParamsHandler } from './scripts/lib/urlParams';
import { constants } from './scripts/lib/constants';

// to add
// vendor and style

// modules:
// <script src="/scripts/lib/firebasedb.js"></script>
// <script src="/scripts/lib/map-helper-functions.js"></script>
// <script src="/scripts/lib/urlParams.js"></script>

// <script src="/data/states.js"></script> --
// <script src="/data/bboxes.js"></script> --

// <script src="/data/zipLookup.js"></script>
import { zipLookup } from './data/zipLookup';
// <script src="/data/fips-lookup.js"></script> --
// <script src="/data/statePop.js"></script> --

// <script src="/scripts/models/MemberOfCongress.js"></script>
import { MoC } from './scripts/models/MemberOfCongress';
// <script src="/scripts/lib/constants.js"></script> --
// <script src="/scripts/models/TownHall.js"></script>
import { TownHall } from './scripts/models/TownHall';
// <script src="/scripts/models/UploadVideo.js"></script>
import { UploadVideo } from './scripts/models/UploadVideo';
// <script src="/scripts/models/mfolEvent.js"></script> 
import { MfolEvent } from './scripts/models/mfolEvent';

// <script src="/scripts/views/zipLookUpView.js"></script>
import zipLookUpHandler from './scripts/views/zipLookUpView';
// <script src="/scripts/views/repCardView.js"></script>
import repCardView from './scripts/views/repCardView';
// <script src="/scripts/views/emailSignUpView.js"></script>
import emailSignUpView from './scripts/views/emailSignUpView';
// <script src="/scripts/views/tableView.js"></script>
import tableView from './scripts/views/tableView';
// <script src="/scripts/views/videoView.js"></script>
import videoView from './scripts/views/videoView';
// <script src="/scripts/views/missingMembersView.js"></script>
import missingMembersView from './scripts/views/missingMembersView';
// <script src="/scripts/views/indexView.js"></script>
import indexView from './scripts/views/indexView';
// <script src="/scripts/views/resultsView.js"></script>
import resultsView from './scripts/views/resultsView';
// <script src="/scripts/views/stateView.js"></script>
import stateView from './scripts/views/stateView';
// <script src="/scripts/views/googleMapView.js"></script>
import './scripts/views/googleMapView';
// <script src="/scripts/views/mapboxView.js"></script>
import mapboxView from './scripts/views/mapboxView';
// <script src="/scripts/views/mapView.js"></script>
import './scripts/views/mapView';
// <script src="/scripts/views/eventView.js"></script>
import eventHandler from './scripts/views/eventView';
// <script src="/scripts/views/dataViz.js"></script>
import dataViz from './scripts/views/dataViz';
// <script src="/scripts/views/mfolSubmitForm.js"></script>
import newEventView from './scripts/views/mfolSubmitForm';

// <script src="/scripts/controllers/index-controller.js"></script>
import indexController from './scripts/controllers/index-controller';
// <script src="/scripts/controllers/map-controller.js"></script>
import mapController from './scripts/controllers/map-controller';
// <script src="/scripts/controllers/routes.js"></script>
import './scripts/controllers/routes';

// vendor scripts
import './vendor/scripts/cors-uploader';
import './vendor/scripts/geo-viewport';
import './vendor/scripts/handlebars-v4.0.5';
import './vendor/scripts/jquery-2.1.4';
import './vendor/scripts/jquery-ui';
import './vendor/scripts/mapbox-gl-v0.32.1';
import './vendor/scripts/tether';

// vendor style
import './vendor/styles/normalize.css';
import './vendor/styles/bootstrap-tagsinput.css';
import './vendor/styles/default.css';
import './vendor/styles/jquery-ui.min.css';
import './vendor/styles/jquery-ui.structure.min.css';
import './vendor/styles/normalize.css';
import './vendor/styles/railscasts.css';
