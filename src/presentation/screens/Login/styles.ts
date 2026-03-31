import { StyleSheet } from 'react-native';
import { sharedStyles } from '../../components/shared-styles';

export const styles = StyleSheet.create({
    ...sharedStyles,
    container: {
        ...sharedStyles.container,
    },
    gradientContainer: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
    scrollContentLandscape: {
        paddingHorizontal: 32,
        paddingVertical: 18,
    },
    formContainer: {
        width: '100%',
        alignSelf: 'center',
    },
    formContainerLandscape: {
        maxWidth: 560,
    },
    welcomeText: {
        marginTop: 20,
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    logoContainerLandscape: {
        marginBottom: 10,
    },
    logo: {
        width: 104,
        height: 152,
        resizeMode: 'contain',
    },
    logoLandscape: {
        width: 84,
        height: 122,
    },
    description: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: '500',
    },
    descriptionLandscape: {
        marginBottom: 20,
    },
    input: {
        width: '90%',
        alignSelf: 'center',
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        fontSize: 16,
        color: '#333',
    },
    inputLandscape: {
        width: '100%',
        maxWidth: 460,
        marginBottom: 12,
    },
    loginButton: {
        height: 50,
        width: '40%',
        alignSelf: 'center',
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loginButtonLandscape: {
        width: '100%',
        maxWidth: 220,
        marginTop: 4,
    },
    loginButtonText: {
        color: '#8B0000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
