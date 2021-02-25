import React from 'react';
import { StyleSheet, ActivityIndicator, Image, Dimensions, SafeAreaView } from 'react-native';
import {
    Block,
    Button,
    Text,
    Input,
    theme,
} from 'galio-framework';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
const { width, height } = Dimensions.get('screen');
// connect to Redux state
import { connect } from "react-redux";
import { Images, nowTheme } from '../../constants';
import { GetMessages, SendMessage } from "../../redux/actions";
import Header from '../Components/Header'

class ChatScreen extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        this.props.getMessages(
            this.props.currentUser.id,
            this.props.route.params.id
        );
    }

    componentDidUpdate() {
        // this.props.updateNotification(this.props.route.params.id, this.props.currentUser.id)
        //     .then(() => {
        //         this.props.changeNotifications({ sender, receiver, count: 0 });
        //     })
    }

    // helper method that is sends a message
    handleSend(newMessage = []) {
        this.props.sendMessage(
            this.props.currentUser.id,
            this.props.route.params.id,
            newMessage,
            this.props.client
        )
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        // Here is the color change
                        backgroundColor: '#6690ee'
                    }
                }}
                textStyle={{
                    right: {
                        color: '#fff'
                    }
                }}
            />
        );
    }

    renderLoading() {
        return (
            <Block style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#6646ee' />
            </Block>
        );
    }
    render() {
        return (
            // <SafeAreaView>
            //     <Header
            //         title={this.props.route.params.title}
            //         back={this.props.route.params.back}
            //         navigation={this.props.navigation}
            //     />
            <GiftedChat
                messages={this.props.messages}
                onSend={newMessage => this.handleSend(newMessage)}
                user={{ _id: this.props.currentUser.id }}
                renderBubble={this.renderBubble}
                placeholder='Type your message here...'
                showUserAvatar
                alwaysShowSend
                scrollToBottom
                renderLoading={this.renderLoading}
            />
            // </SafeAreaView>
        );
    }
};
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        messages: state.messages,
        client: state.client,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        getMessages: (sender, receiver) => GetMessages(dispatch, sender, receiver),
        sendMessage: (sender, receiver, newMessage, client) => SendMessage(dispatch, sender, receiver, newMessage, client),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatScreen);

const styles = StyleSheet.create({
    // rest remains same
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});