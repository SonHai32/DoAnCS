import React from 'react'

import { Modal, Button, Header, Icon} from 'semantic-ui-react'

const ErrorModal = props => {
    const {message, closeModal, modal} = props
    return (
        <React.Fragment>

            <Modal
                size='mini'
                open={modal}
                onClose={closeModal}
            >
                <Modal.Header >
                    <Header color='red'>
                        <Icon name='warning circle'></Icon>
                        Thông báo lỗi 
                    </Header>
                </Modal.Header>
                <Modal.Content>
                    {message}
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={closeModal}>
                        Đóng
          </Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
} 

export default ErrorModal