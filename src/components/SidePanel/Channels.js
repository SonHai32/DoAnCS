import {Menu, Icon, Modal, Form, Input,Button} from 'semantic-ui-react'
import React from 'react'
import {connect} from 'react-redux'
import {setCurrentChannel} from '../../action'
import firebase from '../../firebase'

class Channels extends React.Component{
    state = {
        user: this.props.currentUser,
        channels: [],
        activeChannel: '',
        modal: false,
        channelName: '',
        channelDetail: '',
        errors: [],
        channelRef: firebase.database().ref('channels'),
        firstLoad: true,
    }

    componentWillMount(){
        this.removeListeners();
    }

    componentDidMount(){
        this.addListener();
    }

    addListener = () =>{
        let loadedChannels= [];
        this.state.channelRef.on("child_added", snap =>{
            loadedChannels.push(snap.val());
            this.setState({channels: loadedChannels}, () => this.setFirstChannel());
        })
    }

    removeListeners = () =>{
        this.state.channelRef.off();
    }

    setFirstChannel = () =>{
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length >0 ){
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
        }
        this.setState({firstLoad: false});
    }
    
    handleChange = event =>{
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = event =>{
        event.preventDefault();
        if(this.isFormValid(this.state)){
            this.addChannel(this.state); 
        }else{
            let error = {message: 'Name of Channel must be under 100 character and Channel Detail must be under 500 character'}
            let errors = []
            this.setState({errors: errors.concat(error)})
            console.log(errors)
        }
    }

    addChannel = () =>{
        const {channelRef, channelName, channelDetail, user } = this.state;

        const key = channelRef.push().key;

        const newChannel = {
            id: key,
            name: channelName, 
            detail: channelDetail,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelRef
            .child(key)
            .update(newChannel)
            .then(() =>{
                this.setState({channelName: '', channelDetail: ''});
                this.closeModal();
                console.log('channel added')
            }).catch(err =>{
                console.log(err);
            })
    }

    displayChannel = channels => channels.length > 0 && channels.map(channel => (
        <Menu.Item
            key={channel.id}
            name={channel.name}
            onClick={() =>{this.changeChannel(channel)}}
            style={{opacity: 0.7}}
            active={channel.id === this.state.activeChannel}
        >
            #{channel.name}
        </Menu.Item>
    )); 
    
    changeChannel = channel =>{
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
    }
    
    setActiveChannel = channel =>{
        this.setState({activeChannel: channel.id})
    }

    isFormValid = ({channelName, channelDetail}) => channelName && channelDetail

    isFormOutOfRange = ({channelName, channelDetail}) =>{
        if (channelName.length < 100 && channelDetail.length < 500){
            return true;
        }else{
            return true;
        }
    }

    closeModal = () =>{
        this.setState({modal: false});
    }

    openModal = () =>{
        this.setState({modal: true});
    }

    render(){

        const {channels, modal} = this.state

        return(
           <React.Fragment>
                <Menu.Menu style={{paddingBottom: "2em"}} >
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS 
                        </span>({channels.length}) <Icon name="add" style={{cursor: "pointer "}} onClick={this.openModal} />
                    </Menu.Item>
                    {this.displayChannel(channels)}

                </Menu.Menu>
                
        <Modal basic open={modal} onClose={this.closeModal}>
            <Modal.Header>Add a Channel</Modal.Header>
            <Modal.Content>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <Input 
                        fluid
                        name="channelName"
                        label="Name of Channel"
                        onChange={this.handleChange}
                    />
                    </Form.Field>

                    <Form.Field>
                        <Input 
                            fluid
                            name="channelDetail"
                            label="Channel Detail"
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <Button color="green" inverted onClick={this.handleSubmit} >
                    <Icon name="checkmark" /> Add
                </Button>
                <Button color="red" inverted onClick={this.closeModal}>
                    <Icon name="remove" /> Cancel 
                </Button>
            </Modal.Actions>
            </Modal>
        </React.Fragment>
        
        )

    
    }
}

export default connect(null, {setCurrentChannel})(Channels)