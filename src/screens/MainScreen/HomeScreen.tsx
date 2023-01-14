import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  FlatList,
  ScrollView,
  LogBox,
  Platform
} from 'react-native';
import React, {useState, useEffect, PureComponent} from 'react';
import {globalstyles} from '../globalstyle';
import {Checkbox} from 'react-native-paper';
import {useTogglePasswordVisibility} from '../../component/useTogglePasswordVisibility';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import InputComponent from '../../component/InputComponent';

import { getData, runQuery, CREATE_TIME_TBL } from '../../db';

class HomeScreen extends PureComponent {
  // [x: string]: any;

  state = {
    DATA:[],
    isTimeStarted: false,
    user_id: 1
  };

  componentDidMount() {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

    CREATE_TIME_TBL();

    this.fetchAttendence();

  }

  fetchAttendence(){
    runQuery(`SELECT * FROM time_tbl WHERE user_id = '${this.state.user_id}' ORDER BY id DESC`).then((result: any) => {
      result.forEach((r: any, ind: number) => {
        r.starttime = this.parseTime(r.start_time ? parseInt(r.start_time) : null);
        r.endtime = this.parseTime(r.end_time ? parseInt(r.end_time) : null);

        r.total = '';
        if(r.start_time && r.end_time){
          var diff = Math.abs(parseInt(r.start_time) - parseInt(r.end_time));
          // diff = 213854675;
          var remainder = diff % 3600000;
          var seconds = parseInt(((diff % (3600000 * 60))/1000).toFixed(0));

          var ss = Math.floor(diff/1000);
          var mm = Math.floor(ss/60);
          var hh = Math.floor(mm/60);
          var days = Math.floor(hh/24);

          hh = hh - (days*24);
          mm = mm - (days*24*60) - (hh*60);
          ss = ss - (days*24*60*60) - (hh*60*60) - (mm*60);


          var hours = parseInt((diff / 3600000).toFixed(0));
          var minutes = parseInt((remainder / 60000).toFixed(0));

          // var seconds = 
          r.total = (hh > 9 ? hh : '0'+hh)+':'+(mm > 9 ? mm : '0'+mm)+':'+(ss > 9 ? ss : '0'+ss);

        }

      });

      this.setState({
        DATA: result
      });

      if(result.length > 0){
        if(result[0].starttime && result[0].endtime){
          this.setState({
            isTimeStarted: false
          })
        }
        if(result[0].starttime && !result[0].endtime){
          this.setState({
            isTimeStarted: true
          })
        }
      }

    }, (err) => {
      console.log(err);
    })
  }

  parseTime(time: any){
    if(!time){
      return '';
    }
    var dt = new Date(time);
    return dt.getDate()+'.'+((dt.getMonth() + 1) > 9 ? (dt.getMonth() + 1) : '0'+(dt.getMonth() + 1))+'.'+dt.getFullYear()+', '+(dt.getHours() > 9 ? dt.getHours() : '0'+dt.getHours())+':'+(dt.getMinutes() > 9 ? dt.getMinutes() : '0'+dt.getMinutes())+':'+(dt.getSeconds() > 9 ? dt.getSeconds() : '0'+dt.getSeconds());
  }

  componentWillUnmount(){

  }

  ItemDivider = () => {
    return (
      <View
        style={{
          height: 0.8,
          width: '100%',
          backgroundColor: '#646464',
          alignSelf: 'center',
        }}
      />
    );
  };

  trackChange = (index) => {
    this.setState({
      isTimeStarted: !this.state.isTimeStarted
    }, () => {
      this.setTime();
    });
  };

  setTime = () => {
    var user_id = 1;
    var time = (new Date()).getTime();
    runQuery(`SELECT * FROM time_tbl WHERE user_id='${this.state.user_id}' ORDER BY ID DESC LIMIT 1`).then((result: any) => {
      if(result.length == 0){
        runQuery(`INSERT INTO time_tbl (user_id, start_time) VALUES ('${user_id}', '${time}')`);
      }else{
        if(result[0].start_time && result[0].end_time){
          runQuery(`INSERT INTO time_tbl (user_id, start_time) VALUES ('${user_id}', '${time}')`);
        }
        if(result[0].start_time && !result[0].end_time){
          runQuery(`UPDATE time_tbl SET user_id = '${user_id}', end_time = '${time}' WHERE id = ${result[0].id}`);
        }
      }
      runQuery(`SELECT * FROM time_tbl WHERE user_id = '${this.state.user_id}' ORDER BY id DESC`).then((result: any) => {
        result.forEach((r: any) => {
          r.starttime = this.parseTime(r.start_time ? parseInt(r.start_time) : null);
          r.endtime = this.parseTime(r.end_time ? parseInt(r.end_time) : null);
          r.total = '';
          if(r.start_time && r.end_time){
            var diff = Math.abs(parseInt(r.start_time) - parseInt(r.end_time));
            // diff = 213854675;
            var remainder = diff % 3600000;
            var seconds = parseInt(((diff % (3600000 * 60))/1000).toFixed(0));
  
            var ss = Math.floor(diff/1000);
            var mm = Math.floor(ss/60);
            var hh = Math.floor(mm/60);
            var days = Math.floor(hh/24);
  
            hh = hh - (days*24);
            mm = mm - (days*24*60) - (hh*60);
            ss = ss - (days*24*60*60) - (hh*60*60) - (mm*60);
  
  
            var hours = parseInt((diff / 3600000).toFixed(0));
            var minutes = parseInt((remainder / 60000).toFixed(0));
  
            r.total = (hh > 9 ? hh : '0'+hh)+':'+(mm > 9 ? mm : '0'+mm)+':'+(ss > 9 ? ss : '0'+ss);
  
          }
        });
  
        this.setState({
          DATA: result
        });
  
      }, (err) => {
        console.log(err);
      })

    }, (err) => {
      console.log(err);
    })
  }

  render(){
    return (
      <View style={[globalstyles.container]}>
        <View
          style={{
            width: wp('100%'),
            height: hp('15%'),
            
          }}>
          <TouchableOpacity onPress={() => {
            this.props['navigation'].navigate('Login')
          }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: Platform.OS == 'ios' ? 40 : 10,
                alignItems: 'center',
                marginLeft: 10,
              }}>
              <Feather name={'chevron-left'} size={30} color="#FFF" />
              <Text
                style={[
                  globalstyles.whitetext,
                  globalstyles.font20,
                  {fontWeight: '500'},
                ]}>
                Back
              </Text>
            </View>
          </TouchableOpacity>
  
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'flex-end',
              padding: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flex: 1,
              }}>
              <Text
                style={[
                  globalstyles.whitetext,
                  globalstyles.font24,
                  {fontWeight: '600'},
                ]}>
                Bettina Zeilinger
              </Text>
  
              {/* start */}
              <TouchableOpacity
                onPress={index => {
                  // setUrl(item.url);
                  // SetVideoTitle(item.text);
                  this.trackChange(index);
                }}>
                <Image
                  style={[{resizeMode: 'contain', width: 60, height: 60}]}
                  source={
                    this.state.isTimeStarted
                      ? require('../../../assets/Image/Home/endtime.png')
                      : require('../../../assets/Image/Home/starttime.png')
                  }
                />
              </TouchableOpacity>
              {/* end */}
  
              {/* <Image
                style={{
                  width: 60,
                  height: 60,
                  resizeMode: 'contain',
                }}
                source={require('../../../assets/Image/Home/starttime.png')}
              /> */}
            </View>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
        >
          <Text
            style={[
              globalstyles.bluetext,
              globalstyles.font24,
              {
                fontWeight: '700',
                textAlign: 'center',
                marginVertical: 15
              },
            ]}>
            Working Time List
          </Text>

          <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8F8F8',
                  marginHorizontal: 10
                }}>
                <Text
                  style={[
                    globalstyles.darkgrey,
                    {
                      fontWeight: '500',
                      flex: 1,
                      textAlign: 'center',
                      paddingVertical: 10,
                      borderRightWidth: 2,
                      borderColor: '#d3d3d3'
                    },
                  ]}>
                  Start
                </Text>
  
                <Text
                  style={[
                    globalstyles.darkgrey,
                    {
                      fontWeight: '500',
                      flex: 1,
                      textAlign: 'center',
                      paddingVertical: 10,
                      borderRightWidth: 2,
                      borderColor: '#d3d3d3'
                    },
                  ]}>
                  End
                </Text>
                
                <Text style={[globalstyles.darkgrey, {
                  fontWeight: '500',
                  flex: 0.5,
                  textAlign: 'center',
                  paddingVertical: 10
                  }]}>
                  Total
                </Text>
              </View>

              {
                this.state.DATA.length == 0 &&
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 16,
                      color: '#333'
                    }}
                  >
                    Data not found
                  </Text>
                </View>
              }
              {
                this.state.DATA.length > 0 &&
                <ScrollView
                style={{
                  flex: 1,
                  paddingBottom: 230,
                  marginBottom: 10
                }}
              >
                {
                  this.state.DATA.map((d: any, index: number) => {
                    return (
                      <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: '#F8F8F8',
                        marginHorizontal: 10,
                        borderWidth: 2,
                        borderTopWidth: index == 0 ? 2 : 1,
                        borderBottomWidth: (index == this.state.DATA.length - 1) ? 2 : 1,
                      }}>
                      <Text
                        style={[
                          globalstyles.darkgrey,
                          {
                            fontWeight: '500',
                            flex: 1,
                            textAlign: 'center',
                            paddingVertical: 10,
                            borderRightWidth: 2,
                            borderColor: '#333',
                            fontSize: 13
                          },
                        ]}>
                        {d.starttime}
                      </Text>
  
                      <Text
                        style={[
                          globalstyles.darkgrey,
                          {
                            fontWeight: '500',
                            flex: 1,
                            textAlign: 'center',
                            paddingVertical: 10,
                            borderRightWidth: 2,
                            borderColor: '#333',
                            fontSize: 13
                          },
                        ]}>
                        {d.endtime}
                      </Text>
                
                <Text style={[globalstyles.darkgrey, {
                  fontWeight: '500',
                  flex: 0.5,
                  textAlign: 'center',
                  paddingVertical: 10,
                  // borderLeftWidth: 1,
                  // borderRightWidth: 1,
                  borderColor: '#333',
                  fontSize: 13
                  }]}>
                  {d.total}
                </Text>
              </View>
                    )
                  })
                }
              </ScrollView>
              }
        </View>
  
        {/* <View
          style={{
            width: wp('100%'),
            height: hp('85%'),
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}>
          <ScrollView
            style={{
              flex: 1,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 30,
              }}>
              <Text
                style={[
                  globalstyles.bluetext,
                  globalstyles.font24,
                  {fontWeight: '700'},
                ]}>
                Working Time List
              </Text>
            </View>
  
            <View style={[globalstyles.maincontainer, {marginTop: 20}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  borderColor: '#F8F8F8',
                  borderWidth: 2,
                  padding: 10,
                  backgroundColor: '#F8F8F8',
                }}>
                <Text
                  style={[
                    globalstyles.darkgrey,
                    {
                      fontWeight: '500',
  
                      marginRight: 7,
                    },
                  ]}>
                  Start
                </Text>
                <View style={[styles.verticleLine, {}]}></View>
  
                <Text
                  style={[
                    globalstyles.darkgrey,
                    {fontWeight: '500', marginLeft: 10, marginRight: 12},
                  ]}>
                  End{' '}
                </Text>
                <View style={styles.verticleLine}></View>
                <Text style={[globalstyles.darkgrey, {fontWeight: '500'}]}>
                  Total
                </Text>
              </View>
              <View>
                <View
                  style={{
                    borderColor: '#646464',
                    borderWidth: 1,
                  }}>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    data={this.state.DATA}
                    renderItem={({item, index}) => (
                      <View
                        style={{
                          backgroundColor: '#FFF',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
  
                            justifyContent: 'space-evenly',
                            marginVertical: 15,
                          }}>
                          <Text
                            style={{
                              color: '#000',
                              fontSize: 16,
                              fontWeight: '400',
                            }}>
                            {item.starttime}
                          </Text>
                          <View style={styles.verticleLine1}></View>
                          <Text
                            style={{
                              color: '#000',
                              fontSize: 16,
                              fontWeight: '400',
                            }}>
                            {item.endtime}
                          </Text>
                          <View style={styles.verticleLine1}></View>
                          <Text
                            style={{
                              color: '#000',
                              fontSize: 16,
                              fontWeight: '400',
                              marginLeft: 32,
                              marginRight: 32,
                            }}>
                            {item.total}
                          </Text>
                        </View>
                      </View>
                    )}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={this.ItemDivider}
                  />
                </View>
  
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 40,
                    marginBottom: 30,
                  }}>
                  <TouchableOpacity>
                    <Text
                      style={[
                        globalstyles.darkgrey,
                        globalstyles.font17,
                        {textDecorationLine: 'underline'},
                      ]}>
                      Load More
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View> */}
      </View>
    );
  }

}


const styles = StyleSheet.create({
  verticleLine: {
    height: '230%',
    width: 1.2,
    backgroundColor: '#707070',
    top: -10,
  },
  verticleLine1: {
    height: '255%',
    width: 1.2,
    backgroundColor: '#707070',
    top: -15,
  },
});

export default HomeScreen;
