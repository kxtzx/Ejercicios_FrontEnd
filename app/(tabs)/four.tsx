import { Image, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function TabThreeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicios para Frontend</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text style={styles.subtitle}>Ejercicio 4</Text>
      <View style={{ marginBottom: 20, marginLeft: 15, marginRight: 15 }}>
        <Text>Integrar el explorar ideas de Pinterest para buscar imagenes</Text>
        <Text>Debe contener:</Text>
        <Text>• Barra de búsqueda (placeholder claro) para filtrar por keyword (ej: travel, food, design).</Text>
        <Text>• Infinite scroll</Text>
        <Text>• Vista previa (modal) al tocar una imagen (mostrar imagen grande y autor).</Text>
        <Text>• Integrar Unsplash para mostrar las imagenes.</Text>
      </View>
      <Image
        source={{uri: "https://infosertecla.com/wp-content/uploads/2020/02/200226-8.jpg",}}
        style={{ width: "80vw", height: 200 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
