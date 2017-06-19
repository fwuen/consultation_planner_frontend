'use strict';

describe('MeetTheProf.version module', function() {
  beforeEach(module('MeetThePof.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
