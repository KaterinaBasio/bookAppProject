import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View, Pressable, Image, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const RomanceBooks = () => {


  const [books, setBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [filter, setFilter] = useState('default');
  const [modalVisibility, setModalVisibility] = useState(false);

  const navigation = useNavigation();
  function handleViewBookDet(id, title, description, rating, image, author, pages, publichedDate) {
    navigation.navigate('Book Details',
      {
        bookId: id,
        bookTitle: title,
        bookDescription: description,
        bookRating: rating,
        bookImage: image,
        bookAuthor: author,
        bookPages: pages,
        bookPublished: publichedDate
      })
  }

  useEffect(() => {
    const fetchRomanceBooks = async () => {
      const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=romance&langRestrict=en&orderBy=newest&printType=books&maxResults=40');
      const data = await response.json();
      const newRomanceBooks = data.items.filter((book) => {
        return !books.some((existingBooks) => existingBooks.id === book.id);
      })
      setNewBooks([...books, ...newRomanceBooks]);
    }
    fetchRomanceBooks();
  }, []);

  const filteredBooks = (newBooks, filter) => {
    switch (filter) {
      case 'title':
        return newBooks.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
      case 'author':
        return newBooks.sort((a, b) => {
          let authorOne = a.volumeInfo.authors && a.volumeInfo.authors.length > 0 ? a.volumeInfo.authors[0]: "N/A";
          let authorTwo = b.volumeInfo.authors && b.volumeInfo.authors.length > 0 ? b.volumeInfo.authors[0]: "N/A";
          return authorOne.localeCompare(authorTwo);
        });
              default:
        return newBooks;
    }
  };

  const filterBooks = filteredBooks(newBooks, filter);


  const filterModal = () => {
    return (
      <View style={styles.modal}>
        <Text style={styles.sortBy}>Sort By</Text>
        <Pressable
          style={styles.optionTitle}
          onPress={() => {
            setFilter('title');
            setModalVisibility(false);
          }}>
          <Text style={styles.modalOption}> Title </Text>
        </Pressable>
        <Pressable
          style={styles.optionTitle}
          onPress={() => {
            setFilter('author');
            setModalVisibility(false);
          }}>
          <Text style={styles.modalOption}> Author </Text>
        </Pressable>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.upperPart}>
        <Text style={styles.text}> Romance Books </Text>
        <Pressable onPress={() => { setModalVisibility(true) }}>
          <Ionicons name="filter-outline" style={styles.filterIcon} size={30}></Ionicons>
        </Pressable>
      </View>
      <View style={styles.booksContainer}>
        {filterBooks.map((book) => {
          return (
            <View style={styles.bookContainer} key={book.id}>
              <Pressable onPress={() => handleViewBookDet(book.id, book.volumeInfo.title, book.volumeInfo.description, book.volumeInfo.averageRating, book.volumeInfo.imageLinks?.thumbnail, book.volumeInfo.authors, book.volumeInfo.pageCount, book.volumeInfo.publishedDate, book.accessInfo.pdf.downloadLink)}>
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <Image
                    style={styles.image}
                    source={{ uri: book.volumeInfo.imageLinks.thumbnail }}
                  />
                ) : (
                  <Image
                    style={styles.image}
                    source={require('../assets/noImage.png')}
                  />
                )}
                <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
                  {book.volumeInfo.title}
                </Text>
              </Pressable>
            </View>
          );
        })}
        <Modal visible={modalVisibility} animationType='fade' transparent={true}>
          <Pressable style={styles.filterBackground} onPress={() => { setModalVisibility(false) }}>
            {filterModal()}
          </Pressable>

        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 20,

    alignSelf: 'flex-start'
  },
  booksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',

  },
  bookContainer: {
    width: 100,
    height: 200,
    marginLeft: 7
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 5
  },
  bookTitle: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  upperPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sortBy: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 5
  },
  filterBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    width: 170,
    height: 98,
    borderRadius: 3
  },
  modalOption: {
    fontSize: 18,
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray'
  }

});




export default RomanceBooks;
