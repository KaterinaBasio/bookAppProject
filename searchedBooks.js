import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native";

const SearchedBooks = () => {
    const route = useRoute();
    const searchResult = route.params?.searchResult;
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
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Search Results</Text>
            <View style={styles.booksContainer}>
                {searchResult.map((book) => {
                    return (
                        <View style={styles.bookContainer} key={book.id}>
                            <Pressable onPress={() => handleViewBookDet(book.id, book.volumeInfo.title, book.volumeInfo.description, book.volumeInfo.averageRating, book.volumeInfo.imageLinks?.thumbnail, book.volumeInfo.authors, book.volumeInfo.pageCount, book.volumeInfo.publishedDate, book.accessInfo.pdf.downloadLink)}>
                                <View style={styles.imageAndTtitle}>
                                    <View style={styles.imageContainer}>
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
                                    </View>
                                    <View style={styles.titleContainer}>
                                        <Text style={styles.bookTitle}>
                                            {book.volumeInfo.title}
                                        </Text>
                                        <Text style={styles.bookAuthor} >
                                            By {book.volumeInfo.authors}
                                        </Text>
                                        {book.volumeInfo.averageRating ? (
                                            <Text style={styles.bookAuthor}>
                                                Rating: {book.volumeInfo.averageRating}
                                            </Text>

                                        ) : (
                                            <Text> Rating: N/A </Text>
                                        )}
                                    </View>
                                </View>
                            </Pressable>
                        </View>
                    )
                })}
            </View>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    booksContainer: {
    },
    image: {
        width: 100,
        height: 150,
        borderRadius: 5,
    },
    header: {
        fontWeight: 'bold',
        fontSize: 25,
        margin: 10
    },

    bookTitle: {
        padding: 5,
        fontSize: 19,
        fontWeight: 'bold',
        width: 280

    },
    bookAuthor: {
        padding: 5,
        fontSize: 15,
    },
    bookContainer: {
        width: 370,
        height: 200,
        backgroundColor: 'white',
        margin: 5,
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center'
    },
    imageAndTtitle: {
        display: 'flex',
        flexDirection: 'row',
    },

});
export default SearchedBooks;