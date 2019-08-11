import React from 'react'
import {Popup, Button, Icon, Message, Segment, Comment, Header, Menu} from 'semantic-ui-react'
import firebase from '../../firebase'
class PopupMessage extends React.Component{

    state ={
        userRef: firebase.database().ref('users'),
        users: [],
        user: this.props.currentUser
    }

    componentDidMount(){
        if(this.state.user){
            this.addListener(this.state.user.uid)
        }
    }

    addListener = (currentUserUid) =>{
        let loadUsers = [];
        this.state.userRef.on('child_added', snap =>{
            if(currentUserUid !== snap.key){
                let user = snap.val();
                user['uid'] = snap.key;
                loadUsers.push(user);
                this.setState({users: loadUsers})
                
            }
        })
    }

    displayListUser = users => users.map(user=>(

        <Comment key={user.uid} >
        
            <Comment.Avatar  src={user.avatar} />
            <Comment.Content>  
                <Comment.Author as="a">{user.name}</Comment.Author>
                <Comment.Metadata>111</Comment.Metadata>
                <Comment.Text>hello</Comment.Text>
            </Comment.Content>
        
        </Comment>
    ));
   
    render(){
        const {users} = this.state;
        return(
            <Popup className="popup__message" offset="0 -26px" position="top right" trigger={<Button style={{background:'none'}} size="big" className="popup__message__btn"><Icon name="chat" size="large" /></Button>} flowing hoverable>

                {/* <Segment className="popup__message"> */}

                <Header as="h4" dividing style={{borderBottom:'1px solid black'}}>Messagse</Header>
                {/* {users.map(user =>(
                    <Comment.Group key={user.uid}>
                        <Comment>
                            <Comment.Avatar src={user.avatar} />
                            <Comment.Author as="a">{user.name}</Comment.Author>
                        </Comment>
                    </Comment.Group>
                ))} */}

                <Comment.Group>
                    {users.length > 0 ? this.displayListUser(users) : (<span>No Friends</span>) }
                </Comment.Group>
            
                {/* </Segment> */}
        
            </Popup>
        )
    }

}

export default PopupMessage;