# FlowerID - An Android app that identifies photos of flowers taken from camera using a convolutional neural network.

## This repository contains sources for the app. The files for the FlowerID model can be found at https://github.com/tonylizj/FlowerID and https://github.com/danielsqli/flower-id.

Google Play Link: https://play.google.com/store/apps/details?id=com.flowerid

Dataset Source:
https://www.kaggle.com/alxmamaev/flowers-recognition

To build:
```
// set up your signing keystore if building for production
npm install

// debug build
npm run android
// production build
npm run android-release
