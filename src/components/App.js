import React from 'react';
import {Grid} from 'semantic-ui-react'
import './App.css';
import ColorPanel from './ColorPanel/ColorPanel'
import SidePanel from './SidePanel/SidePanel'
import Messages from './Messages/Messages'
import MetaPanel from './MetaPanel/MetaPanel'
import {connect} from 'react-redux'

import PopupMessage from './PopupMessage/PopupMessage'

const myStyles = {
  mainContainer: {
    backgroundImage: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
    height: '102vh',

  }
}
const App = ({currentUser, currentChannel, isPrivateChannel, userPosts}) =>(
  <div style={myStyles.mainContainer}>

  <Grid columns="equal" className="app" >

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
  </div>
)

const mapStateToProps = state =>({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
})
export default connect(mapStateToProps)(App);
