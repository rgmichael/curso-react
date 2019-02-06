import { createAppContainer, createStackNavigator} from 'react-navigation';

import ContatoPage from './src/pages/ContatoPage';
import ContatoDetalhePage from './src/pages/ContatoDetalhePage';

const AppNavigator = createStackNavigator({
      Main: ContatoPage,
      ContatoDetalhe: ContatoDetalhePage
}, {
    defaultNavigationOptions:{
        title: 'Contatos',
        headerTintColor: 'white',
        headerStyle:{
          backgroundColor:'#6ca2f7',
          borderBottomWidth: 1,
          borderBottomColor: '#c5c5c5' 
        },
        headerTitleStyle:{
          color: 'white',
          fontSize: 30,
          flexGrow: 1,
          textAlign: 'center'
        } 
    }
});


export default createAppContainer(AppNavigator);