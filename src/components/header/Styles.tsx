import { StyleSheet } from 'react-native';
import colors from '../../utils/colors';

const Style = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.PRIMARY,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 12,
    minHeight: 56,
  },
  headLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingEnd: 10,
  },
  iconText: {
    fontSize: 24,
    color: colors.WHITE,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.WHITE,
    textTransform: 'capitalize',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    backgroundColor: colors.RED,
  },
});

export default Style;