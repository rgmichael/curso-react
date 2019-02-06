import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import PeopleListItem from './PeopleListItem';

const ListaContatos = props => {
  const { peoples, onPressItem } = props;

  const items = peoples.map(people =>{
        return (
            <PeopleListItem 
                key={people.name.first} 
                people={people}
                navigateToContatoDetalhe={onPressItem} />
        );
  });

   return(
          <View style={style.container}>
                { items }
          </View>
    )  
};

const style = StyleSheet.create({
    container: {
      backgroundColor: '#e2f9ff'
    }
  });

export default ListaContatos;


