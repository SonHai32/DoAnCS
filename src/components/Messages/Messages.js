import React from 'react'
import {Segment, Comment} from 'semantic-ui-react'
import firebase from '../../firebase'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import Message from './Message'
class Messages extends React.Component{

    state={
        privateChannel: this.props.isPrivateChannel,
        messagesRef: firebase.database().ref('messages'),
        privateMessagesRef: firebase.database().ref('privateMessages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true,
        searchTerm: '',
        searchLoading: false,
        searchResults: []

    }

    componentDidMount(){
        const{channel, user} = this.state;

        if(channel && user){
            this.addListener(channel.id);
        }
    }
    
    

    addListener = channelId =>{
        this.addMessageListener(channelId);
    }

    addMessageListener = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef();
        ref.child(channelId).on('child_added', snap =>{
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });

              
        })
    }

    displayMessage = messages =>(
        messages.length > 0 && messages.map(message =>(
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    )

    handleSearchChange = event =>{
        this.setState({searchTerm: event.target.value,
                       searchLoading: true
        },
        () => this.handleSearchMessages())
    }

    handleSearchMessages = () =>{
        const channelMessage = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessage.reduce((acc,message) =>{
            if( message.content && (message.content.match(regex) || message.user.name.match(regex)) ){
                acc.push(message);
            }
            return acc;
        },[]);
        this.setState({ searchResults});
        setTimeout(() => this.setState({searchLoading: false}), 1000);
    }

    displayChannelName = channel => {
        return channel ? ((this.state.privateChannel ?  '@' : '#') + channel.name) : ''
    }
    

    getMessagesRef = () =>{
        const {messagesRef, privateMessagesRef, privateChannel} = this.state;
        return privateChannel ? privateMessagesRef : messagesRef;
    }

    render() {

        const {messagesRef, channel, user, messages, searchResults,searchTerm, searchLoading, privateChannel} = this.state;

        return (
            <React.Fragment>
                <MessagesHeader 
                    channelName = {this.displayChannelName(channel)}
                    handleSearchChange = {this.handleSearchChange}
                    searchLoading = {searchLoading}
                    isPrivateChannel = {privateChannel}
                />


                <Segment className="messages">
                    <Comment.Group >
                        {searchTerm ? this.displayMessage(searchResults) :
                        this.displayMessage(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm 
                    messagesRef ={messagesRef}
                    currentChannel ={channel}
                    currentUser = {user} 
                    isPrivateChannel={privateChannel}
                    getMessagesRef = {this.getMessagesRef}
                    />
            </React.Fragment>
        )
    }
}

export default Messages