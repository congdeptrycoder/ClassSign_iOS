import { Dimensions, StyleSheet } from 'react-native';
import { sharedStyles } from '../../components/shared-styles';

const { width } = Dimensions.get('window');
const gridColumnWidth = Math.max((width - 90) / 7, 60);

export const styles = StyleSheet.create({
    ...sharedStyles,
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
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
    contentContainer: {
        flex: 1,
        padding: 15,
    },
    whatTimeIsIt: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8dca1a',
        textAlign: 'center',
        marginVertical: 15,
    },
    actionButton: {
        backgroundColor: '#ceb10e',
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 20,
    },
    actionButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    searchInput: {
        height: 50,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 6,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#F9F9F9',
        color: '#333',
    },
    registerButton: {
        backgroundColor: '#8B0000',
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 25,
    },
    registerButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    tableContainer: {
        marginBottom: 30,
        backgroundColor: '#FFF',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    table: {
        borderWidth: 1,
        borderColor: '#EEE',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerCell: {
        padding: 10,
        fontWeight: 'bold',
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
    },
    cell: {
        padding: 10,
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
    },
    cellId: {
        width: 50,
    },
    cellCode: {
        width: 80,
    },
    cellName: {
        width: 180,
    },
    cellStatus: {
        width: 100,
    },
    cellCredits: {
        width: 60,
    },
    timeGrid: {
        borderWidth: 1,
        borderColor: '#EEE',
    },
    gridRow: {
        flexDirection: 'row',
    },
    gridHeaderCorner: {
        width: 60,
        height: 40,
        backgroundColor: '#F5F5F5',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EEE',
    },
    gridHeaderCell: {
        width: gridColumnWidth,
        height: 40,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EEE',
    },
    gridHeaderText: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#555',
    },
    gridPeriodCell: {
        width: 60,
        height: 50,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EEE',
    },
    gridPeriodText: {
        fontSize: 12,
        color: '#666',
    },
    gridCell: {
        width: gridColumnWidth,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EEE',
        backgroundColor: '#FFF',
    },
    gridCellActive: {
        backgroundColor: '#E6F3FF',
    },
    gridEventText: {
        fontSize: 10,
        color: '#0055A4',
        textAlign: 'center',
        padding: 2,
    },
    gridDivider: {
        backgroundColor: '#EEE',
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridDividerText: {
        fontSize: 10,
        color: '#999',
        fontWeight: 'bold',
    },
    bottomSpacer: {
        height: 40,
    },
});
