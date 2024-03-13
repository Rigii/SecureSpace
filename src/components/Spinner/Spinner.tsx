/* eslint-disable react/no-unstable-nested-components */
import React, {ReactElement} from 'react';
import {SpinnerHint} from './spinnerHint';
import {Text, View} from 'react-native';
import {ThemedButton} from '../themed-button';

export const Spinner: React.FC<{
  isActive: boolean;
  spinnerTitle?: string | boolean;
  onlyContent?: boolean;
  wrapperClassName?: string;
  subWrapperClassName?: string;
  noTitle?: boolean;
  notificationMessages?: {[key: string]: string};
  onBack?: () => void;
}> = ({
  isActive,
  spinnerTitle,
  onlyContent,
  wrapperClassName,
  subWrapperClassName,
  noTitle,
  notificationMessages,
  onBack,
}) => {
  if (!isActive) {
    return <></>;
  }

  const PageWrapper = ({children}: {children: ReactElement}) =>
    !onlyContent ? (
      <View
        className={`flex flex-col content-center items-center justify-center flex-1 gap-y-5 absolute top-0 left-0 h-full w-full min-h-screen dark:bg-background-black bg-white z-50 sm:pl-6 pl-3 sm:pr-6 pr-3 ${
          wrapperClassName || ''
        }`}>
        {children}
      </View>
    ) : (
      <>{children}</>
    );

  return (
    <PageWrapper>
      <View
        className={`flex justify-center	flex-col items-center h-32 w-full max-w-xl ${
          subWrapperClassName || ''
        }`}>
        {!noTitle && (
          <Text className="dark:text-white w-full text-center pl-6 pr-6 break-words	">
            {spinnerTitle || 'Loading'}
          </Text>
        )}

        <SpinnerHint />
        <div className={'flex flex-col mb-5'}>
          {notificationMessages &&
            Object.values(notificationMessages).map(
              (currentNotification: string, index: number) => (
                <p
                  key={index}
                  className="dark:text-gray-500 text-gray-600 sm:text-md text-md">
                  {currentNotification}
                </p>
              ),
            )}
        </div>
        {onBack && (
          <ThemedButton
            text={'Back'}
            disabled={!isActive}
            theme="filled"
            onPress={onBack}
            classCustomBody="w-80 h-12 rounded-sm"
          />
        )}
      </View>
    </PageWrapper>
  );
};
