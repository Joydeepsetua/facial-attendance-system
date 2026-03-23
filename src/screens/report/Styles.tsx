import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_DARK,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  listContainer: {
    flexGrow: 1,
  },
  listContent: {
    paddingVertical: 10,
  },
  attendanceCard: {
    backgroundColor: colors.BG_CARD,
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.BG_BORDER,
    shadowColor: colors.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  attendanceAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.BG_CARD,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.BG_BORDER,
  },
  attendanceAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.TEXT_PRIMARY,
  },
  attendanceInfo: {
    flex: 1,
  },
  attendanceUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.TEXT_PRIMARY,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 4,
    marginTop: 2,
  },
  statColumn: {
    alignItems: 'center',
  },
  arrowContainer: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: colors.TEXT_SECONDARY,
    fontWeight: 'bold',
  },
  dividerVertical: {
    width: 1,
    height: 30,
    backgroundColor: colors.BG_BORDER,
    marginHorizontal: 12,
  },
  statLabel: {
    fontSize: 11,
    color: colors.TEXT_SECONDARY,
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    color: colors.TEXT_PRIMARY,
    fontWeight: '600',
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
    color: colors.TEXT_SECONDARY,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.GRAY,
    textAlign: 'center',
  },
  sectionHeaderContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.BG_BORDER,
    opacity: 0.5,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.TEXT_SECONDARY,
    textTransform: 'uppercase',
    paddingHorizontal: 12,
  },
  filterContainer: {
    paddingHorizontal: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.BG_CARD,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.BG_BORDER,
  },
  searchInputField: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.TEXT_PRIMARY,
    fontSize: 14,
  },
  searchClearButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: colors.BG_CARD,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.TEXT_PRIMARY,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.BG_BORDER,
  },
  dateFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateArrowContainer: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerText: {
    color: colors.TEXT_PRIMARY,
    fontSize: 14,
  },
  datePickerPlaceholder: {
    color: colors.TEXT_SECONDARY,
    fontSize: 14,
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 8
  },
  clearButtonText: {
    color: colors.PRIMARY,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default Styles;
