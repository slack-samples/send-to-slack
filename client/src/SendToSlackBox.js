import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import React, { Component } from 'react';
import Select from 'react-select'

class SendToSlackBox extends Component {

    constructor(props){
        super(props)
        this.state = {
          selectOptions: [],
          id: '',
          name:'',
          text: '',
        };
    }
    
    componentDidMount() {
        this.getUserChannels()
            .then(res => this.setState({selectOptions: res}))
            .catch(err => console.log(err));
        this.getUsersForIM()
        .then(res => this.setState({selectOptions: res}))
        .catch(err => console.log(err));
    }
    getUserChannels = async () => {
        const response = await fetch('/channelList');
        const data = await response.json();

        const options = data.channels.map(d => ({
            "value" : d.id,
            "label" : d.name
        }))
        console.log(options);

        if (response.status !== 200) {
            throw Error(data.message) 
        }
        return this.state.selectOptions.concat(options);
    };
    getUsersForIM = async () => {
        const response = await fetch('/users');
        const data = await response.json();

        const options = data.members.map(d => ({
            "value" : d.id,
            "label" : d.profile.real_name
        }))
        console.log(options);

        if (response.status !== 200) {
            throw Error(data.message) 
        }
        return this.state.selectOptions.concat(options);
    };

    handleChange(e){
        this.setState({id:e.value, name:e.label})
    }

    handleSend = async () => {
        const message = {url: window.location.href, message: this.state.text, channel_id: this.state.id}
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        };
        const response = await fetch('/send', requestOptions);
        const data = await response.json();

        if (response.status !== 200) {
            throw Error(data.message) 
        }
        this.setState({id: '',name:'',text: ''});
    };
    handleMessageChange(e){
        this.setState({
            text: e.target.value
          });
    }

    render() {
      return (
        <>
            <Form>
                <FloatingLabel controlId="floatingTextarea" label="Enter message" className="mb-3">
                    <Form.Control onChange={this.handleMessageChange.bind(this)} value={this.state.text} as="textarea" placeholder="Message to be included with the shared URL"/>
                </FloatingLabel>
                <Select placeholder="Select a channel or user" options={this.state.selectOptions} onChange={this.handleChange.bind(this)} />
            </Form>
            <div className="d-grid gap-2 p-3">
                <Button padding="10px" variant="outline-secondary" onClick={this.handleSend.bind(this)}>Send</Button>
            </div>
        </>
      );
    }
  }

export default SendToSlackBox;