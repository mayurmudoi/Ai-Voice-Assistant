import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity,PermissionsAndroid } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Features from '../components/Features';
import { dummyMessages } from '../constants';
import Voice from '@react-native-community/voice';
import { apiCall } from '../api/openAI';


export default function HomeScreen() {
  const [messages, setMessages] =useState (dummyMessages);
  const [recording, setRecording] =useState(false);
  const [speaking, setSpeaking] =useState(true);
  const [result, setResult] =useState('');
  
  const clear = () =>{
    setMessages([]);
  }
  const stopSpeaking = () =>{
    setSpeaking(false);
  }
  const speechStartHandler = e => {
    console.log('speech start event', e);
  };
  const speechEndHandler = e => {
    setRecording(false);
    console.log('speech stop event', e);
  };
  const speechResultsHandler = e => {
    console.log('speech event: ',e);
    const text = e.value[0];
    setResult(text);
  };
  const speechErrorHandler = e=>{
    console.log('speech error: ',e);
  };
  const startRecording = async () => {
    setRecording(true);
    try {
      await Voice.start('en-GB');

    } catch (error) {
      console.log('error', error);
    }
  };
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
      fetchResponse();
    } catch (error) {
      console.log('error', error);
    }
  };

  const fetchResponse  = () =>{
    if(result.trim().length>0){
      let newMessages = [...messages];
      newMessages.push({role: ' user', content:result.trim()})
      setMessages([...newMessages]);

      apiCall(result.trim(), newMessages).then(res=>{
        console.log('got api data: ',res)
      })
    }
  }

  useEffect(()=>{
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  },[])


  // console.log('result: ', result);

  return(
    <View className=" flex-1 bg-white">
      <SafeAreaView className=" flex-1 flex m-5 ">
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
              <TouchableOpacity onPress={stopRecording}>
                <Image
                  className="rounded-full"
                  source={require('../../assets/images/voiceLoading.gif')}
                  style={{width:hp(10), height:hp(10)}}
                />
              </TouchableOpacity>
            ):(
              <TouchableOpacity onPress={startRecording}>
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