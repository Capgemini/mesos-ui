import AppDispatcher from '../core/Dispatcher';
import EventEmitter from 'eventemitter3';
import ClusterConstants from '../constants/ClusterConstants';
import ClusterActions from '../actions/ClusterActions';
import assign from 'object-assign';
import _ from 'lodash';

var CHANGE_EVENT = 'change';
var METRICS_RECEIVED_EVENT = 'metricsReceived';
var LOGS_RECEIVED_EVENT = 'logsReceived';
var STATE_RECEIVED_EVENT = 'stateReceived';

var stats = require('./schemes/statsScheme.js');

var state = {
  nodes: [],
  frameworks: [],
  tasks: [],
  leader: '',
  pid: ''
};

var logs = {};

/**
 * Refresh cluster stats
 */
function refreshStats(statistics) {
  assign(stats,
    { memFreeBytes: statistics['system/mem_free_bytes'] },
    { memTotalBytes: statistics['system/mem_total_bytes'] },
    { cpusPercent: statistics['master/cpus_percent'] },
    { cpusUsed: statistics['master/cpus_used'] },
    { cpusTotal: statistics['master/cpus_total'] },
    { diskPercent: statistics['master/disk_percent'] },
    { diskUsed: statistics['master/disk_used'] },
    { diskTotal: statistics['master/disk_total'] },
    { memPercent: statistics['master/mem_percent'] },
    { memUsed: statistics['master/mem_used'] },
    { memTotal: statistics['master/mem_total'] },
    { slavesActive: statistics['master/slaves_active'] },
    { slavesConnected: statistics['master/slaves_connected'] },
    { slavesDisconnected: statistics['master/slaves_disconnected'] },
    { slavesInactive: statistics['master/slaves_inactive'] },
    { tasksRunning: statistics['master/tasks_running'] },
    { tasksStaging: statistics['master/tasks_staging'] }
  );
}

function refreshLogs(currentLogs) {
  Array.isArray(currentLogs) ? assign(logs, currentLogs[0]) : assign(logs, currentLogs);
  return logs;
}

function refreshState(data) {

  let frameworkScheme = require('./schemes/frameworkScheme.js');
  let nodeScheme = require('./schemes/nodeScheme.js');

  // Get the framework data.
  state.frameworks = data.frameworks.map(function(framework) {
    let frameworkData = assign({}, frameworkScheme);

    for(var propertyName in framework) {
      frameworkData[_.camelCase(propertyName)] = framework[propertyName];
    }

    return frameworkData;
  });

  // Get the node data.
  state.nodes = data.slaves.map(function(node) {
    let nodeData = assign({}, nodeScheme);

    for(var propertyName in node) {
      nodeData[_.camelCase(propertyName)] = node[propertyName];
    }
    return nodeData;
  });

  // This give us time complexity O(n) rather than O(n*m)
  // plus ease to change the patron for grouping at the component level.
  // O(n*m) shoudn't be a problem as number of frameworks never will be massive.
  let allTasks = [];
  let slaveIdName = {};
  let frameworkIdName = {};

  // Builds an array with all the tasks for all the frameworks.
  // Builds a hashs framewrokId: frameworkName.
  for(var index in data.frameworks) {
    frameworkIdName[data.frameworks[index].id] = data.frameworks[index].name;
    allTasks = allTasks.concat(data.frameworks[index].tasks);
  }

  // builds a hash slaveId: hostname.
  for(var index in data.slaves) {
    slaveIdName[data.slaves[index].id] = data.slaves[index].hostname;
  }

  // Add hostname, framework_name and timestamp at the task level.
  for(var index in allTasks) {
    allTasks[index].framework_name = frameworkIdName[allTasks[index].framework_id];
    allTasks[index].hostname = slaveIdName[allTasks[index].slave_id];
    allTasks[index].timestamp = allTasks[index].statuses.map((status) => { if (status.state == 'TASK_RUNNING') { return status.timestamp }} );
  }

  state.leader = data.leader;
  state.pid = data.pid;
  state.tasks = allTasks;
}

var ClusterStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the stats for the cluster.
   * @return {object}
   */
  getStats() {
    return stats;
  },

  getLogs() {
    return logs;
  },

  getNodes() {
    return state.nodes;
  },

  getFrameworks() {
    return state.frameworks;
  },

  getTasks() {
    return state.tasks;
  },

  getLeader() {
    return state.leader;
  },

  getPid() {
    return state.pid;
  },

  /**
   * Utility function to convert Megabytes to Gigabytes and round to the
   * closest 2 decimal places.
   *
   * [convertMBtoGB description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  convertMBtoGB(value) {
    return _.round(value / 1024, 2);
  },

  /**
   * Emits change event to all registered event listeners.
   *
   * @returns {Boolean} Indication if we've emitted an event.
   */
  emitChange() {
    return this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  metricsReceived(data) {
    /* @todo - check if the data we are receiving is different from what we have
    already to avoid calling unecessary DOM updates */
    ClusterActions.refreshStats(data);
    this.emit(METRICS_RECEIVED_EVENT, data);
  },

  logsReceived(data) {
    /* @todo - check if the data we are receiving is different from what we have
    already to avoid calling unecessary DOM updates */
    ClusterActions.refreshLogs(data);
    this.emit(LOGS_RECEIVED_EVENT, data);
  },

  stateReceived(data) {
    /* @todo - check if the data we are receiving is different from what we have
    already to avoid calling unecessary DOM updates */
    ClusterActions.refreshState(data);
    this.emit(STATE_RECEIVED_EVENT, data);
  }
});

// Register callback to handle all updates
ClusterStore.dispatchToken = AppDispatcher.register((action) => {

  switch(action.actionType) {

    case ClusterConstants.CLUSTER_REFRESH_STATS:
      refreshStats(action.stats);
      ClusterStore.emitChange();
      break;

    case ClusterConstants.CLUSTER_REFRESH_LOGS:
      refreshLogs(action.logs);
      ClusterStore.emitChange();
      break;

    case ClusterConstants.CLUSTER_REFRESH_STATE:
      refreshState(action.state);
      ClusterStore.emitChange();
      break;

    default:
      // no op
  }
});

export default ClusterStore;
