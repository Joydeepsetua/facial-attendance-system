import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const Styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.SURFACE_BG,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  listContainer: {
    flexGrow: 1,
  },
  listContent: {
    paddingVertical: 10,
  },
  attendanceCard: {
    backgroundColor: colors.SURFACE_CARD,
    padding: 12,
    marginBottom: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1E2A4A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  attendanceAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.BRAND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attendanceAvatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  attendanceInfo: {
    flex: 1,
  },
  attendanceUserName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
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
    color: colors.SURFACE_TEXT_MUTED,
    fontWeight: 'bold',
  },
  dividerVertical: {
    width: 1,
    height: 30,
    backgroundColor: colors.SURFACE_BORDER,
    marginHorizontal: 12,
  },
  statLabel: {
    fontSize: 11,
    color: colors.SURFACE_TEXT_MUTED,
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    color: colors.SURFACE_TEXT,
    fontWeight: '700',
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
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.SURFACE_TEXT_MUTED,
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
    backgroundColor: colors.SURFACE_BORDER,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.SURFACE_TEXT_MUTED,
    textTransform: 'uppercase',
    paddingHorizontal: 12,
  },
  filterContainer: {
    paddingHorizontal: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.SURFACE_CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.SURFACE_BORDER,
  },
  searchInputField: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: colors.SURFACE_TEXT,
    fontSize: 14,
  },
  searchClearButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: colors.SURFACE_CARD,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.SURFACE_TEXT,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.SURFACE_BORDER,
  },
  dateFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 10,
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
    color: colors.SURFACE_TEXT,
    fontSize: 14,
  },
  datePickerPlaceholder: {
    color: colors.SURFACE_TEXT_MUTED,
    fontSize: 14,
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  clearButtonText: {
    color: colors.BRAND,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default Styles;
