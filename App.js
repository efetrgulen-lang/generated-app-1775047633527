import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('@notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      Alert.alert('Hata', 'Notlar yüklenemedi.');
    }
  };

  const saveNotes = async (newNotes) => {
    try {
      await AsyncStorage.setItem('@notes', JSON.stringify(newNotes));
    } catch (error) {
      Alert.alert('Hata', 'Not kaydedilemedi.');
    }
  };

  const addNote = () => {
    if (inputText.trim() === '') return;
    const newNote = { id: Date.now().toString(), text: inputText };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setInputText('');
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteText}>{item.text}</Text>
      <TouchableOpacity onPress={() => deleteNote(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Sil</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Text style={styles.headerTitle}>Not Defteri</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderNote}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Notunuzu yazın..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity onPress={addNote} style={styles.addButton}>
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  noteItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  noteText: { fontSize: 16, color: '#444', flex: 1 },
  deleteButton: { backgroundColor: '#ff5252', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginLeft: 10 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f9f9f9', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', maxHeight: 120, minHeight: 45, fontSize: 16 },
  addButton: { backgroundColor: '#4caf50', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});