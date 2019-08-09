import React from 'react'
import {Segment, Comment} from 'semantic-ui-react'
import firebase from '../../firebase'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import Message from './Message'
class Messages extends React.Component{

    state={
        messagesRef: firebase.database().ref('messages'),
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
        this.state.messagesRef.child(channelId).on('child_added', snap =>{
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

    displayChannelName = channel => channel ? ('#'+channel.name) : '';
    

    render() {

        const {messagesRef, channel, user, messages, searchResults,searchTerm, searchLoading} = this.state;

        return (
            <React.Fragment>
                <MessagesHeader 
                    channelName = {this.displayChannelName(channel)}
                    handleSearchChange = {this.handleSearchChange}
                    searchLoading = {searchLoading}
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
                    currentUser = {user} />
            </React.Fragment>
        )
    }
}

export default Messages