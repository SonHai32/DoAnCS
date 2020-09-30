import React from 'react';
import {Grid} from 'semantic-ui-react'
import './App.css';
import ColorPanel from './ColorPanel/ColorPanel'
import SidePanel from './SidePanel/SidePanel'
import Messages from './Messages/Messages'
import MetaPanel from './MetaPanel/MetaPanel'
import {connect} from 'react-redux'

import PopupMessage from './PopupMessage/PopupMessage'

const App = ({currentUser, currentChannel, isPrivateChannel, userPosts}) =>(
  <Grid columns="equal" className="app" style={{background: '#eee'}}>

    <SidePanel 
      currentUser={currentUser}
      key={currentUser && currentUser.uid}
      />

    <Grid.Column style={{marginLeft: 320}}>
      <Messages 
        key={currentChannel && currentChannel.id}
        currentChannel={currentChannel}
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel}
      />
    </Grid.Column>

    <Grid.Column width={4} >
      <MetaPanel 
      key={currentChannel && currentChannel.id}
      isPrivateChannel={isPrivateChannel} 
      currentChannel={currentChannel}
      userPosts={userPosts}
      />
    </Grid.Column>

    

  </Grid>
)

const mapStateToProps = state =>({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
})
export default connect(mapStateToProps)(App);
