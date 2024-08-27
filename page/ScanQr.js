import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import Sound from 'react-native-sound';

const ScanQRScreen = ({ origin }) => {
  const route = useRoute();
  const originParam = route.params?.origin ?? origin;

  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    Sound.setCategory('Playback');
  }, []);

  const playSuccessSound = () => {
    const sound = new Sound(require('../assets/bell.mp3'), (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      sound.play(() => {
        sound.release();
      });
    });
  };

  const handleBarCodeRead = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      setData(data);
      setModalVisible(true);
    }
  };

  const handleYesPress = async () => {
    setScanned(false);
    setModalVisible(false);
    console.log(data, originParam);
    try {
      const response = await fetch(`https://fiki.sikapngalah.com/api/api.php?id=${data}&type=${originParam}`);
      const result = await response.json();
      console.log(result);

      if (result.status === "success") {
        playSuccessSound();
        Alert.alert("Success", "Data berhasil ditambahkan");
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch data");
    }
  };

  const handleNoPress = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={StyleSheet.absoluteFillObject}
        onBarCodeRead={handleBarCodeRead}
        captureAudio={false}
      />
      <Text style={styles.text}>Barcode untuk {originParam}</Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Scanned Data</Title>
              <Paragraph>Data: {data}</Paragraph>
              <Paragraph>Do you want to scan again?</Paragraph>
            </Card.Content>
            <Card.Actions style={styles.actions}>
              <Button onPress={handleNoPress} mode="contained" style={styles.buttonNo}>
                No
              </Button>
              <Button onPress={handleYesPress} mode="contained" style={styles.buttonYes}>
                Yes
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    margin: 10,
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    width: 350,
    borderRadius: 10,
    padding: 20,
  },
  actions: {
    justifyContent: 'space-between',
  },
  buttonNo: {
    backgroundColor: '#f44336', // Red color
  },
  buttonYes: {
    backgroundColor: '#4caf50', // Green color
  },
});

export default ScanQRScreen;
