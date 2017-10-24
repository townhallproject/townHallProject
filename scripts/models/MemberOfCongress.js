(function(module) {
  function MoC(opts) {
    for (keys in opts) {
      this[keys] = opts[keys];
    }
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

  MoC.prototype.zeroPadding = function() {
    var zeros = '00';
    district = this.district.toString();
    return zeros.substring(0, zeros.length - district.length) + district;
  };

  MoC.all = firebasedb.ref('mocData/').once('value').then(function(snapshot) {
    var MoCs = snapshot.val();
    return Object.keys(MoCs).map(function(key) {
      return new MoC(MoCs[key]);
    }).filter(function(member){
      return member.in_office;
    }).sort(function(a, b) {
      if (a.state > b.state) {
        return -1;
      } else if (a.state < b.state) {
        return 1;
      }
      return 0;
    });
  });

  module.MoC = MoC;
})(window);