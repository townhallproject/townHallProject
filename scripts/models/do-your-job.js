(function(module){

  function DoYourJobDistrict(opts) {
    for (var key in opts) {
      this[key] = opts[key];
    }
  }
  DoYourJobDistrict.total = null;
  DoYourJobDistrict.getCount = function(){

    firebasedb.ref('do_your_job_districts').once('value').then(function(snapshot) {
      DoYourJobDistrict.total = snapshot.numChildren();
      $('#number-of-dyjd').html(DoYourJobDistrict.total);
    });
  }; 
  DoYourJobDistrict.getCount();
  module.DoYourJobDistrict = DoYourJobDistrict;
})(window);