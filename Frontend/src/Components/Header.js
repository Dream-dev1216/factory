import React from 'react';
import {
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import {
    Block,
    Text,
    theme
} from 'galio-framework';
// connect to Redux state
import { connect } from "react-redux";
import { Images, nowTheme } from '../../constants';
import { apiConfig } from '../../redux/config';


/* Define your class */
class Header extends React.Component {
    render() {
        return (
            <Block row space="between" style={styles.container}>
                {!this.props.nologo && <TouchableOpacity
                    style={{borderWidth:2, borderRadius:nowTheme.SIZES.RADIUS}}
                    onPress={() => this.props.navigation.navigate('Profile')}
                >
                    <Image
                        source={this.props.currentUser.thumbnail ?
                            {uri:`${apiConfig.baseUrl}image/${this.props.currentUser.thumbnail}`} :
                            Images.Avatar
                        }
                        style={styles.Avatar}
                    />
                </TouchableOpacity>}
                <Text size={this.props.nologo ? 20 : 25} color={this.props.nologo ? 'white' : 'black'}>
                    {this.props.title}
                </Text>
            {this.props.back && <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            >
                <Image
                    source={Images.BackButton}
                    style={styles.BackButton}
                />
            </TouchableOpacity>}
                {!this.props.back && !this.props.noDrawer && <TouchableOpacity
                onPress={() => this.props.navigation.toggleDrawer()}
                >
                    <Image
                        source={Images.DrawerButton}
                        style={styles.DrawerButton}
                    />
                </TouchableOpacity>}
            </Block>
        );
    }
}
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
)(Header);

const styles = StyleSheet.create({
    container: {
        backgroundColor: nowTheme.COLORS.MAIN,
        padding: theme.SIZES.BASE,
        alignItems: 'center',
    },
    Avatar: {
        width: theme.SIZES.BASE * 4,
        height: theme.SIZES.BASE * 4,
        resizeMode: 'stretch',
        borderRadius: nowTheme.SIZES.RADIUS,
    },
    DrawerButton: {
        width: theme.SIZES.BASE * 3,
        height: theme.SIZES.BASE * 2,
        resizeMode: 'stretch',
    }
});