import { StyleSheet, Dimensions } from 'react-native';


const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientContainer: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
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
    logo: {
        width: 104,
        height: 152,
        resizeMode: 'contain',
    },
    description: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: '500',
    },
    formContainer: {
        width: '100%',
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
    loginButton: {
        height: 50,
        width: '40%',
        alignSelf: 'center',
        backgroundColor: '#FFD700', // Yellow
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
    loginButtonText: {
        color: '#8B0000', // Dark red text for contrast
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
