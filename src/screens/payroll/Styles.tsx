import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const cardShadow = {
  shadowColor: '#1E2A4A',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 2,
};

const Styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.SURFACE_BG,
  },

  // ---- Month selector ----
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    gap: 18,
  },
  monthBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.SURFACE_CARD,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  monthBtnDisabled: {
    opacity: 0.5,
  },
  monthLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
    minWidth: 150,
    textAlign: 'center',
  },

  // ---- Summary ----
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.BRAND,
    marginHorizontal: 18,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ---- Export ----
  exportRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    marginTop: 12,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.BRAND}14`,
    borderWidth: 1,
    borderColor: `${colors.BRAND}33`,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  exportBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.BRAND,
  },

  // ---- List ----
  listContent: {
    padding: 18,
    paddingTop: 14,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.SURFACE_CARD,
    borderRadius: 14,
    padding: 14,
    ...cardShadow,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.PRIMARY_MUTED,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 15.5,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
    marginTop: 2,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
  },
  subValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.ACCENT_GREEN,
  },
  payCol: {
    alignItems: 'flex-end',
  },
  payLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.SURFACE_TEXT_MUTED,
    marginBottom: 3,
  },
  payValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.SURFACE_TEXT,
  },

  // ---- Empty / loading ----
  emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.SURFACE_TEXT,
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.SURFACE_TEXT_MUTED,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default Styles;
