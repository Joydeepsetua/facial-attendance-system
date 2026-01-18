import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import colors from './colors';

let toastTimeout: NodeJS.Timeout | null = null;
let setToastState: ((message: string | null, type: 'success' | 'error') => void) | null = null;

export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (setToastState) {
    setToastState(message, type);
  }
};

export const ToastContainer = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<'success' | 'error'>('success');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setToastState = (msg: string | null, toastType: 'success' | 'error') => {
      if (msg) {
        setMessage(msg);
        setType(toastType);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        if (toastTimeout) {
          clearTimeout(toastTimeout);
        }

        toastTimeout = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setMessage(null);
          });
        }, 2000);
      } else {
        setMessage(null);
      }
    };

    return () => {
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
    };
  }, [fadeAnim]);

  if (!message) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[styles.toast, type === 'success' ? styles.success : styles.error]}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    pointerEvents: 'none',
  },
  toast: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    maxWidth: '90%',
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  success: {
    backgroundColor: colors.GREEN,
  },
  error: {
    backgroundColor: colors.RED,
  },
  text: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
