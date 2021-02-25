import React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
const Drawer = createDrawerNavigator();
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');
import { nowTheme } from '../../../constants';
// drawer
import CustomDrawerContent from '../Menu';

import EmployeeHome from './EmployeeHome'
import InboxScreen from '../InboxScreen'
import HistoryScreen from '../HistoryScreen'
import ChatScreen from '../ChatScreen'
import ProfileScreen from '../ProfileScreen'
import EditProductScreen from '../Manager/EditProductScreen'
import PreShareScreen from '../PreShareScreen'

export default function EmployeeStack(props) {
    return (
      <Drawer.Navigator
        style={{ flex: 1 }}
        drawerContent={props => <CustomDrawerContent {...props} />}
        drawerStyle={{
          backgroundColor: nowTheme.COLORS.WHITE,
        }}
        drawerContentOptions={{
          activeTintcolor: nowTheme.COLORS.WHITE,
          inactiveTintColor: nowTheme.COLORS.WHITE,
          activeBackgroundColor: "transparent",
          itemStyle: {
            width: width * 0.75,
            backgroundColor: "transparent",
            paddingVertical: 16,
            paddingHorizonal: 12,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            overflow: "hidden"
          },
          labelStyle: {
            fontSize: 18,
            marginLeft: 12,
            fontWeight: "normal",
            fontFamily: nowTheme.FONT
          }
        }}
        initialRouteName="EmployeeHome"
        drawerPosition='right'
      >
        <Drawer.Screen name="EmployeeHome" component={EmployeeHome} initialParams={{ params: props.route.params }}/>
        <Drawer.Screen name="Inbox" component={InboxScreen} />
        <Drawer.Screen name="History" component={HistoryScreen} />
        <Drawer.Screen name="Chat" component={ChatScreen}/>
        <Drawer.Screen name="Profile" component={ProfileScreen}/>
        <Drawer.Screen name="EditProduct" component={EditProductScreen}/>
        <Drawer.Screen name="PreShare" component={PreShareScreen}/>
      </Drawer.Navigator>
    );
  }