import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Select from 'react-select'
import './App.css';
import SendToSlackBox from './SendToSlackBox'


class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      profile: null
    };
  }

  componentDidMount() {
    this.callBackendAPI()
        .then(res => this.setState({profile: res}))
        .catch(err => console.log(err));
    console.log(this.state.profile);
  }
  callBackendAPI = async () => {
      const response = await fetch('/profile');
      const data = await response.json();

      if (response.status !== 200) {
          throw Error(data.message) 
      }
      return data;
  };

  render() {
    let slackOption;
    if (this.state.profile?.slack_auth) {
      slackOption = <SendToSlackBox/>;
    } else {
      const url = "https://workplace-name.slack.com/oauth?client_id=47445629121.2929214697316&user_scope=channels:read,groups:read,mpim:read,im:read,chat:write,users:read&redirect_uri=&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0YWxsT3B0aW9ucyI6eyJzY29wZXMiOlsiY2hhbm5lbHM6aGlzdG9yeSIsImNoYXQ6d3JpdGUiLCJjb21tYW5kcyJdfSwibm93IjoiMjAyMi0wMS0wOVQxODo1MzowMy44NTFaIiwiaWF0IjoxNjQxNzU0MzgzfQ.xVD3esB8e9iPE6jHarhxa85-u5J07q7lUjPvZz3GEdg&granular_bot_scope=1&single_channel=0&install_redirect=&tracked=1";
      slackOption = <><p>To enable Send to Slack, please install the Send2Slack app</p><a href={url}><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a></>;
    }
    const loginLabel = this.state.profile? this.state.profile.user?.name : 'Login';
    
    return (
      <div className="App">
        <Navbar bg="light" variant="light" sticky="top">
          <Container>
            <Navbar.Brand href="#home">Send2Slack</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Projects</Nav.Link>
            </Nav>
            <Nav className="justify-content-end" activeKey="/home">
              <Nav.Link href="/login">{loginLabel}</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Container>
          <Row>
            <div class="jumbotron col-md-8 text-white rounded bg-dark">
            <div class="col-md-10">
              <h1 class="display-4 font-italic">This is a Sample Website</h1>
              <p class="lead my-3">Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.</p>
            </div>
            </div>
            <div class="col-md-4">
              <Card>
              <Card.Header as="h6">Send this URL To Slack</Card.Header>
                <Card.Body>
                  {slackOption}
                </Card.Body>
              </Card>
            </div>
          </Row>
        </Container>
        
      </div>
    );
  }
}

export default App;