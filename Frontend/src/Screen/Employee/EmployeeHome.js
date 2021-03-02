import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, SafeAreaView } from 'react-native';
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
import { Images, nowTheme, Roles, Status } from '../../../constants';
import { GetProducts, UpdateProduct, SetClient, AddMessage } from "../../../redux/actions";
import { apiConfig } from '../../../redux/config'
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Loader from '../../Components/Loader';
import Header from '../../Components/Header'
class EmployeeHome extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
        }
    }

    componentDidMount = () => {
        this.props.getProducts(
            () => this.setState({ loading: false })
        );

        if (this.client) this.client.close();
        this.client = new W3CWebSocket(apiConfig.socketUrl, this.props.currentUser.id);
        this.client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        this.client.onmessage = (message) => {
            this.handleSocket(message.data);
        };
        this.props.setClient(this.client);
    }
    componentWillUnmount() {
        if (this.client)
            this.client.close();
    }

    handleSocket = (message) => {
        let messageObject = JSON.parse(message);
        switch (messageObject.type) {
            case "message":
                this.props.addMessage(messageObject.data, messageObject.receiver, this.props.route.name == 'Chat');
                break;
            default: break;
        }
    }

    getDateFormate = (str) => {
        let d = new Date(str);
        return d.getDate() + '/' + (parseInt(d.getMonth()) + 1) + '/' + d.getFullYear();
    }

    reject = (product) => {
        this.setState({ loading: true });
        this.props.updateProduct(
            product._id,
            { status: Status.HOLD },
            () => this.setState({ loading: false })
        );
    }

    accept = (product) => {
        this.setState({ loading: true });
        this.props.updateProduct(
            product._id,
            { status: Status.ACCEPT },
            () => this.setState({ loading: false })
        )
    }

    done = (product) => {
        this.setState({ loading: true });
        this.props.updateProduct(
            product._id,
            { status: Status.DONE },
            () => this.setState({ loading: false })
        )
    }
    
    renderProducts = () => {
        return this.props.products
            .filter(product => product.status != Status.HOLD && product.employer == this.props.currentUser.name)
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
                    {product.status == Status.PROCESS && <Block row center>
                        <Button
                            size='small' round
                            textStyle={{ fontFamily: nowTheme.FONT, fontSize: 20 }}
                            onPress={() => this.reject(product)}
                        >Reject</Button>
                        <Button
                            size='small' color='success' round success
                            textStyle={{ fontFamily: nowTheme.FONT, fontSize: 20 }}
                            onPress={() => this.accept(product)}
                        >Accept</Button>
                    </Block>}
                    {product.status == Status.ACCEPT && <Block row center>
                        <Button
                            size='small' color='success' round success
                            textStyle={{ fontFamily: nowTheme.FONT, fontSize: 20 }}
                            onPress={() => this.done(product)}
                        >DONE</Button>
                        <Text h6 bold style={{ padding: 4 }}>Under Processing...</Text>
                    </Block>}
                    {product.status == Status.DONE && <Block row center>
                        <Text p color='grey' style={{ padding: theme.SIZES.BASE }}>DONE</Text>
                        <Text p color='grey' style={{ padding: theme.SIZES.BASE }}>{this.getDateFormate(product.updatedAt)}</Text>
                    </Block>}
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
                    <Block center>
                        <Text h3 style={styles.title}>
                            New Product
                        </Text>
                    </Block>
                    <SafeAreaView>
                        <ScrollView
                            style={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {this.renderProducts()}
                        </ScrollView>
                    </SafeAreaView>
                </Block>
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
        setClient: (client) => SetClient(dispatch, client),
        addMessage: (data, receiver, isChatting) => AddMessage(dispatch, data, receiver, isChatting),
        updateProduct: (id, req, successcb) => UpdateProduct(dispatch, id, req, successcb),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeHome);

const styles = StyleSheet.create({
    background: {
        width,
        height: theme.SIZES.BASE * 5,
        position: 'absolute',
        backgroundColor: nowTheme.COLORS.MAIN,
        top: 0
    },
    containter: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
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
    product: {
        width: theme.SIZES.BASE * 7,
        height: theme.SIZES.BASE * 7,
        resizeMode: 'stretch',
    },
    userIcon: {
        width: theme.SIZES.BASE,
        height: theme.SIZES.BASE,
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
    scrollContent: {
        height: height * 0.6,
        marginVertical: theme.SIZES.BASE
    }
});