import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AlarmTwoChooseProps {
    visible: boolean;
    message: string;
    cancelText: string;
    confirmText: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export const AlarmTwoChoose: React.FC<AlarmTwoChooseProps> = ({
    visible,
    message,
    cancelText,
    confirmText,
    onCancel,
    onConfirm,
}) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <Text style={styles.messageText}>{message}</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>{cancelText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
                            <Text style={[styles.buttonText, styles.confirmButtonText]}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    messageText: {
        fontSize: 16,
        color: '#333333',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: '#E0E0E0',
    },
    confirmButton: {
        backgroundColor: '#CC0000',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: '#333333',
    },
    confirmButtonText: {
        color: '#FFFFFF',
    },
});
