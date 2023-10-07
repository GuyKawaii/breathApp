import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Button } from 'react-native-paper';

export default function DraggableList({ navigation }) {
  const [steps, setSteps] = useState([
    { key: "1", label: `2 x Breath 1s in, 2s out`, type: 'breathe', in: 1, out: 2, numberOfBreaths: 2 }
  ]);

  const [breathInDuration, setBreathInDuration] = useState('4');
  const [breathOutDuration, setBreathOutDuration] = useState('6');
  const [numberOfBreaths, setNumberOfBreaths] = useState('3');
  const [quickDuration, setQuickDuration] = useState('4');
  const [holdDuration, setHoldDuration] = useState('30');

  const addBreath = () => {
    const newKey = Date.now().toString();  // Generate a unique key using timestamp
    const newItem = { key: newKey, label: `${numberOfBreaths} x Breath ${breathInDuration}s in, ${breathOutDuration}s out`, type: 'breathe', in: parseInt(breathInDuration), out: parseInt(breathOutDuration), numberOfBreaths: parseInt(numberOfBreaths) };
    setSteps([newItem, ...steps]);
  }

  const addQuick = () => {
    const newKey = Date.now().toString();  // Generate a unique key using timestamp
    const newItem = { key: newKey, label: `Quick ${quickDuration}s`, type: 'quick', duration: parseInt(quickDuration, 10) };
    setSteps([newItem, ...steps]);
  }

  const addHold = () => {
    const newKey = Date.now().toString();  // Generate a unique key using timestamp
    const newItem = { key: newKey, label: `Hold ${holdDuration}s`, type: 'hold', duration: parseInt(holdDuration, 10) };
    setSteps([newItem, ...steps]);
  };

  const deleteItemByKey = (key) => {
    const newData = steps.filter(item => item.key !== key);
    setSteps(newData);
  };

  const renderItem = ({ item, index, drag, isActive }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 50,
            backgroundColor: isActive ? 'lightblue' : 'white',
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
        <Text>Breath: </Text>
        <Text>In: </Text>
        <TextInput
          keyboardType="number-pad"
          TextInput
          value={breathInDuration}
          onChangeText={setBreathInDuration}
          placeholder="seconds for hold"
          style={styles.input}
        />
        <Text>Out: </Text>
        <TextInput
          keyboardType="number-pad"
          TextInput
          value={breathOutDuration}
          onChangeText={setBreathOutDuration}
          placeholder="seconds for hold"
          style={styles.input}
        />
        <Button onPress={addBreath}>Add</Button>
      </View>

      <View style={styles.inputContainer}>
        <Text>Quick: </Text>
        <TextInput
          keyboardType="number-pad"
          TextInput
          value={holdDuration}
          onChangeText={setQuickDuration}
          placeholder="seconds for hold"
          style={styles.input}
        />
        <Button onPress={addQuick}>Add</Button>
      </View>

      <View style={styles.inputContainer}>
        <Text>Hold: </Text>
        <TextInput
          keyboardType="number-pad"
          TextInput
          value={holdDuration}
          onChangeText={setHoldDuration}
          placeholder="seconds for hold"
          style={styles.input}
        />
        <Button onPress={addHold}>Add</Button>
      </View>
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={steps}
          renderItem={renderItem}
          keyExtractor={(item) => `draggable-item-${item.key}`}
          onDragEnd={({ data }) => setSteps(data)}
        />
      </View>
      <Button onPress={() => showList()}>START</Button>
    </View>
  );

  function showList() {
    let splitSteps = [];

    // padding step
    splitSteps.push({ "type": "padding", "duration": 1 });

    steps.forEach(step => {
      if (step.type === 'breathe') {
        for (let i = 0; i < step.numberOfBreaths; i++) {
          splitSteps.push({ "type": "breathe-in", "duration": step.in });
          splitSteps.push({ "type": "breathe-out", "duration": step.out });
        }
      } else {
        splitSteps.push(step);
      }
    });

    // padding step
    splitSteps.push({ "type": "breathe-out", "duration": 1 });

    console.log(steps);
    console.log(splitSteps);

    navigation.navigate('TimerPage', { steps: splitSteps, reset: true });
  }

  function navigateToTimerPage() {
    if (steps.length > 0) {
      navigation.navigate('TimerPage', { steps, reset: true });
    } else {
      alert('Please add breaths');
    }
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

