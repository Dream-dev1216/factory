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

/* Define your class */
export default class Footer extends React.Component {
    render() {
        return (
            <Block row space="between">
                
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    support: {
        width: theme.SIZES.BASE * 4,
        height: theme.SIZES.BASE * 4,
        resizeMode: 'stretch',
    },
});