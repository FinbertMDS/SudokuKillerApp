import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../context/ThemeContext';
import {TimeFilter} from '../../types';

interface Props {
  selected: TimeFilter;
  onClose: () => void;
  onSelect: (filter: TimeFilter) => void;
}

const options: {label: string; value: TimeFilter}[] = [
  {label: 'All Time', value: 'all'},
  {label: 'Today', value: 'today'},
  {label: 'This Week', value: 'week'},
  {label: 'This Month', value: 'month'},
  {label: 'This Year', value: 'year'},
];

const TimeFilterDropdown: React.FC<Props> = ({selected, onSelect, onClose}) => {
  const {theme} = useTheme();

  return (
    <SafeAreaView edges={['bottom']}>
      <Modal transparent onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <View
              style={[styles.container, {backgroundColor: theme.background}]}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    selected === option.value && {
                      backgroundColor: theme.selectedItemBackground,
                    },
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      borderBottomColor:
                        index === options.length - 1
                          ? 'transparent'
                          : theme.itemBorderColor,
                    },
                    index === 0 && styles.firstOption,
                  ]}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}>
                  <Text style={[styles.label, {color: theme.text}]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 16,
  },
  firstOption: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TimeFilterDropdown;
