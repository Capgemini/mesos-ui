'use strict';
// __tests__/ClusterStore-test.js

jest.dontMock('../../constants/ClusterConstants');
jest.dontMock('../ClusterStore');
jest.dontMock('object-assign');
jest.mock('../../core/Dispatcher');

describe('ClusterStore', function() {

  var ClusterConstants = require('../../constants/ClusterConstants');
  var statsScheme = require('../schemes/statsScheme');
  var Dispatcher, ClusterStore, callback;

  var mockStats = {
    "master/cpus_percent": 0.375,
    "master/cpus_total": 4,
    "master/cpus_used": 1.5,
    "master/disk_percent": 0,
    "master/disk_total": 7924,
    "master/disk_used": 0,
    "master/frameworks_active": 2,
    "master/frameworks_connected": 2,
    "master/frameworks_disconnected": 0,
    "master/frameworks_inactive": 0,
    "master/mem_percent": 0.186861313868613,
    "master/mem_total": 5480,
    "master/mem_used": 1024,
    "master/slaves_active": 2,
    "master/slaves_connected": 2,
    "master/slaves_disconnected": 0,
    "master/slaves_inactive": 0,
    "master/tasks_error": 0,
    "master/tasks_failed": 11,
    "master/tasks_finished": 0,
    "master/tasks_killed": 46,
    "master/tasks_lost": 0,
    "master/tasks_running": 1,
    "master/tasks_staging": 1,
    "master/tasks_starting": 0,
    "system/cpus_total": 1,
    "system/load_15min": 0.44,
    "system/load_1min": 0.15,
    "system/load_5min": 0.2,
    "system/mem_free_bytes": 2442649600,
    "system/mem_total_bytes": 3947372544
  }
  // mock actions
  var actionClusterRefreshStats = {
    actionType: ClusterConstants.CLUSTER_REFRESH_STATS,
    stats: mockStats
  };

  beforeEach(function() {
    Dispatcher = require('../../core/Dispatcher');
    ClusterStore = require('../ClusterStore');
    callback = Dispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(Dispatcher.register.mock.calls.length).toBe(1);
  });

  it('should initialize with no stats', function() {
    var all = ClusterStore.getStats();
    expect(all).toEqual(statsScheme);
  });

  it('refreshes cluster stats', function() {
    callback(actionClusterRefreshStats);
    var all = ClusterStore.getStats();
    var keys = Object.keys(all);
    expect(keys.length).toBe(17);
    expect(all['memFreeBytes']).toEqual(2442649600);
    expect(all['cpusPercent']).toEqual(0.375);
  });

  it('converts MB to GB correctly', function() {
    // 7924 MB = 7.74 GB
    expect(ClusterStore.convertMBtoGB(7924)).toEqual(7.74);

    // Zero values
    expect(ClusterStore.convertMBtoGB(0)).toEqual(0);

    // 100 MB
    expect(ClusterStore.convertMBtoGB(0.1)).toEqual(0);
  });
});
