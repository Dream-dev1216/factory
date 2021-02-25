import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, SafeAreaView } from 'react-native';
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
import { Images, nowTheme, Roles } from '../../../constants';
import { Register, UpdateUser, GetEmployers } from "../../../redux/actions";
import { apiConfig } from '../../../redux/config'
import Loader from '../../Components/Loader';
import Header from '../../Components/Header'
class EditEmployeeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            birth: '',
            phone: '',
            address: '',
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
            email: '',
            errName: false,
            errPassword: false,
            errNewPassword: false,
            errMatchPassword: false,
            photo: null,
            loading: false,
        }
    }

    componentDidUpdate = (previousProps, previousState) => {
        if (this.props.route.params.employer) {
            if (previousState.name !== this.props.route.params.employer.name) {
                var employer = this.props.route.params.employer;
                this.setState(
                    {
                        name: employer.name,
                        birth: employer.birth,
                        phone: employer.phone,
                        address: employer.address,
                        email: employer.email,
                        oldPassword: '',
                        newPassword: '',
                        newPasswordConfirm: '',
                        errName: false,
                        errPassword: false,
                        errEmptyPassword: false,
                        errMatchPassword: false,
                        // photo: null,
                    }
                )
            }
        }
    }

    createFormData = (photo, body, timeVal) => {
        const data = new FormData();

        if (photo)
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
        if (this.state.oldPassword != '' && this.state.oldPassword != this.props.route.params.employer.password) {
            this.setState({ errPassword: true });
            return false;
        }
        if (this.props.route.params.employer && this.state.oldPassword == '' && (this.state.newPassword != '' || this.state.newPasswordConfirm != '')) {
            this.setState({ errPassword: true });
            return false;
        }
        if (this.state.oldPassword != '' && this.state.oldPassword == this.props.route.params.employer.password || !this.props.route.params.employer) {
            if (this.state.newPassword == '') {
                this.setState({ errNewPassword: true });
                return false;
            }
            if (this.state.newPassword != this.state.newPasswordConfirm) {
                this.setState({ errMatchPassword: true });
                return false;
            }
        }
        return true;
    }

    register = () => {
        if (this.validate() == true) {
            var timeVal = Date.now();
            this.setState({ loading: true });

            if (this.props.route.params.employer) {
                this.props.updateUser(
                    this.props.route.params.employer._id,
                    this.createFormData(this.state.photo, {
                        name: this.state.name,
                        birth: this.state.birth,
                        phone: this.state.phone,
                        address: this.state.address,
                        newPassword: this.state.oldPassword ? this.state.newPassword : this.props.route.params.employer.password,
                        email: this.state.email,
                        thumbnail: this.state.photo ? timeVal + '-' + this.state.photo.fileName : '',
                        role: Roles.EMPLOYEE
                    }, timeVal), false, () => {
                        // if (successcb) successcb();
                        console.log("Update employer data sucessfully")
                        this.props.getEmployers(
                            () => {
                                this.setState({ loading: false });
                                this.props.navigation.goBack();
                            }
                        );
                    });

            } else {
                this.props.register(
                    this.createFormData(this.state.photo, {
                        name: this.state.name,
                        birth: this.state.birth,
                        phone: this.state.phone,
                        address: this.state.address,
                        newPassword: this.state.newPassword,
                        email: this.state.email,
                        thumbnail: this.state.photo ? timeVal + '-' + this.state.photo.fileName : '',
                        role: Roles.EMPLOYEE
                    }, timeVal), false, () => {
                        // if (successcb) successcb();
                        console.log("Add employer data sucessfully")
                        this.props.getEmployers(
                            () => {
                                this.setState({ loading: false });
                                this.props.navigation.goBack();
                            }
                        );
                    });
            }
        }
    }
    render() {
        return (
            <Block>
                <Loader loading={this.state.loading} />
                <Header nologo title={this.props.route.params.employer ? "Edit Employer" : "Add Employer"} navigation={this.props.navigation} />
                <Block center style={styles.background}>
                    <TouchableOpacity
                        onPress={() => this.handleChoosePhoto()}
                    >
                        <Block style={{ borderWidth: 1, borderRadius: nowTheme.SIZES.RADIUS }}>
                            <Image
                                source={this.state.photo ? { uri: this.state.photo.uri } : (this.props.route.params.employer && this.props.route.params.employer.thumbnail ?
                                    { uri: `${apiConfig.baseUrl}/image/${this.props.route.params.employer.thumbnail}` } :
                                    Images.Avatar)}
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
                            labelStyles={styles.inputLabel} fontSize={20} value={this.state.name}
                            onChangeText={(value) => {
                                this.setState({ name: value })
                                this.setState({ errName: false })
                            }}
                        />
                        {this.state.errName && <Text p color='red'>User name is required.</Text>}
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Birth"
                            labelStyles={styles.inputLabel} fontSize={20} value={this.state.birth}
                            onChangeText={(value) => this.setState({ birth: value })}
                        />
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Phone No"
                            labelStyles={styles.inputLabel} fontSize={20} value={this.state.phone}
                            onChangeText={(value) => this.setState({ phone: value })}
                        />
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Address"
                            labelStyles={styles.inputLabel} fontSize={20} value={this.state.address}
                            onChangeText={(value) => this.setState({ address: value })}
                        />
                        {this.props.route.params.employer &&
                            <Input
                                style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Old Password" password
                                labelStyles={styles.inputLabel} fontSize={20}
                                onChangeText={(value) => {
                                    this.setState({ oldPassword: value })
                                    this.setState({ errPassword: false })
                                }}
                            />}
                        {this.props.route.params.employer && this.state.errPassword && <Text p color='red'>password is not correct</Text>}
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="New Password" password
                            labelStyles={styles.inputLabel} fontSize={20}
                            onChangeText={(value) => {
                                this.setState({ newPassword: value })
                                this.setState({ errNewPassword: false })
                            }}
                        />
                        {this.state.errMatchPassword && <Text p color='red'>Password is not matched.</Text>}
                        {this.state.errNewPassword && <Text p color='red'>Password is required.</Text>}
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Confirm New Password" password
                            labelStyles={styles.inputLabel} fontSize={20}
                            onChangeText={(value) => {
                                this.setState({ newPasswordConfirm: value })
                                this.setState({ errMatchPassword: false })
                            }}
                        />
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Email"
                            labelStyles={styles.inputLabel} fontSize={20} value={this.state.email}
                            onChangeText={(value) => this.setState({ email: value })}
                        />

                        <Block center>
                            <Button
                                onPress={() => this.register()}
                                style={styles.button} round
                                textStyle={{ fontFamily: nowTheme.FONT, fontSize: 31 }}
                            >SAVE</Button>
                        </Block>
                    </ScrollView>
                </SafeAreaView>
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
        register: (req, isSignUp, successcb, errorcb) => Register(dispatch, req, isSignUp, successcb, errorcb),
        updateUser: (id, req, isOwn, successcb, errorcb) => UpdateUser(dispatch, id, req, isOwn, successcb, errorcb),
        getEmployers: (successcb) => GetEmployers(dispatch, successcb),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditEmployeeScreen);

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