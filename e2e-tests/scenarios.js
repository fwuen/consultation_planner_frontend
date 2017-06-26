'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /view-docent when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/view-docent");
  });


  describe('view-docent', function() {

    beforeEach(function() {
      browser.get('index.html#!/view-docent');
    });


    it('should render view-docent when user navigates to /view-docent', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('view-login', function() {

    beforeEach(function() {
      browser.get('index.html#!/view-login');
    });


    it('should render view-login when user navigates to /view-login', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
