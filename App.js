import { createAppContainer, createStackNavigator} from 'react-navigation';

import PeoplePage from './src/pages/PeoplePage';
import PeopleDetailPage from './src/pages/PeopleDetailPage';

const AppNavigator = createStackNavigator({
      Main: PeoplePage,
      ContatoDetalhe: PeopleDetailPage
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