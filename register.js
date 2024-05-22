import { View, Text, TextInput, Pressable, ImageBackground, Modal } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import image from '../assets/book4.jpg';
import { auth, db } from '../config';
import { doc, setDoc } from 'firebase/firestore';
import { CheckBox } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';




const Register = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isSelected, setIsSelected] = useState(false)
    const [buttonDissabled, setButtonDisabbled] = useState(true)
    const [modalVisibility, setModalVisibility] = useState(false)


    const handleCheckBox = () => {
        setIsSelected(!isSelected)
        setButtonDisabbled(!buttonDissabled)
    }

    const passwordValidation = () => {
        let isValid = true
        if (password !== '' && confirmPassword !== '') {
            if (password !== confirmPassword) {
                isValid = false
                setError('Passwords do not match')
                alert('Passwords do not match')
            }
        }
        return isValid
    }

    const signUp = async () => {
        if (passwordValidation() && isSelected) {
            await auth.createUserWithEmailAndPassword(email.trim(), password)
                .then(
                    user => {
                        alert('Account Created')
                        async function createFavFolder() {
                            await setDoc(doc(db, 'favourites', user.user.email),
                                {
                                    books: [],
                                    user: user.user.email
                                })
                        }
                        createFavFolder();
                        async function createReadFolder() {
                            await setDoc(doc(db, 'readBooks', user.user.email),
                                {
                                    books: [],
                                    user: user.user.email
                                })
                        }
                        createReadFolder();
                        navigation.navigate('LogIn');
                    },
                )
                .catch(error => {
                    alert(error.message)

                }
                )

        }

    };
    const privacyModal = () => {
        return (
            <View style={styles.modal}>
                <View style={styles.upperPart}>
                    <Text style={styles.modalHeader}> Privacy Policy </Text>
                    <Pressable
                        style={styles.closeModal}
                        onPress={() => {
                            setModalVisibility(false);
                        }}>
                        <Ionicons name='close-outline' size={25} style={styles.barcodedIcon}></Ionicons>
                    </Pressable>
                </View>
                <View>
                    <Text>We are committed to respecting our users' privacy at BookHub. This privacy statement explains how we collect, use, shop, and safeguard the personal information we collect from our users. You agree to the terms and practises mentioned in this policy by using our services.</Text>
                    <Text style={styles.personalInformationHeader}>Personal Information</Text>
                    <Text style={styles.firstSection}>We may gather the following categories of personal information from you when you use our services:  Email address, User Name, Passwords used to create user accounts
                        Please keep in mind that we only collect personal information that is required to provide you with our services.</Text>
                </View>
                <View>
                    <Text style={styles.securityHeader}>Security</Text>
                    <Text style={styles.firstSection}>We store your personal information securely in Firebase, a cloud-based platform that provides data storage and authentication services. We take reasonable security measures to safeguard against unauthorised access, use, or disclosure of your personal information. To protect your personal information, we employ industry-standard security methods such as firewalls and encryption.We do not disclose your personal information to outside parties</Text>
                </View>
                <View>
                    <Text style={styles.securityHeader}>Updates To Privacy Policy</Text>
                    <Text style={styles.firstSection}>We reserve the right to change this privacy statement at any time.  We will notify you of any material changes to this policy. Your continued use of our services following any modifications to this policy signifies your acceptance of the changes.</Text>
                </View>
            </View>
        )

    }



    return (
        <ImageBackground source={image} style={styles.container}>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>
                        Create Account
                    </Text>
                </View>
                <View style={styles.register}>
                    <View style={styles.logIn}>
                        <TextInput style={styles.email}
                            lable="username"
                            placeholder='username'
                            value={userName}
                            onChangeText={(username) => setUsername(username)}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <TextInput style={styles.email}
                            lable="Email"
                            placeholder='Email'
                            value={email}
                            onChangeText={(email) => setEmail(email)}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <TextInput style={styles.password}
                            lable="Password"
                            placeholder='Password'
                            value={password}
                            onChangeText={(password) => setPassword(password)}
                            autoCapitalize='none'
                            autoCorrect={false}
                            secureTextEntry={true}
                        />
                        <TextInput style={styles.password}
                            lable="Password"
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChangeText={(confirmedPassword) => setConfirmPassword(confirmedPassword)}
                            autoCapitalize='none'
                            autoCorrect={false}
                            secureTextEntry={true}
                        />
                        <View style={styles.checkboxSection}>
                            <View style={styles.checkbox}>
                                <CheckBox checked={isSelected}
                                    onPress={handleCheckBox}
                                    iconType="material-community"
                                    checkedIcon="checkbox-marked"
                                    uncheckedIcon="checkbox-blank-outline"
                                    checkedColor="#968C82"
                                    size={20}
                                    containerStyle={{
                                        backgroundColor: 'transparent'
                                    }}
                                />
                            </View>
                            <View style={styles.checkboxText}>
                                <Pressable>
                                    <Text onPress={() => { setModalVisibility(true) }} style={styles.termsAndConditions}>I Agree to the Terms and Conditions and Privacy Policy </Text>
                                </Pressable>
                            </View>
                        </View>
                        <View>
                            <Pressable onPress={() => signUp()}
                                style={[styles.createAccount, buttonDissabled && { backgroundColor: 'grey' },]}
                                buttonDissabled={buttonDissabled}>
                                <Text style={styles.registerText}> Create Account </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                <Modal visible={modalVisibility} animationType='fade' transparent={true}>
                    <Pressable style={styles.filterBackground} onPress={() => { setModalVisibility(false) }}>
                        {privacyModal()}
                    </Pressable>
                </Modal>
            </View>
        </ImageBackground>
    )

}
export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '30%',
        backgroundColor: 'rgba(234, 222, 212, 0.6)'
    },
    checkboxSection: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 35
    },
    termsAndConditions: {
        fontSize: 10,
        marginLeft: -15
    },
    checkboxText: {
        marginTop: 20
    },
    checkbox: {
        backgroundColor: 'transparent'
    },
    title: {
        flex: 1,
        fontSize: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        color: 'black',
        opacity: 0.7,
        fontWeight: 'normal',
        fontSize: 40,
        fontStyle: 'italic'
    },
    email: {
        width: 300,
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255, 0.5)',
        borderRadius: 10,
        padding: 15,
        marginLeft: 40,
        marginTop: 10,

    },
    password: {
        width: 300,
        backgroundColor: 'rgba(255,255,255, 0.5)',
        borderRadius: 10,
        padding: 15,
        marginTop: 5,
        marginLeft: 40,
        marginTop: 10,
    },
    createAccount: {
        backgroundColor: '#9C847C',
        opacity: 0.9,
        borderRadius: 18,
        width: 150,
        alignItems: 'center',
        padding: 15,
        marginTop: 35,
        marginLeft: '30%'
    },
    registerText: {
        color: 'white'
    },

    register: {
        flex: 2,
        marginTop: 30,
    },
    modal: {
        backgroundColor: 'white',
        width: '90%',
        height: '80%',
        borderRadius: 3,
        alignSelf: 'center',
        padding: 20,
        margin: 60
    },
    upperPart: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalHeader: {
        fontWeight: 'bold',
        fontSize: 20
    },
    closeModal: {

        marginBottom: 10
    },
    securityHeader: {
        fontWeight: 'bold'
    },
    personalInformationHeader: {
        fontWeight: 'bold'
    }

})