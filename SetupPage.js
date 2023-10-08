import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DraggableList({ navigation }) {
  const [steps, setSteps] = useState([
    { key: "1", label: `2 x Breath 1s in, 2s out`, type: 'breathe', in: 1, out: 2, numberOfBreaths: 2 }
  ]);

  const [breathInDuration, setBreathInDuration] = useState('1');
  const [breathOutDuration, setBreathOutDuration] = useState('1');
  const [numberOfBreaths, setNumberOfBreaths] = useState('1');
  const [quickDuration, setQuickDuration] = useState('2');
  const [holdDuration, setHoldDuration] = useState('3');

  const addBreath = () => {
    const newKey = Date.now().toString();  // Generate a unique key using timestamp
    const newItem = { key: newKey, label: `${numberOfBreaths} x Breath ${breathInDuration}s in, ${breathOutDuration}s out`, type: 'breathe', in: parseInt(breathInDuration), out: parseInt(breathOutDuration), numberOfBreaths: parseInt(numberOfBreaths) };
    setSteps([...steps, newItem]);
  }

  const addQuick = () => {
    const newKey = Date.now().toString();  // Generate a unique key using timestamp
    const newItem = { key: newKey, label: `Quick ${quickDuration}s`, type: 'quick', duration: parseInt(quickDuration, 10) };
    setSteps([...steps, newItem]);
  }

  const addHold = () => {
    const newKey = Date.now().toString();  // Generate a unique key using timestamp
    const newItem = { key: newKey, label: `Hold ${holdDuration}s`, type: 'hold', duration: parseInt(holdDuration, 10) };
    setSteps([...steps, newItem]);
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

  const saveSteps = async (steps) => {
    try {
      await AsyncStorage.setItem('steps', JSON.stringify(steps));
      alert('Steps saved successfully');
    } catch (error) {
      console.error('Error saving steps:', error);
    }
  };

  const loadSteps = async () => {
    try {
      const loadedSteps = await AsyncStorage.getItem('steps');
      if (loadedSteps !== null) {
        setSteps(JSON.parse(loadedSteps));
      } else {
        alert('No steps saved previously');
      }
    } catch (error) {
      console.error('Error loading steps:', error);
    }
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
        <Text>times: </Text>
        <TextInput
          keyboardType="number-pad"
          TextInput
          value={numberOfBreaths}
          onChangeText={setNumberOfBreaths}
          placeholder="breath"
          style={styles.input}
        />
        <Button onPress={addBreath}>Add</Button>
      </View>

      <View style={styles.inputContainer}>
        <Text>Quick: </Text>
        <TextInput
          keyboardType="number-pad"
          TextInput
          value={quickDuration}
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
      {/* // view with flex 1 is to push the button to the bottom */}
      <View style={styles.horizontalBox}>
        <Button onPress={() => navigateToTimerPage()}>START</Button>
        <Button onPress={() => loadSteps()}>LOAD</Button>
        <Button onPress={() => saveSteps(steps)}>SAVE</Button>
      </View>
    </View>
  );

  // also creates the steps for the timer
  function navigateToTimerPage() {
    if (steps.length === 0) {
      alert('Add at least one step');
      return;
    }

    let splitSteps = [];

    // padding start
    splitSteps.push({ "type": "padding", "duration": 1 });

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      switch (step.type) {
        case 'breathe':
          for (let j = 0; j < step.numberOfBreaths; j++) {
            splitSteps.push({ "type": "breathe-in", "duration": step.in });
            splitSteps.push({ "type": "breathe-out", "duration": step.out });
          }
          break;
        case 'quick':
          splitSteps.push({ "type": "quick-in", "duration": step.duration / 2 });
          splitSteps.push({ "type": "quick-out", "duration": step.duration / 2 });
          break;
        default:
          splitSteps.push(step);
          break;
      }

      // Check if this step is of type 'hold' and the next step is also 'hold',
      // then add a breathe-in in between them.
      if (step.type === 'hold' && i + 1 < steps.length && steps[i + 1].type === 'hold') {
        splitSteps.push({ "type": "breathe-in", "duration": 1 });
      }
    }

    // If the last step is of type 'hold', add a padding step of type 'breathe-in'.
    if (splitSteps[splitSteps.length - 1].type === 'hold') {
      splitSteps.push({ "type": "breathe-in", "duration": 1 });
    }

    console.log(splitSteps);

    // padding end
    splitSteps.push({ "type": "complete", "duration": 1 });

    navigation.navigate('TimerPage', { steps: splitSteps, allowed: true });
  }


}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
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

