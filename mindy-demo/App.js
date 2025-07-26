import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PersonaSelectScreen from './screens/PersonaSelectScreen';
import ChatScreen from './screens/ChatScreen';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import QuestionnaireScreen from './screens/QuestionnaireScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Persona">
        <Stack.Screen
          name="Persona"
          component={PersonaSelectScreen}
          options={{ title: 'Mindy' }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: 'Mindy와의 대화' }} // 원하면 headerShown: false로 감출 수도 있음
        />
        <Stack.Screen
          name="PHQ9"
          component={QuestionnaireScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>halo!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
