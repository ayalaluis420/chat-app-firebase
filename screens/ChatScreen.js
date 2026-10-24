import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MessageBubble from '../components/MessageBubble';
import { enviarMensaje, escucharMensajes } from '../firebase';

export default function ChatScreen({ route }) {
  const { usuario } = route.params;
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [cargando, setCargando] = useState(true);
  const listaRef = useRef(null);
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  // Escucha los mensajes en tiempo real; al salir de la pantalla se cancela la suscripción.
  useEffect(() => {
    const cancelar = escucharMensajes((lista) => {
      setMensajes(lista);
      setCargando(false);
    });
    return cancelar;
  }, []);

  const puedeEnviar = texto.trim().length > 0;

  const enviar = () => {
    if (!puedeEnviar) return;
    const pendiente = texto;
    setTexto('');
    enviarMensaje(usuario, pendiente).catch(() => {
      setTexto(pendiente);
      Alert.alert('Error', 'No se pudo enviar el mensaje. Revisa tu conexión.');
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      {cargando ? (
        <ActivityIndicator style={styles.centro} size="large" color="#075E54" />
      ) : (
        <FlatList
          ref={listaRef}
          data={mensajes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              usuario={item.usuario}
              texto={item.texto}
              timestamp={item.timestamp}
              esPropio={item.usuario === usuario}
            />
          )}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.vacio}>Aún no hay mensajes. ¡Escribe el primero!</Text>
          }
          // Auto-scroll al último mensaje cuando llega uno nuevo
          onContentSizeChange={() => listaRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <View style={[styles.barra, { paddingBottom: 8 + insets.bottom }]}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje"
          value={texto}
          onChangeText={setTexto}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.boton, !puedeEnviar && styles.botonDeshabilitado]}
          onPress={enviar}
          disabled={!puedeEnviar}
        >
          <Text style={styles.botonTexto}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE5DD',
  },
  centro: {
    flex: 1,
  },
  lista: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  vacio: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
  },
  barra: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingTop: 8,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
  },
  boton: {
    backgroundColor: '#075E54',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  botonDeshabilitado: {
    backgroundColor: '#9E9E9E',
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
