import React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
const Drawer = createDrawerNavigator();
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');
import { nowTheme } from '../../../constants';
// drawer
import CustomDrawerContent from '../Menu';

import AdminHome from './AdminHome'
import InboxScreen from '../InboxScreen'
import HistoryScreen from '../HistoryScreen'
import ChatScreen from '../ChatScreen'
import ProfileScreen from '../ProfileScreen'
import ManagersScreen from './ManagersScreen'
import EditManagerScreen from './EditManagerScreen'
import EmployeesScreen from './EmployeesScreen'
import EditEmployeeScreen from './EditEmployeeScreen'
import CustomersScreen from './CustomersScreen'
import EditCustomerScreen from './EditCustomerScreen'
import EditProductScreen from '../Manager/EditProductScreen'
import PreShareScreen from '../PreShareScreen'

export default function AdminStack(props) {
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
        initialRouteName="AdminHome"
        drawerPosition='right'
      >
        <Drawer.Screen name="AdminHome" component={AdminHome} initialParams={{ params: props.route.params }}/>
        <Drawer.Screen name="Inbox" component={InboxScreen} />
        <Drawer.Screen name="History" component={HistoryScreen} />
        <Drawer.Screen name="Chat" component={ChatScreen}/>
        <Drawer.Screen name="Profile" component={ProfileScreen}/>
        <Drawer.Screen name="Managers" component={ManagersScreen}/>
        <Drawer.Screen name="EditManager" component={EditManagerScreen}/>
        <Drawer.Screen name="Employees" component={EmployeesScreen}/>
        <Drawer.Screen name="EditEmployer" component={EditEmployeeScreen}/>
        <Drawer.Screen name="Customers" component={CustomersScreen}/>
        <Drawer.Screen name="EditCustomer" component={EditCustomerScreen}/>
        <Drawer.Screen name="EditProduct" component={EditProductScreen}/>
        <Drawer.Screen name="PreShare" component={PreShareScreen}/>
      </Drawer.Navigator>
    );
  }