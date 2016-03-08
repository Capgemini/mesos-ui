import React from 'react';
import { Menu } from 'material-ui';

class Navigation extends React.Component {

  static propTypes = {
    menuItems: React.PropTypes.array
  };

  static contextTypes = {
    router: React.PropTypes.func,
    muiTheme: React.PropTypes.object
  };

  constructor() {
    super();
    this.getSelectedIndex = this.getSelectedIndex.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
  }

  getSelectedIndex() {
    let menuItems = this.props.menuItems;
    let currentItem;

    for (let i = menuItems.length - 1; i >= 0; i--) {
      currentItem = menuItems[i];
      if (currentItem.route && this.context.router.isActive(currentItem.route)) {
        return i;
      }
    }
  }

  onMenuItemClick(e, index, item) {
    this.context.router.transitionTo(item.route);
  }

  getStyles() {
    return {
      minHeight: '800',
      borderRadius: 0,
      zIndex: 0,
      boxShadow: 'none',
      whiteSpace: 'pre'
    };
  }

  render() {
    return (
      <Menu style={this.getStyles()}
        ref="menuItems"
        zDepth={1}
        animated={false}
        desktop={true}
        autoWidth={false}
        menuItems={this.props.menuItems}
        selectedIndex={this.getSelectedIndex()}
        onItemTap={this.onMenuItemClick} />
    );
  }

}

export default Navigation;
