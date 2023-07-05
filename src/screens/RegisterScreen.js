import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';

import MultiSelect from 'react-native-multiple-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../utils/api';
const RegisterScreen = ({navigation}) => {
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;
  const [firstName, setFirstName] = React.useState('');
  const [middleName, setMiddleName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState(new Date());
  const [address, setAddress] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [referralCode, setReferralCode] = React.useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [courses, setCourses] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await api.get('/student/apis/get_courses.php', {
          params: null,
        });
        if (response) {
          try {
            setCourses(response.data.data);
          } catch (error) {
            console.error('Error getting data:', error);
          }
        }
      } catch (error) {
        // Handle login error
        console.log(error);
      }
    };
    getCourses();
  }, []);
  const showDatePicker = () => {
    setShowPicker(true);
  };

  const hideDatePicker = () => {
    setShowPicker(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setDateOfBirth(currentDate);
    hideDatePicker();
  };
  const handleCourseSelection = items => {
    setSelectedCourses(items);
  };
  const validateForm = () => {
    const errors = {};

    if (!firstName) {
      errors.firstName = 'First name is required.';
    }
    if (!middleName) {
      errors.middleName = 'Middle name is required.';
    }
    if (!lastName) {
      errors.lastName = 'Last name is required.';
    }

    if (!dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required.';
    }
    if (!mobileNumber) {
      errors.mobileNumber = 'Mobile number is required.';
    }
    if (mobileNumber.length != 10) {
      errors.mobileNumber = 'Enter Valid Mobile number';
    }
    if (!address) {
      errors.address = 'Address is required.';
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async () => {
    const isFormValid = validateForm();

    if (isFormValid) {
      setIsLoading(true);
      try {
        const formData = {
          firstName: firstName,
          middleName: middleName,
          lastName: lastName,
          dateOfBirth: dateOfBirth,
          address: address,
          mobileNumber: mobileNumber,
          referralCode: referralCode,
          selectedCourses: selectedCourses,
        };
        const checkMobile = async () => {
          try {
            const checkMobileRes = await api.get(
              '/student/apis/check_mobile.php',
              {
                params: {
                  mobileNumber: mobileNumber,
                },
              },
            );

            if (checkMobileRes.data.data.found == 0) {
              const response = await api.post(
                '/student/apis/register_student.php',
                formData,
              );

              const res = response.data.trim();
              if (res == 'success') {
                Alert.alert('Registration Done!', 'Click ok to Login', [
                  {
                    text: 'Cancel',
                    onPress: () => navigation.navigate('Login'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Login'),
                  },
                ]);
              } else {
                Alert.alert('Something Went Wrong!', res, [
                  {
                    text: 'Cancel',
                    onPress: () => navigation.navigate('TimeTable'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('TimeTable'),
                  },
                ]);
              }
            } else {
              Alert.alert(
                'This mobile number is already registered!',
                'Click ok to Login',
                [
                  {
                    text: 'Cancel',
                    onPress: () => navigation.navigate('Login'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Login'),
                  },
                ],
              );
            }
          } catch (error) {
            // Handle the error
            console.error(error);
          }
        };
        checkMobile();
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsLoading(false); // Set isLoading state back to false to hide the loader
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10} // Adjust the offset as needed
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Registration</Text>
          </View>
          <View style={styles.header}>
            <Image
              source={require('../assets/login.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.formContainer}>
            <View
              style={[
                styles.inputFieldContainer,
                validationErrors.firstName
                  ? styles.inputFieldContainerError
                  : styles.inputFieldContainer,
              ]}>
              <Image
                style={styles.inputFieldIcon}
                source={require('../assets/user-icon.png')}
              />
              <TextInput
                placeholder="First Name"
                placeholderTextColor="grey"
                style={styles.inputField}
                value={firstName}
                onChangeText={text => setFirstName(text)}
              />
              {validationErrors.firstName && (
                <Text style={styles.errorText}>
                  {validationErrors.firstName}
                </Text>
              )}
            </View>
            <View
              style={[
                styles.inputFieldContainer,
                validationErrors.middleName
                  ? styles.inputFieldContainerError
                  : styles.inputFieldContainer,
              ]}>
              <Image
                style={styles.inputFieldIcon}
                source={require('../assets/user-icon.png')}
              />
              <TextInput
                placeholder="Middle Name"
                placeholderTextColor="grey"
                style={styles.inputField}
                value={middleName}
                onChangeText={text => setMiddleName(text)}
              />
              {validationErrors.middleName && (
                <Text style={styles.errorText}>
                  {validationErrors.middleName}
                </Text>
              )}
            </View>
            <View
              style={[
                styles.inputFieldContainer,
                validationErrors.lastName
                  ? styles.inputFieldContainerError
                  : styles.inputFieldContainer,
              ]}>
              <Image
                style={styles.inputFieldIcon}
                source={require('../assets/user-icon.png')}
              />
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="grey"
                style={styles.inputField}
                value={lastName}
                onChangeText={text => setLastName(text)}
              />
              {validationErrors.lastName && (
                <Text style={styles.errorText}>
                  {validationErrors.lastName}
                </Text>
              )}
            </View>

            <View style={[styles.inputFieldContainer]}>
              <Image
                style={styles.inputFieldIcon}
                source={require('../assets/calendar.png')}
              />
              <TouchableOpacity onPress={showDatePicker}>
                <Text
                  style={{color: colorScheme == 'dark' ? 'white' : 'black'}}>
                  {dateOfBirth.toDateString()}
                </Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date(1900, 0, 1)} // Optional minimum date
                  maximumDate={new Date()} // Optional maximum date
                />
              )}
            </View>

            <View
              style={[
                styles.inputFieldContainer,
                validationErrors.mobileNumber
                  ? styles.inputFieldContainerError
                  : styles.inputFieldContainer,
              ]}>
              <Image
                style={styles.inputFieldIcon}
                source={require('../assets/mobile.png')}
              />
              <TextInput
                placeholder="Mobile Number"
                placeholderTextColor="grey"
                style={styles.inputField}
                keyboardType="numeric"
                value={mobileNumber}
                onChangeText={text => setMobileNumber(text)}
              />
              {validationErrors.mobileNumber && (
                <Text style={styles.errorText}>
                  {validationErrors.mobileNumber}
                </Text>
              )}
            </View>
            <View style={styles.inputFieldContainer}>
              <Image
                style={styles.inputFieldIcon}
                source={require('../assets/network.png')}
              />
              <TextInput
                placeholder="Referral Code (optional)"
                placeholderTextColor="grey"
                style={styles.inputField}
                value={referralCode}
                onChangeText={text => setReferralCode(text)}
              />
            </View>

            <TextInput
              placeholder="Address"
              placeholderTextColor="grey"
              style={styles.textarea}
              multiline
              value={address}
              onChangeText={text => setAddress(text)}
            />
            <View style={styles.dropdownContainer}>
              <MultiSelect
                items={courses}
                uniqueKey="id"
                onSelectedItemsChange={handleCourseSelection}
                selectedItems={selectedCourses}
                selectText="Select Courses"
                selectedTextColor={colorScheme != 'dark' ? 'white' : 'black'}
                searchInputPlaceholderText="Search Courses..."
                altFontFamily="Arial"
                tagRemoveIconColor={colorScheme == 'dark' ? 'white' : 'black'}
                tagBorderColor={colorScheme == 'dark' ? 'white' : 'black'}
                tagTextColor={colorScheme == 'dark' ? 'white' : 'black'}
                selectedItemTextColor={
                  colorScheme == 'dark' ? 'white' : 'black'
                }
                selectedItemIconColor={
                  colorScheme == 'dark' ? 'white' : 'black'
                }
                itemTextColor={colorScheme == 'dark' ? 'white' : 'black'}
                displayKey="name"
                searchInputStyle={{
                  color: colorScheme == 'dark' ? 'white' : 'black',
                }}
                submitButtonColor="#185DCF"
                submitButtonText="Ok"
                styleDropdownMenuSubsection={styles.dropdownMenuSubsection}
                styleTextDropdown={styles.dropdownText}
                styleDropdownMenu={styles.dropdownMenu}
                styleItemsContainer={styles.itemsContainer}
                styleListContainer={styles.listContainer}
                styleSelectorContainer={styles.selectorContainer}
                styleInputGroup={styles.inputGroup}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const {width} = Dimensions.get('window');

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'black',
  },
  logo: {
    width: 100,
    height: 100,
    alignItems: 'center',
    resizeMode: 'contain', // Adjust the image content's aspect ratio
  },
  content: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  description: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
  },
  formContainer: {
    width: width * 0.8,
    alignItems: 'center',
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    borderColor: '#969696',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  inputFieldContainerError: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  inputFieldIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  inputField: {
    color: 'black',
    flex: 1,
  },
  dropdownContainer: {
    width: '100%',
    marginVertical: 15,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: 'black',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  dropdownSelected: {
    backgroundColor: '#E3F2FD',
  },
  dropdownTickIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  dropdownOption: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
  textarea: {
    width: '100%',
    height: 80,
    borderColor: '#969696',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#25D366',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownMenuSubsection: {},
  dropdownText: {
    fontSize: 14,
    color: '#000',
    marginTop: 0,
  },
  dropdownMenu: {
    borderColor: '#969696',
    borderWidth: 1,
    borderRadius: 1,
    marginTop: 0,
    maxHeight: 200,
  },
  itemsContainer: {
    maxHeight: 200,
  },
  listContainer: {
    borderColor: '#969696',
    borderWidth: 1,
  },
  selectorContainer: {
    marginTop: 0,
  },
  inputGroup: {
    borderColor: '#969696',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
});
const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  logo: {
    width: 100,
    height: 100,
    alignItems: 'center',
    resizeMode: 'contain', // Adjust the image content's aspect ratio
  },
  content: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  description: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
  },
  formContainer: {
    width: width * 0.8,
    alignItems: 'center',
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    borderColor: '#969696',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    color: 'white',
  },
  inputFieldContainerError: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  inputFieldIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  inputField: {
    color: 'white',
    flex: 1,
  },
  dropdownContainer: {
    width: '100%',
    marginVertical: 15,
    backgroundColor: 'black',
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: 'white',
    borderColor: 'white',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    color: 'white',
  },
  dropdownSelected: {
    color: 'white',
    textShadowColor: 'white',
  },
  dropdownTickIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    color: 'white',
  },
  dropdownOption: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  textarea: {
    width: '100%',
    height: 80,
    borderColor: '#969696',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#25D366',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownMenuSubsection: {backgroundColor: 'black'},
  dropdownText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 0,
  },
  dropdownMenu: {
    borderColor: '#969696',
    borderWidth: 1,
    borderRadius: 1,
    marginTop: 0,
    maxHeight: 200,
  },
  itemsContainer: {
    maxHeight: 500,
  },
  listContainer: {
    borderColor: '#969696',
    borderWidth: 1,
    backgroundColor: 'black',
  },
  selectorContainer: {
    marginTop: 0,
    backgroundColor: 'black',
  },
  inputGroup: {
    borderColor: '#969696',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
});

export default RegisterScreen;
