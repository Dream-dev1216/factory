import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import {
    Block,
    Button,
    Text,
    Input,
    theme,
} from 'galio-framework';
import { Dropdown } from 'react-native-material-dropdown';
import {
    MenuProvider,
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';

const { width, height } = Dimensions.get('screen');
// connect to Redux state
import { connect } from "react-redux";
import { Images, nowTheme } from '../../constants';
import { GetHistory } from "../../redux/actions";
import { apiConfig } from '../../redux/config'
import Header from '../Components/Header'
import Loader from '../Components/Loader';

const { Popover } = renderers

class HistoryScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filterKey: '',
            searchKey: '',
            today: new Date(),
            weekNumber: this.getNumberOfWeek(new Date()),
            loading: true,
        }
    }

    componentDidMount = () => {
        this.props.getHistory(
            () => this.setState({ loading: false })
        );
    }

    getDateFormate = (str) => {
        let d = new Date(str);
        return d.getFullYear() + '.' + (parseInt(d.getMonth()) + 1) + '.' + d.getDate();
    }

    getNumberOfWeek = (d) => {
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    renderHistory = () => {
        return this.props.history
            .filter(hist => hist.customer.search(this.state.searchKey) >= 0 || hist.bill.toString().search(this.state.searchKey) >= 0)
            .filter(hist => {
                const updatedAt = new Date(hist.updatedAt);
                switch (this.state.filterKey) {
                    case 'Today':
                        return updatedAt.getDate() == this.state.today.getDate() &&
                            updatedAt.getMonth() == this.state.today.getMonth() &&
                            updatedAt.getFullYear() == this.state.today.getFullYear()
                    case 'Week':
                        return this.getNumberOfWeek(updatedAt) == this.state.weekNumber
                    case 'Month':
                        return updatedAt.getMonth() == this.state.today.getMonth() &&
                            updatedAt.getFullYear() == this.state.today.getFullYear()
                    case 'Year':
                        return updatedAt.getFullYear() == this.state.today.getFullYear()

                    default:
                        return true;
                }
            })
            .map(hist =>
                <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }} key={hist._id}>
                    <MenuTrigger>
                        <Block>
                            <Text h6 style={styles.date}>{this.getDateFormate(hist.updatedAt)}</Text>
                            <Block row style={styles.row} flex>
                                <Block center style={{ borderWidth: 1, borderRadius: nowTheme.SIZES.RADIUS }}>
                                    <Image
                                        source={hist.thumbnail ? { uri: `${apiConfig.baseUrl}image/${hist.thumbnail}` } : null}
                                        style={styles.Avatar}
                                    />
                                </Block>
                                <Block flex={6} style={{ padding: theme.SIZES.BASE }}>
                                    <Block row style={{ justifyContent: 'space-between' }} >
                                        <Text bold h5>{hist.customer}</Text>
                                        <Text h6>Bill No.{hist.bill}</Text>
                                    </Block>
                                    <Block row style={{ justifyContent: 'space-between' }}>
                                        <Text p>{hist.name}</Text>
                                        <Text p>{hist.requestType}</Text>
                                        <Text p>{hist.employer}</Text>
                                    </Block>
                                </Block>
                                <Block center flex={2}>
                                    <Text h5 bold>{hist.price}</Text>
                                </Block>
                            </Block>
                        </Block>
                    </MenuTrigger>
                    <MenuOptions>
                        <Button round size='small' color='success'
                            onPress={() => this.props.navigation.navigate('PreShare', { product: hist })}
                        >Share</Button>
                        <Button round size='small'
                            onPress={() => this.props.navigation.navigate('EditProduct', { product: hist, readonly: true })}
                        >Detail</Button>
                    </MenuOptions>
                </Menu>
            )
    }

    render() {
        let filterData = [{
            value: 'Today',
        }, {
            value: 'Week',
        }, {
            value: 'Month',
        }, {
            value: 'Year',
        }, {
            value: 'All',
        }];
        return (
            <MenuProvider>
                <Loader loading={this.state.loading} />
                <Header title={this.props.currentUser.name} navigation={this.props.navigation} />
                <Block>
                    <Block style={styles.background} />
                    <Block center style={styles.containter}>
                        <Text h3 style={styles.title}>
                            History
                        </Text>
                    </Block>
                </Block>
                <Block style={{ padding: theme.SIZES.BASE }}>
                    <Input
                        style={styles.inputBox} color={nowTheme.COLORS.MAIN} label="Search"
                        labelStyles={styles.inputLabel} fontSize={20}
                        onChangeText={(value) => this.setState({ searchKey: value })}
                        placeholder='Search by Customer Name, Bill No.'
                        placeholderTextColor={theme.COLORS.PLACEHOLDER}
                    />
                    <Dropdown
                        label='Filter by'
                        textColor={nowTheme.COLORS.MAIN}
                        labelFontSize={16}
                        fontSize={20}
                        data={filterData}
                        overlayStyle={{ backgroundColor: '#cccccccc' }}
                        pickerStyle={{ height: 250 }}
                        onChangeText={(value) => this.setState({ filterKey: value })}
                    />
                    <ScrollView style={styles.scrollContainer}>
                        {this.renderHistory()}
                    </ScrollView>
                </Block>
            </MenuProvider>
        );
    }
};
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        history: state.history,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        getHistory: (successcb) => GetHistory(dispatch, successcb),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HistoryScreen);

const styles = StyleSheet.create({
    background: {
        width,
        height: height / 10,
        position: 'absolute',
        backgroundColor: nowTheme.COLORS.MAIN,
        top: 0
    },
    containter: {
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
    inputLabel: {
        fontSize: 20,
        fontFamily: nowTheme.FONT
    },
    inputBox: {
        borderRadius: theme.SIZES.BORDER_RADIUS * 4,
    },
    Avatar: {
        width: theme.SIZES.BASE * 3,
        height: theme.SIZES.BASE * 3,
        resizeMode: 'stretch',
        borderRadius: nowTheme.SIZES.RADIUS,
    },
    row: {
        justifyContent: 'space-between',
        borderRadius: theme.SIZES.CARD_BORDER_RADIUS * 5,
        borderWidth: theme.SIZES.CARD_BORDER_WIDTH,
        paddingHorizontal: theme.SIZES.BASE,
    },
    scrollContainer: {
        height: height * 0.4
    },
    date: {
        marginTop: theme.SIZES.BASE,
        marginLeft: theme.SIZES.BASE,
        color: theme.COLORS.PLACEHOLDER
    },

});