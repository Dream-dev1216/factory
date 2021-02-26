import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
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
import { Roles, nowTheme } from '../../constants';
import { Login } from "../../redux/actions";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Loader from '../Components/Loader';

class TestLoginScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            password: '',
            loading: false,
            errText: false,
        }
    }

    login = () => {
        this.setState({ loading: true })
        this.props.login(
            this.state.name,
            this.state.password,
            (res) => {
                this.setState({ loading: false })
                if (res.data) {
                    console.log("Login Success =>", res.data)
                    this.props.navigation.replace(this.props.currentUser.role);
                } else {
                    this.setState({ errText: true })
                }
            },
            (error) => alert(error)
        );
    }

    render() {
        return (
            <Block
                style={styles.containter}>
                <Loader loading={this.state.loading} />
                <Block
                    style={styles.background} />
                <Block center
                    style={styles.logoBlock}>
                    <Image
                        style={styles.logoIcon} />
                    <Text
                        style={styles.label}
                        size={20}
                        style={{ position: 'absolute' }}> LOGO </Text>
                </Block>
                <Block
                    style={styles.card}>
                    <Text
                        style={styles.label}
                        size={20}> Name </Text>
                    <Input
                        style={styles.inputBox} color={nowTheme.COLORS.MAIN} fontSize={20}
                        onChangeText={(name) => this.setState({ name: name, errText: false })}
                    />
                    <Text
                        style={styles.label}
                        size={20}> Password </Text>
                    <Input
                        style={styles.inputBox} password color={nowTheme.COLORS.MAIN} fontSize={20}
                        onChangeText={(pwd) => this.setState({ password: pwd, errText: false })}
                    />
                    {this.state.errText && <Block center>
                        <Text p color='red'>Invalid username or password.</Text>
                    </Block>}
                    <Block style={styles.divide} />
                    <Block center>
                        <Button
                            style={styles.button}
                            textStyle={{ fontFamily: nowTheme.FONT, fontSize: 31 }}
                            onPress={() => this.login()}
                        >Sign In</Button>
                    </Block>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Register')}
                    >
                        <Text
                            center
                            style={styles.label}
                            color={nowTheme.COLORS.MAIN}
                            size={18} > Register </Text>
                    </TouchableOpacity>
                </Block>
            </Block>
        );
    }
};
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        login: (name, password, successcb, errorcb) => Login(dispatch, name, password, successcb, errorcb),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TestLoginScreen);

const styles = StyleSheet.create({
    background: {
        width,
        height: height / 2,
        position: 'absolute',
        backgroundColor: nowTheme.COLORS.MAIN,
        top: 0
    },
    containter: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: theme.SIZES.BASE * 3,
        paddingVertical: theme.SIZES.BASE * 5,
    },
    logoIcon: {
        width: theme.SIZES.BASE * 8,
        height: theme.SIZES.BASE * 8,
        borderColor: theme.COLORS.BLACK,
        borderRadius: 200,
        borderWidth: 1
    },
    card: {
        backgroundColor: theme.COLORS.WHITE,
        borderRadius: theme.SIZES.BORDER_RADIUS * 7,
        padding: theme.SIZES.BASE * 2
    },
    label: {
        paddingTop: theme.SIZES.BASE,
        fontFamily: nowTheme.FONT
    },
    inputBox: {
        borderColor: theme.COLORS.BLACK,
        borderRadius: theme.SIZES.BORDER_RADIUS * 4,
        // width: width * 0.6,
    },
    divide: {
        height: 1,
        backgroundColor: nowTheme.COLORS.MAIN,
        margin: theme.SIZES.BASE * 2
    },
    button: {
        borderRadius: theme.SIZES.BORDER_RADIUS * 4,
        backgroundColor: nowTheme.COLORS.MAIN,
        borderColor: theme.COLORS.BLACK,
        borderWidth: 1,
        // width: width * 0.6,
        paddingVertical: theme.SIZES.BASE * 1.5
    },
    logoBlock: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});