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

  // ---- List card ----
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

  // ---- Row ----
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.SURFACE_BORDER,
  },
  rowIcon: {
    width: 28,
    alignItems: 'center',
  },
  rowLabel: {
    flex: 1,
    marginLeft: 14,
    fontSize: 15.5,
    fontWeight: '600',
    color: colors.SURFACE_TEXT,
  },
  rowLabelDanger: {
    color: colors.RED,
  },
});

export default Styles;
