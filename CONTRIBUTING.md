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

### Replacing the Mesos default UI

#### With Docker

You can use [capgemini/mesos-ui](https://hub.docker.com/r/capgemini/mesos-ui/) for running a container extending [mesosphere/mesos-master](https://hub.docker.com/r/mesosphere/mesos-master/) with this mesos-ui as the default Mesos UI.

##### Building the Docker image

```
git clone https://github.com/Capgemini/mesos-ui.git mesos-ui
cd mesos-ui
npm install

export MESOS_VERSION="Mesos version to build from"
//This must be an existing local git tag.
export MESOS_UI_VERSION="Mesos ui version"

make
```

#### Without Docker

```
git clone https://github.com/Capgemini/mesos-ui.git mesos-ui
cd mesos-ui
npm install
gulp build
```

Run mesos like:

```./bin/mesos-master.sh --ip=127.0.0.1 --work_dir=/var/lib/mesos --log_dir=/var/lib/mesos/logs --webui_dir=/path-to/mesos-ui/build/```

or using environment variables:

```export MESOS_WEBUI_DIR=/your-path/mesos-ui/build/```

See http://mesos.apache.org/gettingstarted/

See http://mesos.apache.org/documentation/latest/configuration/

## Compatibility

This code has been tested against Mesos version 0.23 at the time of writing and all subsequent versions until 0.27 included.

## Developing locally

### Prerequisites

NodeJS (+ NPM) version 4.x. See [https://nodejs.org/en/download/releases/](https://nodejs.org/en/download/releases/) for installation instructions.

Install gulp package for global use:

```
sudo npm install -g gulp
```

To run the app, first clone the repo:

```
git clone https://github.com/Capgemini/mesos-ui.git mesos-ui
```

Install the NPM packages:

```
cd mesos-ui
npm install
```
Make sure you export the environment variable MESOS_ENDPOINT to point to the stub server.
```export MESOS_ENDPOINT=http://127.0.0.1:8000``` 

Serve the app

```
gulp
```

At this point the app should open in the browser the page `http://localhost:3000`.

The application is using a stub JSON server to mock the Mesos APIs
so you don't necessarily need a working Mesos Cluster. For that we are using
[json-server](https://github.com/typicode/json-server).

The application should be available on http://localhost:5000.

The stub data is at [src/stub.json](https://github.com/Capgemini/mesos-ui/blob/master/src/stub.json). The UI for json-server should be available on http://localhost:8000

For using the previews standalone version of mesos-ui [check this out](https://github.com/Capgemini/mesos-ui/tree/0.1.1)

