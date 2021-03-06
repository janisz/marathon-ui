var React = require("react/addons");

var InfoActions = require("../../actions/InfoActions");
var InfoEvents = require("../../events/InfoEvents");
var InfoStore = require("../../stores/InfoStore");
var ModalComponent = require("../ModalComponent");
var ObjectDlComponent = require("../ObjectDlComponent");
var UnspecifiedNodeComponent =
  require("../../components/UnspecifiedNodeComponent");

var config = require("../../config/config");

var AboutModalComponent = React.createClass({
  displayName: "AboutModalComponent",

  propTypes: {
    onDestroy: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      info: InfoStore.info
    };
  },

  componentDidMount: function () {
    InfoActions.requestInfo();
  },

  componentWillMount: function () {
    InfoStore.on(InfoEvents.CHANGE, this.onInfoChange);
  },

  componentWillUnmount: function () {
    InfoStore.removeListener(InfoEvents.CHANGE, this.onInfoChange);
  },

  destroy: function () {
    // This will also call `this.props.onDestroy` since it is passed as the
    // callback for the modal's `onDestroy` prop.
    this.refs.modalComponent.destroy();
  },

  getInfo: function (attr) {
    return this.state.info[attr] ||
      <UnspecifiedNodeComponent tag="span" />;
  },

  onInfoChange: function () {
    this.setState({
      info: InfoStore.info
    });
  },

  render: function () {
    var marathonConfig = this.state.info.marathon_config;
    var zookeeperConfig = this.state.info.zookeeper_config;
    var logoPath = config.rootUrl + "img/marathon-logo.png";

    return (
      <ModalComponent
          onDestroy={this.props.onDestroy}
          ref="modalComponent"
          size="lg">
        <div className="modal-header modal-header-blend">
          <button type="button" className="close"
            aria-hidden="true" onClick={this.destroy}>&times;</button>
          <h3 className="modal-title" title={`UI Version ${config.version}`}>
            <img width="160" height="27" alt="Marathon" src={logoPath} />
            <small className="text-muted" style={{"marginLeft": "1em"}}>
              Version {this.getInfo("version")}
            </small>
          </h3>
        </div>
        <div className="modal-body">
          <dl className="dl-horizontal dl-horizontal-lg">
            <dt title="framework_id">Framework Id</dt>
            <dd>
              {this.getInfo("framework_id")}
            </dd>
            <dt title="leader">Leader</dt>
            <dd>
              {this.getInfo("leader")}
            </dd>
          </dl>
          <h5 title="marathon_config">Marathon Config</h5>
          <ObjectDlComponent object={marathonConfig} />
          <h5 title="zookeeper_config">ZooKeeper Config</h5>
          <ObjectDlComponent object={zookeeperConfig} />
        </div>
      </ModalComponent>
    );
  }
});

module.exports = AboutModalComponent;
