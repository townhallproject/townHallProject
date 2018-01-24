(function(module) {

  repCardHandler = {};

  // renders the results of rep response
  repCardHandler.repCards = function(results, compiledTemplate, $parent) {
    results.forEach(function(rep) {
      switch(rep.party) {
      case 'R':
        rep.party = 'Republican';
        break;
      case 'D':
        rep.party = 'Democrat';
        break;
      case 'I':
        rep.party = 'Independent';
        break;
      }
      var termEnd = new Date(rep.term_end);
      // Get the canon facebook and twitter accounts
      rep.facebook_canon = rep.facebook_official_account || rep.facebook_account || rep.facebook;
      rep.twitter_canon = rep.twitter_account || rep.twitter;
      // If term expires in janurary then assume the election is in the prior year
      rep.electionYear = termEnd.getMonth() === 0 ? termEnd.getFullYear() - 1 : termEnd.getFullYear();
      $parent.append(compiledTemplate(rep));
    });
  };

  // Display a list of reps with contact info
  repCardHandler.renderRepresentativeCards = function(representativePromise, $parent, state) {
    $parent.empty(); // If they search for a new zipcode clear the old info
    representativePromise.then(function(representatives) {
      var compiledTemplate = Handlebars.getTemplate('representativeCard');
      $parent.append('<h2 class="text-primary text-center">Your Federal Representatives</h2>');
      repCardHandler.repCards(representatives, compiledTemplate, $parent);

      if (representatives.length > 3) {
        $parent.append('<h4 class="col-md-12 text-center">Your zip code encompasses more than one district.<br><small><a href="http://www.house.gov/representatives/find/">Learn More</a></small></h4>');
      } else if (representatives.length === 1) {
        repCardHandler.addRepresentativeCards(TownHall.lookupReps('state', state), $('#representativeCards section'));
      }
      $parent.parent().show();
    });
  };

  // append additional reps for lookup by district
  repCardHandler.addRepresentativeCards = function(representativePromise, $parent) {
    representativePromise.then(function(representatives) {
      var compiledTemplate = Handlebars.getTemplate('representativeCard');
      repCardHandler.repCards(representatives, compiledTemplate, $parent);
    });
  };

  module.repCardHandler = repCardHandler;
})(window);
