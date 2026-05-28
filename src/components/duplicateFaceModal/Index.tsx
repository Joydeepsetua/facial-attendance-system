import React from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../../constants/colors';
import { FaceMatch } from '../../utils/face';
import Styles from './Styles';

interface Props {
  visible: boolean;
  matches: FaceMatch[];
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}

const DuplicateFaceModal = ({
  visible,
  matches,
  onCancel,
  onConfirm,
  confirmLabel = 'Add Anyway',
}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={Styles.overlay} onPress={onCancel}>
        <View style={Styles.modal} onStartShouldSetResponder={() => true}>
          <View style={Styles.iconCircle}>
            <Text style={Styles.icon}>⚠️</Text>
          </View>
          <Text style={Styles.title}>Face Already Registered</Text>
          <Text style={Styles.message}>This face matches with:</Text>

          {matches.length > 0 && (
            <ScrollView
              style={Styles.list}
              contentContainerStyle={Styles.listContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
            >
              {matches.map(m => (
                <View key={m.uuid} style={Styles.row}>
                  <Text style={Styles.rowName}>{m.name}</Text>
                  <Text style={Styles.rowSim}>{(m.similarity * 100).toFixed(1)}%</Text>
                </View>
              ))}
            </ScrollView>
          )}

          <Text style={Styles.question}>Do you still want to add this user?</Text>

          <View style={Styles.actions}>
            <TouchableOpacity style={Styles.cancelButton} onPress={onCancel}>
              <Text style={Styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Styles.confirmButton} onPress={onConfirm}>
              <Text style={Styles.confirmButtonText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default DuplicateFaceModal;
