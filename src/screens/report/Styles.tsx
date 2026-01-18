import { StyleSheet } from 'react-native';
import colors from '../../utils/colors';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 10,
  },
  attendanceCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.LIGHT_GRAY,
  },
  attendanceAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attendanceAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.WHITE,
  },
  attendanceInfo: {
    flex: 1,
  },
  attendanceUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.BLACK,
    marginBottom: 4,
  },
  attendanceDateTime: {
    fontSize: 12,
    color: colors.DARK_GRAY,
  },
  attendanceStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.GREEN_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendanceStatusIcon: {
    fontSize: 18,
    color: colors.GREEN,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.DARK_GRAY,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.GRAY,
    textAlign: 'center',
  },
});

export default Styles;
