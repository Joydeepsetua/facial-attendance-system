import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const cardShadow = {
  shadowColor: '#1E2A4A',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.07,
  shadowRadius: 10,
  elevation: 3,
};

const Styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.SURFACE_BG,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  createButton: {
    backgroundColor: colors.BRAND,
    borderRadius: 50,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.BRAND,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    position: 'absolute',
    bottom: 18,
    right: 18,
    zIndex: 1000,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listContainer: {
    flexGrow: 1,
  },
  listContent: {
    paddingBottom: 90,
  },
  userCard: {
    backgroundColor: colors.SURFACE_CARD,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...cardShadow,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.BRAND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
    marginBottom: 4,
  },
  userDate: {
    fontSize: 12,
    color: colors.SURFACE_TEXT_MUTED,
  },
  userPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  userPhoneText: {
    fontSize: 12.5,
    color: colors.SURFACE_TEXT_MUTED,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
    marginTop: 14,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.SURFACE_TEXT_MUTED,
    textAlign: 'center',
  },
  menuButton: {
    padding: 6,
    marginLeft: 4,
  },
  overlay: {
    flex: 1,
  },
  popupMenu: {
    position: 'absolute',
    backgroundColor: colors.SURFACE_CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.SURFACE_BORDER,
    paddingVertical: 4,
    minWidth: 130,
    ...cardShadow,
  },
  popupMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  popupMenuText: {
    fontSize: 14,
    color: colors.SURFACE_TEXT,
    fontWeight: '500',
  },
  popupMenuTextDanger: {
    color: colors.RED,
  },
  popupMenuDivider: {
    height: 1,
    backgroundColor: colors.SURFACE_BORDER,
    marginHorizontal: 8,
  },
  deleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  deleteModal: {
    width: '100%',
    backgroundColor: colors.SURFACE_CARD,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  deleteIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.RED}1A`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.SURFACE_TEXT,
    marginBottom: 8,
  },
  deleteMessage: {
    fontSize: 14,
    color: colors.SURFACE_TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  deleteUserName: {
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
  },
  deleteActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
    fontWeight: '600',
    color: colors.SURFACE_TEXT,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.RED,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Styles;
