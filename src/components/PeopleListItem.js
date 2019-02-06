import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { upperPrimeiraLetra } from '../util';


const PeopleListItem = props => {
    const { people, navigateToContatoDetalhe } = props;
    const { title, first, last } = people.name;
    return(
        <TouchableOpacity onPress={() => {
            console.log('clicou em= ', first);
            navigateToContatoDetalhe({people});
        }}>
            <View style={style.line}>
                <Image style={style.avatar} source={{ uri: people.picture.thumbnail }}/>
                <Text style={style.lineText}>
                    { `${
                        upperPrimeiraLetra(title)
                    } ${
                        upperPrimeiraLetra(first)
                    } ${
                        upperPrimeiraLetra(last)
                    } `}
                </Text>
            </View>
        </TouchableOpacity>
  );  

};

const style = StyleSheet.create({
    line: {
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: "#bbb",
        alignItems: 'center',
        flexDirection: 'row'
      },
    lineText: {
        fontSize: 20,
        paddingLeft: 15,
        flex: 7
      },
    avatar: {
        aspectRatio: 1,
        flex: 1,
        marginLeft: 15,
        borderRadius: 50
      }
  });

  
export default PeopleListItem;


