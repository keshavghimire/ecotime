import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { globalstyles } from "../globalstyle";
import { ActivityIndicator, Checkbox } from "react-native-paper";
import { useTogglePasswordVisibility } from "../../component/useTogglePasswordVisibility";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import InputComponent from "../../component/InputComponent";
import SQLite from "react-native-sqlite-2";

export default function LoginScreen({ navigation }) {
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = React.useState({
    loginName: "",
    password: "",
  });
  const [loginNameArray, setLoginNameArray] = React.useState([]);

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData();
    });

    return unsubscribe;
  }, [navigation]);
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
  const getData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT LoginName, Password,Name,LastName FROM Users",
          [],
          (tx, results) => {
            setLoginNameArray(results.rows._array);
            console.log("called", results.rows._array);
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  const checkLoginUserExist = () => {
    getData();
    setLoading(true);
    let loginName = loginData.loginName;
    let password = loginData.password;
    let check = false;
    loginNameArray.map((item) => {
      if (loginName === item.LoginName) {
        check = true;
        if (password === item.Password) {
          navigation.navigate("Home", { params: item });
          setLoading(false);
        } else {
          alert("Password is incorrect");
          setLoading(false);
        }
      }
    });
    if (check === false) {
      alert("User doesn't Exist");
      setLoading(false);
    }
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
        {loginNameArray.length < 1 && (
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "flex-end",
              padding: 20,
            }}
          >
            <Image
              style={{
                width: 50,
                height: 30,
                resizeMode: "stretch",
                alignSelf: "flex-end",
                justifyContent: "flex-end",
              }}
              source={require("../../../assets/Image/Login/germany.png")}
            />
            <Image
              style={{
                width: 50,
                height: 30,
                resizeMode: "stretch",
                alignSelf: "flex-end",
                justifyContent: "flex-end",
                marginLeft: 12,
              }}
              source={require("../../../assets/Image/Login/british.png")}
            />
          </View>
        )}
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
            Log In
          </Text>
          <Text
            style={[
              globalstyles.darkgrey,
              globalstyles.font16,
              { fontWeight: "500", marginTop: 10 },
            ]}
          >
            Kindly Enter Info To Log Into Account
          </Text>
        </View>

        <View style={[globalstyles.maincontainer, { padding: 20 }]}>
          <InputComponent
            height={50}
            label={"Username"}
            // width={'90%'}
            placeholder="Bettina"
            value={loginData.loginName}
            onChangeText={(text) => {
              setLoginData({ ...loginData, loginName: text });
            }}
            width={undefined}
            keyboardType={undefined}
            secureTextEntry={undefined}
            multiline={undefined}
          />

          <View>
            <InputComponent
              height={50}
              label={"Password"}
              secureTextEntry={passwordVisibility}
              // width={'90%'}
              placeholder="Type password"
              width={undefined}
              keyboardType={undefined}
              value={loginData.password}
              onChangeText={(text) => {
                setLoginData({ ...loginData, password: text });
              }}
              multiline={undefined}
            />
            <Pressable
              style={{
                position: "absolute",
                right: 15,
                top: 65,
              }}
              onPress={handlePasswordVisibility}
            >
              <MaterialCommunityIcons
                name={rightIcon}
                size={22}
                color="#B2B2B2"
              />
            </Pressable>
          </View>

          <TouchableOpacity onPress={() => !loading && checkLoginUserExist()}>
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
            </View>
          </TouchableOpacity>
          {loginNameArray.length < 1 && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                marginTop: 20,
              }}
            >
              <Text style={[globalstyles.darkgrey, globalstyles.font15]}>
                If you have no account?
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text
                  style={[
                    globalstyles.bluetext,
                    globalstyles.font15,
                    { fontWeight: "600", textDecorationLine: "underline" },
                  ]}
                >
                  {" "}
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
