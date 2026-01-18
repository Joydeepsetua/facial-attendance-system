import * as React from 'react';
import { createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home/Index';
import CreateUser from '../screens/createUser/Index';
import Attendance from '../screens/attendance/Index';
import Report from '../screens/report/Index';


export type RootStackParamList = {
    Home: undefined;
    CreateUser: undefined;
    Attendance: undefined;
    Report: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigateRef: any = createNavigationContainerRef();

function AppContainer(props: any) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="CreateUser" component={CreateUser} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Attendance" component={Attendance} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Report" component={Report} options={{ animation: 'slide_from_right' }} />
        </Stack.Navigator>
    )
}
export default AppContainer;
