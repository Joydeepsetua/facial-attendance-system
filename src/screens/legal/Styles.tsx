import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const Styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.SURFACE_BG,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 36,
  },
  updated: {
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
    marginBottom: 12,
  },
  intro: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.SURFACE_TEXT,
    marginBottom: 20,
  },
  section: {
    marginBottom: 18,
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
    marginBottom: 6,
  },
  body: {
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.SURFACE_TEXT_MUTED,
  },
});

export default Styles;
