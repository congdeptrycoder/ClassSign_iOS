import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../shared/types/theme.types';

export const createDashboardHeaderStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        navBarHeader: {
            flexDirection: 'row',
            height: 60,
            backgroundColor: colors.navBar,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            zIndex: 10,
        },
        logo: {
            width: 100,
            height: 40,
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.card,
        },
        userInfoBox: {
            position: 'absolute',
            top: 80,
            right: 15,
            backgroundColor: colors.card,
            padding: 15,
            borderRadius: 8,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            zIndex: 20,
            alignItems: 'center',
        },
        userInfoText: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 10,
            color: colors.cardText,
        },
        logoutButton: {
            backgroundColor: colors.buttonPrimary,
            paddingVertical: 6,
            paddingHorizontal: 15,
            borderRadius: 4,
        },
        logoutButtonText: {
            color: colors.buttonPrimaryText,
            fontWeight: 'bold',
            fontSize: 12,
        },
    });
