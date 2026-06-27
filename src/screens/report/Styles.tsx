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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  attendanceUserName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusBadgePresent: {
    backgroundColor: `${colors.ACCENT_GREEN}1A`,
  },
  statusBadgeAbsent: {
    backgroundColor: `${colors.RED}1A`,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotPresent: {
    backgroundColor: colors.ACCENT_GREEN,
  },
  statusDotAbsent: {
    backgroundColor: colors.RED,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextPresent: {
    color: colors.ACCENT_GREEN,
  },
  statusTextAbsent: {
    color: colors.RED,
  },
  attendanceUserMeta: {
    fontSize: 12,
    color: colors.SURFACE_TEXT_MUTED,
    marginBottom: 8,
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
  todayButton: {
    marginLeft: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: `${colors.BRAND}14`,
    borderWidth: 1,
    borderColor: `${colors.BRAND}33`,
    justifyContent: 'center',
  },
  todayButtonText: {
    color: colors.BRAND,
    fontSize: 13,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 12,
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.SURFACE_TEXT,
  },

  // ---- Search + filter row ----
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.SURFACE_CARD,
    borderWidth: 1,
    borderColor: colors.SURFACE_BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    borderColor: colors.BRAND,
    backgroundColor: `${colors.BRAND}12`,
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.BRAND,
  },

  // ---- Filter bottom sheet ----
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.SURFACE_CARD,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.SURFACE_BORDER,
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.SURFACE_TEXT,
    marginBottom: 16,
  },
  sheetSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.SURFACE_TEXT_MUTED,
    marginBottom: 10,
    marginTop: 6,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.SURFACE_BG,
    borderWidth: 1,
    borderColor: colors.SURFACE_BORDER,
  },
  chipActive: {
    backgroundColor: colors.BRAND,
    borderColor: colors.BRAND,
  },
  chipText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.SURFACE_TEXT,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  customRange: {
    marginTop: 12,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.SURFACE_BG,
    borderWidth: 1,
    borderColor: colors.SURFACE_BORDER,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
  },
  applyButton: {
    flex: 1.4,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.BRAND,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default Styles;
