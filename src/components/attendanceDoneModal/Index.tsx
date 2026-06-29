import React from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity } from 'react-native';
import Styles from './Styles';

interface Props {
  visible: boolean;
  name?: string;
  employeeId?: string | null;
  similarity?: number;
  punchIn?: string | null;
  punchOut?: string | null;
  onClose: () => void;
  onScanNext: () => void;
}

// "YYYY-MM-DD HH:MM:SS" → "h:mm AM/PM"
const formatTime = (dt?: string | null): string => {
  if (!dt) return '--:--';
  const hm = dt.substring(11, 16);
  const [hStr, m] = hm.split(':');
  let h = parseInt(hStr, 10);
  if (isNaN(h) || !m) return '--:--';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
};

const AttendanceDoneModal = ({
  visible,
  name,
  employeeId,
  similarity,
  punchIn,
  punchOut,
  onClose,
  onScanNext,
}: Props) => {
  const meta = [
    employeeId ? `ID ${employeeId}` : null,
    similarity != null ? `${(similarity * 100).toFixed(1)}% match` : null,
  ]
    .filter(Boolean)
    .join('   ·   ');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={Styles.overlay} onPress={onClose}>
        <View style={Styles.modal} onStartShouldSetResponder={() => true}>
          <View style={Styles.iconCircle}>
            <Text style={Styles.icon}>✅</Text>
          </View>
          <Text style={Styles.title}>Attendance Already Done</Text>
          <Text style={Styles.message}>
            This user has already completed today's attendance.
          </Text>

          {/* Unified info card: avatar + name + id/match + in/out times */}
          <View style={Styles.infoCard}>
            <View style={Styles.infoHeader}>
              <View style={Styles.avatar}>
                <Text style={Styles.avatarText}>
                  {(name || '?').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={Styles.infoHeaderText}>
                <Text style={Styles.name} numberOfLines={1}>
                  {name || 'Unknown User'}
                </Text>
                {meta ? <Text style={Styles.meta}>{meta}</Text> : null}
              </View>
            </View>

            <View style={Styles.divider} />

            <View style={Styles.timesRow}>
              <View style={Styles.timeCol}>
                <Text style={Styles.timeLabel}>IN TIME</Text>
                <Text style={Styles.timeValue}>{formatTime(punchIn)}</Text>
              </View>
              <View style={Styles.timeColDivider} />
              <View style={Styles.timeCol}>
                <Text style={Styles.timeLabel}>OUT TIME</Text>
                <Text style={Styles.timeValue}>{formatTime(punchOut)}</Text>
              </View>
            </View>
          </View>

          <View style={Styles.actions}>
            <TouchableOpacity style={Styles.cancelButton} onPress={onClose}>
              <Text style={Styles.cancelButtonText}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Styles.confirmButton} onPress={onScanNext}>
              <Text style={Styles.confirmButtonText}>Scan Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default AttendanceDoneModal;
