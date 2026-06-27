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
    paddingBottom: 120,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    overflow: 'hidden',
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
    color: dash.ON_BLUE_MUTED,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: dash.ON_BLUE,
    letterSpacing: 0.3,
    marginTop: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },
  bannerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scanCluster: {
    position: 'absolute',
    right: -12,
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanClusterSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scanBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ---- Today's overview (floating card) ----
  overviewCard: {
    backgroundColor: dash.CARD,
    borderRadius: 18,
    marginHorizontal: H_PADDING,
    marginTop: -85,
    paddingVertical: 18,
    paddingHorizontal: 16,
    ...cardShadow,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: dash.TEXT,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: dash.TEXT,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: dash.TEXT_MUTED,
    marginTop: 2,
  },

  // ---- Section header ----
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PADDING,
    marginTop: 22,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: dash.TEXT,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: dash.BLUE,
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
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    ...cardShadow,
  },
  actionMain: {
    flex: 1,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: dash.TEXT,
  },
  actionSubtitle: {
    fontSize: 11.5,
    fontWeight: '500',
    color: dash.TEXT_MUTED,
    marginTop: 3,
  },

  // ---- Modals (scan / result) ----
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingCard: {
    backgroundColor: dash.CARD,
    borderRadius: 16,
    paddingVertical: 26,
    paddingHorizontal: 34,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: dash.TEXT,
    marginTop: 14,
  },
  resultCard: {
    width: '100%',
    backgroundColor: dash.CARD,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  resultIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: dash.TEXT_MUTED,
    textAlign: 'center',
  },
  resultName: {
    fontSize: 24,
    fontWeight: '800',
    color: dash.TEXT,
    marginTop: 4,
    textAlign: 'center',
  },
  resultSub: {
    fontSize: 13,
    fontWeight: '500',
    color: dash.TEXT_MUTED,
    marginTop: 6,
    textAlign: 'center',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    alignSelf: 'stretch',
  },
  resultButton: {
    flex: 1,
    backgroundColor: dash.BLUE,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: dash.ON_BLUE,
  },
  resultButtonOutline: {
    flex: 1,
    backgroundColor: dash.BG,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: dash.BORDER,
  },
  resultButtonOutlineText: {
    fontSize: 15,
    fontWeight: '700',
    color: dash.TEXT,
  },
  // Colored accent bar at the top of the confirm card (green=in, orange=out).
  actionAccent: {
    width: 44,
    height: 5,
    borderRadius: 3,
    marginBottom: 18,
  },
  // Bold pill that states the action (PUNCH IN / PUNCH OUT) in the action color.
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    marginTop: 2,
  },
  actionPillText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },
  matchText: {
    fontSize: 13,
    fontWeight: '600',
    color: dash.TEXT_MUTED,
  },
});

export default Styles;
