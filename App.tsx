import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Clipboard from '@react-native-clipboard/clipboard';

const yupSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, 'Password Length must be minimum 4')
    .max(16, 'password length can be maximum 16')
    .required('Password length is required'),
});

export default function App() {
  const [password, setPassword] = useState('');
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
  const [lowerCase, setLowerCase] = useState(true);
  const [upperCase, setUpperCase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);

  const showToast = (msg: string) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const generatePassword = (passwordLength: number) => {
    let charList = '';
    const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
    const DIGITS = '0123456789';
    const SPECIAL_CHARACTERS = '!@#$%^&*()_+-=[]{};:\'",./?';

    if (upperCase) {
      charList += UPPERCASE_LETTERS;
    }
    if (lowerCase) {
      charList += LOWERCASE_LETTERS;
    }
    if (numbers) {
      charList += DIGITS;
    }
    if (symbols) {
      charList += SPECIAL_CHARACTERS;
    }

    const generatedPassword = createPassword(passwordLength, charList);
    setIsPasswordGenerated(true);
    setPassword(generatedPassword);
  };

  const createPassword = (
    passwordLength: number,
    characterList: string,
  ): string => {
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      const characterPosition = Math.round(
        Math.random() * characterList.length,
      );
      result += characterList.charAt(characterPosition);
    }
    return result;
  };

  const resetPassword = () => {
    setIsPasswordGenerated(false);
    setLowerCase(false);
    setUpperCase(false);
    setNumbers(false);
    setSymbols(false);
    setPassword('');
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{backgroundColor: 'whitesmoke'}}>
      <SafeAreaView>
        <View>
          <Text style={styles.headingText}>Password Generator</Text>
          <Formik
            initialValues={{
              passwordLength: '',
            }}
            onSubmit={function (values) {
              generatePassword(+values.passwordLength);
            }}
            validationSchema={yupSchema}>
            {({
              values,
              handleChange,
              handleReset,
              isValid,
              handleSubmit,
              errors,
              touched,
            }) => (
              <>
                <View style={styles.formContainer}>
                  <View>
                    {/* <Text style={{marginBottom: 4, color: '#0D0D0D'}}>
                      Password Length:{' '}
                    </Text> */}
                    <TextInput
                      style={{
                        paddingVertical: 4,
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: touched.passwordLength
                          ? errors.passwordLength
                            ? '#B4161B'
                            : '#3DBE29'
                          : '#0D0D0D',
                      }}
                      value={values.passwordLength}
                      onChangeText={handleChange('passwordLength')}
                      keyboardType="numeric"
                      placeholder="Password Length"
                    />
                  </View>
                  <View>
                    {touched.passwordLength && errors.passwordLength && (
                      <Text style={styles.errorText}>
                        {errors.passwordLength}
                      </Text>
                    )}
                  </View>
                  <View>
                    <BouncyCheckbox
                      disableBuiltInState
                      text="Lower Case"
                      onPress={() => setLowerCase(!lowerCase)}
                      isChecked={lowerCase}
                      fillColor="#3DBE29"
                      textStyle={{textDecorationLine: 'none', color: '#3DBE29'}}
                    />
                  </View>
                  <View>
                    <BouncyCheckbox
                      disableBuiltInState
                      text="Upper Case"
                      onPress={() => setUpperCase(!upperCase)}
                      isChecked={upperCase}
                      fillColor="#DDD101"
                      textStyle={{textDecorationLine: 'none', color: '#DDD101'}}
                    />
                  </View>
                  <View>
                    <BouncyCheckbox
                      disableBuiltInState
                      text="Use Numbers"
                      onPress={() => setNumbers(!numbers)}
                      isChecked={numbers}
                      fillColor="#E07C24"
                      textStyle={{textDecorationLine: 'none', color: '#E07C24'}}
                    />
                  </View>
                  <View>
                    <BouncyCheckbox
                      disableBuiltInState
                      text="User Special Characters"
                      onPress={() => setSymbols(!symbols)}
                      isChecked={symbols}
                      fillColor="#1B98F5"
                      textStyle={{textDecorationLine: 'none', color: '#1B98F5'}}
                    />
                  </View>
                  <View style={styles.btnContainer}>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={[styles.btn]}
                      disabled={!isValid}>
                      <Text style={styles.textColor}>Generate Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => {
                        handleReset();
                        resetPassword();
                      }}>
                      <Text style={styles.textColor}>Reset</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </Formik>

          {isPasswordGenerated && (
            <>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(password);
                  showToast('copied to clipboard');
                }}>
                <Text style={styles.resultText}>{password}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headingText: {
    textAlign: 'center',
    fontSize: 24,
    marginVertical: 20,
    color: '#0D0D0D',
    fontWeight: 'bold',
  },
  formContainer: {
    marginHorizontal: 10,
    display: 'flex',
    justifyContent: 'space-evenly',
    gap: 8,
  },
  errorText: {
    color: '#B4161B',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#3944F7',
    borderRadius: 5,
  },
  textColor: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  resultText: {
    textAlign: 'center',
    color: '#2C2D2E',
    padding: 10,
    backgroundColor: '#538FFB',
    fontSize: 24,
    margin: 20,
    borderRadius: 10,
  },
});
