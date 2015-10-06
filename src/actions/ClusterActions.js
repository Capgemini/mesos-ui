/*jshint esnext: true */

import Dispatcher from '../core/Dispatcher';
import ClusterConstants from '../constants/ClusterConstants';

export default {

  refreshStats(stats) {
    Dispatcher.dispatch({
      actionType: ClusterConstants.CLUSTER_REFRESH_STATS,
      stats: stats
    });
  },
  refreshState(state) {
    Dispatcher.dispatch({
      actionType: ClusterConstants.CLUSTER_REFRESH_STATE,
      state: state
    });
  }

};
