import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Pressable, Modal } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { arrayUnion, updateDoc, doc, getDoc, FieldValue } from 'firebase/firestore';
import { db } from '../config';
import { auth } from '../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { TextInput } from 'react-native';


export default function ReadBooks() {
  const [permission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannerOpen, setScanOpen] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const [bookRead, setBookRead] = useState([]);
  const [pagesAndComments, setPagesAndComments] = useState({ pages: '', comments: '' })
  const [openModal, setOpenModal] = useState(false);
  const [bookId, setBookId] = useState()


  useFocusEffect(
    React.useCallback(() => {
      const getPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setPermission(status === 'granted');
      };
      getReadBooks();
      getPermissions();
    }, [])
  );

  const fetchBookDetails = async (isbn) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await response.json();
      return data.items[0].volumeInfo;
    } catch (error) {
      console.error(error);
    }
  };
  const getReadBooks = async () => {
    try {
      const user = auth.currentUser;
      const readBookCollection = doc(db, 'readBooks', user.email);
      const readBooksDoc = await getDoc(readBookCollection);
      const readBook = readBooksDoc.data().books;
      setBookRead(readBook);
      console.log(readBook);
    } catch (error) {
      console.log(error);
    }
  };
  const handleOpenModal = (bookId) => {
    console.log('the book id is ', bookId);
    setOpenModal(true);
    setPagesAndComments({ pages: '', comments: '' });
  };

  const removeReadBook = async (id) => {
    try {
      const user = auth.currentUser;
      const readBooksCollection = doc(db, 'readBooks', user.email);
      const readBookDoc = await getDoc(readBooksCollection);
      const readBooks = readBookDoc.data().books;
      const updatedreadBooks = readBooks.filter((book) => book.id !== id);
      await updateDoc(readBooksCollection, { books: updatedreadBooks });
      setBookRead(updatedreadBooks);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (id, pages, comments) => {
    const user = auth.currentUser;
    const readBooksCollection = db.collection('readBooks').doc(user.email);
    try {
      const doc = await readBooksCollection.get();
      const books = doc.data().books;
      const updatedBooks = books.map(book => {
        if (book.id === id) {
          return {
            ...book,
            pages: pages,
            comments: comments,
          };
        } else {
          return book;
        }
      });
      await readBooksCollection.update({ books: updatedBooks });
      setOpenModal(false)
      getReadBooks();
    } catch (error) {
      console.error(error);
    }
  };
  const handleBarCodeScanned = async ({ data }) => {
    const user = auth.currentUser;
    setScanned(true);
    setScanOpen(false);
    const bookDetails = await fetchBookDetails(data);
    setBookDetails(bookDetails);
    const { title, authors, imageLinks } = bookDetails;
    const book = {
      id: data,
      title,
      author: authors.join(', '),
      image: imageLinks.thumbnail,
      pages: '',
      comments: ''
    };
    const readCollection = doc(db, 'readBooks', user.email);
    await updateDoc(readCollection, { books: arrayUnion(book) });
    const readBookDoc = await getDoc(readCollection);
    const readBooks = readBookDoc.data().books;
    setBookRead(readBooks);
  };
  const handleOpenScanner = () => {
    setScanned(false);
    setScanOpen(true);
    setBookDetails(null);
  };
  const addPagesAndCommentsModal = () => {
    return (
      <Modal visible={openModal} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.headerAndCloseButton}>
              <Text style={styles.modalHeader}>Add Read Details</Text>
              <Pressable onPress={() => setOpenModal(false)}>
              <Ionicons name='close-outline' size={20} style={styles.barcodedIcon}></Ionicons>
              </Pressable>
            </View>
            <View style={styles.mainModalContent}>
            <Text style={styles.pageLabel}>Pages</Text>
            <TextInput
              style={styles.pages}
              label="Pages"
              value={pagesAndComments.pages}
              onChangeText={(pages) => setPagesAndComments({ ...pagesAndComments, pages })}
              keyboardType="numeric"
            />
            <Text style={styles.commentsLabel}>Comments</Text>
            <TextInput
              style={styles.comments}
              label='Comments'
              value={pagesAndComments.comments}
              onChangeText={(comments) => setPagesAndComments({ ...pagesAndComments, comments })}
              multiline
            />
            <View style={styles.addCancelButtons}>
              <Pressable onPress={() => handleSubmit(bookRead[bookId].id, pagesAndComments.pages, pagesAndComments.comments)}>
                <Text style={styles.addButton}>Submit</Text>
              </Pressable>
            </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  if (permission === null) {
    return <Text>Requesting permission</Text>;
  }
  if (permission === false) {
    return <Text>Permission denied</Text>;
  }

  return (
    <View style={styles.outerContainer}>
      {!scannerOpen && (
        <Pressable style={styles.iconStyle} onPress={handleOpenScanner}>
          <Text style={styles.header}>Track A Book</Text>
          <Ionicons name='barcode-outline' size={40} style={styles.barcodedIcon}></Ionicons>
        </Pressable>)
      }
      <ScrollView style={styles.container}>
        <View>
          {
            bookRead.map((book, i) => {
              return (
                <View key={book.id} style={styles.bookContainer}>
                  <View style={styles.bookDet}>
                    <View style={styles.title}>
                      <Text style={styles.bookTitle}>{book.title}</Text>
                    </View>
                    <View style={styles.author}>
                      <Text>By </Text>
                      <Text style={styles.authorName}> {book.author}</Text>
                    </View>
                  </View>
                  <View style={styles.imageAndButtonsContainer}>
                    <Image style={styles.image} source={{ uri: book.image }} />
                    <View style={styles.pageandcomments}>
                      <Text style={styles.pagesLabel}>Pages</Text>
                      {book.pages ? (
                        <Text style={styles.pagesValue}>{book.pages}</Text>
                      ) : (
                        <Text style={styles.noPages}>No pages currently</Text>
                      )}
                      <Text style={styles.pagesLabel}>Comments</Text>
                      {book.comments ? (
                        <Text style={styles.pagesValue}>{book.comments}</Text>
                      ) : (
                        <Text style={styles.noComments}>No Comments currently</Text>
                      )}

                    </View>
                  </View>
                  <View style={styles.buttons}>
                    <Pressable style={styles.editButton} onPress={() => { setBookId(i), handleOpenModal() }}>
                      <Ionicons name='create-outline' size={30} style={styles.editIcon}></Ionicons>
                    </Pressable>
                    <Pressable style={styles.deleteButton} onPress={() => { removeReadBook(book.id) }}>
                      <Ionicons name='trash-outline' size={30} style={styles.deleteIcon}></Ionicons>
                    </Pressable>
                  </View>
                </View>
              )
            })}
          <Modal visible={openModal} animationType='fade' transparent={true}>
            <Pressable style={styles.filterBackground} onPress={() => { setOpenModal(false) }}>
            </Pressable>
          </Modal>
        </View>

        {openModal && addPagesAndCommentsModal()}
      </ScrollView>
      {scannerOpen && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.barcode}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  iconStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20
  },
  image: {
    width: 100,
    height: 160,
    marginTop: 10
  },
  bookContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 350,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderColor: '#B4ACA5',
    borderWidth: 0.1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 8, height: 6 },
    elevation: 3,
    backgroundColor: 'white'
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 10
  },
  deleteBook: {
    color: 'red',
  },
  remove: {
    alignSelf: 'flex-end',
    paddingRight: 10
  },
  author: {
    display: 'flex',
    flexDirection: 'row'
  },
  authorName: {
    fontWeight: 'bold'
  },
  pageandcomments: {
    // backgroundColor: 'red',
    width: 200,
    marginTop: 10,
    padding: 20
  },
  bookDet: {
    // backgroundColor: 'yellow',
    width: 340,
    flexWrap: 'wrap'
  },
  imageAndButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    // backgroundColor: 'pink'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    width: 200,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: 10,
    // backgroundColor: 'blue'
  },
  deleteIcon: {
    color: 'red',
    paddingBottom: 10
  },
  modal: {
    flex: 1,
    width: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 0
  },
  modalHeader: {
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center'
  },
  modalContent: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20
  },
  mainModalContent:{
    marginTop:10
  },
  pageLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 20
  },
  commentsLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  pages: {
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 10,
    padding: 3,
  },
  comments: {
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 10,
    padding: 3,
    marginTop: 5
  },
  addCancelButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  addButton: {
    fontSize: 15,
    color: 'black',
    backgroundColor: '#d9e7c1',
    padding: 8,
    borderRadius: 20
  },
  headerAndCloseButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  cancelButton: {
    fontSize: 15,
  
  },
  pagesLabel: {
    fontWeight: 'bold',
    fontSize: 19,
  },
  noPages: {
    color: 'grey',
    paddingBottom: 10
  },
  noComments: {
    color: 'grey'
  },
  barcode: {
    width: '100%',
    height: '100%',
    alignSelf: 'center'
  }
});
