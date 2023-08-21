import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
  ScrollView,
} from 'react-native';

const PaymentScreen = () => {
  const phoneNumber = '9421844602'; // Replace with your actual phone number
  const windowWidth = Dimensions.get('window').width;

  const openUPIAppChooser = () => {
    const upiLink = `upi://pay?pa=${phoneNumber}`;

    Linking.canOpenURL(upiLink).then(supported => {
      if (supported) {
        console.log('UPI app available.');
        Linking.openURL(upiLink);
      } else {
        console.log('UPI app not available.');
      }
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../assets/paymentqr2.jpg')} // Replace with your image path
          style={{width: windowWidth * 1, height: windowWidth * 1.2}}
        />
        <Text
          style={{
            marginTop: 10,
            fontSize: 18,
            fontWeight: 'bold',
            color: 'black',
          }}>
          तुम्ही 9421844602 या नंबर वर Phonepe वर पेमेंट करू शकता
        </Text>
        <TouchableOpacity onPress={openUPIAppChooser} style={{marginTop: 10}}>
          <Text style={{color: 'blue', fontSize: 16}}>Pay Now</Text>
        </TouchableOpacity>
        <Text style={{fontSize: 20, color: 'black'}}>Fees </Text>
        <Text style={{fontSize: 15, color: 'black'}}>
          {' '}
          Class 5th to 7th : ₹700{' '}
        </Text>
        <Text style={{fontSize: 15, color: 'black'}}>
          Class 8th to 10th : ₹799{' '}
        </Text>
      </View>
    </ScrollView>
  );
};

export default PaymentScreen;
