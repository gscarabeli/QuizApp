import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import styles from "./Styles";
import * as themesDao from "../../services/themesDAO";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Themes({ navigation, route }) {
  const [themeName, setThemeName] = useState("");
  const [id, setId] = useState(0);
  const [themes, setThemes] = useState([]);

  async function setup() {
    try {
      await themesDao.createTable();
      await loadData();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setup();
  }, []);

  async function cleanFields() {
    setThemeName("");
    setId(undefined);
    Keyboard.dismiss();
  }

  function createUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  async function loadData() {
    try {
      const fetchedThemes = await themesDao.getThemes();
      fetchedThemes.sort((a, b) => (a.name > b.name ? 1 : -1));
      setThemes(fetchedThemes);
    } catch (e) {
      Alert.alert(e.toString());
    }
  }

  async function saveTheme() {
    const isNew = id == undefined || id == 0;

    let obj = {
      id: isNew ? createUniqueId() : id,
      name: themeName.trim(),
    };

    if (!obj.name) {
      Alert.alert("Erro", "Preencha o nome do tema.");
      return;
    }

    try {
      let response = false;
      if (isNew) {
        response = await themesDao.insertTheme(obj);
      } else {
        response = await themesDao.updateTheme(obj);
      }

      if (response) {
        Alert.alert("Sucesso", "Tema salvo com sucesso!");
      } else {
        Alert.alert("Erro", "Falha ao salvar tema.");
      }

      cleanFields();
      await loadData();
    } catch (e) {
      Alert.alert("Erro", e.message);
    }
  }

  function deleteTheme(id) {
    Alert.alert("Atenção!", "Deseja deletar este tema?", [
      {
        text: "Sim",
        onPress: () => deleteThemeAux(id),
      },
      {
        text: "Não",
        style: "cancel",
      },
    ]);
  }

  async function deleteThemeAux(id) {
    try {
      await themesDao.deleteTheme(id);
      cleanFields();
      await loadData();
      Alert.alert("Tema deletado com sucesso.");
    } catch (e) {
      Alert.alert("Erro ao deletar tema", e.message);
    }
  }

  function editTheme(id) {
    const selectedTheme = themes.find((theme) => theme.id == id);
    if (selectedTheme != undefined) {
      setId(selectedTheme.id);
      setThemeName(selectedTheme.name);
    }
  }

  return (
    <View style={styles.containerSecondPage}>
      <View style={styles.viewBottom}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.tituloSecondPage}>Temas</Text>
        </View>
      </View>

      <Text
        style={[styles.subTituloSecondPage, styles.inputViewBottomVertical]}
      >
        Digite o nome do tema:
      </Text>
      <TextInput
        style={[styles.labelSecond, styles.buttonInsertDataCal]}
        value={themeName}
        onChangeText={(text) => setThemeName(text)}
        keyboardType="default"
      />

      <View style={styles.centerButtons}>
        <TouchableOpacity
          style={styles.buttonInsertDataInicial}
          onPress={saveTheme}
        >
          <Text style={styles.labelSecondButton}>Salvar Tema</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonInsertDataInicial}
          onPress={cleanFields}
        >
          <Text style={styles.labelSecondButton}>Limpar Campos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {themes.map((theme) => (
          <View key={theme.id} style={styles.themeItem}>
            <Text style={styles.themeText}>{theme.name}</Text>
            <TouchableOpacity onPress={() => editTheme(theme.id)}>
              <Text style={styles.themeButton}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTheme(theme.id)}>
              <Text style={styles.themeButton}>Excluir</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}
