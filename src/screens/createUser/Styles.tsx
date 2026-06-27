import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const Styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.SURFACE_BG,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 32,
  },

  // ---- Form card ----
  card: {
    backgroundColor: colors.SURFACE_CARD,
    borderRadius: 16,
    padding: 18,
    gap: 18,
    marginBottom: 14,
    shadowColor: '#1E2A4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.SURFACE_TEXT,
  },

  // ---- Profile header (avatar + employee id) ----
  profileHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarWrap: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  avatarImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  avatarPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.SURFACE_CARD,
    borderWidth: 1.5,
    borderColor: colors.BRAND,
    borderStyle: 'dashed',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.BRAND,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: colors.SURFACE_BG,
  },
  avatarHint: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
    marginTop: 10,
  },
  idPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${colors.BRAND}14`,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  idPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.BRAND,
    letterSpacing: 1,
  },

  // ---- Section header (icon + title) ----
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readonlyBox: {
    borderWidth: 1,
    borderColor: colors.SURFACE_BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: '#EEF2F9',
  },
  readonlyText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
    letterSpacing: 1,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  segmentChip: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.SURFACE_BG,
    borderWidth: 1,
    borderColor: colors.SURFACE_BORDER,
  },
  segmentChipActive: {
    backgroundColor: `${colors.BRAND}14`,
    borderColor: colors.BRAND,
  },
  segmentChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.SURFACE_TEXT_MUTED,
  },
  segmentChipTextActive: {
    color: colors.BRAND,
  },
  helperText: {
    fontSize: 12,
    color: colors.SURFACE_TEXT_MUTED,
    fontStyle: 'italic',
  },
  inputError: {
    borderColor: colors.RED,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.RED,
    marginTop: 4,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.SURFACE_TEXT,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.SURFACE_BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.SURFACE_TEXT,
    backgroundColor: colors.SURFACE_BG,
  },

  // ---- Image picker ----
  imagePicker: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.SURFACE_BG,
    borderWidth: 1.5,
    borderColor: colors.BRAND,
    borderStyle: 'dashed',
    borderRadius: 14,
  },
  placeholderIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.BRAND}18`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.SURFACE_TEXT,
  },
  imagePlaceholderHint: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
    marginTop: 3,
  },
  imagePreviewWrap: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  retakeOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retakeOverlayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ---- Create button ----
  createButton: {
    backgroundColor: colors.BRAND,
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: colors.BRAND,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  createButtonDisabled: {
    backgroundColor: colors.SURFACE_BORDER,
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  createButtonTextDisabled: {
    color: colors.SURFACE_TEXT_MUTED,
  },
});

export default Styles;
