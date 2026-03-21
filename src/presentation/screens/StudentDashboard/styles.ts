import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    navBarHeader: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#CC0000', // Red background
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
        backgroundColor: '#F00',
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 4,
    },
    logoutButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    contentContainer: {
        flex: 1,
        padding: 15,
    },
    whatTimeIsIt: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#CC0000',
        textAlign: 'center',
        marginVertical: 15,
    },
    actionButton: {
        backgroundColor: '#0055A4', // Blue color for CTA
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
        backgroundColor: '#28A745', // Green color
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
    // Fixed width for cells to allow horizontal scroll
    cellId: { width: 50 },
    cellCode: { width: 80 },
    cellName: { width: 180 },
    cellStatus: { width: 100 },
    cellCredits: { width: 60 },

    // Time Grid Table styles
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
        width: Math.max((width - 90) / 7, 60), // Responsive width, min 60
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
        width: Math.max((width - 90) / 7, 60),
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EEE',
        backgroundColor: '#FFF',
    },
    gridCellActive: {
        backgroundColor: '#E6F3FF', // Light blue background for events
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
});
