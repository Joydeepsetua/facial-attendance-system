import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const H_PADDING = 18;

const Styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.SURFACE_BG,
  },
  scrollContent: {
    padding: H_PADDING,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.SURFACE_TEXT_MUTED,
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 4,
  },

  // ---- Feature list card ----
  card: {
    backgroundColor: colors.SURFACE_CARD,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#1E2A4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.SURFACE_BORDER,
  },
  rowIconChip: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    marginLeft: 14,
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
  },
  rowSubtitle: {
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
    marginTop: 3,
    lineHeight: 17,
  },
});

export default Styles;
