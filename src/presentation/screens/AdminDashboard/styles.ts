import { StyleSheet } from 'react-native';
import { sharedStyles } from '../../components/shared-styles';

export const styles = StyleSheet.create({
    ...sharedStyles,
    navBarHeader: {
        ...sharedStyles.navBarHeader,
    },
    logo: {
        ...sharedStyles.logo,
    },
    avatar: {
        ...sharedStyles.avatar,
    },
    userInfoBox: {
        ...sharedStyles.userInfoBox,
    },
    userInfoText: {
        ...sharedStyles.userInfoText,
    },
    logoutButton: {
        ...sharedStyles.logoutButton,
    },
    logoutButtonText: {
        ...sharedStyles.logoutButtonText,
    },
    scrollContent: {
        ...sharedStyles.scrollContent,
    },
    warningText: {
        color: '#83b13e',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    uploadSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    uploadBtn: {
        backgroundColor: '#f0ce09',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    uploadBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    uploadHint: {
        marginLeft: 10,
        color: '#777',
        fontStyle: 'italic',
    },
    searchSection: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
        color: '#333',
    },
    filtersRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 10,
    },
    pickerBtn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        backgroundColor: '#fff',
    },
    pickerBtnText: {
        color: '#333',
    },
    searchBtn: {
        backgroundColor: '#8B0000',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
    },
    searchBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    tableSection: {
        marginTop: 10,
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
        width: 100,
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
    actionCell: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 120,
        alignItems: 'center',
    },
    editBtn: {
        backgroundColor: '#f0ad4e',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    deleteBtn: {
        backgroundColor: '#d9534f',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    actionText: {
        color: '#fff',
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '80%',
        maxHeight: '60%',
        borderRadius: 8,
        padding: 10,
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
});
