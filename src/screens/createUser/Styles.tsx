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
    gap: 22,
    shadowColor: '#1E2A4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default Styles;
