import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

// Mirror the dashboard's light/blue palette, sourced from the constants.
export const dash = {
  BG: colors.SURFACE_BG,
  BLUE: colors.BRAND,
  CARD: colors.SURFACE_CARD,
  TEXT: colors.SURFACE_TEXT,
  TEXT_MUTED: colors.SURFACE_TEXT_MUTED,
};

const Styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: dash.BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: dash.CARD,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E2A4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: dash.TEXT,
    marginLeft: 14,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: -40,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: `${colors.BRAND}14`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: dash.TEXT,
  },
  blurb: {
    fontSize: 14,
    fontWeight: '500',
    color: dash.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
  },
  cta: {
    marginTop: 28,
    backgroundColor: dash.BLUE,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default Styles;
