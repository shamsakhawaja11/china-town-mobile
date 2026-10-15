import { useState } from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const login=()=>{
        
    }
    return (
        <SafeAreaView>
            <KeyboardAvoidingView>
                <ScrollView>
                    <Text>Email</Text>
                    <TextInput autoCapitalize="none" autoCorrect={false}
                        onChangeText={setEmail}
                    />
                    <Text>Password</Text>
                    <TextInput autoCapitalize="none" autoCorrect={false}
                        onChangeText={setPassword}
                    />
                    <Pressable onPress={login}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )

}