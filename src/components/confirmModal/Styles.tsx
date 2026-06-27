import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const Styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modal: {
    width: '100%',
    backgroundColor: colors.SURFACE_CARD,
    borderRadius: 20,
    paddingVertical: 26,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.BRAND}18`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.SURFACE_TEXT,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    alignSelf: 'stretch',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.SURFACE_BG,
    borderWidth: 1,
    borderColor: colors.SURFACE_BORDER,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.BRAND,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default Styles;
