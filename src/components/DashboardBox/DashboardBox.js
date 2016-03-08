import React, { PropTypes } from 'react';
import { Card, CardTitle } from 'material-ui';
import _ from 'lodash';

class DashboardBox extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    styles: PropTypes.object,
    children: PropTypes.object,
    xsColSize: PropTypes.number,
    smColSize: PropTypes.number,
    mdColSize: PropTypes.number,
    lgColSize: PropTypes.number
  };

  static defaultProps = {
    xsColSize: 12,
    smColSize: 6,
    mdColSize: 4,
    styles: {}
  };

  constructor(props) {
    super(props);
  }

  getStyles() {
    return {
      root: {
        borderRadius: 5,
        minHeight: 315
      },
      card: {
        titleColor: '#000000',
        subtitleColor: '#000000'
      }
    };
  }

  getCols() {
    let xs = this.props.xsColSize;
    let sm = this.props.smColSize;
    let md = this.props.mdColSize;
    let lg = this.props.lgColSize;

    let cols = 'col-xs-' + xs;
    if (sm) {
      cols = cols + ' col-sm-' + sm;
    }
    if (md) {
      cols = cols + ' col-md-' + md;
    }
    if (lg) {
      cols = cols + ' col-lg-' + lg;
    }
    return cols;
  }

  render() {
    let styles = _.merge(this.getStyles(), this.props.styles);

    return (
      <div className={this.getCols()}>
        <div className="box">
          <Card style={styles.root}>
            <CardTitle subtitle={this.props.title} titleColor={styles.card.titleColor} subtitleColor={styles.card.subtitleColor} />
            {this.props.children}
          </Card>
        </div>
      </div>
    );
  }

}

export default DashboardBox;
