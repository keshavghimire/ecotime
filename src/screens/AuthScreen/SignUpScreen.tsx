import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { globalstyles } from "../globalstyle";
import Feather from "react-native-vector-icons/Feather";
import { ActivityIndicator, Checkbox } from "react-native-paper";
import { useTogglePasswordVisibility } from "../../component/useTogglePasswordVisibility";
import { RadioButton } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import InputComponent from "../../component/InputComponent";
import SQLite from "react-native-sqlite-2";

export default function SignUpScreen({ navigation }) {
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();
  const [loginData, setLoginData] = React.useState({
    name: "",
    lastName: "",
    address: "",
    loginName: "",
    password: "",
    identityNumber: "",
    server: "",
    type: "company",
  });
  const [loginNameArray, setLoginNameArray] = React.useState([]);
  const [loading, setLoading] = useState(false);

  const getData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql("SELECT LoginName FROM Users", [], (tx, results) => {
          setLoginNameArray(results.rows._array);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  const checkLoginNameExist = () => {
    let exist = false;
    loginNameArray.map((item) => {
      if (item.LoginName == loginData.loginName) {
        exist = true;
      }
    });
    return exist;
  };

  const onSubmit = async () => {
    setLoading(true);
    if (loginData.name.length == 0) {
      alert("Please enter your name.");
      setLoading(false);
    } else if (loginData.lastName.length == 0) {
      setLoading(false);
      alert("Please enter your lastname.");
    } else if (loginData.address.length == 0) {
      setLoading(false);
      alert("Please enter your address.");
    } else if (loginData.loginName.length == 0) {
      setLoading(false);
      alert("Please enter your login name.");
    } else if (loginData.password.length == 0) {
      setLoading(false);
      alert("Please enter your password.");
    } else if (loginData.identityNumber.length == 0) {
      setLoading(false);
      alert("Please enter your identity number.");
    } else if (loginData.server.length == 0) {
      setLoading(false);
      alert("Please enter your server.");
    } else if (checkLoginNameExist()) {
      setLoading(false);
      alert("This login name is already exist.");
    } else {
      try {
        await db.transaction(async (tx) => {
          await tx.executeSql(
            "INSERT INTO Users (Name, LastName,Address,LoginName,Password,IdentityNumber,Type,Server ) VALUES (?,?,?,?,?,?,?,?)",
            [
              loginData.name,
              loginData.lastName,
              loginData.address,
              loginData.loginName,
              loginData.password,
              loginData.identityNumber,
              loginData.type,
              loginData.server,
            ]
          );
          Alert.alert("SIGN IN", "Account Created Successfully.", [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("Login"), setLoading(false);
                getData();
              },
            },
          ]);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getData();
    createTable();
  }, []);

  const db = SQLite.openDatabase(
    {
      name: "ecotime.db",
      location: "default",
    },
    () => {},
    (error) => {
      console.log(error);
    }
  );
  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "Users " +
          "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, LastName TEXT,Address TEXT,LoginName TEXT,Password TEXT,IdentityNumber TEXT,Type TEXT,Server TEXT );"
      );
    });
  };

  return (
    <View style={[globalstyles.container]}>
      <View
        style={{
          width: wp("100%"),
          height: hp("15%"),
          // backgroundColor: '#FFFFFF',
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <View
            style={{
              flexDirection: "row",
              marginTop: Platform.OS == "ios" ? 60 : 30,
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <Feather name={"chevron-left"} size={30} color="#FFF" />
            <Text
              style={[
                globalstyles.whitetext,
                globalstyles.font20,
                { fontWeight: "500" },
              ]}
            >
              Back
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: wp("100%"),
          height: hp("85%"),
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 30,
            }}
          >
            <Text
              style={[
                globalstyles.bluetext,
                globalstyles.font24,
                { fontWeight: "700" },
              ]}
            >
              Sign Up
            </Text>
            <Text
              style={[
                globalstyles.darkgrey,
                globalstyles.font16,
                { fontWeight: "500", marginTop: 10 },
              ]}
            >
              Kindly Enter Info To Create Account
            </Text>
            <Text
              style={[
                globalstyles.darkgrey,
                globalstyles.font14,
                { fontWeight: "500", marginTop: 10 },
              ]}
            >
              All data are stored locally and they are not shared.{"\n"} The
              information is used for the weekly reports.
            </Text>

            <View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "#616161",
                  alignSelf: "stretch",
                  marginTop: 20,
                  width: 100,
                }}
              />
            </View>
          </View>

          <View style={[globalstyles.maincontainer, { padding: 20 }]}>
            <View>
              <InputComponent
                height={50}
                label={"First Name"}
                // width={'90%'}
                placeholder="Bettina"
                value={loginData.name}
                onChangeText={(text) =>
                  setLoginData({ ...loginData, name: text })
                }
                width={undefined}
                keyboardType={undefined}
                secureTextEntry={undefined}
                multiline={undefined}
              />

              <InputComponent
                height={50}
                label={"Last Name"}
                // width={'90%'}
                placeholder="Zeilinger"
                value={loginData.lastName}
                onChangeText={(text) =>
                  setLoginData({ ...loginData, lastName: text })
                }
                width={undefined}
                keyboardType={undefined}
                secureTextEntry={undefined}
                multiline={undefined}
              />

              <InputComponent
                height={100}
                label={"Address"}
                multiline={true}
                // width={'90%'}
                placeholder="Elm Street 123, 75270 Dallas, TX,"
                width={undefined}
                keyboardType={undefined}
                value={loginData.address}
                onChangeText={(text) =>
                  setLoginData({ ...loginData, address: text })
                }
                secureTextEntry={undefined}
              />
            </View>

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Text
                style={[
                  globalstyles.darkgrey,
                  { textAlign: "center", fontWeight: "500" },
                ]}
              >
                Attention, the login data is only saved on the device. If you
                have forgotten the data, you must reinstall the application, all
                saved data will be lost.
              </Text>
            </View>
            <View>
              <InputComponent
                height={50}
                label={"Login Name"}
                // width={'90%'}
                placeholder="Betty"
                value={loginData.loginName}
                onChangeText={(text) =>
                  setLoginData({ ...loginData, loginName: text })
                }
                width={undefined}
                keyboardType={undefined}
                secureTextEntry={undefined}
                multiline={undefined}
              />
              <InputComponent
                height={50}
                label={"Password"}
                // width={'90%'}
                placeholder="6655"
                value={loginData.password}
                onChangeText={(text) =>
                  setLoginData({ ...loginData, password: text })
                }
                width={undefined}
                keyboardType={undefined}
                secureTextEntry={undefined}
                multiline={undefined}
              />
            </View>

            {/* radio btn  */}
            <View style={{ marginTop: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  // alignItems:'center',
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View>
                    {Platform.OS == "ios" && (
                      <View
                        style={{
                          marginTop: 8,
                          borderWidth: 2,
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          position: "absolute",
                          left: 8,
                          borderColor: "#9B9B9B",
                          borderRadius: 3,
                          top: 1,
                        }}
                      />
                    )}
                    <RadioButton
                      uncheckedColor="#9B9B9B"
                      color="#2981E1"
                      value="first"
                      status={
                        loginData.type === "company" ? "checked" : "unchecked"
                      }
                      onPress={() =>
                        setLoginData({ ...loginData, type: "company" })
                      }
                    />
                  </View>
                  <Text
                    style={[
                      globalstyles.darkgrey,
                      globalstyles.font14,
                      { marginTop: 0 },
                    ]}
                  >
                    Company Application
                  </Text>
                </View>
                <View
                  style={{
                    // marginLeft: 30,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View>
                    {Platform.OS == "ios" && (
                      <View
                        style={{
                          marginTop: 8,
                          borderWidth: 2,
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          position: "absolute",
                          left: 8,
                          borderColor: "#9B9B9B",
                          borderRadius: 3,
                          top: 1,
                        }}
                      />
                    )}
                    <RadioButton
                      uncheckedColor="#9B9B9B"
                      color="#2981E1"
                      value="second"
                      status={
                        loginData.type === "project" ? "checked" : "unchecked"
                      }
                      onPress={() =>
                        setLoginData({ ...loginData, type: "project" })
                      }
                    />
                  </View>
                  <Text
                    style={[
                      globalstyles.darkgrey,
                      globalstyles.font14,
                      { marginTop: 0 },
                    ]}
                  >
                    Project Capture
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <InputComponent
                height={50}
                label={"Identity No."}
                // width={'90%'}
                placeholder="123"
                value={loginData.identityNumber}
                onChangeText={(text) =>
                  setLoginData({ ...loginData, identityNumber: text })
                }
                width={undefined}
                keyboardType={undefined}
                secureTextEntry={undefined}
                multiline={undefined}
              />
              <InputComponent
                height={100}
                label={"Server"}
                multiline={true}
                // width={'90%'}
                placeholder="Please contact your administrator or the developer for the correct data."
                value={loginData.server}
                onChangeText={(text) =>
                  setLoginData({ ...loginData, server: text })
                }
                width={undefined}
                keyboardType={undefined}
                secureTextEntry={undefined}
              />
            </View>

            <View
              style={{
                backgroundColor: "#2981E1",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 40,
                padding: 20,
                borderRadius: 8,
              }}
            >
              <TouchableOpacity onPress={() => onSubmit()}>
                {!loading ? (
                  <Text
                    style={[
                      globalstyles.whitetext,
                      globalstyles.font15,
                      { fontWeight: "600" },
                    ]}
                  >
                    SUBMIT
                  </Text>
                ) : (
                  <ActivityIndicator size="small" color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                marginTop: 20,
                marginBottom: 30,
              }}
            >
              <Text style={[globalstyles.darkgrey, globalstyles.font15]}>
                Already have an account?
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text
                  style={[
                    globalstyles.bluetext,
                    globalstyles.font15,
                    { fontWeight: "600", textDecorationLine: "underline" },
                  ]}
                >
                  {" "}
                  Log In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
