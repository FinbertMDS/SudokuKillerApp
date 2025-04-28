import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { MAX_MISTAKES } from '../../utils/constants';
import { formatTime } from '../../utils/dateUtil';

type PauseModalProps = {
  visible: boolean;
  level: string;
  mistake: number;
  elapsedTime: number;
  onResume: () => void;
};

const PauseModal = ({ visible, level, mistake: mistakeCount, elapsedTime, onResume }: PauseModalProps) => (
  <>
    {/* Modal tạm dừng */}
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>

          {/* Header */}
          <Text style={styles.modalHeader}>Đã dừng</Text>

          {/* Thông tin Board */}
          <View style={styles.modalBoardInfo}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>Level</Text>
              <Text style={styles.infoValue}>{level}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>Mistakes</Text>
              <Text style={styles.infoValue}>{mistakeCount}/{MAX_MISTAKES}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>Time</Text>
              <Text style={styles.infoValue}>{formatTime(elapsedTime)}</Text>
            </View>
          </View>

          {/* Button Tiếp tục */}
          <TouchableOpacity style={styles.resumeButton} onPress={onResume}>
            <Text style={styles.resumeButtonText}>Tiếp tục</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  </>
);

const styles = {
  infoBlock: {
    alignItems: 'center' as const,
  },

  infoTitle: {
    fontSize: 14,
    color: '#888',
  },

  infoValue: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#333',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  modalBox: {
    backgroundColor: 'white',
    width: '90%' as const,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center' as const,
  },

  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    marginBottom: 20,
    color: '#333',
  },

  modalBoardInfo: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    width: '100%' as const,
    marginBottom: 20,
  },

  resumeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  resumeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
};

export default React.memo(PauseModal);
