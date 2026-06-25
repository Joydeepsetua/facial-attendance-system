import * as React from 'react';
import { createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/splash/Index';
import Home from '../screens/home/Index';
import CreateUser from '../screens/createUser/Index';
import Report from '../screens/report/Index';
import Users from '../screens/users/Index';
import EditUser from '../screens/editUser/Index';
import ComingSoon from '../screens/comingSoon/Index';


export type RootStackParamList = {
    Splash: undefined;
    Home: undefined;
    CreateUser: undefined;
    EditUser: { userUuid: string };
    Report: undefined;
    Users: undefined;
    Payroll: undefined;
    Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigateRef: any = createNavigationContainerRef();

function AppContainer(props: any) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
            <Stack.Screen name="Splash" component={Splash} options={{ animation: 'fade' }} />
            <Stack.Screen name="Home" component={Home} options={{ animation: 'fade' }} />
            <Stack.Screen name="CreateUser" component={CreateUser} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Report" component={Report} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Users" component={Users} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="EditUser" component={EditUser} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Payroll" component={ComingSoon} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Settings" component={ComingSoon} options={{ animation: 'slide_from_right' }} />
        </Stack.Navigator>
    )
}
export default AppContainer;
