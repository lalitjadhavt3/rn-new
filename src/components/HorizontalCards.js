import React from 'react';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';
export default HorizontalScrollCards = () => {
  const data = [
    {id: 1, image: require('../assets/image-17.png'), title: 'Card 1'},
    {id: 2, image: require('../assets/image-17.png'), title: 'Card 2'},
    {id: 3, image: require('../assets/image-17.png'), title: 'Card 3'},

    // Add more cards as needed
  ];

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  card: {
    width: 200,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardTitle: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
