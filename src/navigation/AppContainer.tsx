import * as React from 'react';
import { createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/splash/Index';
import Home from '../screens/home/Index';
import CreateUser from '../screens/createUser/Index';
import Report from '../screens/report/Index';
import Users from '../screens/users/Index';
import EditUser from '../screens/editUser/Index';
import Settings from '../screens/settings/Index';
import Organization from '../screens/organization/Index';
import FeatureMaster from '../screens/featureMaster/Index';
import Legal from '../screens/legal/Index';
import About from '../screens/about/Index';
import Payroll from '../screens/payroll/Index';
import Payslip from '../screens/payslip/Index';
import Feedback from '../screens/feedback/Index';


export type RootStackParamList = {
    Splash: undefined;
    Home: undefined;
    CreateUser: undefined;
    EditUser: { userUuid: string };
    Report: undefined;
    Users: undefined;
    Payroll: undefined;
    Settings: undefined;
    Organization: undefined;
    FeatureMaster: undefined;
    Legal: { type: 'privacy' | 'terms' };
    About: undefined;
    Feedback: undefined;
    Payslip: {
        uuid: string;
        year: number;
        month: number; // 0-based
        presentDays: number;
        pay: number;
        salaryType: string;
        salaryAmount: number;
    };
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
            <Stack.Screen name="Payroll" component={Payroll} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Payslip" component={Payslip} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Settings" component={Settings} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Organization" component={Organization} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="FeatureMaster" component={FeatureMaster} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Legal" component={Legal} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="About" component={About} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Feedback" component={Feedback} options={{ animation: 'slide_from_right' }} />
        </Stack.Navigator>
    )
}
export default AppContainer;
