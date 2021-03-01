import React from 'react';
import { StyleSheet, BackHandler, TouchableOpacity, Dimensions, ScrollView, } from 'react-native';
import {
    Block,
    Button,
    Text,
    Input,
    theme,
} from 'galio-framework';
import Orientation from 'react-native-orientation';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
var RNFS = require("react-native-fs");

const { width, height } = Dimensions.get('screen');
// connect to Redux state
import { connect } from "react-redux";
import { Images, nowTheme } from '../../constants';

class PreShareScreen extends React.Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {

        }
    }

    componentDidMount = () => {
        Orientation.lockToLandscape();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        Orientation.lockToPortrait()
        this.props.navigation.goBack('History');
        return true;
    }

    getDateFormate = (str) => {
        let d = new Date(str);
        return d.getFullYear() + '.' + (parseInt(d.getMonth()) + 1) + '.' + d.getDate();
    }

    captureAndShareScreenshot = () => {
        this.refs.viewShot.capture().then((uri) => {
            console.log("uri => ", uri);
            RNFS.readFile(uri, 'base64').then((res) => {
                let urlString = 'data:image/jpeg;base64,' + res;
                // const shareResponse = Share.open({ url: urlString });
                let shareOptions = {
                    title: "Share",
                    url: urlString,
                    type: 'image/png',
                    // message: "Here it is",
                    subject: "Share Link", // for email,
                };
                Share.open(shareOptions);
                // let options = {
                //     title: 'Share Title',
                //     message: 'Share Message',
                //     url: urlString,
                //     type: 'image/jpeg',
                // };
                // Share.shareSingle(Object.assign(res, {
                //     social : "whatsapp"
                // })).catch(err=>console.log(err));
                // Share.open(options)
                //     .then((res) => {
                //         console.log(res);
                //     })
                //     .catch((err) => {
                //         err && console.log(err);
                //     });
            });
        });
    };

    render() {
        let product = this.props.route.params.product;
        return (
            <ViewShot
                // style={styles.container}
                ref="viewShot"
                options={{ format: 'jpg', quality: 0.9 }}>
                <TouchableOpacity style={styles.container}
                    onPress={() => this.captureAndShareScreenshot()}
                >

                    <Block row center>
                        <Block center>
                            <Text h5>BAREEQ ALS AFWA CO.</Text>
                            <Text size={12}>For Watches & Jewellers</Text>
                            <Text size={12}>C.R.: 1010290255 - Metal license 12/10100354</Text>
                            <Text size={12}>Tel.: 011 4384024 - Mob: 0554233330</Text>
                            <Text size={12}>Email: assafwa@hotmail.com</Text>
                        </Block>
                        <Text bold size={80}> BRS </Text>
                        <Block center>
                            <Text h5>شركة بريق العفوة</Text>
                            <Text size={12}>للساعات والمجوهرات</Text>
                            <Text size={12}>السجل التجاري: 1010290255 - رخصة معدنية 12/10100354</Text>
                            <Text size={12}>هاتف: 4384024 011 - موبايل: 0554233330</Text>
                            <Text size={12}>assafwa@hotmail.com</Text>
                        </Block>
                    </Block>
                    <Block row style={styles.inputRow}>
                        <Text>Date</Text>
                        <Text style={styles.bordered}>{this.getDateFormate(product.updatedAt)}</Text>
                        <Text>Bill No</Text>
                        <Text style={styles.bordered}>{product.bill}</Text>
                        <Text>Customer Name</Text>
                        <Text style={styles.bordered}>{product.customer}</Text>
                        <Text>Phone Number</Text>
                        <Text style={styles.bordered}></Text>
                    </Block>
                    <Block row>
                        <Text style={{ flex: 1, borderWidth: 1, textAlign: 'center' }}>No</Text>
                        <Text style={{ flex: 2, borderWidth: 1, textAlign: 'center' }}>Product Name</Text>
                        <Text style={{ flex: 2, borderWidth: 1, textAlign: 'center' }}>Request Type</Text>
                        <Text style={{ flex: 2, borderWidth: 1, textAlign: 'center' }}>Gold Weight</Text>
                        <Text style={{ flex: 2, borderWidth: 1, textAlign: 'center' }}>Diamond Weight</Text>
                        <Text style={{ flex: 2, borderWidth: 1, textAlign: 'center' }}>Stone Weight</Text>
                        <Text style={{ flex: 2, borderWidth: 1, textAlign: 'center' }}>Maintenance Fee</Text>
                    </Block>
                    <Block row>
                        <Text style={{ flex: 1, borderWidth: 1, textAlign: 'center' }}>1</Text>
                        <Text style={{ flex: 2, borderWidth: 1, textAlign: 'center' }}>{product.name}</Text>
                        <Text style={{ flex: 2, borderWidth: 1, textAlign: 'center' }}>{product.requestType}</Text>
                        <Text style={{ flex: 2, borderWidth: 1, textAlign: 'center' }}>{product.gold}</Text>
                        <Text style={{ flex: 2, borderWidth: 1, textAlign: 'center' }}>{product.diamond}</Text>
                        <Text style={{ flex: 2, borderWidth: 1, textAlign: 'center' }}>{product.stone}</Text>
                        <Text style={{ flex: 2, borderWidth: 1, textAlign: 'center' }}>{product.price}</Text>
                    </Block>
                    <Block row style={styles.tableRow}>
                        <Text bold>Totally</Text>
                        <Text style={{marginLeft:theme.SIZES.BASE}}>{product.total}</Text>
                    </Block>
                    <Block row style={styles.tableRow}>
                        <Text bold>Discount</Text>
                        <Text style={{marginLeft:theme.SIZES.BASE}}>0</Text>
                    </Block>
                    <Block row style={styles.tableRow}>
                        <Text bold>Tax</Text>
                        <Text style={{marginLeft:theme.SIZES.BASE}}>{this.props.currentUser.tax ?? 0} %</Text>
                    </Block>
                    <Block row style={styles.tableRow}>
                        <Text bold>Totally with Tax</Text>
                        <Text style={{marginLeft:theme.SIZES.BASE}}>{
                            this.props.currentUser.tax ? 
                            product.total + this.props.currentUser.tax :
                            product.total
                        }</Text>
                    </Block>
                    <Block row style={{ paddingTop: theme.SIZES.BASE }}>
                        <Text style={{ flex: 1, paddingLeft: theme.SIZES.BASE }} >Note</Text>
                        <Text style={{ flex: 2, borderWidth: 1, marginRight: 5 }} > {product.note}</Text>
                        <Text style={{ flex: 2 }} >Receiver Signature</Text>
                        <Block style={styles.underline} />
                        <Text style={{ flex: 2 }} >Responsible Signature</Text>
                        <Block style={styles.underline} />
                    </Block>
                </TouchableOpacity>
            </ViewShot>
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
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PreShareScreen);

const styles = StyleSheet.create({
    container: {
        padding: theme.SIZES.BASE
    },
    bordered: {
        borderWidth: 1,
        width: theme.SIZES.BASE * 6,
        paddingLeft: 5
    },
    inputRow: {
        justifyContent: 'space-around',
        marginVertical: theme.SIZES.BASE
    },
    tableRow: {
        borderWidth: 1,
        paddingLeft: theme.SIZES.BASE
    },
    underline: {
        borderBottomWidth: 1,
        width: theme.SIZES.BASE * 6,
        flex: 2
    }
});