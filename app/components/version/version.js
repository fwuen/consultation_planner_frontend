'use strict';

angular.module('MeetTheProf.version', [
  'MeetTheProf.version.interpolate-filter',
  'MeetTheProf.version.version-directive'
])

.value('version', '0.1');
