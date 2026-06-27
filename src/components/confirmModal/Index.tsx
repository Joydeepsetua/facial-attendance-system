import React from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from '../icons/Index';
import { AppIconName } from '../icons/icons';
import colors from '../../constants/colors';
import Styles from './Styles';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message?: string;
  icon?: AppIconName;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Reusable confirmation dialog with the primary (brand) colour theme.
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  icon,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={Styles.overlay}>
        <View style={Styles.modal}>
          {icon && (
            <View style={Styles.iconCircle}>
              <Icon name={icon} size="lg" color={colors.BRAND} strokeWidth={2} />
            </View>
          )}
          <Text style={Styles.title}>{title}</Text>
          {message ? <Text style={Styles.message}>{message}</Text> : null}
          <View style={Styles.actions}>
            <TouchableOpacity style={Styles.cancelButton} activeOpacity={0.85} onPress={onCancel} disabled={loading}>
              <Text style={Styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[Styles.confirmButton, loading && { opacity: 0.6 }]}
              activeOpacity={0.85}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={Styles.confirmButtonText}>{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
