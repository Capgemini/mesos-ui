How to contribute
=================

[Mesos-ui](https://github.com/Capgemini/mesos-ui) is based on an strong open-source philosophy so we would love your contributions to make it better.


## Code of Conduct

This project adheres to the [Open Code of Conduct](http://todogroup.org/opencodeofconduct/#mesos-ui/digitaldevops.uk@capgemini.com). By participating, you are expected to uphold this code.

## Mesos-ui Core

* Mesos-ui an alternative web UI for [Apache Mesos](http://mesos.apache.org/) which provides a non-opinionated rich user experience for managing and monitoring your Mesos Cluster.

* Mesos-ui does not make any assumptions so we'd love you to provide your addons specific features on top of it that can be resued across the community.

* We use [ReactJS](https://facebook.github.io/react/index.html) so it leverages encapsulation, code reusability and separation of concerns via React Components.

* We use [material-ui](http://material-ui.com/) which combines quality of [Google Design](https://design.google.com) with power of React.


## Contributing to Mesos-ui

* Submit an issue describing your proposed change to the Mesos-ui repo.

* Fork the repo, develop and test your feature.

* Submit a pull request.

### New Widgets.

* Mesos-ui is composed of reusable bits. For creating a new component please read about [React Reusable Components](https://facebook.github.io/react/docs/why-react.html) and [ES6 Classes.](https://facebook.github.io/react/docs/reusable-components.html#es6-classes)

* Individual components live in ```src/components/your-component```

### New Themes.

* See http://material-ui.com/#/customization/themes

* New themes should live in ```src/themes```

* A new theme should be purely a JS file defining your specific styles for rendering the material-ui components.

```
checkbox: {
  boxColor: palette.textColor,
  checkedColor: palette.primary1Color,
  requiredColor: palette.primary1Color,
  disabledColor: palette.disabledColor,
  labelColor: palette.textColor,
  labelDisabledColor: palette.disabledColor
}
```

* Components should be theme agnostic, being injected as a context.

```
 static contextTypes = {
    muiTheme: React.PropTypes.object
  };

getStyles() {
    let palette = this.context.muiTheme.palette;
  computer: {
      color: palette.primary3Color,
```
