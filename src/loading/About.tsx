/* eslint-disable react/jsx-filename-extension */
// eslint-disable-next-line no-use-before-define
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

interface AboutPageProps {
  setupFinished: boolean;
}

const AboutPage = (props: AboutPageProps) => {
  const { setupFinished } = props;
  return (
    <TouchableOpacity onPress={() => aboutFID()}>
      <View
        style={[
          styles.permsButton,
          {
            display:
                setupFinished ? 'flex' : 'none',
          },
        ]}
      >
        <Text>About FlowerID</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AboutPage;
