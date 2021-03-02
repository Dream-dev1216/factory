import React from 'react';
import { StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
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
import { nowTheme } from '../../../constants';
import { GetStatements, SetClient, AddMessage, SetTotalNotify } from "../../../redux/actions";
import { apiConfig } from '../../../redux/config'
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Loader from '../../Components/Loader';

import Header from '../../Components/Header'

class AdminHome extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
        }
    }


    componentDidMount = () => {
        this.props.getStatements(
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
                this.props.setTotalNotify( this.props.totalNotify++ );
                this.props.addMessage(messageObject.data, messageObject.receiver, this.props.route.name == 'Chat');
                break;
            default: break;
        }
    }

    render() {
        let statements = this.props.statements;
        return (
            <Block>
                <Loader loading={this.state.loading} />
                <Header title={this.props.currentUser.name} navigation={this.props.navigation} />
                <Block>
                    <Block style={styles.background} />
                    <Block center style={styles.containter}>
                        <Text h3 style={styles.title}>
                            Statements
                        </Text>
                    </Block>
                    <ScrollView
                        style={{ height: height / 2 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <Block row style={styles.rowItems}>
                            <Text h5 >Products In Process</Text>
                            <Block flex style={{ alignItems: 'flex-end' }}>
                                <Text h5 bold>{statements.process}</Text>
                            </Block>
                        </Block>
                        <Block row style={styles.rowItems}>
                            <Text h5 >Products Done</Text>
                            <Block flex style={{ alignItems: 'flex-end' }}>
                                <Text h5 bold>{statements.done}</Text>
                            </Block>
                        </Block>
                        <Block row style={styles.rowItems}>
                            <Text h5 >Gold Used</Text>
                            <Block flex style={{ alignItems: 'flex-end' }}>
                                <Text h5 bold>{statements.gold}g</Text>
                            </Block>
                        </Block>
                        <Block row style={styles.rowItems}>
                            <Text h5 >Diamond Used</Text>
                            <Block flex style={{ alignItems: 'flex-end' }}>
                                <Text h5 bold>{statements.diamond}g</Text>
                            </Block>
                        </Block>
                        <Block row style={styles.rowItems}>
                            <Text h5 >Stone Used</Text>
                            <Block flex style={{ alignItems: 'flex-end' }}>
                                <Text h5 bold>{statements.stone}g</Text>
                            </Block>
                        </Block>
                        <Block row style={styles.rowItems}>
                            <Text h5 >Managers</Text>
                            <Block flex style={{ alignItems: 'flex-end' }}>
                                <Text h5 bold>{statements.managers}</Text>
                            </Block>
                        </Block>
                        <Block row style={styles.rowItems}>
                            <Text h5 >Employees</Text>
                            <Block flex style={{ alignItems: 'flex-end' }}>
                                <Text h5 bold>{statements.employers}</Text>
                            </Block>
                        </Block>
                        <Block row style={styles.rowItems}>
                            <Text h5 >Customers</Text>
                            <Block flex style={{ alignItems: 'flex-end' }}>
                                <Text h5 bold>{statements.customers}</Text>
                            </Block>
                        </Block>
                    </ScrollView>
                </Block>
            </Block>
        );
    }
};
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        statements: state.statements,
        totalNotify: state.totalNotify,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        getStatements: (successcb) => GetStatements(dispatch, successcb),
        setClient: (client) => SetClient(dispatch, client),
        addMessage: (data, receiver, isChatting) => AddMessage(dispatch, data, receiver, isChatting),
        setTotalNotify: (totalNotify) => SetTotalNotify(dispatch, totalNotify),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminHome);

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
        paddingTop: height / 8,
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
    rowItems: {
        padding: theme.SIZES.BASE,
        marginHorizontal: theme.SIZES.BASE * 4
    }
});