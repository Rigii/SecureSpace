import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ReactNativeVideo from 'react-native-video';

export interface ContentPreviewModalProps {
  contentType: string;
  contentLocalPath: string;
  indexNumber: number;
  contentName: string;
  contentDate: string | Date;
  isOpen: boolean;

  onClose?: () => void;
}

const normalizeLocalPath = (path: string): string =>
  path.startsWith('file://') ? path : `file://${path}`;

const isImageType = (contentType: string): boolean =>
  contentType === 'image' || contentType.startsWith('image/');

const isVideoType = (contentType: string): boolean =>
  contentType === 'video' || contentType.startsWith('video/');

const getFormattedDate = (value: string | Date): string => {
  if (value instanceof Date) {
    return value.toLocaleString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
};

const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  contentType,
  contentLocalPath,
  indexNumber,
  contentName,
  contentDate,
  isOpen,
  onClose,
}) => {
  const localUri = normalizeLocalPath(contentLocalPath);
  const imageContent = isImageType(contentType);
  const videoContent = isVideoType(contentType);
  const formattedDate = getFormattedDate(contentDate);

  let VideoComponent: React.ComponentType<any> | null = null;
  if (videoContent) {
    try {
      // Optional dependency: render fallback text if react-native-video is not installed.
      VideoComponent = ReactNativeVideo;
    } catch {
      VideoComponent = null;
    }
  }

  const handleOutsidePress = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={isOpen}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.header}>
          <Text style={styles.indexText}>#{indexNumber + 1}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>

        <View style={styles.mediaCenter}>
          <View style={styles.mediaBlock}>
            {imageContent && (
              <Image
                source={{uri: localUri}}
                style={styles.media}
                resizeMode="contain"
              />
            )}

            {videoContent && VideoComponent && (
              <VideoComponent
                source={{uri: localUri}}
                style={styles.media}
                controls
                resizeMode="contain"
                paused={false}
              />
            )}

            {videoContent && !VideoComponent && (
              <View style={styles.unsupportedBlock}>
                <Text style={styles.unsupportedText}>
                  Video preview is not available.
                </Text>
              </View>
            )}

            {!imageContent && !videoContent && (
              <View style={styles.unsupportedBlock}>
                <Text style={styles.unsupportedText}>
                  Unsupported content type.
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.metaBlock}>
          <Text style={styles.contentName}>{contentName}</Text>
          <Text style={styles.contentDate}>{formattedDate}</Text>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  indexText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
  closeButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  mediaCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  mediaBlock: {
    width: '100%',
    height: '74%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  unsupportedBlock: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2E2E2E',
    borderRadius: 12,
  },
  unsupportedText: {
    color: '#D1D5DB',
    fontSize: 16,
  },
  metaBlock: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 6,
  },
  contentName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  contentDate: {
    color: '#BDBDBD',
    fontSize: 13,
  },
});

export default ContentPreviewModal;
