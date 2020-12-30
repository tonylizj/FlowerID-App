import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

import styles from '../styles'; // eslint-disable-line
import aboutFIDText from '../../assets/aboutFID'; // eslint-disable-line

const aboutFID = async () => {
  Alert.alert('About FlowerID', aboutFIDText, [{ text: 'OK' }]);
};

const About = (props: {setupFinished: boolean}) => {
  return (
    <TouchableOpacity onPress={() => aboutFID()}>
      <View
        style={[
          styles.permsButton,
          {
            display:
                props.setupFinished ? 'flex' : 'none',
          },
        ]}
      >
        <Text>About FlowerID</Text>
      </View>
    </TouchableOpacity>
  );
};

export default About;
