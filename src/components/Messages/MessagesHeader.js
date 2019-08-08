 import React from 'react'
 import {Header, Input, Segment, Icon} from 'semantic-ui-react'

 class MessagesHeader extends React.Component{
     render(){
         return(
            <Segment clearing>
                <Header fluid="true" as="h2" floated="left" style={{marginBottom: 0}} >
                <span>
                    Channel <Icon name={"star outline"} color="black" />        
                </span>
                <Header.Subheader>2 Users</Header.Subheader>
                </Header>
                <Header floated="right">
                    <Input
                        size="mini"
                        icon="search"
                        name="searhTerm"
                        placeholder="Search Message"
                    />
                </Header>
            </Segment>
         );
     }
 }

 export default MessagesHeader;