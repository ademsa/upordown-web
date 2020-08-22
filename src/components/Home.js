import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Stats from './Stats';
import StatusMessage from './StatusMessage';
import NestedURLs from './NestedURLs';
import NestedURLsNon200 from './NestedURLsNon200';
import NestedURLs200 from './NestedURLs200';

var wsMsg = {
  "url-err": "Enter valid url.",
  "ws-unknown-err": "Unknown error with websocket",
  "ws-not-ready": "Websocket connection not ready. Please review your connection and browser settings and try again later.",
  "ws-closed": "Cannot connect to websocket server. Please review your connection and browser settings and try again.",
  "action-timeout": "Check was not completed withing expected time period. Please review your connection and browser settings and try again.",
}

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    document.title = "UpOrDown";

    this.state = {
      wsStatusMsg: "",
      actionStatus: 0,
      targetUrl: "",
      targetUrlForResults: "",
      targetUrlStatusCode: 0,
      targetUrlStatusMsg: "",
      targetUrlResponseTime: 0,
      nestedUrls200: null,
      nestedUrlsNon200: null,
      nestedUrls: null,
    };

    this.ws = null;
    this.setWS = this.setWS.bind(this);
    this.handleWSError = this.handleWSError.bind(this);
    this.handleWSMessage = this.handleWSMessage.bind(this);

    this.handleActionInputChange = this.handleActionInputChange.bind(this);
    this.validateActionInput = this.validateActionInput.bind(this);
    this.handleActionButtonClick = this.handleActionButtonClick.bind(this);
    this.proceedWithAction = this.proceedWithAction.bind(this);
    this.sendActionRequest = this.sendActionRequest.bind(this);
    this.cancelActionRequest = this.cancelActionRequest.bind(this);
    this.resetActionUI = this.resetActionUI.bind(this);
    this.disableActionUI = this.disableActionUI.bind(this);
    this.resetActionState = this.resetActionState.bind(this);

    this.actionTimeout = null;
    this.clearActionTimeout = this.clearActionTimeout.bind(this);

    this.actionInputRef = React.createRef();
    this.actionButtonRef = React.createRef();
  }

  handleActionInputChange(event) {
    var value = event.currentTarget.value;
    this.setState(prevState => ({
      ...prevState,
      targetUrl: value,
    }));
  }

  validateActionInput() {
    if (this.state.targetUrl === "" || this.state.targetUrl === undefined) {
      this.setState(prevState => ({
        ...prevState,
        targetUrlForResults: "",
        targetUrlStatusCode: 0,
        targetUrlStatusMsg: wsMsg["url-err"],
        targetUrlResponseTime: 0,
        nestedUrls200: null,
        nestedUrlsNon200: null,
        nestedUrls: null,
      }));
      return false;
    }
    this.setState(prevState => ({
      ...prevState,
      targetUrlStatusMsg: "",
    }));
    return true;
  }

  handleActionButtonClick() {
    if (!this.validateActionInput()) {
      return;
    }

    if (this.ws == null) {
      this.setWS(this.proceedWithAction);
    } else if (this.ws != null && this.ws.readyState === 1) {
      this.proceedWithAction();
    } else {
      this.setState(prevState => ({
        ...prevState,
        wsStatusMsg: wsMsg["ws-not-ready"]
      }));
    }
  }

  proceedWithAction() {
    if (this.state.actionStatus === 0 || this.state.actionStatus === 4 || this.state.actionStatus === 10) {
      this.sendActionRequest();
    } else {
      this.cancelActionRequest();
    }
  }

  sendActionRequest() {
    this.actionInputRef.current.parentNode.className = "control is-expanded is-large is-loading";
    this.actionButtonRef.current.innerHTML = "Cancel Action";
    this.actionButtonRef.current.className = "button is-danger is-large";

    this.setState(prevState => ({
      ...prevState,
      actionStatus: 1
    }));

    this.ws.send(JSON.stringify({
      "type": "target-url-request",
      "url": this.state.targetUrl,
    }));

    this.clearActionTimeout();
    this.actionTimeout = window.setTimeout(() => {
      var wsStatusMsg = wsMsg["action-timeout"];
      if (this.ws != null && this.ws.readyState === 3) {
        wsStatusMsg = wsMsg["ws-closed"];
      }
      this.resetActionUI();
      this.resetActionState(wsStatusMsg);
    }, 60000);
  }

  cancelActionRequest() {
    this.resetActionUI();

    this.setState(prevState => ({
      ...prevState,
      actionStatus: 10,
      targetUrlForResults: "",
      targetUrlStatusCode: 0,
      targetUrlStatusMsg: "",
      targetUrlResponseTime: 0,
      nestedUrls200: null,
      nestedUrlsNon200: null,
      nestedUrls: null,
    }));

    this.ws.send(JSON.stringify({
      "type": "target-url-cancel-request",
    }));
  }

  resetActionUI() {
    this.actionButtonRef.current.innerHTML = "Check";
    this.actionButtonRef.current.className = "button is-black is-outlined is-large";
  }

  disableActionUI(flag) {
    this.actionInputRef.current.disabled = flag;
    this.actionButtonRef.current.disabled = flag;
  }

  resetActionState(wsStatusMsg) {
    this.setState(prevState => ({
      ...prevState,
      wsStatusMsg: wsStatusMsg,
      actionStatus: 0,
      targetUrl: "",
      targetUrlForResults: "",
      targetUrlStatusCode: 0,
      targetUrlStatusMsg: "",
      targetUrlResponseTime: 0,
      nestedUrls200: null,
      nestedUrlsNon200: null,
      nestedUrls: null,
    }));
  }

  clearActionTimeout() {
    if (this.actionTimeout != null) {
      window.clearTimeout(this.actionTimeout);
      this.actionTimeout = null;
    }
  }

  setWS(callback) {
    try {
      this.ws = new WebSocket("ws://localhost:8080");
    } catch (error) {
      this.handleWSError(error);
    }

    this.ws.onopen = () => {
      if (callback != null && callback !== undefined) {
        callback();
      }
    }
    this.ws.onclose = () => {
      this.ws = null;
      this.clearActionTimeout();
      this.resetActionUI();
      this.disableActionUI(true);
      this.resetActionState(wsMsg["ws-closed"]);
    }
    this.ws.onerror = this.handleWSError;
    this.ws.onmessage = this.handleWSMessage;
  }

  handleWSError = () => {
    this.disableActionUI(true);

    var wsStatusMsg = wsMsg["ws-unknown-err"];
    if (this.ws != null && this.ws.readyState === 3) {
      wsStatusMsg = wsMsg["ws-closed"];
    }

    this.resetActionUI(wsStatusMsg);

    this.clearActionTimeout();
  }

  handleWSMessage = (event) => {
    if (this.state.actionStatus === 10) {
      return;
    }

    var json = JSON.parse(event.data);
    if (json.type === "target-url-result") {
      this.actionInputRef.current.parentNode.className = "control is-expanded";

      this.setState(prevState => ({
        ...prevState,
        actionStatus: 2,
        targetUrlForResults: prevState.targetUrl,
        targetUrlStatusCode: json.statusCode,
        targetUrlStatusMsg: json.statusMsg,
        targetUrlResponseTime: json.rt,
        nestedUrls200: new Map(),
        nestedUrlsNon200: new Map(),
        nestedUrls: new Map(),
      }));
    } else if (json.type === "nested-url-in-progress") {
      var nestedUrls = this.state.nestedUrls;
      nestedUrls.set(json.id, json);
      this.setState(prevState => ({
        ...prevState,
        nestedUrls: nestedUrls,
      }));
    } else if (json.type === "nested-url-completed") {
      var nestedUrls200 = this.state.nestedUrls200;
      var nestedUrlsNon200 = this.state.nestedUrlsNon200;
      nestedUrls = this.state.nestedUrls;
      nestedUrls.delete(json.id);
      if (json.statusCode === 200) {
        nestedUrls200.set(json.id, json);
      } else {
        nestedUrlsNon200.set(json.id, json);
      }
      this.setState(prevState => ({
        ...prevState,
        nestedUrls200: nestedUrls200,
        nestedUrlsNon200: nestedUrlsNon200,
        nestedUrls: nestedUrls,
      }));
    } else if (json.type === "completed") {
      this.clearActionTimeout();

      this.actionInputRef.current.placeholder = "Try with another url...";

      this.resetActionUI();

      this.setState(prevState => ({
        ...prevState,
        actionStatus: 4,
      }));
    }
  }

  componentDidMount() {
    if (this.ws == null) {
      this.setWS();
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header />

        <section className="section">
          <div className="container">
            <div className="columns is-vcentered is-centered">
              <div className="column is-12-mobile is-8">
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input ref={this.actionInputRef} value={this.state.targetUrl} onChange={this.handleActionInputChange} className="input is-black is-large is-full-width" type="text" placeholder="Enter url here..." />
                  </div>
                  <div className="control">
                    <button ref={this.actionButtonRef} onClick={this.handleActionButtonClick} className="button is-black is-outlined is-large">Check</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {(this.state.wsStatusMsg || this.state.targetUrlStatusMsg) &&
          <StatusMessage
            wsStatusMsg={this.state.wsStatusMsg}
            targetUrlStatusMsg={this.state.targetUrlStatusMsg}
          />
        }

        {this.state.targetUrlStatusCode !== 0 &&
          <Stats
            targetUrlStatusCode={this.state.targetUrlStatusCode}
            targetUrlForResults={this.state.targetUrlForResults}
            targetUrlResponseTime={this.state.targetUrlResponseTime}
            nestedUrlsCount={this.state.nestedUrls200.size + this.state.nestedUrlsNon200.size + this.state.nestedUrls.size}
          />
        }

        <section className="section">
          <div className="container">
            <div className="columns is-vcentered is-centered">
              <div className="column is-12-mobile is-10-tablet is-8">
                {this.state.nestedUrls &&
                  <NestedURLs items={this.state.nestedUrls} />
                }

                {this.state.nestedUrlsNon200 &&
                  <NestedURLsNon200 items={this.state.nestedUrlsNon200} />
                }

                {this.state.nestedUrls200 &&
                  <NestedURLs200 items={this.state.nestedUrls200} />
                }
              </div>
            </div>
          </div>
        </section>

        {this.state.targetUrlForResults &&
          <Footer />
        }
      </React.Fragment >
    );
  }
}
