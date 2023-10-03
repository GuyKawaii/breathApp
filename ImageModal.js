import React from 'react';
import { Modal, View, Image, Button, StyleSheet } from 'react-native';

const ImageModal = ({ visible, imageUrl, onClose, onChangeImage }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalContent}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title="Change Image" onPress={onChangeImage} />
            </View>
            <View style={styles.button}>
              <Button title="Close" onPress={onClose} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 10,
  },
  image: {
    width: 300,
    height: 300,
  }
});

export default ImageModal;
