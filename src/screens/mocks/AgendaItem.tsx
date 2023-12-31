import isEmpty from 'lodash/isEmpty';
import React, {useCallback} from 'react';
import {StyleSheet, Alert, View, Text, TouchableOpacity, Button} from 'react-native';

interface ItemProps {
  item: any;
  navigationLink:any;
  navigationTest:any;
  usernameAuth:any;
  index:any;
}

const AgendaItem = (props: ItemProps) => {
  const {item,navigationLink,navigationTest,usernameAuth,index} = props;

  const buttonPressed = useCallback(() => {
    //console.log(navigationTest);
    //navigationTest.navigate('TestScreen',{route:navigationLink});
    
  }, []);

  const itemPressed = useCallback(() => {
    Alert.alert(
      '',
      item.title,
      [
        {
          text: 'OK',
          onPress: () => null,
          style: 'cancel'
        },
        {
          text: 'JOIN',
          onPress: () =>{
            if (item.type == 'Offline') {
              navigationTest.navigate('OfflineLecture', {
                joinLink: item.link,
                username: item.username,
              });
            } else if (item.type == 'Youtube') {
              navigationTest.navigate('YoutubeVideo', {
                joinLink: item.link,
                username: item?.username,
              });
            } else if (item.type == 'Online') {
              Alert.alert('Online Lectures will be start soon!');
            }
          } 
        }
      ],
      { cancelable: true }
    );
    //Alert.alert(item.title);
  }, []);

  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={itemPressed} style={styles.item} key={index} >
      <View>
        <Text style={styles.itemHourText}>{item.hour}</Text>
        <Text style={styles.itemDurationText}>{item.duration}</Text>
      </View>
      <Text style={styles.itemTitleText}>{item.title}</Text>
      <View style={styles.itemButtonContainer}>
        <Button color={'grey'} title={'Info'} onPress={itemPressed}/>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(AgendaItem);


const styles = StyleSheet.create({
  item: {
    padding: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgrey',
    flexDirection: 'row',
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 4,
},
shadowOpacity: 0.30,
shadowRadius: 4.65,

elevation: 8,
  },
  itemHourText: {
    color: 'black'
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14
  }
});
