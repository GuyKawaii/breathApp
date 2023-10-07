import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Button } from 'react-native-paper';

export default function DraggableList() {
  const [data, setData] = useState([
    { key: '1', label: 'Item 1' },
    { key: '2', label: 'Item 2' },
    { key: '3', label: 'Item 3' },
  ]);

  const [holdDuration, setNewItemLabel] = useState('');  // New state for input

  const addHold = () => {
    const newKey = Date.now().toString();  // Generate a unique key using timestamp
    const newItem = { key: newKey, label: holdDuration, type: 'hold', duration: holdDuration };
    setData([newItem, ...data]);
    setNewItemLabel('');
  };

  const deleteItemByKey = (key) => {
    const newData = data.filter(item => item.key !== key);
    setData(newData);
  };

  const renderItem = ({ item, index, drag, isActive }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 50,
            backgroundColor: isActive ? 'blue' : 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopWidth: 1,
            borderColor: '#ddd',
          }}
          onLongPress={drag}
        >
          <Text>{item.label}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteItemByKey(item.key)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.inputContainer}>
        <TextInput
          value={holdDuration}
          onChangeText={setNewItemLabel}
          placeholder="Enter new item label..."
          style={styles.input}
        />
        <Button onPress={addHold}>Add</Button>
      </View>
      <DraggableFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => `draggable-item-${item.key}`}
        onDragEnd={({ data }) => setData(data)}
      />
      <Button onPress={() => showList()}>console log list</Button>
    </View>
  );

  function showList() {
    console.log(data);
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    width: 70,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
});

