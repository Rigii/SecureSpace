import React, {useMemo} from 'react';
import {Image, Modal, Pressable, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ReactNativeVideo from 'react-native-video';
import {getFileTypeCategory} from '../../services/file-content/helpers';
import {EContentFileType} from '../../services/file-content/types';

export interface ContentPreviewModalProps {
  mimeType: string;
  contentLocalPath: string;
  indexNumber: number;
  contentName: string;
  contentDate: string | Date;
  isOpen: boolean;

  onClose?: () => void;
}

const strings = {
  videoPreviewUnavailable: 'Video preview is not available.',
  unsupportedMimeType: 'Unsupported content type.',
  closeButton: 'Close',
};

const normalizeLocalPath = (path: string): string =>
  path.startsWith('file://') ? path : `file://${path}`;

const getFormattedDate = (value: string | Date): string => {
  if (value instanceof Date) {
    return value.toLocaleString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
};

const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  mimeType,
  contentLocalPath,
  indexNumber,
  contentName,
  contentDate,
  isOpen,
  onClose,
}) => {
  const currentContentType = useMemo(
    () => getFileTypeCategory(mimeType),
    [mimeType],
  );

  const localUri = normalizeLocalPath(contentLocalPath);
  const formattedDate = getFormattedDate(contentDate);

  let VideoComponent: React.ComponentType<any> | null = null;
  if (currentContentType === EContentFileType.VIDEO) {
    try {
      // Optional: render fallback text if react-native-video is not installed.
      VideoComponent = ReactNativeVideo;
    } catch {
      VideoComponent = null;
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={false}
      presentationStyle="pageSheet"
      statusBarTranslucent={true}
      visible={isOpen}
      onRequestClose={onClose}
      className="flex-1 bg-black">
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-black">
        <View className="flex-row items-center justify-between px-4 pt-2">
          <Text className="text-white text-sm opacity-80">
            #{indexNumber + 1}
          </Text>
          <Pressable
            className="border border-white px-3.5 py-2 rounded-lg"
            onPress={onClose}>
            <Text className="text-white text-sm font-semibold">
              {strings.closeButton}
            </Text>
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center px-3">
          <View className="w-full h-3/4 items-center justify-center">
            {currentContentType === EContentFileType.IMAGE && (
              <Image
                source={{uri: localUri}}
                className="w-full h-full"
                resizeMode="contain"
              />
            )}

            {currentContentType === EContentFileType.VIDEO &&
              VideoComponent && (
                <VideoComponent
                  source={{uri: localUri}}
                  controls
                  resizeMode="contain"
                  paused={false}
                />
              )}

            {currentContentType === EContentFileType.VIDEO &&
              !VideoComponent && (
                <View className="w-full h-full items-center justify-center border border-[#2E2E2E] rounded-xl">
                  <Text className="text-gray-300 text-base">
                    {strings.videoPreviewUnavailable}
                  </Text>
                </View>
              )}

            {currentContentType === EContentFileType.OTHER && (
              <View className="w-full h-full items-center justify-center border border-[#2E2E2E] rounded-xl">
                <Text className="text-gray-300 text-base">
                  {strings.unsupportedMimeType}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="px-4 pb-6 space-y-1.5">
          <Text className="text-white text-lg font-bold">{contentName}</Text>
          <Text className="text-[#BDBDBD] text-[13px]">{formattedDate}</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ContentPreviewModal;
