import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const Styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modal: {
    width: '100%',
    backgroundColor: colors.SURFACE_CARD,
    borderRadius: 24,
    paddingTop: 30,
    paddingBottom: 22,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#1E2A4A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },

  // ---- Badge: concentric green rings + check ----
  badgeOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.BRAND}14`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  badgeInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.BRAND,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.BRAND,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.SURFACE_TEXT,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
    paddingHorizontal: 4,
  },

  button: {
    alignSelf: 'center',
    backgroundColor: `${colors.BRAND}12`,
    borderWidth: 1.5,
    borderColor: `${colors.BRAND}40`,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.BRAND,
    letterSpacing: 0.3,
  },
});

export default Styles;
