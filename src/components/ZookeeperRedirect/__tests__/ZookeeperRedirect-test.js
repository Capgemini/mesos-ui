jest.autoMockOff();
describe('ZookeeperRedirect', function() {

  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var ZookeeperRedirect = require('../ZookeeperRedirect.js');

  it('is hidden when leader == pid', function() {
  // Render a ZookeeperRedirect in the document.
    var zookeeperRedirectRendered = TestUtils.renderIntoDocument(
      <ZookeeperRedirect leader='http://127.0.0.1:5050' pid='http://127.0.0.1:5050' redirectTime={3000} />
    );

    // Verify that it's hide by default.
    var zooKeeperDiv = TestUtils.findRenderedDOMComponentWithTag(
      zookeeperRedirectRendered, 'div');
      expect(React.findDOMNode(zooKeeperDiv).className).toEqual('hide');
  });

  it('shows message when leader == null', function() {

    var zookeeperRedirectRendered = TestUtils.renderIntoDocument(
      <ZookeeperRedirect leader='' pid='http://127.0.0.1:5050' redirectTime={3000} />
    );

    var zooKeeperDiv = TestUtils.findRenderedDOMComponentWithTag(
      zookeeperRedirectRendered, 'div');
      expect(React.findDOMNode(zooKeeperDiv).className).toEqual('show');

    var alertSpan = TestUtils.findRenderedDOMComponentWithTag(
      zookeeperRedirectRendered, 'span');
      expect(React.findDOMNode(alertSpan).innerHTML).toEqual('No master currently leading...');
  });

  it('shows message when leader != pid', function() {

    var zookeeperRedirectRendered = TestUtils.renderIntoDocument(
      <ZookeeperRedirect leader='http://127.0.0.1:5050' pid='http://127.0.0.2:5050' redirectTime={3000} />
    );

    var zooKeeperDiv = TestUtils.findRenderedDOMComponentWithTag(
      zookeeperRedirectRendered, 'div');
      expect(React.findDOMNode(zooKeeperDiv).className).toEqual('show');

    var alertSpan = TestUtils.findRenderedDOMComponentWithTag(
      zookeeperRedirectRendered, 'span');
      expect(React.findDOMNode(alertSpan).innerHTML).toEqual('This master is not the leader, redirecting...');
  });
});
