import React from 'react'
import {Segment, Accordion, Header, Icon} from 'semantic-ui-react'

class MetaPanel extends React.Component{

    state = {
        activeIndex: 0,
        privateChannel: this.props.isPrivateChannel,

        
    }

    setActiveIndex = (event, titleProps) =>{
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({activeIndex: newIndex});
    }

    render(){

        const {activeIndex, privateChannel} = this.state;

        if(privateChannel) return null;

        return(
            <Segment>
                <Header as="h3" attached="top">
                    About # channel
                </Header>
                <Accordion styled attached="true">
                    <Accordion.Title
                        active={activeIndex ===0}
                        index={0}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name='dropdown' />
                        <Icon name="info" />
                        Channel Detail
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex ===0}>
                        Channel Detail
                    </Accordion.Content>    
                    <Accordion.Title
                        active={activeIndex ===1}
                        index={1}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name='dropdown' />
                        <Icon name="user circle" />
                        Channel Detail
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex ===1}>
                         Detail
                    </Accordion.Content>    
                    <Accordion.Title
                        active={activeIndex ===2}
                        index={2}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name='dropdown' />
                        <Icon name="pencil alternate" />
                        Create By
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex ===2}>
                        Detais
                    </Accordion.Content>    
                </Accordion>
            </Segment>
        )
    }
}

export default MetaPanel