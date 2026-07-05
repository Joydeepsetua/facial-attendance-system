import React from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity } from 'react-native';
import Icon from '../icons/Index';
import Styles from './Styles';

interface Props {
  visible: boolean;
  message: string;
  onDone: () => void;
}

// Polished success confirmation shown after feedback is submitted.
const FeedbackSuccessModal = ({ visible, message, onDone }: Props) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onDone}>
    <Pressable style={Styles.overlay} onPress={onDone}>
      <View style={Styles.modal} onStartShouldSetResponder={() => true}>
        <View style={Styles.badgeOuter}>
          <View style={Styles.badgeInner}>
            <Icon name="check" size="xl" color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>

        <Text style={Styles.title}>Feedback Sent!</Text>
        <Text style={Styles.message}>{message}</Text>

        <TouchableOpacity style={Styles.button} activeOpacity={0.7} onPress={onDone}>
          <Text style={Styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Modal>
);

export default FeedbackSuccessModal;
