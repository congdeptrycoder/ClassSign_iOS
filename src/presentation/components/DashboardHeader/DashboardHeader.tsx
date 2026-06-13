import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../ThemeContext';
import { createDashboardHeaderStyles } from './styles';

type DashboardHeaderProps = {
    titleLabel: string;
    isProfileOpen: boolean;
    toggleProfile: () => void;
    onLogout: () => void;
};

export const DashboardHeader = ({
    titleLabel,
    isProfileOpen,
    toggleProfile,
    onLogout,
}: DashboardHeaderProps) => {
    const { colors } = useTheme();
    const styles = createDashboardHeaderStyles(colors);

    return (
        <>
            <View style={styles.navBarHeader} testID="nav-bar-header">
                <Image
                    source={require('../../../../assets/image/hust-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <TouchableOpacity onPress={toggleProfile}>
                    <Image
                        source={require('../../../../assets/image/hust-logo.png')}
                        style={styles.avatar}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {isProfileOpen && (
                <View style={styles.userInfoBox}>
                    <Text style={styles.userInfoText}>{titleLabel}</Text>
                    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
};
