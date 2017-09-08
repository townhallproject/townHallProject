function Moc(opts) {
  for (keys in opts) {
    this[keys] = opts[keys];
  }
  this.TownHall = 0;
  if (this.type === 'sen') {
    this.repOf = 'Sen. ' + this.state;
    this.displayType = 'Senate';
    this.subtitle = 'Senator';
  } else {
    this.repOf = this.state + '-' + this.zeroPadding();
    this.displayType = 'House';
    this.subtitle = this.state + '-' + this.district;
  }
}

Moc.loaded = false;
Moc.allMocsObjs = [];

Moc.prototype.zeroPadding = function() {
  var zeros = '00';
  district = this.district.toString();
  return zeros.substring(0, zeros.length - district.length) + district;
};

Moc.loadAll = function(){
  $currentState = $('#mm-current-state');
  var total = 0;
  return new Promise(function (resolve, reject) {
    firebase.database().ref('mocData/').once('value').then(function(snapshot){
      snapshot.forEach(function(member){
        if (member.val().party) {
          var memberobj = new Moc(member.val());
          memberobj.partyClass = memberobj.party.substring(0,3);
          if (memberobj.missingMember === true) {
            Moc.allMocsObjs.push(memberobj);
            total ++;
          }
        }
      });
      $('#mm-current-state').attr('data-current', total);
      $('#mm-current-state').attr('data-total', total);
      Moc.allMocsObjs.sort(function(a, b){
        if (a.state > b.state) {
          return -1;
        } else if (a.state < b.state) {
          return 1;
        }
        return 0;
      });
      resolve(Moc.allMocsObjs);
    });
  });
};
