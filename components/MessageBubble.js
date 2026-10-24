import { View, Text, StyleSheet } from 'react-native';

const formatearHora = (timestamp) => {
  if (typeof timestamp !== 'number') return '';
  const fecha = new Date(timestamp);
  const hh = String(fecha.getHours()).padStart(2, '0');
  const mm = String(fecha.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

// Burbuja de un mensaje: propios a la derecha (verde), ajenos a la izquierda (blanco).
export default function MessageBubble({ usuario, texto, timestamp, esPropio }) {
  return (
    <View style={[styles.fila, esPropio ? styles.filaPropia : styles.filaAjena]}>
      <View style={[styles.burbuja, esPropio ? styles.propia : styles.ajena]}>
        <Text style={[styles.nombre, esPropio && styles.nombrePropio]}>
          {esPropio ? 'Tú' : usuario}
        </Text>
        <Text style={styles.texto}>{texto}</Text>
        <Text style={styles.hora}>{formatearHora(timestamp)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 10,
  },
  filaPropia: {
    justifyContent: 'flex-end',
  },
  filaAjena: {
    justifyContent: 'flex-start',
  },
  burbuja: {
    maxWidth: '80%',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 1,
  },
  propia: {
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 2,
  },
  ajena: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 2,
  },
  nombre: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 2,
  },
  nombrePropio: {
    color: '#075E54',
  },
  texto: {
    fontSize: 16,
    color: '#111',
  },
  hora: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
});
