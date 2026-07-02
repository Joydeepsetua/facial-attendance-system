import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E66E0',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: -20,
  },
  appName: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#1E66E0',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    color: 'rgba(30, 102, 224, 0.85)',
  },
});

export default Styles;
