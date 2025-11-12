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
      <Text style={styles.subtitle}>Ejercicio 3</Text>
      <View style={{ marginBottom: 20, marginLeft: 15, marginRight: 15 }}>
        <Text>Crear una tarjeta de producto con foto, título, precio, rating y botón Agregar</Text>
        <Text>Debe contener:</Text>
        <Text>• Mostrar badge de oferta (opcional).</Text>
        <Text>• Precio con formato y descuento.</Text>
        <Text>• Estado de stock (en stock / sin stock).</Text>
        <Text>• Integrar datos desde un archivo .json.</Text>
      </View>
      <Image
        source={{uri: "https://imgproxy.epicpxls.com/V5HKeqN9GKeQCxBbVqevwDQukHmUJcCI1AwlXMlVkPA/rs:fill:800:600:0/g:no/aHR0cHM6Ly9pdGVt/cy5lcGljcHhscy5j/b20vdXBsb2Fkcy9w/aG90by9hY2VlYzM0/NzE4MGU4MmRiZTY0/ZGI5YmQzYmI5ZGQ4/ZA.jpg",}}
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
