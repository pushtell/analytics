var Analytics = require('analytics.js-core');


var Mixpanel = require('./integrations/mixpanel');



describe("Integrations", function() {
  let container;
  before(function(){
    var options = {
      token: 'x',
      cookieName: 'y',
      crossSubdomainCookie: true,
      secureCookie: true
    };
    var analytics = new Analytics();
    var mixpanel = new Mixpanel(options);
    analytics.use(Mixpanel);
    analytics.add(mixpanel);
  });
  after(function(){
  });
  it("should render the correct variant.", function(){

  });
});

