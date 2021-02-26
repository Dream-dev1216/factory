import React from 'react';
import { StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
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
import { Images, nowTheme } from '../../../constants';
import { GetManagers, DeleteUser, PendingUser } from "../../../redux/actions";
import { apiConfig } from '../../../redux/config'
import Loader from '../../Components/Loader';
import Header from '../../Components/Header'
class ManagersScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
        }
    }
    componentDidMount = () => {
        this.props.getManagers(
            () => this.setState({ loading: false })
        );
    }
    deleteUser = (id) => {
        this.props.deleteUser(id,
            () => {
                this.props.getManagers(
                    () => this.setState({ loading: false })
                )
                console.log("delete user successfully");
            })
    }
    pending = (managerId, pending) => {
        this.props.pendingUser(
            managerId,
            pending,
            () => {
                this.props.getManagers(
                    () => this.setState({ loading: false })
                )
                this.setState({ visibleModal: true })
            }
        )
    }
    renderManagers = () => {
        return this.props.managers.map((manager) =>
            <Block style={{ paddingVertical: theme.SIZES.BASE }} key={manager._id}>
                <Block row center>
                    <Block center style={{ borderWidth: 1, borderRadius: nowTheme.SIZES.RADIUS }}>
                        <Image
                            source={manager.thumbnail ?
                                { uri: `${apiConfig.baseUrl}image/${manager.thumbnail}` } :
                                Images.Avatar}
                            style={styles.manager}
                        />
                    </Block>
                    <Block center>
                        <Text h4 bold style={{ paddingLeft: theme.SIZES.BASE }}>{manager.name}</Text>
                    </Block>
                </Block>
                <Block row center>
                    <TouchableOpacity
                        style={{ backgroundColor: nowTheme.COLORS.SUCCESS, borderRadius: 5 }}
                        onPress={() => this.props.navigation.navigate('EditManager', { manager: manager })}
                    >
                        <Image
                            source={Images.edit}
                            style={styles.editIcon}
                        />
                    </TouchableOpacity>
                    <Button
                        onPress={() => this.deleteUser(manager._id)}
                        size='small' round
                        textStyle={{ fontFamily: nowTheme.FONT, fontSize: 20 }}
                    >Delete</Button>
                    <Button
                        size='small' color='success' round success
                        textStyle={{ fontFamily: nowTheme.FONT, fontSize: 20 }}
                        onPress={() => this.pending(manager._id, !manager.pending)}
                    >{manager.pending ? 'Release' : 'Pending'}</Button>
                </Block>
            </Block>
        )
    }
    render() {
        return (
            <Block>
                <Loader loading={this.state.loading} />
                <Header title={this.props.currentUser.name} navigation={this.props.navigation} />
                <Block>
                    <Block style={styles.background} />
                    <Block center style={styles.containter}>
                        <Text h3 style={styles.title}>
                            All Managers
                        </Text>
                    </Block>
                    <ScrollView
                        style={{ height: height * 0.55 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {this.props.managers && this.renderManagers()}
                    </ScrollView>
                    <Block center>
                        <Button
                            onPress={() => this.props.navigation.navigate('EditManager', { manager: null })} size="large"
                            style={styles.button}
                            textStyle={{ fontFamily: nowTheme.FONT, fontSize: 31 }}
                        >ADD NEW MANAGER</Button>
                    </Block>
                </Block>
            </Block>
        );
    }
};
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        managers: state.managers,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        getManagers: (successcb) => GetManagers(dispatch, successcb),
        deleteUser: (id, successcb) => DeleteUser(dispatch, id, successcb),
        pendingUser: (userId, pending, successcb) => PendingUser(dispatch, userId, pending, successcb),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ManagersScreen);

const styles = StyleSheet.create({
    background: {
        width,
        height: theme.SIZES.BASE * 5,
        position: 'absolute',
        backgroundColor: nowTheme.COLORS.MAIN,
        top: 0
    },
    containter: {
        paddingHorizontal: theme.SIZES.BASE * 3,
    },
    title: {
        backgroundColor: theme.COLORS.WHITE,
        width: width * 2 / 3,
        height: height / 6,
        textAlign: 'center',
        textAlignVertical: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    manager: {
        width: theme.SIZES.BASE * 7,
        height: theme.SIZES.BASE * 7,
        resizeMode: 'stretch',
        borderRadius: nowTheme.SIZES.RADIUS,
    },
    button: {
        backgroundColor: nowTheme.COLORS.MAIN,
        borderColor: theme.COLORS.BLACK,
        borderWidth: 1,
        paddingVertical: theme.SIZES.BASE * 1.5
    },
});