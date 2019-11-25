import moment from 'moment';

import { firebasedb } from '../lib/firebasedb';
import constants from '../lib/constants';
class MoC {
  constructor(opts) {
    for (var keys in opts) {
      this[keys] = opts[keys];
    }
    if (this.type === 'sen') {
      this.repOf = 'Sen. ' + this.state;
      this.displayType = 'Senate';
      this.title = this.title ? this.title.split(',')[0] : 'Senator';
      this.subtitle = 'Senator';
    } else if (this.type === 'rep') {
      this.repOf = this.state + '-' + this.zeroPadding();
      this.displayType = 'House';
      this.subtitle = this.state + '-' + this.district;
      this.title = this.title ? this.title.split(',')[0] : 'Representative';
    }
  }
  zeroPadding() {
    var zeros = '00';
    var district = this.district.toString();
    return zeros.substring(0, zeros.length - district.length) + district;
  };
  format = function(){
    switch (this.party) {
    case 'R':
      this.party = 'Republican';
      break;
    case 'D':
      this.party = 'Democratic';
      break;
    case 'I':
      this.party = 'Independent';
      break;
    }
    // Get the canon facebook and twitter accounts
    this.facebook_canon = this.facebook_official_account || this.facebook_account || this.facebook;
    this.twitter_canon = this.twitter_account || this.twitter;

    this.electionYear = this.next_election;

    if (this.dyjd){
      this.pledger = this.dyjd.pledger;
    }
    var prefix = this.short_title;

    var sentence = [prefix, this.displayName];
    this.formattedMember = sentence.join(' ');
  };
}

  MoC.all = () => {
    return firebasedb.ref('moc_by_congress/116').once('value')
    .then(function(snapshot) {
      var toReturn = [];
      snapshot.forEach(function(ele) {
        toReturn.push(ele.val());
      });
      return toReturn;
    }).then(function(currentCongressIds) {
      return firebasedb.ref('mocData/').once('value').then(function(snapshot) {
        var MoCs = snapshot.val();
        return Object.keys(MoCs).map(function(key) {
          return new MoC(MoCs[key]);
        }).filter(function(member) {
          return member.in_office && currentCongressIds.indexOf(member.govtrack_id) > 0;
        }).sort(function(a, b) {
          if (a.state > b.state) {
            return -1;
          } else if (a.state < b.state) {
            return 1;
          }
          return 0;
        });
      });
    });
  }

export default MoC;
