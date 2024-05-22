import { Text,View ,StyleSheet, ScrollView} from "react-native";
import FantasyBooks from "./fantasyBooks";
import RomanceBooks from './romanceBooks';
import AdventureBooks from './adventureBooks';
import MysteryBooks from './mysteryBooks';
import ScienceFictionBooks from './scienceFictBooks';
import ThrillerBooks from './thrillerBooks';


const  Categories = ({route})=> {
    const category= route.params.category;
    let Screen;
    if(category === 'Fantasy'){
        Screen = FantasyBooks
    }
    else if(category === 'Romance'){
        Screen = RomanceBooks
    }else if(category === 'Adventure'){
        Screen = AdventureBooks
    }else if (category === 'Mystery'){
        Screen = MysteryBooks
    }else if (category=== 'Thriller/Horror'){
        Screen = ThrillerBooks
    }else if (category === 'Science Fiction'){
        Screen = ScienceFictionBooks
    }

    return (
        <ScrollView style={styles.screen}>
        <View style={styles.container}>
            {Screen && <Screen/>}
        </View>
        </ScrollView>
    );

}
const styles = StyleSheet.create({
    screen: {
        backgroundColor: 'white',
      },
  });
  

export default Categories;