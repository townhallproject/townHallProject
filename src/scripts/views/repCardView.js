import $ from 'jquery';

import representativeCardTemplate from '../../components/RepCard';

import TownHall from '../models/TownHall';
import MoC from '../models/MemberOfCongress';

const repCardHandler = {};

// renders the results of rep response
repCardHandler.repCards = function(results, compiledTemplate, $parent) {
  // results.forEach(function(rep) {
  //   if (rep) {
  //     const newRep = new MoC(rep);
  //     newRep.format();
  //     $parent.append(compiledTemplate(newRep));
  //   }
  // });
};

// Display a list of reps with contact info
repCardHandler.renderRepresentativeCards = function (representativePromise, $parent, state) {
  // $parent.empty(); // If they search for a new zipcode clear the old info
  // representativePromise.then(function (representatives) {
  //   $parent.append('<h2 class="text-primary text-center">Your Federal Representatives</h2>');
  //   repCardHandler.repCards(representatives, representativeCardTemplate, $parent);

  //   if (representatives.length > 3) {
  //     $parent.append('<h4 class="col-md-12 text-center">Your zip code encompasses more than one district.<br><small><a href="http://www.house.gov/representatives/find/">Learn More</a></small></h4>');
  //   } else if (representatives.length === 1) {
  //     repCardHandler.addRepresentativeCards(TownHall.lookupReps('state', state), $('#representativeCards section'));
  //   }
  //   $parent.parent().show();
  // });
};

// append additional reps for lookup by district
repCardHandler.addRepresentativeCards = function (representativePromise, $parent) {
  // representativePromise.then(function (representatives) {
  //   repCardHandler.repCards(representatives, representativeCardTemplate, $parent);
  // });
};

export default repCardHandler;
