import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const cardShadow = {
  shadowColor: '#1E2A4A',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
};

const Styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.SURFACE_BG,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 36,
  },

  // ---- Hero (soft light tint with decorative blobs) ----
  hero: {
    backgroundColor: '#EAF2FF',
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#DCE8FB',
    overflow: 'hidden',
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: `${colors.BRAND}22`,
  },
  logo: {
    width: 60,
    height: 60,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.SURFACE_TEXT,
    letterSpacing: 0.5,
  },
  versionPill: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: `${colors.BRAND}14`,
  },
  versionText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.BRAND,
  },

  // ---- Cards ----
  card: {
    backgroundColor: colors.SURFACE_CARD,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    ...cardShadow,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
    marginBottom: 10,
  },
  body: {
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.SURFACE_TEXT_MUTED,
  },

  // ---- Feature rows ----
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  featureDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.SURFACE_BORDER,
  },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: `${colors.BRAND}14`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.SURFACE_TEXT,
    fontWeight: '500',
  },

  // ---- Link rows ----
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },
  linkText: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: colors.SURFACE_TEXT,
  },

  // ---- Developer credit ----
  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  devAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.BRAND,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  devAvatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  devInfo: {
    flex: 1,
  },
  devLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
  },
  devName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
    marginTop: 2,
  },

  copyright: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 24,
  },
});

export default Styles;
