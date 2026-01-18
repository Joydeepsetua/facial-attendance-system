import { StyleSheet } from 'react-native';
import colors from '../../utils/colors';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  capturedImage: {
    width: 300,
    height: 300,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: colors.PRIMARY,
    marginBottom: 12,
  },
  retakeButton: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.LIGHT_GRAY,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  retakeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.DARK_GRAY,
  },
  resultContainer: {
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: colors.GREEN_LIGHT,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.GREEN,
    width: '100%',
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  matchedName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.BLACK,
    marginBottom: 8,
    textAlign: 'center',
  },
  similarityText: {
    fontSize: 14,
    color: colors.DARK_GRAY,
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.LIGHT_GRAY,
    width: '100%',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  noMatchText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.DARK_GRAY,
    textAlign: 'center',
  },
  captureButton: {
    borderWidth: 2,
    borderColor: colors.LIGHT_GRAY,
    borderStyle: 'dashed',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 20,

  },
  buttonPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.LIGHT_GRAY_BG,
  },
  buttonPlaceholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  buttonPlaceholderText: {
    fontSize: 14,
    color: colors.DARK_GRAY,
  },
});

export default Styles;
