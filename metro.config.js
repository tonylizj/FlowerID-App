module.exports = {
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
  resolver: {
    // (add 'bin' to assetExts)
    assetExts: ['bin', 'txt', 'jpg', 'png', 'ttf'],
  },
};
