import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * 전문가 상담 예약 다이얼로그 컴포넌트
 * 
 * Props:
 * - visible: boolean (모달 표시 여부)
 * - reservation: {
 *     hospital: string,
 *     doctor: string,
 *     date: string,
 *     time: string,
 *     personaName: string,
 *     personaImage: any (require 혹은 URI)
 *   }
 * - onAccept: function (수락 시 콜백)
 * - onDecline: function (거절 시 콜백)
 */
const ExpertReservationDialog = ({ visible, reservation, onAccept, onDecline }) => {
  if (!reservation) return null;

  const { hospital, doctor, date, time, personaName, personaImage } = reservation;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Image source={personaImage} style={styles.avatar} />
            <Text style={styles.title}>Mindy
                <Text style={styles.messageText}>{'\n'}챗봇</Text>
            </Text>
            
          </View>

          <Image
            source={require('../assets/consultation.png')}
            style={styles.illustration}
            resizeMode="contain"
          />

          <View style={styles.content}>
            <Text style={styles.infoText}>
              {hospital} {doctor} 선생님{`\n`}
              {date} {time}
            </Text>
            <Text style={styles.messageText}>
                {'\t'}챗봇 {personaName}가 병원 치료가 필요하다고 판단하여{`\n`}
                {doctor} 선생님과의 상담 일정을 예약하려고 합니다.{`\n\n`}
                {"\t\t\t\t\t\t\t\t\t\t\t\t\t"}수락하시겠습니까?
            </Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, styles.decline]} onPress={onDecline}>
              <Text style={styles.declineText}>거절</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.accept]} onPress={onAccept}>
              <Text style={styles.acceptText}>수락</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 45,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  illustration: {
    width: '150%',
    height: 231,
    marginVertical: 5,
    alignSelf:'center',
  },
  content: {
    width: '100%',
    marginVertical: 8,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 6,
  },
  messageText: {
    fontSize: 14,
    textAlign: 'left',
    lineHeight: 20,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  decline: {
    backgroundColor: '#EFEFEF',
  },
  accept: {
    backgroundColor: '#5c4ccf',
  },
  declineText: {
    fontSize: 16,
    color: '#555',
  },
  acceptText: {
    fontSize: 16,
    color: '#FFF',
  },
});

export default ExpertReservationDialog;
