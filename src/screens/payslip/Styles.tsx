import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const Styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.SURFACE_BG,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 36,
  },

  // The "paper" payslip card
  sheet: {
    backgroundColor: colors.SURFACE_CARD,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.SURFACE_BORDER,
    shadowColor: '#1E2A4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  // Company header — logo pinned left, company details centered.
  companyHeader: {
    position: 'relative',
    minHeight: 56,
    justifyContent: 'center',
  },
  companyLogo: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 56,
    height: 56,
  },
  companyInfo: {
    alignItems: 'center',
    paddingHorizontal: 60, // keep centered text clear of the left logo
  },
  companyName: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.SURFACE_TEXT,
    textAlign: 'center',
  },
  companyMeta: {
    fontSize: 12,
    color: colors.SURFACE_TEXT_MUTED,
    textAlign: 'center',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.SURFACE_BORDER,
    marginVertical: 14,
  },

  payslipTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.BRAND,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  payslipMonth: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 8,
  },

  sectionLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.BRAND,
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 10,
  },

  // Two-column field grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  field: {
    width: '50%',
    marginBottom: 12,
    paddingRight: 10,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.SURFACE_TEXT,
  },

  // Earnings
  earnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.SURFACE_BORDER,
  },
  earnLabel: {
    fontSize: 13.5,
    color: colors.SURFACE_TEXT,
    flex: 1,
    marginRight: 10,
  },
  earnValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.SURFACE_TEXT,
  },
  grossRow: {
    borderBottomWidth: 0,
  },
  grossLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.SURFACE_TEXT,
  },
  grossValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.SURFACE_TEXT,
  },

  // Net pay
  netBox: {
    backgroundColor: `${colors.BRAND}14`,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  netTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.SURFACE_TEXT,
  },
  netValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.BRAND,
  },
  netWords: {
    fontSize: 12.5,
    fontWeight: '500',
    fontStyle: 'italic',
    color: colors.SURFACE_TEXT_MUTED,
    marginTop: 6,
  },

  footer: {
    fontSize: 11,
    color: colors.SURFACE_TEXT_MUTED,
    textAlign: 'center',
    marginTop: 18,
  },

  // ---- Share bar ----
  shareBar: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: colors.SURFACE_BG,
    borderTopWidth: 1,
    borderTopColor: colors.SURFACE_BORDER,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.BRAND,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shareBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default Styles;
