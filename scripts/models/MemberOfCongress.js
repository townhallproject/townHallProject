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
    // Do we need to check if party exists here? It was in the missing members code, but I can't see any examples of MoCs without party
    return Object.keys(MoCs).map(function(key) {
      return new MoC(MoCs[key]);
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