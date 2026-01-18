import { StyleSheet } from 'react-native';
import colors from '../../utils/colors';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  buttonContainer: {
    gap: 20,
  },
  button: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.LIGHT_GRAY,
  },
  buttonPrimary: {
    backgroundColor: colors.BLUE_LIGHT,
    borderColor: colors.BLUE,
  },
  buttonSuccess: {
    backgroundColor: colors.GREEN_LIGHT,
    borderColor: colors.GREEN,
  },
  buttonInfo: {
    backgroundColor: colors.PURPLE_LIGHT,
    borderColor: colors.PURPLE,
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.BLACK,
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 14,
    color: colors.DARK_GRAY,
  },
});

export default Styles;
