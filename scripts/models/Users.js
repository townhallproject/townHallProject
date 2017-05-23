(function(module) {
  function User (opts) {
    for (var key in opts) {
      this[key] = opts[key];
    }
  }

  module.User = User;
})(window);
