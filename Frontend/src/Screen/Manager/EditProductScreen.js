import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import {
    Block,
    Button,
    Text,
    Input,
    theme,
} from 'galio-framework';
import { Dropdown } from 'react-native-material-dropdown';
import Textarea from 'react-native-textarea';
import * as ImagePicker from 'react-native-image-picker'

const { width, height } = Dimensions.get('screen');
// connect to Redux state
import { connect } from "react-redux";
import { Images, nowTheme, Status } from '../../../constants';
import { GetNewBill, GetCustomers, SaveProduct } from "../../../redux/actions";
import Loader from '../../Components/Loader';
import Header from '../../Components/Header'
import { apiConfig } from '../../../redux/config'

class EditProductScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            bill: '',
            name: '',
            description: '',
            gold: '0',
            diamond: '0',
            stone: '0',
            total: '0',
            note: '',
            customers: [],
            customer: '',
            requestType: '',
            photo: null,
            thumbnail: '',
            loading: true,
        }
    }

    componentDidMount = () => {
        this.props.getNewBill(
            (newBill) => this.setState({ bill: newBill })
        );
        this.props.getCustomers(
            (customers) => {
                let arrCustomers = []
                customers.map(customer => arrCustomers.push({ value: customer.name }));
                this.setState({ customers: arrCustomers });
                this.setState({ loading: false });
            }
        );
    }
    componentDidUpdate = (previousProps, previousState) => {
        if (this.props.route.params.product
            && previousState.id !== this.props.route.params.product._id) {
            var product = this.props.route.params.product;
            this.setState(
                {
                    id: product._id,
                    bill: product.bill,
                    name: product.name,
                    description: product.description,
                    gold: product.gold,
                    diamond: product.diamond,
                    stone: product.stone,
                    total: product.total,
                    note: product.note,
                    customer: product.customer,
                    requestType: product.requestType,
                    thumbnail: product.thumbnail
                }
            )
        } else if (this.props.route.params.product == null
            && previousState.id != '') {
            this.setState({
                id: '',
                bill: this.props.newBill,
                name: '',
                description: '',
                gold: '0',
                diamond: '0',
                stone: '0',
                total: '0',
                note: '',
                customer: '',
                requestType: '',
                photo: null,
                thumbnail: '',
            })
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
        if (this.props.route.params.readonly) return;
        const options = {
            noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                this.setState({ photo: response })
            }
        })
    }

    submit = () => {
        this.setState({ loading: true });
        var timeVal = Date.now();
        let product = {
            bill: this.state.bill,
            name: this.state.name,
            description: this.state.description,
            gold: this.state.gold,
            diamond: this.state.diamond,
            stone: this.state.stone,
            total: this.state.total,
            note: this.state.note,
            customer: this.state.customer,
            requestType: this.state.requestType,
            thumbnail: this.state.photo ? timeVal + '-' + this.state.photo.fileName : this.state.thumbnail,
            manager: this.props.currentUser.name
        }

        this.props.saveProduct(
            this.state.id,
            this.createFormData(this.state.photo, product, timeVal),
            (res) => {
                if (res)
                    this.goToHoldScreen()
            }
        )

    }

    goToHoldScreen = () => {
        this.props.getNewBill(
            () => {
                this.setState({ loading: false });
                this.props.navigation.navigate('Hold');
            }
        );
        console.log("save product successfully.");
    }

    render() {
        const readonly = this.props.route.params.readonly;
        let data = [{
            value: 'Maintenance',
        }, {
            value: 'Create',
        }];
        return (
            <Block>
                <Loader loading={this.state.loading} />
                <Header nologo title={this.state.id ? "Edit Product" : "Add New Product"} navigation={this.props.navigation} />
                <Block center>
                    <Block style={styles.background} />
                    <Block style={{ borderWidth: 1, borderRadius: nowTheme.SIZES.RADIUS }}>
                        <Image
                            source={this.props.currentUser.thumbnail ?
                                { uri: `${apiConfig.baseUrl}image/${this.props.currentUser.thumbnail}` } :
                                Images.Avatar}
                            style={styles.Avatar}
                        />
                    </Block>
                    <Block center style={styles.containter}>
                        <Text h3 style={styles.title}>
                            {this.props.currentUser.name}
                        </Text>
                    </Block>
                    <TouchableOpacity
                        onPress={() => readonly ? null : this.handleChoosePhoto()}
                    >
                        <Block style={{ borderWidth: 1, borderRadius: nowTheme.SIZES.RADIUS, padding: 2 }}>
                            <Image
                                source={this.state.photo ? { uri: this.state.photo.uri } :
                                    (this.state.thumbnail ? { uri: `${apiConfig.baseUrl}image/${this.state.thumbnail}` } : null)
                                }
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
                        <Block row center>
                            <Text size={15} color='grey'>Bill No.</Text>
                            <Text size={20} color='red'>{this.state.bill}</Text>
                        </Block>
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Name"
                            labelStyles={styles.inputLabel} fontSize={20} value={this.state.name}
                            onChangeText={(value) => this.setState({ name: value })}
                            editable={!readonly}
                        />
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Description"
                            labelStyles={styles.inputLabel} fontSize={20} value={this.state.description}
                            onChangeText={(value) => this.setState({ description: value })}
                            editable={!readonly}
                        />
                        <Dropdown
                            label='Customer Name'
                            textColor={nowTheme.COLORS.MAIN}
                            labelFontSize={16}
                            fontSize={20}
                            data={this.state.customers}
                            value={this.state.customer}
                            onChangeText={(value) => this.setState({ customer: value })}
                            disabled={readonly}
                        />
                        <Dropdown
                            label='Request Type'
                            textColor={nowTheme.COLORS.MAIN}
                            labelFontSize={16}
                            fontSize={20}
                            data={data}
                            value={this.state.requestType}
                            onChangeText={(value) => this.setState({ requestType: value })}
                            disabled={readonly}
                        />
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Gold Weight" type="decimal-pad"
                            labelStyles={styles.inputLabel} fontSize={20} value={this.state.gold.toString()}
                            onChangeText={(value) => {
                                this.setState({ total: parseFloat(this.state.diamond) + parseFloat(this.state.stone) + parseFloat(value) })
                                this.setState({ gold: value })
                            }}
                            editable={!readonly}
                        />
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Diamond Weight" type="decimal-pad"
                            labelStyles={styles.inputLabel} fontSize={20} value={this.state.diamond.toString()}
                            onChangeText={(value) => {
                                this.setState({ total: parseFloat(this.state.stone) + parseFloat(this.state.gold) + parseFloat(value) })
                                this.setState({ diamond: value })
                            }}
                            editable={!readonly}
                        />
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Stone Weight" type="decimal-pad"
                            labelStyles={styles.inputLabel} fontSize={20} value={this.state.stone.toString()}
                            onChangeText={(value) => {
                                this.setState({ total: parseFloat(this.state.diamond) + parseFloat(this.state.gold) + parseFloat(value) })
                                this.setState({ stone: value })
                            }}
                            editable={!readonly}
                        />
                        <Input
                            style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Total Weight" type="decimal-pad"
                            labelStyles={styles.inputLabel} fontSize={20} value={this.state.total.toString()}
                            editable={false}
                        />
                        <Text style={{ paddingLeft: theme.SIZES.BASE }} size={20}>Note</Text>
                        <Textarea
                            style={styles.textarea}
                            onChangeText={(value) => this.setState({ note: value })}
                            defaultValue={this.state.note}
                            maxLength={120}
                            placeholder={'Enter Notes...'}
                            placeholderTextColor={theme.COLORS.PLACEHOLDER}
                            underlineColorAndroid={'transparent'}
                            value={this.state.note}
                            editable={!readonly}
                        />
                        <Block center>
                            {!readonly && <Button
                                onPress={() => this.submit()}
                                style={styles.button} round
                                textStyle={{ fontFamily: nowTheme.FONT, fontSize: 31 }}
                            >{this.state.id ? 'SAVE' : 'ADD'}</Button>}
                            {readonly && <Button
                                onPress={() => this.props.navigation.goBack()}
                                style={styles.button} round
                                textStyle={{ fontFamily: nowTheme.FONT, fontSize: 31 }}
                            >BACK</Button>}
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
        newBill: state.newBill,
        customers: state.customers
    };
}
function mapDispatchToProps(dispatch) {
    return {
        getNewBill: (successcb) => GetNewBill(dispatch, successcb),
        getCustomers: (successcb) => GetCustomers(dispatch, successcb),
        saveProduct: (id, product, successcb) => SaveProduct(id, product, successcb),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditProductScreen);

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
        height: height * 0.4,
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

    textarea: {
        textAlignVertical: 'top',  // hack android
        height: 170,
        fontSize: 20,
        color: nowTheme.COLORS.MAIN,
        backgroundColor: theme.COLORS.WHITE,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 20
    },
});