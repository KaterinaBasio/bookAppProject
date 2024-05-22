import { StyleSheet } from "react-native";
import { Text, View, Image, Pressable } from "react-native";
import { doc, getDoc,arrayRemove,updateDoc } from 'firebase/firestore';
import { auth, db } from '../config';
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from "@react-navigation/native";
import React from "react";



const FavBooks = () => {

  const [favourites, setFavorites] = useState([])
  useFocusEffect(
    React.useCallback(() =>{
      getFavorites();
    },[]) 
  )
  const getFavorites = async () => {
    try {
      const user = auth.currentUser;
      const favCollection = doc(db, 'favourites', user.email);
      const favDoc = await getDoc(favCollection);
      const favorites = favDoc.data().books;
      setFavorites(favorites);
      console.log('Favorites:', favorites);
    } catch (error) {
      console.log(error);
    }
  }
  const removeData = async (id) => {
    try {
      const user = auth.currentUser;
      const favCollection = doc(db, 'favourites', user.email);
      const favDoc = await getDoc(favCollection);
      const favorites = favDoc.data().books;
      const updatedFavorites = favorites.filter((book) => book.id !== id);
      await updateDoc(favCollection, { books: updatedFavorites });
      setFavorites(updatedFavorites);
    } catch (error) {
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.bookContainer}>
        {favourites.map((book) => {
          return (
            <View key={book.id} style={styles.books}>
              {book.BookImage ?(
              <Image
                style={styles.image}
                source={{ uri: book.BookImage }}
              />
              ):(
                <Image
                style={styles.image}
                source={require('../assets/noImage.png')}
              />
              )}
              <View style={styles.innerDet}>
                <View style={styles.bookDet}>
                  <View style={styles.title}>
                    <Text style={styles.bookTitle}>{book.BookTitle}</Text>
                  </View>
                  <View style={styles.author}>
                    <Text style={styles.bookAuthor}>By </Text>
                    <Text style={styles.authorName}>{book.BookAuthor}</Text>
                  </View>
                </View>
                <View style={styles.readEbook} >
                  <Pressable style={styles.read} onPress = {()=>removeData(book.id)}>
                    <Text style={styles.readText}> Remove</Text>
                  </Pressable>
                </View>
              </View>
              <View style={styles.removeIcon}>
                <Pressable style={styles.remove} onPress={() => removeData(book.id)}>
                  <Ionicons name="heart" style={styles.heartIcon} size={25}></Ionicons>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 30
  },
  bookContainer: {
    width: 300,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingBottom: 20
  },
  books: {
    width: 330,
    height: 140,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#DCDCDC',
    paddingBottom: 20,
    marginTop: 5,
    marginLeft: 20,
  },
  image: {
    width: 80,
    height: 120,
    margin: 10
  },
  bookTitle: {
    fontSize: 20,
    color: '#6c7360',
    fontWeight: 'bold'
  },
  bookDet: {
    width: 180,
    height: 70,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  heartIcon: {
    color: 'red',

  },
  author: {
    display: 'flex',
    flexDirection: 'row'
  },
  authorName: {
    color: '#6c7360',
  },
  removeIcon: {
    marginLeft: 20,
    marginTop: 10,
  },
  read: {
    marginTop: 20,
    width: 70,
  },
  readText: {
    fontSize: 15,
    color: 'black',
    backgroundColor: '#d9e7c1',
    padding: 5,
  },







});

export default FavBooks;
