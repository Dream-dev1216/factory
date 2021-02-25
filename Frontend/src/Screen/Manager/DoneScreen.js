import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import {
    Block,
    Button,
    Text,
    Input,
    theme,
} from 'galio-framework';
import { Modal, ModalFooter, ModalTitle, ModalButton, ModalContent, SlideAnimation } from 'react-native-modals';
const { width, height } = Dimensions.get('screen');
// connect to Redux state
import { connect } from "react-redux";
import { Images, nowTheme, Status } from '../../../constants';
import { GetProducts, UpdateProduct } from "../../../redux/actions";
import { apiConfig } from '../../../redux/config'
import Loader from '../../Components/Loader';
import Header from '../../Components/Header'
class DoneScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleModal: false,
            id: '',
            price: 0,
            loading: true,
        }
    }

    componentDidMount = () => {
        this.props.getProducts(
            () => this.setState({ loading: false })
        );
    }

    getDateFormate = (str) => {
        let d = new Date(str);
        return d.getDate() + '/' + (parseInt(d.getMonth()) + 1) + '/' + d.getFullYear();
    }

    done = () => {
        this.setState({ loading: true });
        this.props.updateProduct(
            this.state.id,
            { price: this.state.price },
            () => {
                this.setState({ visibleModal: false });
                this.setState({ loading: false });
            }
        )
    }

    renderProducts = () => {
        return this.props.products
            .filter(product => product.status == Status.DONE && product.price == '-1')
            .map((product) =>
                <TouchableOpacity
                    style={{ marginVertical: theme.SIZES.BASE }} key={product._id}
                    onPress={() => this.setState({
                        visibleModal: true,
                        id: product._id
                    })}
                >
                    <Block row center>
                        <Block center flex>
                            <Image
                                source={product.thumbnail ? { uri: `${apiConfig.baseUrl}/image/${product.thumbnail}` } : null}
                                style={styles.product}
                            />
                        </Block>
                        <Block flex>
                            <Text h4 bold style={{ padding: 4 }}>{product.name}</Text>
                            <Text p style={{ padding: 4 }}>{product.description}</Text>
                            <Text p style={{ padding: 4 }}>{product.type}</Text>
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
                        <Text h6 color='grey' style={{ padding: theme.SIZES.BASE }}>Done</Text>
                        <Text h6 color='grey' style={{ padding: theme.SIZES.BASE }}>{this.getDateFormate(product.updatedAt)}</Text>
                        <Text h6 bold style={{ padding: theme.SIZES.BASE }}>By {product.employer}</Text>
                    </Block>
                </TouchableOpacity>
            )
    }

    render() {
        return (
            <Block style={{ backgroundColor: 'white' }}>
                <Loader loading={this.state.loading} />
                <Header nologo title="Done" navigation={this.props.navigation} />
                <Block center style={styles.background}>
                    <Block style={{ borderWidth: 1, borderRadius: nowTheme.SIZES.RADIUS }}>
                        <Image
                            source={this.props.currentUser.thumbnail ?
                                { uri: `${apiConfig.baseUrl}/image/${this.props.currentUser.thumbnail}` } :
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
                        <ModalTitle title="Manufacturing fees" />
                    }
                    footer={
                        <ModalFooter>
                            <ModalButton
                                text="Cancel"
                                onPress={() => this.setState({ visibleModal: false })}
                            />
                            <ModalButton
                                text="Done"
                                onPress={() => this.done()}
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
                        <Input
                            color={nowTheme.COLORS.MAIN} label="Price" rounded
                            labelStyles={styles.inputLabel} fontSize={20}
                            onChangeText={(value) => this.setState({ price: value })}
                        />
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
        updateProduct: (id, req, successcb) => UpdateProduct(dispatch, id, req, successcb),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DoneScreen);

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
        alignItems: 'center',
        marginLeft: theme.SIZES.BASE
    },
    userIcon: {
        width: theme.SIZES.BASE,
        height: theme.SIZES.BASE,
        resizeMode: 'stretch',
    },
    scrollContent: {
        height: height * 2 / 3
    },
    inputLabel: {
        fontSize: 20,
        fontFamily: nowTheme.FONT
    },
});