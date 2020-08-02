import React from 'react';
import $ from 'jquery';

import urlParamsHandler from '../../../scripts/lib/urlParams';

import TownHall from '../../../scripts/models/TownHall';

import indexView from '../../../scripts/views/indexView';
import zipLookUpHandler from '../../../scripts/views/zipLookUpView';
import stateView from '../../../scripts/views/stateView';
import eventHandler from '../../../scripts/views/eventView';
import mapHelperFunctions from '../../../scripts/lib/map-helper-functions';
import {
  firestore
} from '../../../scripts/lib/firebasedb';

import { isZipCode, isState, isDistrict, isFederalDistrict, capitalizeName } from '../../../utils';

const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
require('./style.less');

export default class ZipSearch extends React.Component {

static handleZipToDistrict(zipToDistrictArray) {
  var federal = zipToDistrictArray[0].reduce(function (acc, cur) {
    if (!acc.districts) {
      acc.districts = [];
      acc.selections = [];
    }
    var stateObj = eventHandler.getStateDataFromAbbr(cur.abr);
    var geoid = stateObj[0].FIPS + cur.dis;
    acc.state = cur.abr;
    acc.districts.push(cur.dis);
    acc.selections.push(geoid);
    return acc;
  }, {});

  if (!eventHandler.checkStateName(federal.state)) {
    return zipLookUpHandler.zipErrorResponse('That zipcode is not in ' + stateView.state + '. Go back to <a href="/">Town Hall Project U.S.</a> to search for events.');
  }

  if (zipToDistrictArray.length > 1) {
    var lower = zipToDistrictArray[1].reduce(function (acc, cur) {
      if (!acc.districts) {
        acc.districts = [];
      }
      acc.state = cur.abr;
      acc.districts.push(cur.dis);
      return acc;
    }, {});
    var upper = zipToDistrictArray[2].reduce(function (acc, cur) {
      if (!acc.districts) {
        acc.districts = [];
      }
      acc.state = cur.abr;
      acc.districts.push(cur.dis);
      return acc;
    }, {});
  }
  return {
    federal: federal,
    upper: upper,
    lower: lower,
  };
}
  static checkIfOnlySenate(selectedData) {
    var justSenate = true;
    var numOfDistrictEvents = 0;
    if (selectedData.length === 0) {
      justSenate = false;
    }
    selectedData.forEach(function (ele) {
      if (ele.district) {
        numOfDistrictEvents++;
        justSenate = false;
      }
    });
    return [justSenate, numOfDistrictEvents];
  };

  static getLookupArray() {
    if (stateView.state) {
      return ['/zipToDistrict/', '/state_zip_to_district_lower/' + stateView.state + '/', '/state_zip_to_district_upper/' + stateView.state + '/'];
    }
    return ['/zipToDistrict/'];
  }

  constructor(props) {
    super(props);
    this.saveZip = this.saveZip.bind(this);
    this.lookUpZip = this.lookUpZip.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      query: ''
    }
  }

  componentDidMount() {
    const { setDistrict } = this.props;
    // Perform zip search on load
    var zipcode = urlParamsHandler.getUrlParameter('zipcode');
    var selectedDistrict = urlParamsHandler.getUrlParameter('district');
    if (zipcode) {
      this.setState({ query: zipcode})
      this.lookUpZip(zipcode);
    } else if (selectedDistrict) {
      if (selectedDistrict.split('-').length === 3) {
        //TODO: possible more checks to make sure this is a real district
        const state = selectedDistrict.split('-')[0];
        const district = selectedDistrict.split('-')[1];
        const geoID = selectedDistrict.split('-')[2];
        var feature = {
          state,
          district,
          geoID,
        };
        const locationData = {federal: {
          state,
          districts: [district],
          selections: [geoID],
        }}
        setDistrict(locationData)
      } else {
        urlParamsHandler.setUrlParameter('district', false);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {currentZip} = this.props;
    // clear out input box
    if (!currentZip && this.state.query && prevProps.currentZip) {
      this.setState({query: ''})
    }
  }

  saveZip(e) {
    this.setState({
      query: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    const { query } = this.state;
    const { setDistrict, setZip } = this.props;
    if (!query) {
      setZip('');
      setDistrict('');
      return indexView.resetHome();
    }
    if (isZipCode(query)) {
      this.lookUpZip(query);
    } else if (isState(query)) {
      this.lookUpByState();
    } else if (isDistrict(query)) {
      this.lookUpByDistrict(query);
    } else {
      this.lookUpName(query);
    }
  }

  lookUpName(name) {
    const queryRef = firestore.collection('office_people').where('displayName', "==", capitalizeName(name));
    const locationData = {};
    queryRef.get()
      .then((snapshot) => {
      if (snapshot.empty) {
        return;
      }

      snapshot.forEach(member => {
        const memberData = member.data();
        const currentRole = memberData.roles[memberData.current_office_index];
        if (memberData.campaigns) {
          const currentCampaign = memberData.campaigns[memberData.current_office_index];
          if (currentCampaign.chamber === 'nationwide') {
            locationData.displayName = memberData.displayName
          }

        }
        if (currentRole.level === 'federal') {
          locationData.federal = {
            state: currentRole.state,
            districts: currentRole.district ? [mapHelperFunctions.zeroPad(currentRole.district)] : [],
          }
        } else if (currentRole.level === 'state') {
          locationData[currentRole.chamber] = {
            state: currentRole.state,
            districts: [currentRole.district.split('-')[1]]
          }
        }
      });
      // eventHandler.renderResults(locationData);
    })

  }

  lookUpByDistrict(district) {
    const {
      usState,
      setDistrict
    } = this.props;
    let locationData = {}
    if (isFederalDistrict(district)) {
      const state = district.split('-')[0];
      locationData.federal = {
        districts: [district.split('-')[1]],
        state
      }
    } else if (usState) {
      const chamber = district.split('-')[0];
      if (chamber === 'HD') {
        locationData.lower = {
          districts: [district.split('-')[1]],
          state: usState,
        }
      } else {
        locationData.upper = {
          districts: [district.split('-')[1]],
          state: usState,
        }
      }
    }
    setDistrict(locationData);
    // eventHandler.renderResults(locationData);
  }

  lookUpByState(state) {
    const {
      setDistrict
    } = this.props;
    TownHall.resetData();
    TownHall.zipQuery;


      urlParamsHandler.setUrlParameter('state', state);

      var locationData = ZipSearch.handleZipToDistrict(zipToDistrictArray);
      setDistrict(locationData);
      // eventHandler.renderResults(locationData);
  }

  lookUpZip(zip) {
    const {
      setDistrict,
      setZip
    } = this.props;
    TownHall.resetData();
    TownHall.zipQuery;

    var zipCheck = zip.match(zipcodeRegEx);
    if (zipCheck) {
      var zipClean = zip.split('-')[0];
      setZip(zipClean)
      var lookupArray = ZipSearch.getLookupArray();
      var promises = lookupArray.map(function (path) {
        return TownHall.lookupZip(zipClean, path);
      });
      Promise.all(promises)
        .then(function (zipToDistrictArray) {
          TownHall.zipQuery = zipClean;
          urlParamsHandler.setUrlParameter('district', false);
          urlParamsHandler.setUrlParameter('zipcode', zipClean);

          var locationData = ZipSearch.handleZipToDistrict(zipToDistrictArray);
          setDistrict(locationData);
          // eventHandler.renderResults(locationData);
        })
        .catch(function (error) {
          zipLookUpHandler.zipErrorResponse('That zip code is not in our database, if you think this is an error please email us.', error);
        });
    } else {
      zipLookUpHandler.zipErrorResponse('Zip codes are 5 or 9 digits long.');
    }
  };

  render() {
    const {
      usState
    } = this.props;
    const bannerSrc = usState ? `${location.origin}/Images/${usState}/THP_logo_inverse.png` : "/Images/THP_logo_inverse.png";
    return (
      <header className="site-header clearfix">
        <section className="container container-fluid">
          <div className="row">
            <div className="col-md-6 left-panels">
              <div className=" text-left site-header clearfix displayoff ">
                <div className="form-text-results col-md-12">
                  <div className="text-toggle header-large">
                    <img id="header-image" src={bannerSrc} alt=""></img>
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
              <form className="form-inline text-center" onSubmit={this.handleSubmit}>
                <div className="form-group text-center">
                  <input className="form-control input-lg search-input" type="zip" placeholder={usState ? "zip, district or lawmaker": "zipcode or district"} onChange={this.saveZip} value={this.state.query}/>
                  <input type="submit" className="btn btn-primary btn-lg fath-button" value="Find a Town Hall" />
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
    );
  }
};

