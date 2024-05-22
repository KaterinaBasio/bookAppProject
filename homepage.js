import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Pressable } from 'react-native';
import { FlatList } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import search from '../assets/searchIcon.png';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks,setPopularBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [booksCategories, setBooksCategories] = useState([
    { ID: 'c1', cat: 'Fantasy', color: '#DDA0DD' },
    { ID: 'c2', cat: 'Romance', color: '#FFC0CB' },
    { ID: 'c3', cat: 'Thriller/Horror', color: '#4169E1' },
    { ID: 'c5', cat: 'Adventure', color: '#FF8C00' },
    { ID: 'c6', cat: 'Mystery', color: '#800080' },
    { ID: 'c7', cat: 'Science Fiction', color: '#008B8B' }]);

  const navigation = useNavigation();
  function handleCategory(item) {
    navigation.navigate('Categories', { category: item })
  }
  function handleViewBookDet(id, title, description, rating, image, author, pages, publichedDate,downloadLink) {
    navigation.navigate('Book Details',
      {
        bookId: id,
        bookTitle: title,
        bookDescription: description,
        bookRating: rating,
        bookImage: image,
        bookAuthor: author,
        bookPages: pages,
        bookPublished: publichedDate,
        bookLink:downloadLink
      })
  }
  function handleViewAllPopularBooks(item) {
    navigation.navigate('Popular Books')
  }
  function handleViewAllNewBooks(item) {
    navigation.navigate('New Books')
  }

  
  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=novel+year:2022&printType=books&maxResults=8&key=AIzaSyDmjzPqqMeAhM6RFKdPYX_oYiZ6W8w0uWc');
      const data = await response.json();
      const newBooks = data.items.filter((book) => {
        return !popularBooks.some((existingBook) => existingBook.id === book.id);
      });
      setPopularBooks([...popularBooks, ...newBooks]);
    };
    const fetchNewBooks = async () => {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=novel&orderBy=newest&key=AIzaSyDmjzPqqMeAhM6RFKdPYX_oYiZ6W8w0uWc`);
      const data = await response.json();
      const newBooksLastMonth = data.items.filter((book) => {
        return !books.some((existingBook) => existingBook.id === book.id);
      });
      setNewBooks([...books, ...newBooksLastMonth]);
    };
    const filteredBooks = books.filter(
      (book) =>
        book.volumeInfo.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        book.volumeInfo.authors
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filteredBooks);
    fetchBooks();
    fetchNewBooks();
  }, []);
    const handleSearch = async () => {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${searchQuery} `);
      const data = await response.json();
      setSearchResult(data.items);
      navigation.navigate('SearchedBooks',{searchResult:data.items})
    };
  return (
    <View style={styles.screen} nestedScrollEnabled={true}>
      <View style={styles.searchbarFill}>
        <Image
          style={styles.icon}
          source={search}
        />
        <TextInput
          style={styles.inputStyle}
          autoCorrect={false}
          placeholder="Search a book"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <Pressable style={styles.searchButton} onPress = {()=>handleSearch()}>
          <Ionicons name ='arrow-forward' size={20} style={styles.arrowIcon}></Ionicons>
          </Pressable>
      </View>
      <View style={styles.listHeader}>
        <Text style={styles.popularBooks}> Popular Books 2022</Text>
        <Pressable style={styles.viewAll} onPress={(item) => handleViewAllPopularBooks(item.id)}><Text>View All</Text></Pressable>
      </View>
      <FlatList
        nestedScrollEnabled={true}
        data={popularBooks}
        horizontal={true}
        keyExtractor={book => book.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: book }) => (
          <Pressable onPress={() => handleViewBookDet(book.id, book.volumeInfo.title, book.volumeInfo.description, book.volumeInfo.averageRating, book.volumeInfo.imageLinks?.thumbnail, book.volumeInfo.authors, book.volumeInfo.pageCount, book.volumeInfo.publishedDate)}>
            <View style={styles.text}>
              <Image
                style={styles.image}
                source={{ uri: book.volumeInfo.imageLinks.thumbnail }}
              />
              <Text style={styles.bookTitle}>
                {book.volumeInfo.title}
              </Text>
            </View>
          </Pressable>
        )}
      />
      <View style={styles.listHeader}>
        <Text style={styles.newBooks}> New Books</Text>
        <Pressable style={styles.viewAll} onPress={(item) => { handleViewAllNewBooks(item.id) }}><Text>View All</Text></Pressable>
      </View>
      <FlatList
        data={newBooks}
        horizontal={true}
        keyExtractor={book => book.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: book }) => (
          <Pressable onPress={() => handleViewBookDet(book.id, book.volumeInfo.title, book.volumeInfo.description, book.volumeInfo.averageRating, book.volumeInfo.imageLinks.thumbnail, book.volumeInfo.authors, book.volumeInfo.pageCount, book.volumeInfo.publishedDate,book.accessInfo.pdf.downloadLink)}>
            <View style={styles.text}>
              <Image
                style={styles.image}
                source={{ uri: book.volumeInfo.imageLinks.thumbnail }}
              />
              <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
                {book.volumeInfo.title}
              </Text>
            </View>
          </Pressable>
        )}
      />
      <FlatList
        data={booksCategories}
        nestedScrollEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.ID}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleCategory(item.cat)}>
            <View style={[styles.category, { backgroundColor: item.color }]}>
              <Text style={styles.categoryName}>
                {item.cat}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  screen: {
    backgroundColor: 'white',
  },
  book: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 6,
  },
  searchbarFill: {
    marginTop: 10,
    backgroundColor: '#F0F8FF',
    height: 40,
    borderRadius: 25,
    marginHorizontal: 15,
    flexDirection: 'row',
  },
  inputStyle: {
    fontSize: 13,
    flex: 1,
  },
  arrowIcon:{
    marginTop:10,
    marginRight:10
  },
  icon: {
    height: 16,
    width: 16,
    marginHorizontal: 15,
    marginTop: 14,

  },
  searchButtonText:{
    marginTop:15,
    marginRight:20
  },
  bookTitle: {
    width: 100,
    fontSize: 13,
    textAlign: 'center',
    flexWrap: 'wrap',
    marginTop: 10,

  },
  popularBooks: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-start',

  },
  newBooks: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    alignSelf: 'flex-start',

  },
  text: {
    width: 100,
    height: 200,
    margin: 10
  },
  category: {
    height: 90,
    margin: 5,
    borderRadius: 5
  },
  categoryName: {
    width: 100,
    fontSize: 15,
    textAlign: 'center',
    flexWrap: 'wrap',
    marginTop: 40,
    color: 'white'
  },
  viewAll: {
    marginTop: 20
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  }
});

export default Books;