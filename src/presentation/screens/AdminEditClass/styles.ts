import { StyleSheet } from 'react-native';
import { sharedStyles } from '../../components/shared-styles';

export const styles = StyleSheet.create({
    ...sharedStyles,
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    backBtn: {
        marginRight: 16,
        padding: 8,
    },
    backBtnText: {
        color: '#0275d8',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        flexShrink: 1,
    },
    scrollContent: {
        ...sharedStyles.scrollContent,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
        color: '#333',
    },
    saveBtn: {
        backgroundColor: '#5cb85c',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
