import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { upperPrimeiraLetra } from '../util';
import Line from '../components/Line';

export default class PeopleDetailPage extends React.Component {

    static navigationOptions = ({navigation}) => {
        const peopleName = upperPrimeiraLetra(navigation.state.params.people.name.first)
        return({
            title: peopleName,
            headerTitleStyle: {
                color: '#fff',
                fontSize: 30,
                fontWeight: 'normal'
            }
        });
    }
 

  render() {
    const { people } = this.props.navigation.state.params;
    return (
      <View style={styles.container} >
          <Image 
            style={styles.avatar} 
            source={{ uri: people.picture.large }}/>
        <View style={styles.datailContainer} > 
            <Line label="Email:" content={ people.email }></Line>
            <Line label="Cidade:" content={ people.location.city }></Line>
            <Line label="Estado:" content={ people.location.state }></Line>
            <Line label="Tel:" content={ people.phone }></Line>
            <Line label="Cel:" content={ people.cell }></Line>
            <Line label="Nacionalidade:" content={ people.nat }></Line>
            <Line label="Profissão:" content={ people.job }></Line>
        </View>   
      </View>
    ); 
  }
}

const styles = StyleSheet.create({
  container: {
     padding: 15
  },
  avatar: {
     aspectRatio: 1
  },
  datailContainer: {
     backgroundColor: '#e2f9ff',
     marginTop: 20,
     elevation: 1
    },
 
});