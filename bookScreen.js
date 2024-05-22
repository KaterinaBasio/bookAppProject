import { auth, db } from '../config';
import { favCollection } from '../config';
import { useState, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Text, View, Image, Pressable, ImageBackground } from "react-native";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { arrayUnion, updateDoc, doc, getDoc } from 'firebase/firestore';

const Book = ({ route }) => {
    const { bookId, bookImage, bookTitle, bookRating, bookAuthor, bookDescription, bookPages, bookPublished, bookLink } = route.params;
    const [showFullBookDesc, setShowFullBookDesc] = useState(false);
    const [similarBooks, setSimilarBooks] = useState([]);
    const [favorites, setFavorites] = useState([]);

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
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://www.googleapis.com/books/v1/volumes?q=inauthor:${bookAuthor}&maxResults=4`
                );
                const data = await response.json();
                const booksBySameAuthor = data.items.filter((book) => {
                    return !similarBooks.some((existingBooks) => existingBooks.id === book.id);
                })
                setSimilarBooks([...similarBooks, ...booksBySameAuthor]);

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);
    const addToFavorites = async (bookId, bookName, bookImage, bookAuthor) => {
        try {
            const user = auth.currentUser;
            const favCollection = doc(db, 'favourites', user.email);
            const bookData = { id: bookId, BookTitle: bookName, BookAuthor: bookAuthor };
            if (bookImage) {
                bookData.BookImage = bookImage;
            }
            const update = await updateDoc(favCollection, { books: arrayUnion(bookData) });
            const favDoc = await getDoc(favCollection);
            const favorites = favDoc.data().books;
            setFavorites(favorites);
        } catch (error) {
            console.log(error);
        }
    };

    const isFavourite = (bookId) => {
        return favorites.some(book => book.id === bookId)
    }
    const handleShowFullDesc = () => {
        setShowFullBookDesc(!showFullBookDesc);
    };
    const year = bookPublished.substr(0, 4);
    const MAX_DESCRIPTION_LINES = 5;
    const descriptionLines = bookDescription.split('\n');


    return (
        <ScrollView style={styles.container}>
            <ImageBackground source={{ uri: bookImage }} opacity={0.2} style={styles.booksDetSection} >
                <View style={styles.booksDetSection}>
                    <View>
                        {isFavourite(bookId) ? (
                            <Ionicons
                                name="heart"
                                style={styles.heartIcon}
                                size={25}
                            />
                        ) : (
                            <Pressable onPress={() => addToFavorites(bookId, bookTitle, bookImage, bookAuthor)}>
                                <Ionicons
                                    name="heart-outline"
                                    style={styles.heartIcon}
                                    size={25}
                                />
                            </Pressable>
                        )}
                    </View>
                    {bookImage ? (
                        <Image style={styles.bookImage} source={{ uri: bookImage }} />
                    ) : (
                        <Image
                            style={styles.noBookImage}
                            source={require('../assets/noImagePicture.png')}
                        />
                    )}
                    <Text style={styles.booksTitle}>{bookTitle}</Text>
                    <Text style={styles.booksAuthor}>{bookAuthor}</Text>
                    <View style={styles.bookDetails}>
                        <Text style={styles.bookshighlights}>Year: {year}</Text>
                        <Text style={styles.seperator}>  |  </Text>
                        <Text style={styles.bookshighlights}>Pages: {bookPages}</Text>
                        <Text style={styles.seperator}>  |  </Text>
                        <Ionicons name="star" style={styles.starIcon} size={15}></Ionicons>
                        <Text style={styles.bookshighlights}>{bookRating} /5</Text>
                    </View>
                </View>
            </ImageBackground>
            <View>
                <Text style={styles.sectionsHeader}>Synopsis</Text>
                {bookDescription ? (
                    <Pressable onPress={handleShowFullDesc}>
                        {showFullBookDesc ? (
                            <>
                                <Text style={styles.booksDescription}>{bookDescription}</Text>
                                <Text style={styles.showMore}>Show less</Text>
                            </>
                        ) : (
                            <>
                                <Text numberOfLines={5} ellipsizeMode="tail" style={styles.booksDescription}>
                                    {bookDescription}
                                </Text>
                                <Text style={styles.showMore}>Show more</Text>
                            </>
                        )}
                    </Pressable> 
                 ) : (
                    <View>
                        <Text style={styles.booksDescription}>No description available</Text>
                    </View>
                )}
            </View>
            <Text
                style={styles.sectionsHeader}>More by the Author
            </Text>
            <View style={styles.similarBooksContainer}>
                <FlatList
                    data={similarBooks}
                    horizontal={true}
                    keyExtractor={(item, book) => `${item.id}_${book}`}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item: book }) =>
                        <View style={styles.bookContainer}>
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
                                <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">{book.volumeInfo.title}</Text>
                            </Pressable>
                        </View>
                    } />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "flex-start",
        margin: 10,
    },
    booksDetSection: {
        alignSelf: "center",
        width: '100%'
    },
    booksTitle: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        alignSelf: 'center'
    },
    bookshighlights: {
        fontSize: 15,
        fontWeight: "bold",
        color: "grey",
    },
    bookPublished: {
        fontSize: 15,
        fontWeight: "bold",
        color: "grey",
    },
    booksAuthor: {
        alignSelf: 'center',
        color: 'black',
        fontWeight: 'bold'
    },
    seperator: {
        color: 'gray'
    },
    bookImage: {
        width: 100,
        height: 170,
        alignSelf: "center",
        marginTop: 20
    },
    sectionsHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 20,
        color: '#696969',
        marginTop: 20
    },
    booksDescription: {
        marginTop: 5,
        marginLeft: 20,
        marginRight: 20
    },
    showMore: {
        fontSize: 15,
        fontWeight: "bold",
        color: "blue",
        alignSelf: "center",
        backgroundColor: "white",
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    bookDetails: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginTop: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 20
    },
    starIcon: {
        color: '#FFD700'
    },
    heartIcon: {
        color: 'red',
        alignSelf: 'flex-end',
        marginRight: 10,
        marginTop: 10

    },
    image: {
        width: 100,
        height: 150,
        borderRadius: 6,
        marginLeft: 10,
        marginTop: 5
    },
    noBookImage: {
        width: 160,
        height: 170,
        alignSelf: 'center'

    },
    similarBooksContainer: {
        alignItems: 'center'
    },
    bookTitle: {

        fontSize: 13,
        textAlign: 'center',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    book: {
        marginLeft: 10
    },
    bookContainer: {
        width: 100,
        height: 200,
        marginLeft: 7
    }


});

export default Book;
