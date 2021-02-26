import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import {
    Block,
    Button,
    Text,
    Input,
    theme,
    Toast
} from 'galio-framework';
import * as ImagePicker from 'react-native-image-picker'
const { width, height } = Dimensions.get('screen');
// connect to Redux state
import { connect } from "react-redux";
import { UpdateUser } from "../../redux/actions";
import { Images, nowTheme } from '../../constants';
import {apiConfig} from '../../redux/config';
import Header from '../Components/Header'
class ProfileScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: this.props.currentUser.name,
            birth: this.props.currentUser.birth,
            phone: this.props.currentUser.phone,
            address: this.props.currentUser.address,
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
            email: this.props.currentUser.email,
            errName: false,
            errPassword: false,
            errNewPassword: false,
            errMatchPassword: false,
            showErr: false,
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
        if (this.state.oldPassword != '' && this.state.oldPassword != this.props.currentUser.password) {
            this.setState({ errPassword: true });
            return false;
        }
        if (this.state.oldPassword == '' && (this.state.newPassword != '' || this.state.newPasswordConfirm != '')){
            this.setState({ errPassword: true });
            return false;
        }
        if (this.state.oldPassword != '' && this.state.oldPassword == this.props.currentUser.password) {
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

    save = () => {
        if (!this.validate()){
            this.setState({ showErr: true })
            setTimeout(() => {
                this.setState({ showErr: false })
            }, 2000);
        };
        var timeVal = Date.now();
        this.props.updateUser(
            this.props.currentUser.id,
            this.createFormData(this.state.photo, {
                name: this.state.name,
                birth: this.state.birth,
                phone: this.state.phone,
                address: this.state.address,
                newPassword: this.state.oldPassword ? this.state.newPassword : this.props.currentUser.password,
                email: this.state.email,
                thumbnail: this.state.photo ? timeVal + '-' + this.state.photo.fileName : '',
                role:this.props.currentUser.role
            }, timeVal), true, () => {
                // if (successcb) successcb();
                console.log("update user success")
                this.props.navigation.goBack();
            });
    }

    render() {
        return (
            <Block>
                <Header nologo title="Profile" navigation={this.props.navigation} />
                <Block center>
                    <Block style={styles.background} />
                    <TouchableOpacity
                        onPress={() => this.handleChoosePhoto()}
                    >
                        <Block style={{ borderWidth: 1, borderRadius: nowTheme.SIZES.RADIUS }}>
                            <Image
                                source={this.state.photo ? {uri:this.state.photo.uri} : (this.props.currentUser.thumbnail ?
                                    {uri:`${apiConfig.baseUrl}image/${this.props.currentUser.thumbnail}`} :
                                    Images.Avatar)}
                                style={styles.Avatar}
                            />
                        </Block>
                        
                    </TouchableOpacity>
                    <Block center style={styles.containter}>
                        <Text h3 style={styles.title}>
                            {this.props.currentUser.name}
                        </Text>
                    </Block>
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
                        {this.state.errName && <Text p color='red'>name is required</Text>}
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
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Old Password" password
                            labelStyles={styles.inputLabel} fontSize={20}
                            onChangeText={(value) => {
                                this.setState({ oldPassword: value })
                                this.setState({ errPassword: false })
                            }}
                        />
                        {this.state.errPassword && <Text p color='red'>password is not correct</Text>}
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="New Password" password
                            labelStyles={styles.inputLabel} fontSize={20}
                            onChangeText={(value) => {
                                this.setState({ newPassword: value })
                                this.setState({ errNewPassword: false })
                                this.setState({ errMatchPassword: false })
                            }}
                        />
                        {this.state.errNewPassword && <Text p color='red'>password is required</Text>}
                        {this.state.errMatchPassword && <Text p color='red'>password is not matched</Text>}
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
                                onPress={() => this.save()}
                                style={styles.button} round
                                textStyle={{ fontFamily: nowTheme.FONT, fontSize: 31 }}
                            >Save</Button>
                        </Block>
                    </ScrollView>
                </SafeAreaView>
                <Toast
                    isShow={this.state.showErr}
                    positionIndicator="top"
                    color='warning'
                    // textStyle={{ textAlign: 'center', fontSize: 18, color: 'red' }}
                    round
                >Save failed</Toast>
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
        updateUser: (id, req, isOwn, successcb, errorcb) => UpdateUser(dispatch, id, req, isOwn, successcb, errorcb),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileScreen);

const styles = StyleSheet.create({
    background: {
        width,
        height: height / 5,
        position: 'absolute',
        backgroundColor: nowTheme.COLORS.MAIN,
        top: 0
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
        height: height / 2,
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