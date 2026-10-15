
import React, { useState } from 'react';
import { View ,Button,Image,Text,TextInput,SafeAreaView}from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

type Student = {
  name: string;
  reg: string;
};

export default function App() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [reg, setReg] = useState('');
  const [students, setStudents] = useState<Student[]>([]);

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets[0]?.uri) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets[0]?.uri) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const addStudent = () => {
    if (!name.trim() || !reg.trim()) {
      return;
    }

    const newStudent: Student = {
      name: name.trim(),
      reg: reg.trim(),
    };

    setStudents([...students, newStudent]);

    setName('');
    setReg('');
  };

  const deleteStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 20 }}>
        <Button title="Gallery" onPress={openGallery} />

        <View style={{ height: 10 }} />

        <Button title="Camera" onPress={openCamera} />

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200, marginTop: 10 }}
          />
        )}

        <View style={{ marginTop: 20 }}>
          <Text>Name:</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            style={{
              borderWidth: 1,
              padding: 8,
              marginBottom: 10,
            }}
          />

          <Text>Registration No:</Text>
          <TextInput
            value={reg}
            onChangeText={setReg}
            placeholder="Enter registration number"
            style={{
              borderWidth: 1,
              padding: 8,
              marginBottom: 10,
            }}
          />
        </View>

        <Button title="Add" onPress={addStudent} />

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Student Records
          </Text>

          {students.map((student, index) => (
            <View
              key={index}
              style={{
                borderRadius: 8,
                padding: 12,
                marginTop: 10,
              }}
            >
              <Text>Name: {student.name}</Text>
              <Text>RegNo: {student.reg}</Text>

              <View style={{ marginTop: 8 }}>
                <Button
                  title="Delete"
                  onPress={() => deleteStudent(index)}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
