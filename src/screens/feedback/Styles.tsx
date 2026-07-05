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

  // ---- Card ----
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.SURFACE_TEXT,
  },

  // ---- Inputs ----
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
  inputMultiline: {
    minHeight: 110,
    textAlignVertical: 'top',
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
  errorTextFlush: {
    marginTop: 0,
    flexShrink: 1,
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
    marginLeft: 'auto',
  },

  // ---- Dropdown (feedback type + module) ----
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.SURFACE_BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: colors.SURFACE_BG,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.SURFACE_TEXT,
  },
  dropdownPlaceholder: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
  },
  // Dropdown list popover (rendered by react-native-element-dropdown).
  dropdownList: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.SURFACE_BORDER,
    backgroundColor: colors.SURFACE_CARD,
    marginTop: 4,
    overflow: 'hidden',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.SURFACE_TEXT,
  },

  // ---- Screenshot attachment ----
  imagePlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.SURFACE_BG,
    borderWidth: 1.5,
    borderColor: colors.BRAND,
    borderStyle: 'dashed',
    borderRadius: 14,
  },
  placeholderIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${colors.BRAND}18`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
    height: 200,
    resizeMode: 'cover',
  },
  imageActionsOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  imageActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ---- Device info (read-only) ----
  metaNote: {
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
    marginTop: -6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.SURFACE_TEXT_MUTED,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.SURFACE_TEXT,
  },

  // ---- Submit button ----
  submitButton: {
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
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default Styles;
