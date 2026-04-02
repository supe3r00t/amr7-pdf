import { Linking, Alert } from 'react-native';

export const openURL = async (url: string) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('تعذر فتح الرابط', url);
    }
  } catch (e) {
    await Linking.openURL(url);
  }
};
