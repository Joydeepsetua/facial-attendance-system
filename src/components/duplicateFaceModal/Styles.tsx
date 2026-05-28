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
    backgroundColor: 'rgba(205, 255, 3, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.TEXT_PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  list: {
    maxHeight: 220,
    width: '100%',
    marginBottom: 12,
  },
  listContent: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.BG_ELEVATED,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.BG_BORDER,
  },
  rowName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.TEXT_PRIMARY,
    flex: 1,
  },
  rowSim: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.TEXT_SECONDARY,
  },
  question: {
    fontSize: 14,
    color: colors.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 20,
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
