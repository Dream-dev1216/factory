// Server Client
import { Roles } from '../constants';
import Client from './api';

// allows a new user to sign up for an account and returns
// user object and token to store in state/browser
// Used in LoginSignup/Signup component
export function Login(dispatch, name, password, successcb, errorcb) {
    Client.get(`users/${name}/${password}`)
        .then(async res => {
            if (res.status == 200) {
                // set user info in Redux state
                dispatch({
                    type: "CURRENT_USER",
                    payload: Object.assign({}, {
                        id: res.data._id
                    }, {
                        name: res.data.name
                    }, {
                        birth: res.data.birth
                    }, {
                        phone: res.data.phone
                    }, {
                        birth: res.data.birth
                    }, {
                        address: res.data.address
                    }, {
                        password: res.data.password
                    }, {
                        email: res.data.email
                    }, {
                        thumbnail: res.data.thumbnail
                    }, {
                        role: res.data.role
                    })
                });
            }
            if (successcb) successcb(res);
        })
        .catch(error => {
            console.log("login error => ", error);
            if (errorcb) errorcb(error);
        });
}


export function Register(dispatch, req, isSignUp, successcb, errorcb) {
    Client.post(`users/`, req)
        .then(async res => {
            if (res.status == 200 && isSignUp) {
                console.log("success register")
                // set user info in Redux state
                dispatch({
                    type: "CURRENT_USER",
                    payload: Object.assign({}, {
                        id: res.data._id
                    }, {
                        name: res.data.name
                    }, {
                        birth: res.data.birth
                    }, {
                        phone: res.data.phone
                    }, {
                        birth: res.data.birth
                    }, {
                        address: res.data.address
                    }, {
                        password: res.data.password
                    }, {
                        email: res.data.email
                    }, {
                        thumbnail: res.data.thumbnail
                    }, {
                        role: res.data.role
                    })
                });
            }
            if (successcb) successcb();
        })
        .catch(error => {
            console.log("register error => ", error);
            if (errorcb) errorcb();
        });
}
export function UpdateUser(dispatch, id, req, isOwn, successcb, errorcb) {
    Client.patch(`users/${id}`, req)
        .then(async res => {
            if (res.status == 200 && isOwn) {
                // set user info in Redux state
                dispatch({
                    type: "CURRENT_USER",
                    payload: Object.assign({}, {
                        id: res.data._id
                    }, {
                        name: res.data.name
                    }, {
                        birth: res.data.birth
                    }, {
                        phone: res.data.phone
                    }, {
                        birth: res.data.birth
                    }, {
                        address: res.data.address
                    }, {
                        password: res.data.password
                    }, {
                        email: res.data.email
                    }, {
                        thumbnail: res.data.thumbnail
                    }, {
                        role: res.data.role
                    })
                });
            }
            if (successcb) successcb();
        })
        .catch(error => {
            console.log("UpdateUser error => ", error);
            if (errorcb) errorcb();
        });
}

export function GetManagers(dispatch, successcb) {
    Client.get(`users/managers`)
        .then(async res => {
            if (res.status == 200) {
                // set managers info in Redux state
                dispatch({
                    type: "SET_MANAGERS",
                    payload: res.data
                });
                if (successcb) successcb();
            }
        })
        .catch(error => {
            console.log("GetManagers error => ", error);
        });
}
export function GetEmployers(dispatch, successcb) {
    Client.get(`users/employers`)
        .then(async res => {
            if (res.status == 200) {
                // set employers info in Redux state
                dispatch({
                    type: "SET_EMPLOYERS",
                    payload: res.data
                });
                if (successcb) successcb(res.data);
            }
        })
        .catch(error => {
            console.log("GetEmployers error => ", error);
        });
}
export function GetCustomers(dispatch, successcb) {
    Client.get(`users/customers`)
        .then(async res => {
            if (res.status == 200) {
                // set customers info in Redux state
                dispatch({
                    type: "SET_CUSTOMERS",
                    payload: res.data
                });
                if (successcb) successcb(res.data);
            }
        })
        .catch(error => {
            console.log("GetCustomers error => ", error);
        });
}

export function DeleteUser(dispatch, id, successcb) {
    Client.post(`users/delete/${id}`)
        .then(async res => {
            if (res.status == 200)
                if (successcb) successcb()
        })
        .catch(error => {
            console.log("delete user error => ", error);
        });
}

/************************ Products *************************************/
export function GetNewBill(dispatch, successcb) {
    Client.get('products/newBill')
        .then(async res => {
            if (res.status == 200) {
                // set user info in Redux 
                dispatch({
                    type: "SET_NEW_BILL",
                    payload: res.data
                })
                console.log("get new Bill success");
                if (successcb) successcb(res.data);
            }
        })
        .catch(error => {
            console.log("get new Bill error => ", error);
        });
}

export function SaveProduct(id, req, successcb) {
    if (id)
        Client.patch(`products/${id}`, req)
            .then(async res => {
                if (res.status == 200) {
                    console.log("save product successfully")
                    if (successcb) successcb(res.data);
                }
            })
            .catch(error => {
                console.log("save product error => ", error);
            });
    else
        Client.post(`products`, req)
            .then(async res => {
                if (res.status == 200) {
                    console.log("save product successfully")
                    if (successcb) successcb(res.data);
                }
            })
            .catch(error => {
                console.log("save product error => ", error);
            });
}

export function GetProducts(dispatch, successcb) {
    Client.get(`products/`)
        .then(async res => {
            if (res.status == 200) {
                dispatch({
                    type: "SET_PRODUCTS",
                    payload: res.data
                });
                if (successcb) successcb();
            }
        })
        .catch(error => {
            console.log("get products error => ", error);
        });
}
export function UpdateProduct(dispatch, id, req, successcb) {
    Client.patch(`products/${id}`, req)
        .then(async res => {
            if (res.status == 200) {
                dispatch({
                    type: "SET_PRODUCTS",
                    payload: res.data
                });
                if (successcb) successcb();
            }
        })
        .catch(error => {
            console.log("update product error => ", error);
            if (errorcb) errorcb();
        });
}
export function DeleteProduct(dispatch, id) {
    Client.post(`products/delete/${id}`)
        .then(async res => {
            if (res.status == 200) {
                // set managers info in Redux state
                dispatch({
                    type: "SET_PRODUCTS",
                    payload: res.data
                });
            }
        })
        .catch(error => {
            console.log("delete product error => ", error);
        });
}
/***********************************************************************/
/************************ Notifications *************************************/
export function GetNotifications(dispatch, userId, successcb) {
    Client.get(`notifications/${userId}`)
        .then(async res => {
            if (res.status == 200) {
                dispatch({
                    type: "SET_NOTIFICATIONS",
                    payload: res.data
                });
                if (successcb) successcb();
            }
        })
        .catch(error => {
            console.log("get notifications error => ", error);
        });
}

export function ClearNotification(dispatch, receiver, sender, successcb) {
    Client.patch(`notifications/${receiver}/${sender}`)
        .then(async res => {
            if (res.status == 200) {
                Client.get(`notifications/${receiver}`)
                    .then(async res => {
                        if (res.status == 200) {
                            dispatch({
                                type: "SET_NOTIFICATIONS",
                                payload: res.data
                            });
                            if (successcb) successcb();
                        }
                    })
                    .catch(error => {
                        console.log("get notifications error during clear => ", error);
                    });
            }
        })
        .catch(error => {
            console.log("clear notifications error => ", error);
            if (errorcb) errorcb();
        });
}
/****************************************************************************/
/***************************** Chats ****************************************/
export function GetMessages(dispatch, sender, receiver) {
    Client.get(`chats/${sender}/${receiver}`)
        .then(async res => {
            if (res.status == 200) {
                dispatch({
                    type: "SET_MESSAGES",
                    payload: res.data
                });
            }
        })
        .catch(error => {
            console.log("GetMessages error => ", error);
        });
}
export function SendMessage(dispatch, sender, receiver, newMessage, client) {
    return Client.post(`chats/`, {
        sender: sender,
        receiver: receiver,
        content: newMessage[0].text,
    })
        .then(async res => {
            if (res.status == 200) {
                dispatch({
                    type: "APPEND_MESSAGE",
                    payload: res.data
                });
                if (client)
                    client.send(JSON.stringify({
                        ...{},
                        type: "message",
                        data: res.data,
                        receiver
                    }));
                Client.post(`notifications/`, {
                    sender: sender,
                    receiver: receiver,
                })
            }
            return res
        })
        .catch(error => {
            console.log("SendMessage error => ", error);
        });
}
/****************************************************************************/
/****************************** History *************************************/
export function GetHistory(dispatch, successcb) {
    Client.get(`history/`)
        .then(async res => {
            if (res.status == 200) {
                dispatch({
                    type: "SET_HISTORY",
                    payload: res.data
                });
                if(successcb) successcb();
            }
        })
        .catch(error => {
            console.log("GetHistory error => ", error);
        });
}
/****************************************************************************/
/***************************** Pending **************************************/
export function PendingUser(dispatch, userId, pending, successcb) {
    Client.patch(`users/pending/${userId}/${pending}`)
        .then(async res => {
            if (res.status == 200) {
                if (successcb) successcb();
                console.log("pending user successfully.")
            }
        })
        .catch(error => {
            console.log("pending user error => ", error);
        });
}
/****************************************************************************/
/**************************** Statements ************************************/
export function GetStatements(dispatch, successcb) {
    Client.get(`statements`)
        .then(res => {
            if (res.status == 200) {
                dispatch({
                    type: "SET_STATEMENTS",
                    payload: res.data
                });
                console.log("get statements successfully.")
                if (successcb) successcb();
            }
        })
        .catch(error => {
            console.log("get statements error => ", error);
        });
}
/**************************** Socket *****************************************/
export function SetClient(dispatch, client) {
    dispatch({
        type: "SET_CLIENT",
        payload: client
    });
}
export function AddMessage(dispatch, _data, receiver, isChatting) {
    dispatch({
        type: "APPEND_MESSAGE",
        payload: _data
    });
    // getNotification
    if (!isChatting)
        Client.get(`notifications/${receiver}`)
            .then(async res => {
                if (res.status == 200) {
                    dispatch({
                        type: "SET_NOTIFICATIONS",
                        payload: res.data
                    });
                }
            })
            .catch(error => {
                console.log("get notifications error => ", error);
            });
}



















export function IsExsitUser(name) {
    return Client.get(`users/${name}`)
}

export function SetCurrentUser(dispatch, user) {
    dispatch({
        type: "CURRENT_USER",
        payload: user
    });
}


export function registerTag(dispatch, nfc_id, label, user_id, successcb, errorcb) {
    Client.post(`?query=saveTag`, {
        nfc_id: nfc_id,
        label: label,
        user_id: user_id,
    })
        .then(async res => {
            if (res.status == 200 && res.data.error == 0) {
                console.log("registerTag success")
                if (successcb) successcb();
            }
        })
        .catch(error => {
            console.log("registerTag error => ", error);
        });
}
export function getRoutes(dispatch, user_id, successcb, errorcb) {
    Client.post(`?query=getRoutes`, {
        user_id: user_id,
    })
        .then(async res => {
            if (res.status == 200 && res.data.error == 0) {
                console.log("registerTag success")
                if (successcb) successcb();
            }
        })
        .catch(error => {
            console.log("registerTag error => ", error);
        });
}
export function RequestFriend(dispatch, requesterphone, receiverphone, requestcontent, successcb) {
    Client.post(`friends/`, {
        requesterphone: requesterphone,
        receiverphone: receiverphone,
        requestcontent: requestcontent,
    })
        .then(async res => {
            if (res.status == 200) {
                dispatch({
                    type: "SET_FRIENDS",
                    payload: res.data.friends.friends
                });
                console.log("Request Friend success")
                if (successcb) successcb();
            }
        })
        .catch(error => {
            console.log("RequestFriend error => ", error);
        });
}

export function AcceptFriend(dispatch, requesterphone, receiverphone, successcb) {
    Client.put(`friends/`, {
        requesterphone: requesterphone,
        receiverphone: receiverphone,
    })
        .then(async res => {
            if (res.status == 200) {
                dispatch({
                    type: "SET_FRIENDS",
                    payload: res.data.friends.friends
                });
                console.log("Request Friend success")
                successcb();
            }
        })
        .catch(error => {
            console.log("RequestFriend error => ", error);
        });
}

export function DeleteChatHistory(myphone, otherphone) {
    Client.delete(`chats/${myphone}/${otherphone}`).then(() => { })
        .catch((error) => {
            console.log("Error");
        })
}
export function SetChatMan(dispatch, man) {
    dispatch({
        type: "SET_CHAT_MAN",
        payload: man
    });
}

export function UpdateNotification(sender, receiver, isNotify, isSticky) {
    let noti = {
        sender,
        receiver,
        isSticky,
    }
    if (isNotify != undefined) {
        noti = Object.assign({}, noti, { isNotify });
    }
    if (isSticky != undefined) {
        noti = Object.assign({}, noti, { isSticky });
    }
    return Client.put("notifications/", noti)
}

export function GetNotification(sender, receiver) {
    return Client.get(`notifications/${sender}/${receiver}`);
}

export function SetFilterText(dispatch, filterText) {
    dispatch({
        type: "SET_FILTER",
        payload: filterText
    });
}

export function AddFriend(dispatch, sender, receiver) {
    GetNotification(sender, receiver).then(({ data }) => {
        dispatch({
            type: "APPEND_NOTIFICATION",
            payload: data
        })
    })
}
