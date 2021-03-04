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
const { width, height } = Dimensions.get('screen');
// connect to Redux state
import { connect } from "react-redux";
import { Images, nowTheme, Status } from '../../../constants';
import { GetProducts } from "../../../redux/actions";
import { apiConfig } from '../../../redux/config'
import Loader from '../../Components/Loader';
import Header from '../../Components/Header'
class ProcessingScreen extends React.Component {
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
    }

    renderProducts = () => {
        return this.props.products
            .filter(product => product.status == Status.PROCESS || product.status == Status.ACCEPT)
            .map((product) =>
                <Block style={{ marginVertical: theme.SIZES.BASE }} key={product._id}>
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
                        {product.status == Status.ACCEPT && <Text p bold>✔️</Text>}
                        <Text h6 bold style={{ padding: theme.SIZES.BASE }}>Under Processing...</Text>
                        <Text h6 bold style={{ padding: theme.SIZES.BASE }}>By {product.employer}</Text>
                    </Block>
                </Block>
            )
    }

    render() {
        return (
            <Block style={{ backgroundColor: 'white' }}>
                <Loader loading={this.state.loading} />
                <Header nologo title="Processing" navigation={this.props.navigation} />
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
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProcessingScreen);

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
    scrollContent: {
        height: height * 2 / 3
    }
});