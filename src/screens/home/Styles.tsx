import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_DARK,
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
    borderRadius: 16,
    height: 170,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    backgroundColor: colors.CARD_A_BG,
    borderColor: colors.CARD_A_BORDER,
    borderWidth: 1.5,
  },
  buttonIcon: {
    fontSize: 46,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.TEXT_PRIMARY,
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 14,
    color: colors.TEXT_SECONDARY,
  },
});

export default Styles;
