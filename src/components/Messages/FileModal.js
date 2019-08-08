import React from 'react'
import {Modal, Input, Icon, Button} from 'semantic-ui-react'
class FileModal extends React.Component{

    state = {file : null,
            authorized: ['image/jpge', 'image/png']
    }

    addFile = event => {
        const file = event.target.files[0];
        if(file){
            this.setState({file})
            console.log(file.type)
        }
    }

    sendFile = () =>{
        const {file} = this.state;
        const { uploadFile,closeModal } = this.props;
        if(file !== null){
            if(this.isAuthorized(file.type)){
                // send file

                const metadata = { contentType: file.type }
                uploadFile(file, metadata);
                closeModal();
                this.clearFile();
            }
        }
    }

    isAuthorized = fileType => this.state.authorized.includes(fileType);

    clearFile = () =>{
        this.setState({file: null});
    }

    render(){

        const {modal, closeModal} = this.props;

        return(
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header>Select an Image file</Modal.Header>
                <Modal.Content>
                    <Input 
                        fluid
                        label="File types: jpg, png "
                        name="file"
                        type="file"
                        onChange={this.addFile}
                       
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                        color="green"
                        inverted
                        onClick={this.sendFile}
                    > 
                        <Icon name ="checkmark" /> Send
                    </Button>
                    <Button 
                        color="red"
                        inverted
                        onClick={closeModal}
                    >
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default FileModal;