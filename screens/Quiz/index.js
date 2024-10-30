import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import styles from "./Styles";
import * as questionsDao from "../../services/questionsDAO";
import * as themesDao from "../../services/themesDAO";
import Icon from "react-native-vector-icons/FontAwesome";
import EndGame from "../EndGame";

export default function Quiz({ navigation }) {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questionsCountByTheme, setQuestionsCountByTheme] = useState({});
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  async function setup() {
    try {
      await loadThemes();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setup();
  }, []);

  async function loadThemes() {
    try {
      const dbThemes = await themesDao.getThemes();
      setThemes(dbThemes);
    } catch (e) {
      Alert.alert(e.toString());
    }
  }

  const onThemeSelect = async (themeId) => {
    setSelectedTheme(themeId);

    if (!questionsCountByTheme[themeId]) {
      const count = await questionsDao.getQuestionCountByTheme(themeId);

      setQuestionsCountByTheme((prevState) => ({
        ...prevState,
        [themeId]: count,
      }));
    }
  };

  async function startQuiz() {
    if (!selectedTheme || questionCount <= 0) {
      Alert.alert(
        "Erro",
        "Por favor, selecione um tema e defina a quantidade de perguntas."
      );
      return;
    }

    if (questionCount > questionsCountByTheme[selectedTheme]) {
      Alert.alert(
        "Erro",
        `O tema selecionado possui apenas ${questionsCountByTheme[selectedTheme]} perguntas.`
      );
      return;
    }

    const dbQuestions = await questionsDao.getQuestionsByTheme(selectedTheme);
    setQuestions(dbQuestions.slice(0, questionCount));
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
  }

  function onAnswer(selectedAnswer) {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      setUserAnswers((prevAnswers) => [
        ...prevAnswers,
        { question: questions[currentQuestionIndex], selectedAnswer },
      ]);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        showSummary();
      }
    }
  }

  function showSummary() {
    setIsQuizFinished(true);
  }

  const onRestart = () => {
    setQuestions([]);
    setSelectedTheme("");
    setQuestionCount("");
    setCurrentQuestionIndex(0);
    setIsQuizFinished(false);
    setUserAnswers([]);
  };

  return (
    <View style={styles.containerGamePage}>
      <View style={styles.viewBottom}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.tituloGamePage}>Quiz</Text>
        </View>
      </View>

      {!isQuizFinished && !questions.length > 0 && (
        <>
          <Text style={styles.subTituloGamePage}>Selecione um Tema:</Text>
          <ScrollView>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                onPress={() => onThemeSelect(theme.id)}
              >
                <Text style={styles.themeText}>
                  {theme.name} - {questionsCountByTheme[theme.id]} pergunta(s)
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.textGamePage}>
            Com quantas perguntas você deseja jogar?
          </Text>
          <TextInput
            style={styles.labelGame}
            value={String(questionCount)}
            onChangeText={(text) => setQuestionCount(Number(text))}
            keyboardType="numeric"
          />

          <TouchableOpacity
            onPress={startQuiz}
            style={styles.buttonInsertDataInicial}
          >
            <Text style={styles.labelGameButton}>Iniciar Quiz</Text>
          </TouchableOpacity>
        </>
      )}

      {isQuizFinished ? (
        <EndGame
          correctCount={
            userAnswers.filter(
              (answer) =>
                answer.selectedAnswer === answer.question.correct_answer
            ).length
          }
          totalQuestions={questions.length}
          onRestart={onRestart}
          navigation={navigation}
        />
      ) : (
        questions.length > 0 &&
        currentQuestionIndex < questions.length && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={styles.questionText}>
              {questions[currentQuestionIndex].question_text}
            </Text>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <TouchableOpacity key={index} onPress={() => onAnswer(option)}>
                <Text style={styles.answerText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )
      )}

      <StatusBar style="auto" />
    </View>
  );
}
