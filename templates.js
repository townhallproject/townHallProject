Handlebars.getTemplate = function(name) {
  if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
    $.ajax({
      url : 'templates/' + name + '.handlebars',
      mimeType: 'text/x-handlebars-template',
      success : function(data) {
        if (Handlebars.templates === undefined) {
          Handlebars.templates = {};
        }
        Handlebars.templates[name] = Handlebars.compile(data);
      },
      async : false
    });
  }
  return Handlebars.templates[name];
};

Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context).replace(/"/g, '&quot;');
});

Handlebars.registerHelper('addressQuery', function(address) {
  return escape(address)
});

Handlebars.registerHelper('addressFormat', function(address, options) {
  var out = "";
  var items = address.split(',');
  out = out + items.splice(0, 1)[0] + '<br>'
  return out + items.join(', ');
});

// Adapted from http://stackoverflow.com/a/16315366
// Please don't kill me for adding regex validation to handlebars...
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
  case 'regexTest':
    var re = new RegExp(v2);
    return re.test(v1) ? options.fn(this) : options.inverse(this);
  case '||':
    return (v1 || v2) ? options.fn(this) : options.inverse(this);
  case '&&':
    return (v1 && v2) ? options.fn(this) : options.inverse(this);
  case '==':
    return (v1 == v2) ? options.fn(this) : options.inverse(this);
  case '===':
    return (v1 === v2) ? options.fn(this) : options.inverse(this);
  case '!=':
    return (v1 != v2) ? options.fn(this) : options.inverse(this);
  case '!==':
    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
  case '<':
    return (v1 < v2) ? options.fn(this) : options.inverse(this);
  case '<=':
    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
  case '>':
    return (v1 > v2) ? options.fn(this) : options.inverse(this);
  case '>=':
    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
  default:
    return options.inverse(this);
  }
});

///Handlebars helper to format the Last Updated
Handlebars.registerHelper('dateFormat', function(lastUpdated) {
  return moment(lastUpdated).fromNow();
});

Handlebars.registerHelper('shortDateTime', function(townhall) {
  var localString = new Date(townhall.Date + ' ' + townhall.Time).toLocaleString();
  var shortDateTime = localString.slice(0, -6) + localString.slice(-2);
  return townhall.timeZone ? townhall.timeZone : null;
});
