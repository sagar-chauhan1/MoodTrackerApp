import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mood options with their display names and colors
const MOODS = [
  { name: 'Happy', color: '#4CAF50' },      // Green
  { name: 'Neutral', color: '#9E9E9E' },    // Gray
  { name: 'Sad', color: '#2196F3' },        // Blue
  { name: 'Energetic', color: '#FFEB3B' },  // Yellow
  { name: 'Tired', color: '#795548' },      // Brown
];

// Helper to format timestamp as "YYYY-MM-DD HH:MM:SS"
function formatTimestamp(ts) {
  const date = new Date(ts);
  const pad = (n) => n.toString().padStart(2, '0');
  return (
    date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    ' ' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds())
  );
}

function getTodayString() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
}

export default function App() {
  const [history, setHistory] = useState([]);
  const [note, setNote] = useState('');
  const [editingIdx, setEditingIdx] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [reminderDismissed, setReminderDismissed] = useState(false);

  // Handle mood button tap
  const handleMoodPress = (mood) => {
    const entry = { mood: mood.name, timestamp: Date.now(), note: note.trim() };
    setHistory((prev) => [entry, ...prev].slice(0, 5));
    setNote('');
  };

  // Edit mood note
  const handleEdit = (idx) => {
    setEditingIdx(idx);
    setEditNote(history[idx].note || '');
  };
  const handleSaveEdit = (idx) => {
    const newHistory = [...history];
    newHistory[idx] = { ...newHistory[idx], note: editNote };
    setHistory(newHistory);
    setEditingIdx(null);
    setEditNote('');
  };
  const handleDelete = (idx) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this mood entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setHistory(history.filter((_, i) => i !== idx));
      }}
    ]);
  };

  // Mood statistics
  const moodCounts = MOODS.reduce((acc, m) => {
    acc[m.name] = history.filter(e => e.mood === m.name).length;
    return acc;
  }, {});
  const mostFrequentMood = Object.entries(moodCounts).reduce((a, b) => a[1] >= b[1] ? a : b, ['', 0])[0];

  // Daily reminder logic
  const today = getTodayString();
  const hasTodayEntry = history.some(e => {
    const d = new Date(e.timestamp);
    return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() === today;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f4f8' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 12, color: '#2c3e50', textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 }}>
          Mood Tracker
        </Text>
        <Text style={{ fontSize: 18, color: '#34495e', marginBottom: 20, textAlign: 'center', fontStyle: 'italic' }}>
          Track your mood, add notes, and view your mood stats!
        </Text>
        {/* Daily reminder */}
        {!hasTodayEntry && !reminderDismissed && (
          <View style={{ backgroundColor: '#fff3cd', borderRadius: 10, padding: 16, marginBottom: 20, width: '100%', maxWidth: 420, borderWidth: 1, borderColor: '#ffeeba', shadowColor: '#d6c23c', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 5 }}>
            <Text style={{ color: '#856404', fontSize: 16, fontWeight: '600' }}>Don't forget to log your mood today!</Text>
            <TouchableOpacity onPress={() => setReminderDismissed(true)} style={{ position: 'absolute', right: 14, top: 14 }}>
              <Text style={{ color: '#856404', fontWeight: 'bold', fontSize: 14 }}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Mood buttons */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.name}
              onPress={() => handleMoodPress(mood)}
              activeOpacity={0.85}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: mood.color,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 6,
                transform: [{ scale: 1 }],
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 }}>{mood.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Mood note input */}
        <View style={{ width: '100%', maxWidth: 420, marginBottom: 28 }}>
          <Text style={{ fontSize: 18, marginBottom: 8, color: '#2c3e50', fontWeight: '600' }}>Add a note (optional):</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="How are you feeling?"
            style={{
              borderWidth: 1,
              borderColor: '#a0aec0',
              borderRadius: 12,
              padding: 14,
              fontSize: 18,
              backgroundColor: '#ffffff',
              marginBottom: 6,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              fontFamily: 'System',
            }}
            maxLength={100}
            multiline
          />
        </View>
        {/* Mood statistics */}
        <View style={{ width: '100%', maxWidth: 420, marginBottom: 28, backgroundColor: '#e3e8f0', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#2c3e50' }}>Mood Statistics</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {MOODS.map((mood) => (
              <View key={mood.name} style={{ alignItems: 'center', marginBottom: 12, width: '19%' }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: mood.color, marginBottom: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 }} />
                <Text style={{ fontSize: 14, color: '#34495e', fontWeight: '600' }}>{mood.name}</Text>
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#2c3e50' }}>{moodCounts[mood.name]}</Text>
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 16, color: '#4a5568', marginTop: 12 }}>Most frequent mood: <Text style={{ fontWeight: 'bold', color: '#2c3e50' }}>{mostFrequentMood || 'N/A'}</Text></Text>
        </View>
        {/* Mood history */}
        <View style={{ width: '100%', maxWidth: 420 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#2c3e50' }}>Mood History</Text>
          {history.length === 0 ? (
            <Text style={{ color: '#718096', fontSize: 18, fontStyle: 'italic' }}>No moods recorded yet.</Text>
          ) : (
            history.map((entry, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: 'column',
                  paddingVertical: 14,
                  borderBottomWidth: idx === history.length - 1 ? 0 : 1,
                  borderColor: '#cbd5e0',
                  marginBottom: 6,
                  backgroundColor: '#ffffff',
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, color: '#2d3748', fontWeight: '600' }}>{entry.mood}</Text>
                  <Text style={{ fontSize: 15, color: '#718096', fontFamily: 'monospace' }}>
                    {formatTimestamp(entry.timestamp)}
                  </Text>
                </View>
                {editingIdx === idx ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <TextInput
                      value={editNote}
                      onChangeText={setEditNote}
                      style={{ flex: 1, borderWidth: 1, borderColor: '#a0aec0', borderRadius: 8, padding: 8, fontSize: 16, backgroundColor: '#f7fafc' }}
                      maxLength={100}
                      multiline
                    />
                    <TouchableOpacity onPress={() => handleSaveEdit(idx)} style={{ marginLeft: 12 }}>
                      <Text style={{ color: '#48bb78', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <Text style={{ fontSize: 16, color: '#4a5568', flex: 1 }}>{entry.note ? 'Note: ' + entry.note : ''}</Text>
                    <TouchableOpacity onPress={() => handleEdit(idx)} style={{ marginLeft: 12 }}>
                      <Text style={{ color: '#4299e1', fontWeight: 'bold', fontSize: 16 }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(idx)} style={{ marginLeft: 12 }}>
                      <Text style={{ color: '#f56565', fontWeight: 'bold', fontSize: 16 }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
