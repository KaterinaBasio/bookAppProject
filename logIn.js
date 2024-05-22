import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, ImageBackground, Pressable, Image } from 'react-native';
import image from '../assets/book4.jpg';
import logo from '../assets/readme.png';
import { auth } from '../config';

const LogIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("false");
  const [user, setUser] = useState('');
  useEffect(() => {
    if (user) {
      navigation.navigate('HomePage');
    }
  }, [user])
  const signIn = async () => {
    await auth.signInWithEmailAndPassword(email.trim(), password)
      .then(
        user => {
          setUser(user)
          setEmail('')
          setPassword('')
        }
      )
      .catch(error => {
        alert(error.message)
      }
      )
  };


  return (
    <ImageBackground source={image} style={styles.container}>
      <View style={styles.title}>
        <Image source={logo} style={styles.logoImage} />
      </View>

      <View style={styles.logIn}>
        <Text> Email</Text>
        <TextInput style={styles.email}
          label="Email"
          placeholder='Email'
          value={email}
          onChangeText={(email) => setEmail(email)}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <Text> Password</Text>
        <TextInput style={styles.password}
          label="Password"
          placeholder='Password'
          value={password}
          onChangeText={(password) => setPassword(password)}
          autoCapitalize='none'
          autoCorrect={false}
          secureTextEntry={true}
        />
        <Pressable onPress={() => { signIn() }} style={styles.logInButton}>
          <Text>Log In</Text>
        </Pressable>
        <View style={styles.lines}>
          <View
            style={styles.line}>
          </View>
          <Text style={styles.orText}> OR </Text>
          <View
            style={styles.lineRight}>
          </View>
        </View>
        <Pressable onPress={() => { navigation.navigate('Register') }} style={styles.createAccount}>
          <Text style={styles.createAccountText}> Create Account </Text>
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </ImageBackground>

  );
}
export default LogIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', height: '100%'

  },
  title: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%'
  },
  logoImage: {
    width: '100%',
    height: '100%'

  },
  bookTitle: {
    color: 'black',
    opacity: 0.7,
    fontWeight: 'bold',
    fontSize: 40,
    fontStyle: 'italic',
    fontFamily: 'monospace'
  },
  email: {
    width: 300,
    borderWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 18,
    padding: 8,
  },
  password: {
    width: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 18,
    padding: 8,
    marginTop: 5
  },
  logIn: {
    flex: 2,
    marginTop: 50,
  },


  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    opacity: 0.5,
    marginTop: 20,
    width: 100,
    marginLeft: 30
  },
  lineRight: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    opacity: 0.5,
    marginTop: 20,
    width: 100,
    marginRight: 30
  },
  lines: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  orText: {
    marginTop: 30
  },
  createAccount: {
    marginTop: 30,
    marginLeft: '27%',
  },
  createAccountText: {
    fontWeight: 'bold'
  },
  logInButton: {
    backgroundColor: '#FAF0E6',
    opacity: 0.9,
    borderRadius: 18,
    width: 100,
    alignItems: 'center',
    padding: 10,
    marginTop: 35,
    marginLeft: '25%'
  }
});
