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
import { Modal, ModalFooter, ModalTitle, ModalButton, ModalContent, SlideAnimation } from 'react-native-modals';
const { width, height } = Dimensions.get('screen');
// connect to Redux state
import { connect } from "react-redux";
import { Images, nowTheme, Roles, Status } from '../../../constants';
import { GetProducts, GetEmployers, UpdateProduct, DeleteProduct } from "../../../redux/actions";
import { apiConfig } from '../../../redux/config'
import Loader from '../../Components/Loader';
import Header from '../../Components/Header'
class HoldScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleModal: false,
            id: '',
            employers: [],
            employer: '',
            loading: true,
            errEmp: false,
        }
    }

    componentDidMount = () => {
        this.props.getProducts(
            () => this.props.getEmployers(
                (employers) => {
                    let arrEmployers = []
                    employers.map(employer => arrEmployers.push({ value: employer.name }));
                    this.setState({ employers: arrEmployers });
                    this.setState({ loading: false });
                }
            )
        );
    }

    process = () => {
        this.setState({ loading: true });
        if (this.state.id) {
            if (this.state.employer == '') {
                this.setState({ loading: false, errEmp: true });
            }
            this.props.updateProduct(
                this.state.id,
                {
                    status: Status.PROCESS,
                    employer: this.state.employer
                },
                () => {
                    this.setState({ loading: false, visibleModal: false });
                }
            )
        } else {
            this.setState({ loading: false, visibleModal: false });
            alert("invalid product selected.");
        }
    }

    deleteProduct = (id) => {
        this.setState({ loading: true });
        this.props.deleteProduct(id,
            () => this.setState({ loading: false })
        );
    }

    renderProducts = () => {
        return this.props.products
            .filter(product => product.status == Status.HOLD)
            .map((product) =>
                <Block key={product._id}>
                    <Block row center>
                        <Block center flex>
                            <Image
                                source={product.thumbnail ? { uri: `${apiConfig.baseUrl}image/${product.thumbnail}` } : null}
                                style={styles.product}
                            />
                        </Block>
                        <Block flex>
                            <Text h4 bold style={{ padding: 4 }}>{product.name}</Text>
                            <Text p style={{ padding: 4 }}>{product.description}</Text>
                            <Text p style={{ padding: 4 }}>{product.requestType}</Text>
                            <Block row >
                                <Text h6 bold style={{ padding: 4 }}>{product.gold}g</Text>
                                <Text h6 bold style={{ padding: 4 }}>{product.total}g</Text>
                                <Block row>
                                    <Block center style={styles.userCapture}>
                                        <Image
                                            source={Images.user}
                                            style={styles.userIcon}
                                        />
                                    </Block>
                                    <Text p style={{ padding: 4 }}>{product.customer}</Text>
                                </Block>
                            </Block>
                        </Block>
                    </Block>
                    <Block row center>
                        <TouchableOpacity
                            style={{ backgroundColor: nowTheme.COLORS.SUCCESS, borderRadius: 5 }}
                            onPress={() => this.props.navigation.navigate('EditProduct', { product: product, readonly: false })}
                        >
                            <Image
                                source={Images.edit}
                                style={styles.editIcon}
                            />
                        </TouchableOpacity>
                        <Button
                            size='small' round
                            textStyle={{ fontFamily: nowTheme.FONT, fontSize: 20 }}
                            onPress={() => this.deleteProduct(product._id)}
                        >Delete</Button>
                        <Button
                            size='small' color='success' round success
                            textStyle={{ fontFamily: nowTheme.FONT, fontSize: 20 }}
                            onPress={() => {
                                this.setState({ id: product._id })
                                this.setState({ visibleModal: true })
                            }}
                        >Process</Button>
                    </Block>
                </Block>
            )
    }

    render() {
        let employees = this.state.employers;
        return (
            <Block style={{ backgroundColor: 'white' }}>
                <Loader loading={this.state.loading} />
                <Header nologo title="Hold" navigation={this.props.navigation} />
                <Block center style={styles.background}>
                    <Block style={{ borderWidth: 1, borderRadius: nowTheme.SIZES.RADIUS }}>
                        <Image
                            source={this.props.currentUser.thumbnail ?
                                { uri: `${apiConfig.baseUrl}image/${this.props.currentUser.thumbnail}` } :
                                Images.Avatar}
                            style={styles.Avatar}
                        />
                    </Block>
                </Block>
                <SafeAreaView>
                    <ScrollView
                        style={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {this.renderProducts()}
                    </ScrollView>
                </SafeAreaView>
                <Modal
                    visible={this.state.visibleModal}
                    modalTitle={
                        <ModalTitle title="Process" />
                    }
                    footer={
                        <ModalFooter>
                            <ModalButton
                                text="Cancel"
                                onPress={() => this.setState({ visibleModal: false })}
                            />
                            <ModalButton
                                text="Process"
                                onPress={() => this.process()}
                            />
                        </ModalFooter>
                    }
                    onTouchOutside={() => {
                        this.setState({ visibleModal: false });
                    }}
                    modalAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                >
                    <ModalContent
                        style={{ width: width - theme.SIZES.BASE * 4 }}
                    >
                        <Dropdown
                            label='Employee Name'
                            textColor={nowTheme.COLORS.MAIN}
                            labelFontSize={16}
                            fontSize={20}
                            data={employees}
                            onChangeText={(value) => this.setState({ employer: value, errEmp: false })}
                        />
                        {this.state.errEmp && <Text color='red'>
                            Select Employer.
                        </Text>}
                    </ModalContent>
                </Modal>
            </Block>
        );
    }
};
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        products: state.products,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        getProducts: (successcb) => GetProducts(dispatch, successcb),
        getEmployers: (successcb) => GetEmployers(dispatch, successcb),
        updateProduct: (id, req, successcb) => UpdateProduct(dispatch, id, req, successcb),
        deleteProduct: (id, successcb) => DeleteProduct(dispatch, id, successcb),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HoldScreen);

const styles = StyleSheet.create({
    background: {
        width,
        height: height / 5,
        backgroundColor: nowTheme.COLORS.MAIN,
    },
    Avatar: {
        width: theme.SIZES.BASE * 6,
        height: theme.SIZES.BASE * 6,
        resizeMode: 'stretch',
        borderRadius: nowTheme.SIZES.RADIUS,
    },
    product: {
        width: theme.SIZES.BASE * 7,
        height: theme.SIZES.BASE * 7,
        resizeMode: 'stretch',
    },
    userCapture: {
        width: theme.SIZES.BASE,
        height: theme.SIZES.BASE,
        resizeMode: 'stretch',
        borderRadius: nowTheme.SIZES.RADIUS,
        borderWidth: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userIcon: {
        width: theme.SIZES.BASE,
        height: theme.SIZES.BASE,
        resizeMode: 'stretch',
    },
    editIcon: {
        width: theme.SIZES.BASE * 1.5,
        height: theme.SIZES.BASE * 1.5,
        resizeMode: 'stretch',
        margin: 10

    },
    scrollContent: {
        height: height * 2 / 3
    }
});