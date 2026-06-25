import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const Style = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.SURFACE_BG,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.SURFACE_CARD,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E2A4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
    textTransform: 'capitalize',
    marginLeft: 14,
  },
  titleNoBack: {
    marginLeft: 4,
  },
});

export default Style;
