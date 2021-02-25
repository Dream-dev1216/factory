import React from 'react';
import { StyleSheet, I18nManager } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GalioProvider } from "galio-framework";
import { ModalPortal } from 'react-native-modals';
import Orientation from 'react-native-orientation';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import userReducer from './redux/reducer';
import Loader from './src/Components/Loader';
import { nowTheme, Roles } from "./constants";

import LoginScreen from './src/Screen/LoginScreen';
import RegisterScreen from './src/Screen/RegisterScreen';
import EmployeeStack from './src/Screen/Employee/EmployeeStack';
import ManagerStack from './src/Screen/Manager/ManagerStack';
import AdminStack from './src/Screen/Admin/AdminStack';

const store = createStore(userReducer);
const translationGetters = {
    ar: () => require("./src/translations/ar.json"),
    en: () => require("./src/translations/en.json"),
};

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
);

const Stack = createStackNavigator();

const setI18nConfig = () => {
    const fallback = { languageTag: "en", isRTL: false };
    const { languageTag, isRTL } = fallback;

    translate.cache.clear();
    I18nManager.forceRTL(isRTL);
    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag;
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
        setI18nConfig();
    }

    componentDidMount() {
        this.setState({ loading: false });
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
        Orientation.lockToPortrait();
    }

    componentWillUnmount() {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
    }

    handleLocalizationChange = () => {
        setI18nConfig();
        this.forceUpdate();
    };

    render() {
        return (
            <Provider store={store}>
                <Loader loading={this.state.loading} />
                <NavigationContainer>
                    <GalioProvider theme={nowTheme}>
                        <Stack.Navigator initialRouteName="Login">
                            <Stack.Screen
                                name="Login"
                                component={LoginScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="Register"
                                component={RegisterScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name={Roles.EMPLOYEE}
                                component={EmployeeStack}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name={Roles.MANAGER}
                                component={ManagerStack}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name={Roles.ADMIN}
                                component={AdminStack}
                                options={{ headerShown: false }}
                            />
                        </Stack.Navigator>
                    </GalioProvider>
                </NavigationContainer>
                <ModalPortal/>
            </Provider>
        );
    }
}

export default App;
