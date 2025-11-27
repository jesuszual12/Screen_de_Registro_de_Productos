import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera'; 

export default function Registrar() {
  const [InputUno, setInputUno] = useState('');
  const [InputDos, setInputDos] = useState('');
  const [InputTres, setInputTres] = useState('');

  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  
  const [fechaCompra, setFechaCompra] = useState<string | null>(null);
  const [fechaCaducidad, setFechaCaducidad] = useState<string | null>(null);
  const [showCalendarCompra, setShowCalendarCompra] = useState(false);
  const [showCalendarCaducidad, setShowCalendarCaducidad] = useState(false);

  // barcode
  const [codigoBarras, setCodigoBarras] = useState('');
  const [cantidadStock, setCantidadStock] = useState('');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<{ type: string; data: string } | null>(null);
  const [scannedOnce, setScannedOnce] = useState(false);
  const [flash, setFlash] = useState(false);
  const cameraRef = useRef<CameraView | null>(null); 

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  const openScanner = () => {
    setScannedData(null);
    setScannedOnce(false);
    setScannerVisible(true);
  };

  const onBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scannedOnce) return;
    setScannedOnce(true);
    setScannedData({ type, data });
  };

  const acceptScanned = () => {
    if (scannedData) setCodigoBarras(scannedData.data);
    setScannerVisible(false);
  };

  const handleGuardarProducto = () => {
    console.log('Guardando producto:', {
      nombre: InputUno,
      marca: InputDos,
      proveedor: InputTres,
      precioCompra,
      precioVenta,
      fechaCompra,
      fechaCaducidad,
      codigoBarras,
      cantidad: cantidadStock,
    });
  };

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.box}>
        <Text style={styles.subtitulos}>Nombre Producto:</Text>
        <TextInput
          style={styles.inputs}
          value={InputUno}
          onChangeText={setInputUno}
          placeholder="Nombre Producto"
        />

        <Text style={styles.subtitulos}>Marca</Text>
        <TextInput
          style={styles.inputs}
          value={InputDos}
          onChangeText={setInputDos}
          placeholder="Marca"
        />

        <Text style={styles.subtitulos}>Provedor</Text>
        <TextInput
          style={styles.inputs}
          value={InputTres}
          onChangeText={setInputTres}
          placeholder="provedor (Nombre)"
        />

        <Text style={[styles.subtitulos, { marginTop: 12 }]}>Cantidad en stock (Almacén)</Text>
        <TextInput
          style={styles.inputs}
          value={cantidadStock}
          onChangeText={setCantidadStock}
          placeholder="0"
          keyboardType="numeric"
        />

       
        <Text style={[styles.subtitulos, { marginTop: 12 }]}>Precios</Text>
        <View style={styles.row}>
          <View style={styles.priceInputContainer}>
            <Text style={styles.label}>Precio Compra</Text>
            <TextInput
              style={[styles.inputs, styles.priceInput]}
              value={precioCompra}
              onChangeText={setPrecioCompra}
              placeholder="$50"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.priceInputContainer}>
            <Text style={styles.label}>Precio Venta</Text>
            <TextInput
              style={[styles.inputs, styles.priceInput]}
              value={precioVenta}
              onChangeText={setPrecioVenta}
              placeholder="$70"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={[styles.subtitulos, { marginTop: 12 }]}>Fechas</Text>
        <View style={styles.row}>

          <View style={styles.dateContainer}>
            <Text style={styles.label}>Fecha Compra</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowCalendarCompra(true)}
            >
              <Text style={styles.dateButtonText}>
                {fechaCompra ? fechaCompra : "dd/mm/aaaa"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.label}>Fecha Caducidad</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowCalendarCaducidad(true)}
            >
              <Text style={styles.dateButtonText}>
                {fechaCaducidad ? fechaCaducidad : "dd/mm/aaaa"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.subtitulos, { marginTop: 12 }]}>Código de Barras</Text>
        <View style={styles.barcodeContainer}>
          <View style={styles.barcodeInputWrapper}>
            <TextInput
              style={styles.inputs}
              value={codigoBarras}
              onChangeText={setCodigoBarras}
              placeholder="0"
            />
          </View>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={openScanner}
            accessibilityLabel="Abrir escáner"
          >
            <MaterialCommunityIcons name="barcode-scan" color="#fff" size={32} />
            <Text style={styles.scanButtonText}>Escanear</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.guardarButton}
          onPress={handleGuardarProducto}
        >
          <Text style={styles.guardarButtonText}>Guardar Producto</Text>
        </TouchableOpacity>
      </View>

    
      <Modal visible={scannerVisible} animationType="slide" transparent={false} onRequestClose={() => setScannerVisible(false)}>
        <View style={styles.scannerContainer}>
          {hasCameraPermission === false ? (
            <View style={styles.label}><Text>Sin permiso de cámara</Text></View>
          ) : (
            <CameraView 
              ref={cameraRef}
              style={styles.scannerCamera}
              onBarcodeScanned={onBarCodeScanned}
              flash={flash ? "on" : "off"} 
              facing="back"
            />
          )}

          <View style={styles.scannerFooter}>
            <TouchableOpacity style={styles.scannerBtn} onPress={() => setFlash((s) => !s)}>
              <MaterialCommunityIcons name={flash ? 'flash' : 'flash-off'} size={22} color="#fff" />
              <Text style={styles.scannerBtnText}>{flash ? 'Flash ON' : 'Flash OFF'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.scannerBtn} onPress={() => setScannerVisible(false)}>
              <MaterialCommunityIcons name="close" size={22} color="#fff" />
              <Text style={styles.scannerBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          {scannedData && (
            <View style={styles.scannedCard}>
              <Text style={styles.scannedTitle}>Scanned Barcode:</Text>
              <Text style={styles.scannedText}>Data: {scannedData.data}</Text>
              <Text style={styles.scannedText}>Format: {scannedData.type}</Text>
              <View style={styles.scannedActions}>
                <TouchableOpacity style={styles.scannedActionBtn} onPress={() => { setScannedOnce(false); setScannedData(null); }}>
                  <Text style={styles.scannedActionText}>Scan Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.scannedActionBtn, styles.scannedAccept]} onPress={acceptScanned}>
                  <Text style={[styles.scannedActionText, { color: '#fff' }]}>Usar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>

      <Modal
        visible={showCalendarCompra}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendarCompra(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona Fecha Compra</Text>
              <TouchableOpacity onPress={() => setShowCalendarCompra(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={(day) => {
                setFechaCompra(day.dateString);
                setShowCalendarCompra(false);
              }}
              markedDates={
                fechaCompra
                  ? {
                      [fechaCompra]: {
                        selected: true,
                        selectedColor: "#0B3D91",
                      },
                    }
                  : {}
              }
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCalendarCaducidad}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendarCaducidad(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona Fecha Caducidad</Text>
              <TouchableOpacity onPress={() => setShowCalendarCaducidad(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={(day) => {
                setFechaCaducidad(day.dateString);
                setShowCalendarCaducidad(false);
              }}
              markedDates={
                fechaCaducidad
                  ? {
                      [fechaCaducidad]: {
                        selected: true,
                        selectedColor: "#0B3D91",
                      },
                    }
                  : {}
              }
            />
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  

  box: {
    width: "100%",
    padding: 16,
    backgroundColor: "transparent",
    alignItems: "flex-start"
  },

  subtitulos: { 
    fontSize: 16, 
    fontWeight: '600',
    marginBottom: 12, 
    color: "#ff0000ff", 
    alignSelf: "flex-start" 
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
    color: "#666",
    marginBottom: 6,
  },

  inputs: {
    width: "100%",
    borderWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    textAlignVertical: "center",
    fontSize: 16,
    color: "#111827",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 10
  },

  row: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 12,
  },

  priceInputContainer: {
    flex: 1,
  },

  priceInput: {
    flex: 1,
    marginBottom: 0,
  },

  dateContainer: {
    flex: 1,
  },

  dateButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  dateButtonText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: '500',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B3D91',
  },

  closeButton: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },

  barcodeContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    alignItems: "flex-end",
  },

  barcodeInputWrapper: {
    flex: 1,
  },

  barcodeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: "#666",
    marginBottom: 6,
  },

  scanButton: {
    width: 90,
    height: 90,
    backgroundColor: "#ff0000ff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    gap: 4,
  },

  scanButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: '600',
  },

  guardarButton: {
    width: "100%",
    backgroundColor: "#ff0000ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  guardarButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '600',
  },

  // Scanner styles
  scannerContainer: { flex: 1, backgroundColor: '#000' },
  scannerCamera: { flex: 1 },
  scannerFooter: { position: 'absolute', bottom: 24, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  scannerBtn: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8, alignItems: 'center' },
  scannerBtnText: { color: '#fff', marginTop: 4, fontSize: 12 },
  scannedCard: { position: 'absolute', top: 60, left: 24, right: 24, backgroundColor: '#fff', padding: 12, borderRadius: 10, elevation: 8 },
  scannedTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8 },
  scannedText: { fontSize: 14, marginBottom: 4 },
  scannedActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  scannedActionBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#e5e7eb', marginLeft: 8 },
  scannedAccept: { backgroundColor: '#0B3D91' },
  scannedActionText: { fontWeight: '600' },
});
