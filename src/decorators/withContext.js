/*jshint esnext: true */

import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import emptyFunction from '../../node_modules/react/lib/emptyFunction';

function withContext(ComposedComponent) {
  return class WithContext {

    static propTypes = {
      context: PropTypes.shape({
        onSetTitle: PropTypes.func,
        onSetMeta: PropTypes.func,
        onInsertCss: PropTypes.func
      })
    };

    static childContextTypes = {
      onInsertCss: PropTypes.func.isRequired,
      onSetTitle: PropTypes.func.isRequired,
      onSetMeta: PropTypes.func.isRequired
    };

    getChildContext() {
      let context = this.props.context;
      return {
        onInsertCss: context.onInsertCss || emptyFunction,
        onSetTitle: context.onSetTitle || emptyFunction,
        onSetMeta: context.onSetMeta || emptyFunction
      };
    }

    render() {
      let { context, ...other } = this.props; // eslint-disable-line no-unused-vars
      return <ComposedComponent {...other} />;
    }

  };
}

export default withContext;
