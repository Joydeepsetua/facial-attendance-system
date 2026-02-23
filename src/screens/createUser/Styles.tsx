import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_DARK,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.TEXT_PRIMARY,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.BG_BORDER,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.TEXT_PRIMARY,
    backgroundColor: colors.BG_ELEVATED,
  },
  imagePicker: {
    borderWidth: 2,
    borderColor: colors.PRIMARY,
    borderStyle: 'dashed',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.BG_CARD,
  },
  imagePlaceholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: colors.TEXT_SECONDARY,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  createButton: {
    backgroundColor: colors.PRIMARY_DARK,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.TEXT_ON_PRIMARY,
  },
});

export default Styles;
