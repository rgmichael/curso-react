import React from 'react';
import { View, Text } from 'react-native';

import ListaContatos from '../components/ListaContatos';

import axios from 'axios';

export default class ContatoPage extends React.Component {

  constructor(props){
      super(props);

      this.state = {
        peoples: []
      };
  }

  componentDidMount(){
      axios
          .get('https://randomuser.me/api/?nat=br&results=5')
          .then(response => {
                const { results } = response.data;
                this.setState({
                  peoples: results
                });
          })
  }

  render() {
    
    return (
      <View>
        <ListaContatos 
        peoples = { this.state.peoples }
        onPressItem = {pageParametros => {
          this.props.navigation.navigate('ContatoDetalhe', pageParametros);
        }}/>
      </View>
    ); 
  }
}

