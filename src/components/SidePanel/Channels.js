import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Header,
  Label,
  Dimmer,
  Loader,
} from "semantic-ui-react"
import React from "react"
import { connect } from "react-redux"
import { setCurrentChannel, setPrivateChannel } from "../../action"
import firebase from "../../firebase"
import ErrorModal from "../MessageModals/ErrorModal"

class Channels extends React.Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    channelLoading: true,
    channel: null,
    activeChannel: "",
    createChannelModal: false,
    errorModal: false,
    channelName: "",
    channelDetail: "",
    errors: [],
    channelRef: firebase.database().ref("channels"),
    messageRef: firebase.database().ref("messages"),
    notifications: [],
    firstLoad: true,
    errorMessageModal: "",
  }

  componentWillMount() {
    this.removeListeners()
  }

  componentDidMount() {
    this.addListener()
  }

  addListener = () => {
    let loadedChannels = []
    this.state.channelRef.on("child_added", (snap) => {
      loadedChannels.push(snap.val())
      this.setState({ channels: loadedChannels }, () => {
        this.setFirstChannel()
        this.setState({ channelLoading: false })
      })
      this.addNotificationListener(snap.key)
    })
  }

  addNotificationListener = (channelId) => {
    this.state.messageRef.child(channelId).on("value", (snap) => {
      if (this.state.channel) {
        this.handleNotifications(
          channelId,
          this.state.channel.id,
          this.state.notifications,
          snap
        )
      }
    })
  }

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0

    let index = notifications.findIndex(
      (notification) => notification.id === channelId
    )

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal
        }
      }

      notifications[index].lastKnowTotal = snap.numChildren()
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnowTotal: snap.numChildren(),
        count: 0,
      })
    }

    this.setState({ notifications })
  }

  removeListeners = () => {
    this.state.channelRef.off()
  }

  setFirstChannel = () => {
    if (this.state.firstLoad && this.state.channels.length > 0) {
      const firstChannel = this.state.channels[0]

      this.props.setCurrentChannel(firstChannel)
      this.setState({ channel: firstChannel }, () =>
        this.setActiveChannel(this.state.channel)
      )
    }
    this.setState({ firstLoad: false })
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleCreateChannel = (event) => {
    event.preventDefault()

    if (this.isFormValid(this.state)) {
      if (this.isOutOfRange(18, this.state.channelName)) {
        this.setState({
          errorMessageModal: "Tên phòng không quá 18 kí tự",
          errorModal: true,
        })
        return
      } else if (this.isOutOfRange(100, this.state.channelDetail)) {
        this.setState({
          errorMessageModal: "Thông tin phòng không quá 100 kí tự",
          errorModal: true,
        })
        return
      }
      this.addChannel(this.state)
    } else {
      this.setState({
        errorMessageModal: "Vui lòng nhập đủ thông tin ",
        errorModal: true,
      })
      return
    }
  }

  addChannel = () => {
    const { channelRef, channelName, channelDetail, user } = this.state

    const key = channelRef.push().key

    const newChannel = {
      id: key,
      name: channelName,
      detail: channelDetail,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      },
    }

    channelRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetail: "" })
        this.closeCreateChannelModal()
        console.log("channel added")
      })
      .catch((err) => {
        console.log(err)
      })
  }

  displayChannel = (channels) =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        onClick={() => {
          this.changeChannel(channel)
        }}
        active={this.isActiveChannel(channel.id)}
        color="teal"
        style={{ fontSize: "16px" }}
      >
        <Icon name="home"></Icon>
        {this.getNotificationCount(channel) && (
          <Label color="red">{this.getNotificationCount(channel)}</Label>
        )}
        {channel.name}
      </Menu.Item>
    ))

  getNotificationCount = (channel) => {
    let count = 0

    this.state.notifications.forEach((notification) => {
      if (notification.id === channel.id) {
        count = notification.count
      }
    })

    if (count > 0) return count
  }

  changeChannel = (channel) => {
    this.props.setCurrentChannel(channel)
    this.props.setPrivateChannel(false)
    this.setActiveChannel(channel)
    this.setState({ channel })
    this.clearNotification()
  }

  clearNotification = () => {
    let index = this.state.notifications.findIndex(
      (notification) => notification.id === this.state.channel.id
    )

    if (index !== -1) {
      let updateNotifications = [...this.state.notifications]
      updateNotifications[index].total = this.state.notifications[
        index
      ].lastKnowTotal
      updateNotifications[index].count = 0
      this.setState({ notifications: updateNotifications })
    }
  }

  setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id })
  }

  isActiveChannel = (channelId) => {
    return this.state.activeChannel === channelId
  }

  isOutOfRange = (maxLength, val) => {
    if (val.length > maxLength) return true
    else return false
  }

  isFormValid = ({ channelName, channelDetail }) =>
    channelName && channelDetail

  isFormOutOfRange = ({ channelName, channelDetail }) => {
    if (channelName.length < 100 && channelDetail.length < 500) {
      return true
    } else {
      return true
    }
  }

  closeCreateChannelModal = () => {
    this.setState({ createChannelModal: false })
  }

  openCreateChannelModal = () => {
    this.setState({ createChannelModal: true })
  }

  closeErrorModal = () => {
    this.setState({ errorModal: false })
  }

  openErrorModal = () => {
    this.setState({ errorModal: true })
  }

  render() {
    const {
      channels,
      createChannelModal,
      errorMessageModal,
      errorModal,
      channelLoading,
    } = this.state

    return (
      <React.Fragment>
        <Header as="h4" block color="green">
          <Header.Content>
            <span style={{ marginLeft: "auto" }}>
              <Icon name="mail outline" /> Phòng Chat
            </span>
            <span style={{ color: "#d63031" }}>&emsp ({channels.length})</span>
            <Icon
              name="add"
              style={{ marginLeft: "20px", cursor: "pointer " }}
              onClick={this.openCreateChannelModal}
            />
          </Header.Content>
        </Header>
        <Menu.Menu>
          <Dimmer active={channelLoading} inverted>
            <Loader size="mini">Loading</Loader>
          </Dimmer>
          {this.displayChannel(channels)}
        </Menu.Menu>
        <ErrorModal
          key="2"
          message={errorMessageModal}
          closeModal={this.closeErrorModal}
          modal={errorModal}
        />
        <Modal
          basic
          open={createChannelModal}
          onClose={this.closeCreateChannelModal}
        >
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleCreateChannel}>
              <Form.Field>
                <Input
                  fluid
                  name="channelName"
                  label="Name of Channel"
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  name="channelDetail"
                  label="Channel Detail"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleCreateChannel}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.closeCreateChannelModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  Channels
)
