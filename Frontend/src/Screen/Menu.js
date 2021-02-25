import React from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Icon,
  Linking
} from "react-native";
import { Block, Text, theme } from "galio-framework";
// connect to Redux state
import { connect } from "react-redux";

import { Images, nowTheme, Roles } from "../../constants";
const { width, height } = Dimensions.get('screen');

class CustomDrawerContent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }


  render() {
    return (
      <Block flex style={styles.container}>
        <Block>
          <Block style={styles.iconRound} center>
            <Image style={styles.logo} source={Images.Logo} />
          </Block>
          <Block style={styles.divide} />
          {this.props.currentUser.role == Roles.ADMIN &&
            <Block>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Profile')}
              >
                <Block row style={styles.row}>
                  <Block flex={8} center>
                    <Text h4 style={{ alignItems: 'center' }}>My Profile</Text>
                  </Block>
                  <Block flex={1} style={{ alignItems: 'flex-end' }}>
                    <Block style={styles.iconRound}>
                      <Image
                        source={Images.user}
                        style={styles.icon}
                      />
                    </Block>
                  </Block>
                </Block>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Managers')}
              >
                <Block row style={styles.row}>
                  <Block flex={8} center>
                    <Text h4 style={{ alignItems: 'center' }}>All Managers</Text>
                  </Block>
                  <Block flex={1} style={{ alignItems: 'flex-end' }}>
                    <Block style={styles.iconRound}>
                      <Image
                        source={Images.user}
                        style={styles.icon}
                      />
                    </Block>
                  </Block>
                </Block>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Employees')}
              >
                <Block row style={styles.row}>
                  <Block flex={8} center>
                    <Text h4 style={{ alignItems: 'center' }}>All Employees</Text>
                  </Block>
                  <Block flex={1} style={{ alignItems: 'flex-end' }}>
                    <Block style={styles.iconRound}>
                      <Image
                        source={Images.user}
                        style={styles.icon}
                      />
                    </Block>
                  </Block>
                </Block>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Customers')}
              >
                <Block row style={styles.row}>
                  <Block flex={8} center>
                    <Text h4 style={{ alignItems: 'center' }}>All Customers</Text>
                  </Block>
                  <Block flex={1} style={{ alignItems: 'flex-end' }}>
                    <Block style={styles.iconRound}>
                      <Image
                        source={Images.user}
                        style={styles.icon}
                      />
                    </Block>
                  </Block>
                </Block>
              </TouchableOpacity>
            </Block>
          }
          {this.props.currentUser.role == Roles.MANAGER &&
            <Block>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('EditProduct', {product:null, readonly: false })}
              >
                <Block row style={styles.row}>
                  <Block flex={8} center>
                    <Text h4 style={{ alignItems: 'center' }}>New Product</Text>
                  </Block>
                  <Block flex={1} style={{ alignItems: 'flex-end' }}>
                    <Block style={styles.iconRound}>
                      <Image
                        source={Images.checklist}
                        style={styles.icon}
                      />
                    </Block>
                  </Block>
                </Block>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Hold')}
              >
                <Block row style={styles.row}>
                  <Block flex={8} center>
                    <Text h4 style={{ alignItems: 'center' }}>Hold</Text>
                  </Block>
                  <Block flex={1} style={{ alignItems: 'flex-end' }}>
                    <Block style={styles.iconRound}>
                      <Image
                        source={Images.hand}
                        style={styles.icon}
                      />
                    </Block>
                  </Block>
                </Block>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Processing')}
              >
                <Block row style={styles.row}>
                  <Block flex={8} center>
                    <Text h4 style={{ alignItems: 'center' }}>Processing</Text>
                  </Block>
                  <Block flex={1} style={{ alignItems: 'flex-end' }}>
                    <Block style={styles.iconRound}>
                      <Image
                        source={Images.process}
                        style={styles.icon}
                      />
                    </Block>
                  </Block>
                </Block>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Done')}
              >
                <Block row style={styles.row}>
                  <Block flex={8} center>
                    <Text h4 style={{ alignItems: 'center' }}>Products Done</Text>
                  </Block>
                  <Block flex={1} style={{ alignItems: 'flex-end' }}>
                    <Block style={styles.iconRound}>
                      <Image
                        source={Images.checklist}
                        style={styles.icon}
                      />
                    </Block>
                  </Block>
                </Block>
              </TouchableOpacity>
            </Block>
          }
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('History')}
          >
            <Block row style={styles.row}>
              <Block flex={8} center>
                <Text h4 style={{ alignItems: 'center' }}>History</Text>
              </Block>
              <Block flex={1} style={{ alignItems: 'flex-end' }}>
                <Block style={styles.iconRound}>
                  <Image
                    source={Images.checklist}
                    style={styles.icon}
                  />
                </Block>
              </Block>
            </Block>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Inbox')}
          >
            <Block row style={styles.row}>
              <Block flex={8} center>
                <Text h4 style={{ alignItems: 'center' }}>Inbox</Text>
              </Block>
              <Block flex={1} style={{ alignItems: 'flex-end' }}>
                <Block style={styles.iconRound}>
                  <Image
                    source={Images.InboxIcon}
                    style={styles.icon}
                  />
                </Block>
              </Block>
            </Block>
          </TouchableOpacity>
        </Block>
        <Block>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate(this.props.currentUser.role + 'Home')}
          >
            <Block row style={styles.row}>
              <Block flex={8} center>
                <Text h4 style={{ alignItems: 'center' }} bold >Home</Text>
              </Block>
              <Block flex={1} style={{ alignItems: 'flex-end' }}>
                <Block style={styles.iconRound}>
                  <Image
                    source={Images.Home}
                    style={styles.icon}
                  />
                </Block>
              </Block>
            </Block>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Block row style={styles.row}>
              <Block flex={8} center>
                <Text h4 style={{ alignItems: 'center' }} bold>Logout</Text>
              </Block>
              <Block flex={1} style={{ alignItems: 'flex-end' }}>
                <Block style={styles.iconRound}>
                  <Image
                    source={Images.LogoutIcon}
                    style={styles.icon}
                  />
                </Block>
              </Block>
            </Block>
          </TouchableOpacity>
        </Block>
      </Block >
    );
  }
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: theme.SIZES.BASE * 2,
    justifyContent: 'space-between',
  },
  logo: {
    height: theme.SIZES.BASE * 6,
    width: theme.SIZES.BASE * 6,
    resizeMode: 'stretch',
    borderRadius: nowTheme.SIZES.RADIUS
  },
  icon: {
    height: theme.SIZES.BASE * 2,
    width: theme.SIZES.BASE * 2,
    resizeMode: 'stretch',
  },
  divide: {
    height: 3,
    width: width * 0.5,
    backgroundColor: theme.COLORS.BLACK,
    marginTop: theme.SIZES.BASE
  },
  iconRound: {
    borderWidth: 1,
    borderRadius: nowTheme.SIZES.RADIUS,
    padding: theme.SIZES.BASE / 2,
    zIndex: 1
  },
  row: {
    paddingTop: theme.SIZES.BASE,
  },
});

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
)(CustomDrawerContent);
