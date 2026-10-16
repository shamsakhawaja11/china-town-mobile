
import { SafeAreaView, Text } from 'react-native';
import { AppTextField } from './src/components/AppTextField';

export default function App() {
  return (
    <SafeAreaView style={{backgroundColor:'yellow',height:'100%'}}>
      <Text>koi</Text>
      <AppTextField label='Email'/>
    </SafeAreaView>
  );
}
