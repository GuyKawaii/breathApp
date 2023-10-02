import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { database, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function App() {
  const Stack = createNativeStackNavigator();
  const [notesCollection, loading, error] = useCollection(collection(database, "notes"));
  const notesData = notesCollection?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ListPage" component={(props) => <ListPage {...props} data={notesData} />} />

        <Stack.Screen name="DetailsPage" component={DetailsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const ListPage = ({ navigation, data }) => {
  const defaultNotes = [{ key: 1, name: "Lars Lars :)" }, { key: 2, name: "per peterson" }];
  const [noteTitle, setNoteTitle] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const navigateToDetails = (item) => navigation.navigate('DetailsPage', { note: item });

  const removeNote = async (id) => await deleteDoc(doc(database, "notes", id));

  const openUpdateDialog = (item) => {
    setSelectedNote(item);
    setNoteTitle(item.title);
  };

  const saveNote = async () => {
    try {
      await addDoc(collection(database, "notes"), {
        title: noteTitle
      });
    } catch (error) {
      console.error("Error adding note: ", error);
    }
  };

  const updateExistingNote = async () => {
    if (!selectedNote) return;
    await updateDoc(doc(database, "notes", selectedNote.id), { title: noteTitle });
    setSelectedNote(null);
    setNoteTitle('');
  };

  async function launchImagePicker() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    })

    if (!result.canceled) {
      setImagePath(result.assets[0].uri)
    }
  }

  async function uploadImage() {
    const res = await fetch(imagePath)
    const blob = await res.blob();
    const storageRef = ref(storage, "myimage.jpg");
    uploadBytes(storageRef, blob).then((snapshot => { alert("image uploaded") }))
  }

  async function downloadImage(id) {
    getDownloadURL(ref(storage, id + ".jpg"))
      .then((url) => {
        setImagePath(url)
      })
      .catch((error) => {
        alert("error in download: " + error);
      })
  }

  return (
    <View style={styles.container}>
      <Text>List of notes</Text>
      {selectedNote &&
        <View>
          <TextInput defaultValue='REMOVE THIS TEXT LATER' />
          <Text onPress={updateExistingNote}>Save</Text>
        </View>
      }

      <TextInput
        style={styles.textInput}
        value={noteTitle}
        onChangeText={setNoteTitle}
      />
      <Button title='Create' onPress={saveNote} />
      <FlatList
        data={data}
        renderItem={(note) => (
          <View>
            <Button title={note.item.title} onPress={() => navigateToDetails(note.item)} />
            <Text onPress={() => removeNote(note.item.id)}>Delete</Text>
            <Text onPress={() => openUpdateDialog(note.item)}>Update</Text>
          </View>
        )}
      />
      <View>
        <Image style={{ width: 200, height: 200 }} source={{ uri: imagePath }} />
        <Button title='Pick image' onPress={launchImagePicker} />
        <Button title='upload image' onPress={uploadImage} />
        <Button title='download image' onPress={downloadImage} />
      </View>
    </View>
  );
};

const DetailsPage = ({ navigation, route }) => {
  const note = route.params?.note;
  const [noteTitle, setNoteTitle] = useState(note?.title || "");

  useEffect(() => {
    if (note) setNoteTitle(note.title);
  }, [note]);

  const updateExistingNote = async () => {
    if (!note) return;
    try {
      await updateDoc(doc(database, "notes", note.id), { title: noteTitle });
      navigation.goBack(); // or navigate to another screen if necessary
    } catch (error) {
      console.error("Error updating note: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={noteTitle}
        onChangeText={setNoteTitle}
      />
      <Button title='Update' onPress={updateExistingNote} />
      <Button title="Go back" onPress={() => navigation.navigate('ListPage')} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    minWidth: 200
  },
});
