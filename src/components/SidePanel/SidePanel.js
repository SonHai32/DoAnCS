import React from 'react'
import {Menu} from 'semantic-ui-react'
import UserPanel from './UserPanel'
import Channels from './Channels'
import DirectMessage from './DirectMessage'
class SidePanel extends React.Component{
    render() {

        const {currentUser} = this.props;

        return (
            <Menu
                size="large"
                fixed="left"
                vertical
                style={{background: "#81ecec", fontSize: "1.2rem",}}
            >
            <UserPanel currentUser={currentUser} />
            <Channels currentUser={currentUser} />
            <DirectMessage currentUser={currentUser} />
            </Menu>

            
        )
    }
}

export default SidePanel