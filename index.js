import React, { useEffect } from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Sound from 'react-native-sound';

// Import gesture handler
import 'react-native-gesture-handler';

const Main = () => {
  useEffect(() => {
    Sound.setCategory('Playback');
  }, []);

  return <App />;
};

AppRegistry.registerComponent(appName, () => Main);
