import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const Styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modal: {
    width: '100%',
    backgroundColor: colors.BG_CARD,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.BG_BORDER,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.TEXT_PRIMARY,
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: colors.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },

  // Single unified info card (avatar + name + id/match + times)
  infoCard: {
    width: '100%',
    backgroundColor: colors.BG_ELEVATED,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BG_BORDER,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.PRIMARY_MUTED,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.TEXT_PRIMARY,
  },
  infoHeaderText: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.TEXT_PRIMARY,
  },
  meta: {
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.TEXT_SECONDARY,
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.BG_BORDER,
    marginVertical: 8,
  },
  timesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeCol: {
    flex: 1,
    alignItems: 'center',
  },
  timeColDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.BG_BORDER,
  },
  timeLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: colors.TEXT_SECONDARY,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.TEXT_PRIMARY,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.BG_ELEVATED,
    borderWidth: 1,
    borderColor: colors.BG_BORDER,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.TEXT_PRIMARY,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.PRIMARY,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.TEXT_ON_PRIMARY,
  },
});

export default Styles;
