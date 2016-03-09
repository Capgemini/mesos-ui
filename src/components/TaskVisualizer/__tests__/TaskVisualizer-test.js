/*jshint esnext: true */
jest.dontMock('../TaskVisualizer');
jest.autoMockOff();

describe('TaskVisualizer', function() {

  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var TaskVisualizer = require('../TaskVisualizer.js');
  var tasks = require('./tasks-stub.json');


  it('gets Hex colors from app names', function() {
    const TaskVisualizer = require('../TaskVisualizer');
    let object = new TaskVisualizer();
    expect(object.stringToColor('anyAppName')).toMatch("#[a-zA-Z0-9]{6,}$");
  });

  it('creates a hash like => appName: hexColor from an array of tasks.', function() {
    const TaskVisualizer = require('../TaskVisualizer');
    let object = new TaskVisualizer();
    let appColorList = object.createAppColorList(tasks);
    expect(appColorList.stubby).toMatch("#[a-zA-Z0-9]{6,}$");
    expect(appColorList.dashing).toMatch("#[a-zA-Z0-9]{6,}$");
    expect(appColorList.stubby).toMatch("#[a-zA-Z0-9]{6,}$");
  });
});
