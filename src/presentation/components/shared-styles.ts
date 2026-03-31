import { StyleSheet } from 'react-native';

export const sharedStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    navBarHeader: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#CC0000',
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
        backgroundColor: '#FFF',
    },
    userInfoBox: {
        position: 'absolute',
        top: 70,
        right: 15,
        backgroundColor: '#FFF',
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
        color: '#333',
    },
    logoutButton: {
        backgroundColor: '#8B0000',
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 4,
    },
    logoutButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    tableHeader: {
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 2,
        borderColor: '#ccc',
    },
    cell: {
        padding: 10,
        borderRightWidth: 1,
        borderColor: '#eee',
        textAlign: 'center',
        fontSize: 12,
        color: '#333',
    },
    headerCell: {
        fontWeight: 'bold',
    },
});
