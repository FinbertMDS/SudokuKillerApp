import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {Level} from '../../types';
import {MAX_MISTAKES} from '../../utils/constants';
import {formatTime} from '../../utils/dateUtil';

type PauseModalProps = {
  level: Level;
  mistake: number;
  time: number;
  onResume: () => void;
};

const PauseModal = ({level, mistake, time, onResume}: PauseModalProps) => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <>
      {/* Modal tạm dừng */}
      <Modal
        animationType="fade"
        transparent
        visible
        statusBarTranslucent
        onRequestClose={() => onResume()}>
        <View style={styles.overlay}>
          <View style={[styles.modalBox, {backgroundColor: theme.background}]}>
            {/* Header */}
            <Text style={[styles.modalHeader, {color: theme.text}]}>
              {t('paused')}
            </Text>

            {/* Thông tin Board */}
            <View style={styles.modalBoardInfo}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>{t('level')}</Text>
                <Text style={[styles.infoValue, {color: theme.text}]}>
                  {t(`level.${level}`)}
                </Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>{t('mistakes')}</Text>
                <Text style={[styles.infoValue, {color: theme.text}]}>
                  {mistake}/{MAX_MISTAKES}
                </Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>{t('time')}</Text>
                <Text style={[styles.infoValue, {color: theme.text}]}>
                  {formatTime(time)}
                </Text>
              </View>
            </View>

            {/* Button Tiếp tục */}
            <TouchableOpacity
              style={[styles.resumeButton, {backgroundColor: theme.primary}]}
              onPress={onResume}>
              <Text
                style={[styles.resumeButtonText, {color: theme.buttonText}]}>
                {t('continue')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute' as const,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 10, // for Android shadow
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalBoardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  infoBlock: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 14,
    color: '#888',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resumeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  resumeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(PauseModal);
