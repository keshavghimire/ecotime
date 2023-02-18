import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { globalstyles } from "../screens/globalstyle";

export default function InputComponent({
  label,
  width,
  height,
  placeholder,
  keyboardType,
  onChangeText,
  value,
  secureTextEntry,
  multiline,
}) {
  return (
    <View style={{ marginTop: 20 }}>
      <View>
        <Text
          style={[globalstyles.font16, { color: "#676565", fontWeight: "700" }]}
        >
          {label}
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <TextInput
          style={{
            height: height,
            // width: `${width}`,

            backgroundColor: "#fff",
            paddingLeft: 12,
            fontSize: 16,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#C2C2C2",
            color: "#000",
           }}
          containerStyle={{
            paddingLeft: 0,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
          }}
          //   inputContainerStyle={{
          //     height:60
          // }}

          onChangeText={onChangeText}
          // placeholder={placeholder}
          placeholderTextColor={"#B2B2B2"}
          keyboardType={keyboardType}
          value={value}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
        />
      </View>
    </View>
  );
}
