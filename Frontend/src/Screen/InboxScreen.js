import React from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import {
    Block,
    Button,
    Text,
    Input,
    theme,
} from 'galio-framework';
const { width, height } = Dimensions.get('screen');
// connect to Redux state
import { connect } from "react-redux";
import { Images, nowTheme } from '../../constants';
import { GetNotifications, ClearNotification } from "../../redux/actions";
import { apiConfig } from '../../redux/config'
import Loader from '../Components/Loader';
import Header from '../Components/Header'

class InboxScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    componentDidMount = () => {
        this.props.getNotifications(
            this.props.currentUser.id,
            // () => this.setState({loading:false})
        );
    }

    selectUser = (sender) => {
        if(sender.count > 0){
            this.props.clearNotification(
                this.props.currentUser.id,
                sender.id,
                () => this.props.navigation.navigate('Chat', { title: sender.name, thumbnail: sender.thumbnail, id:sender.id, back: true })
            );
        }else{
            this.props.navigation.navigate('Chat', { title: sender.name, thumbnail: sender.thumbnail, id:sender.id, back: true });
        }
    }

    renderItem = () => {
        return this.props.notifications.map((notification) =>
            <TouchableOpacity
                key={notification.id}
                onPress={() => this.selectUser(notification)}
            >
                <Block row style={styles.row}>
                    <Block flex row center>
                        <Image
                            source={notification.thumbnail ?
                                { uri: `${apiConfig.baseUrl}/image/${notification.thumbnail}` } :
                                Images.Avatar}
                            style={styles.avatar}
                        />
                        <Text h4 style={{ marginLeft: theme.SIZES.BASE }}>{notification.name}</Text>
                    </Block>
                    {notification.count > 0 && <Block flex style={{ alignItems: 'flex-end' }} center>
                        <Text h4 style={styles.notify}>{notification.count}</Text>
                    </Block>}
                </Block>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <Block>
                <Loader loading={this.state.loading} />
                <Header title={this.props.currentUser.name} navigation={this.props.navigation} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderItem()}
                </ScrollView>
            </Block>
        );
    }
};
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        notifications: state.notifications,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        getNotifications: (userId, successcb) => GetNotifications(dispatch, userId, successcb),
        clearNotification: (receiver, sender, successcb) => ClearNotification(dispatch, receiver, sender, successcb),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InboxScreen);

const styles = StyleSheet.create({
    row: {
        margin: theme.SIZES.BASE,
        borderBottomWidth: 1,
        borderBottomColor: theme.COLORS.BLACK,
        paddingBottom: theme.SIZES.BASE * 2,
    },
    notify: {
        backgroundColor: 'red',
        width: theme.SIZES.BASE * 2,
        textAlign: 'center',
        borderRadius: nowTheme.SIZES.RADIUS,
        color: theme.COLORS.WHITE,
        borderColor: 'grey',
        borderWidth: 1,
    },
    avatar: {
        width: theme.SIZES.BASE * 4,
        height: theme.SIZES.BASE * 4,
        resizeMode: 'stretch',
        borderRadius: nowTheme.SIZES.RADIUS,
    },
});