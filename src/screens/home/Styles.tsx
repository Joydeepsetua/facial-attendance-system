import { Dimensions, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');

// Dashboard palette, sourced from the shared constants.
export const dash = {
  BG: colors.SURFACE_BG,
  BLUE: colors.BRAND,
  BLUE_DARK: colors.BRAND_DARK,
  CARD: colors.SURFACE_CARD,
  TEXT: colors.SURFACE_TEXT,
  TEXT_MUTED: colors.SURFACE_TEXT_MUTED,
  BORDER: colors.SURFACE_BORDER,
  ON_BLUE: colors.WHITE,
  ON_BLUE_MUTED: 'rgba(255,255,255,0.85)',
};

const H_PADDING = 18;
const CARD_GAP = 14;
const CARD_W = (width - H_PADDING * 2 - CARD_GAP) / 2;

const cardShadow = {
  shadowColor: '#1E2A4A',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 4,
};

const Styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: dash.BG,
  },
  scrollContent: {
    paddingBottom: 28,
  },

  // ---- Header banner ----
  banner: {
    backgroundColor: dash.BLUE,
    paddingHorizontal: H_PADDING,
    paddingBottom: 22,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: dash.ON_BLUE_MUTED,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: dash.ON_BLUE,
    letterSpacing: 0.3,
    marginTop: 2,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
    color: dash.ON_BLUE_MUTED,
    marginTop: 6,
  },

  // ---- Section ----
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: dash.TEXT,
    marginTop: 22,
    marginBottom: 12,
    paddingHorizontal: H_PADDING,
  },

  // ---- Today's overview card ----
  overviewCard: {
    flexDirection: 'row',
    backgroundColor: dash.CARD,
    borderRadius: 14,
    paddingVertical: 18,
    marginHorizontal: H_PADDING,
    ...cardShadow,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: dash.BORDER,
    marginVertical: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },

  // ---- Action grid ----
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    paddingHorizontal: H_PADDING,
  },
  actionCard: {
    width: CARD_W,
    backgroundColor: dash.CARD,
    borderRadius: 14,
    padding: 16,
    ...cardShadow,
  },
  actionIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: dash.TEXT,
  },
  actionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: dash.TEXT_MUTED,
    marginTop: 3,
  },
});

export default Styles;
