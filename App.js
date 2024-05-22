import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { auth } from './config';
import LogIn from './src/logIn';
import Register from './src/register';
import HomePage from './src/homepage';
import FavBooks from './src/favourite';
import Categories from './src/categories';
import BookPage from './src/bookScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PopularBooks from './src/popularBooks';
import NewBooks from './src/newBooks';
import SearchedBooks from './src/searchedBooks';
import BookRead from './src/library';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Home = () => {

  const navigation = useNavigation();
  const logOut = async () => {
    try {
      await auth.signOut();
      navigation.navigate('LogIn');
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <StatusBar translucent backgroundColor="linen" barStyle='light-content' />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? 'home'
                : 'home-outline';
            } else if (route.name === 'Favourite') {
              iconName = focused
                ? 'heart'
                : 'heart-outline';
            }
            else if (route.name === 'My Library') {
              iconName = focused
                ? 'book'
                : 'book-outline'
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#B4ACA5',
          tabBarInactiveTintColor: 'gray',
          tabBarHideOnKeyboard: 'true'
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomePage}
          options={{
            headerStyle: {
              backgroundColor: '#E6DCD2'
            },
            headerRight: () => (
              <Pressable onPress={logOut} >
                <Ionicons name="log-out-outline" size={24} color="black" style={{ marginRight: 10 }} />
              </Pressable>)
          }}/>
        <Tab.Screen
          name="Favourite"
          component={FavBooks}
          options={{
            headerStyle: {
              backgroundColor: '#E6DCD2',},
            headerTitle: 'My Favourites',
          }}/>
        <Tab.Screen
          name="My Library"
          component={BookRead}
          options={{
            headerStyle: {
              backgroundColor: '#E1D8CF'
            }
          }}/>
      </Tab.Navigator>
    </>
  )
}

export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='LogIn'
          component={LogIn}
          options={{
            headerShown: false
          }
          }
        />
        <Stack.Screen
          name='HomePage'
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen
          name='Register'
          component={Register}
          options={
            {
              headerShown: false,
              cardStyleInterpolator: ({ current: { progress } }) => {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateY: progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [900, 0],
                        }),
                      },
                    ],
                  },
                };
              },
            }}
        />
        <Stack.Screen
          name='Categories'
          component={Categories}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#E1D8CF'
            }
          }}
        />
        <Stack.Screen
          name='Favourites'
          component={FavBooks}
        />
        <Stack.Screen
          name='Book Details'
          component={BookPage}
        />
        <Stack.Screen
          name='Popular Books'
          component={PopularBooks}
        />
        <Stack.Screen
          name='New Books'
          component={NewBooks}
        />
        <Stack.Screen
          name='SearchedBooks'
          component={SearchedBooks}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#F0F8FF'
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

