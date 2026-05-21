import React from 'react';
import {View, TouchableWithoutFeedback, Modal} from 'react-native';

export interface IModalPopup {
  content: JSX.Element;
  isOpen: boolean;
  wrapperClass?: string;
  backgroundClass?: string;
  setisModalOpen: (isOpen: boolean) => void;
}

const ModalPopup: React.FC<IModalPopup> = ({
  content,
  wrapperClass,
  backgroundClass,
  isOpen,
  setisModalOpen,
}) => {
  const handleClose = () => {
    setisModalOpen(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={isOpen}
      onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className={`flex-1 bg-transparent ${backgroundClass}`}>
          <View className={`absolute p-3 rounded-lg ${wrapperClass}`}>
            {content}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalPopup;
