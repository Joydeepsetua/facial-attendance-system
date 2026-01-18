
import { LogBox, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppContainer, { navigateRef } from './src/navigation/AppContainer';
import { ToastContainer } from './src/utils/toast';


const App = () => {
    LogBox.ignoreAllLogs(true);
    console.warn = () => { };
    return (
        <SafeAreaProvider>
            <NavigationContainer ref={navigateRef}>
                <AppContainer />
            </NavigationContainer>
            <ToastContainer />
        </SafeAreaProvider>
    )
}

export default App;