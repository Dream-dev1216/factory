import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import {
    Block,
    Button,
    Text,
    Input,
    theme,
} from 'galio-framework';
import * as ImagePicker from 'react-native-image-picker'

const { width, height } = Dimensions.get('screen');
// connect to Redux state
import { connect } from "react-redux";
import { Images, nowTheme, Roles } from '../../constants';
import { Register } from "../../redux/actions";
import Header from '../Components/Header'
class RegisterScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            birth: '',
            phone: '',
            address: '',
            newPassword: '',
            newPasswordConfirm: '',
            email: '',
            errName: false,
            errEmptyPassword: false,
            errMatchPassword: false,
            photo: null,
        }
    }
    createFormData = (photo, body, timeVal) => {
        const data = new FormData();

        if(photo)
        data.append("photo", {
            name: timeVal + '-' + photo.fileName,
            type: photo.type,
            uri:
                Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
        });

        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });
        return data;
    };

    handleChoosePhoto = () => {
        const options = {
            noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                this.setState({ photo: response })
            }
        })
    }

    validate = () => {
        if (!this.state.name || this.state.name == '') {
            this.setState({ errName: true });
            return false;
        }
        if (!this.state.newPassword || this.state.newPassword == '') {
            this.setState({ errEmptyPassword: true });
            return false;
        }
        if (this.state.newPassword != this.state.newPasswordConfirm) {
            this.setState({ errMatchPassword: true });
            return false;
        }
        return true;
    }

    register = () => {
        if (this.validate() == true) {
            var timeVal = Date.now();
            this.props.register(
                this.createFormData(this.state.photo, {
                    name: this.state.name,
                    birth: this.state.birth,
                    phone: this.state.phone,
                    address: this.state.address,
                    newPassword: this.state.newPassword,
                    email: this.state.email,
                    thumbnail: this.state.photo ? timeVal + '-' + this.state.photo.fileName : '',
                    role:Roles.EMPLOYEE
                }, timeVal), true, () => {
                    // if (successcb) successcb();
                    console.log("register sucess")
                    this.props.navigation.navigate(Roles.EMPLOYEE);
                });
        }
    }
    render() {
        return (
            <KeyboardAvoidingView>
                <Header nologo noDrawer title="Register" />
                <Block center style={styles.background}>
                    <TouchableOpacity
                        onPress={() => this.handleChoosePhoto()}
                    >
                        <Block style={{ borderWidth: 1, borderRadius: nowTheme.SIZES.RADIUS }}>
                            <Image
                                source={this.state.photo ? {uri:this.state.photo.uri} : Images.Avatar}
                                style={styles.Avatar}
                            />
                        </Block>
                    </TouchableOpacity>
                </Block>
                <SafeAreaView>
                    <ScrollView
                        style={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Name *"
                            labelStyles={styles.inputLabel} fontSize={20}
                            onChangeText={(value) => {
                                this.setState({ name: value })
                                this.setState({ errName: false })
                            }}
                        />
                        {this.state.errName && <Text p color='red'>User name is required.</Text>}
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Birth"
                            labelStyles={styles.inputLabel} fontSize={20}
                            onChangeText={(value) => this.setState({ birth: value })}
                        />
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Phone No"
                            labelStyles={styles.inputLabel} fontSize={20}
                            onChangeText={(value) => this.setState({ phone: value })}
                        />
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Address"
                            labelStyles={styles.inputLabel} fontSize={20}
                            onChangeText={(value) => this.setState({ address: value })}
                        />
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="New Password" password
                            labelStyles={styles.inputLabel} fontSize={20}
                            onChangeText={(value) => {
                                this.setState({ newPassword: value })
                                this.setState({ errEmptyPassword: false })
                            }}
                        />
                        {this.state.errMatchPassword && <Text p color='red'>Password is not matched.</Text>}
                        {this.state.errEmptyPassword && <Text p color='red'>Password is required.</Text>}
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Confirm New Password" password
                            labelStyles={styles.inputLabel} fontSize={20}
                            onChangeText={(value) => this.setState({ newPasswordConfirm: value })}
                        />
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Email"
                            labelStyles={styles.inputLabel} fontSize={20}
                            onChangeText={(value) => this.setState({ email: value })}
                        />

                        <Block center>
                            <Button
                                onPress={() => this.register()}
                                style={styles.button} round
                                textStyle={{ fontFamily: nowTheme.FONT, fontSize: 31 }}
                            >Register</Button>
                        </Block>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
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
        register: (req, isSignUp, successcb, errorcb) => Register(dispatch, req, isSignUp, successcb, errorcb),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterScreen);

const styles = StyleSheet.create({
    background: {
        width,
        backgroundColor: nowTheme.COLORS.MAIN,
        paddingBottom: theme.SIZES.BASE
    },
    containter: {
        paddingHorizontal: theme.SIZES.BASE * 3,
        paddingVertical: theme.SIZES.BASE,
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
    header: {
        height: 50,
        backgroundColor: '#537791'
    },
    text: {
        textAlign: 'center',
        fontWeight: '100'
    },
    Avatar: {
        width: theme.SIZES.BASE * 6,
        height: theme.SIZES.BASE * 6,
        resizeMode: 'stretch',
        borderRadius: nowTheme.SIZES.RADIUS,
    },
    scrollContainer: {
        height: height * 2 / 3,
        paddingHorizontal: theme.SIZES.BASE * 3,
        marginTop: theme.SIZES.BASE
    },
    button: {
        backgroundColor: nowTheme.COLORS.MAIN,
        borderColor: theme.COLORS.BLACK,
        borderWidth: 1,
        paddingVertical: theme.SIZES.BASE * 1.5
    },
    inputLabel: {
        fontSize: 20,
        fontFamily: nowTheme.FONT
    },
    inputBox: {
        borderRadius: theme.SIZES.BORDER_RADIUS * 4,
    },
});