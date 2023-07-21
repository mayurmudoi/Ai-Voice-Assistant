import React, { useState } from 'react'
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Features from '../components/Features';
import { dummyMessages } from '../constants';

export default function HomeScreen() {
  const [messages, setMessages] =useState (dummyMessages);
  const [recording, setRecording] =useState(false);
  const [speaking, setSpeaking] =useState(true);
  
  const clear = () =>{
    setMessages([]);
  }
  const stopSpeaking = () =>{
    setSpeaking(false);
  }
  return(
    <View className=" flex-1 bg-white">
      <SafeAreaView className=" flex-1 flex margin-5">
        <View className="flex-row justify-center">
          <Image source={require("../../assets/images/bot.png")} style={{width: hp(15), height: hp(15)}}/>
        </View>

        {
          messages.length>0?(
            <View className="space-y-2 flex-1">
              <Text className="text-gray-700 font-semibold ml-1" style={{fontSize: wp(5)}}>
                Assistant
              </Text>
              <View
                style={{height:hp(58)}}
                className="bg-neutral-200 rounded-3xl p-4"
              >
                <ScrollView
                  bounce={false}
                  className="space-y-4"
                  showsVerticalScrollIndicator={false}
                >
                  {
                    messages.map((message, index) =>{
                      if(message.role=='assistant'){
                        if(message.content.includes('https')){
                          return (
                            <View key={index} className="flex-row justify-start">
                              <View className="p-2 flex rounded-2xl bg-emerald-100 rounded-tl-none">
                                <Image  
                                  source={{uri: message.content}} 
                                  className="rounded-2xl"  
                                  resizeMode="contain" 
                                  style={{height: wp(60), width: wp(60)}} 
                                />
                              </View>
                            </View>
                          )
                        }else{
                          return (
                            <View 
                            key={index}
                              style={{width: wp(70)}} 
                              className="bg-emerald-100 p-2 rounded-xl rounded-tl-none">
                              <Text style={{fontSize: wp(4)}}  >
                                {message.content}
                              </Text>
                            </View>
                          );
                        }
                      }else{
                        return (
                          <View key={index} className="flex-row justify-end">
                            <View 
                              style={{width: wp(70)}} 
                              className="bg-white p-2 rounded-xl rounded-tr-none">
                              <Text style={{fontSize: wp(4)}}  >
                                {message.content}
                              </Text>
                            </View>
                          </View>
                        );
                      }
                    })
                  }
                </ScrollView>

              </View>
            </View>
          ) : (
            <Features/>
          )
        }

        <View className="flex justify-center items-center">
          {
            recording?(
              <TouchableOpacity>
                <Image
                  className="rounded-full"
                  source={require('../../assets/images/voiceLoading.gif')}
                  style={{width:hp(10), height:hp(10)}}
                />
              </TouchableOpacity>
            ):(
              <TouchableOpacity>
                <Image
                  className="rounded-full"
                  source={require('../../assets/images/recordingIcon.png')}
                  style={{width:hp(10), height:hp(10)}}
                />
              </TouchableOpacity>
            )
          }
          {
            messages.length>0 && (
              <TouchableOpacity 
                onPress={clear} 
                className="bg-neutral-400 rounded-3xl p-2 absolute right-10"
              >
                <Text className="text-white font-semibold">Clear</Text>
              </TouchableOpacity>
            )
          }
          {
            speaking && (
              <TouchableOpacity 
                onPress={stopSpeaking} 
                className="bg-red-400 rounded-3xl p-2 absolute left-10"
              >
                <Text className="text-white font-semibold">Stop</Text>
              </TouchableOpacity>
            )
          }
        </View>
      </SafeAreaView>
    </View>
  )
}