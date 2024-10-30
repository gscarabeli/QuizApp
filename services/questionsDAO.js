import * as SQLite from "expo-sqlite/next";

export async function getDbConnection() {
  const cx = await SQLite.openDatabaseAsync("dbQuiz.db");
  return cx;
}

export async function createTable() {
  const query = `CREATE TABLE IF NOT EXISTS questions
        (
            id text not null primary key,
            theme_id text,
            question_text text,
            correct_answer text not null,
            wrong_answer_1 text not null,
            wrong_answer_2 text not null,
            wrong_answer_3 text not null,
            FOREIGN KEY(theme_id) REFERENCES themes(id)
        )`;
  const cx = await getDbConnection();
  await cx.execAsync(query);
  await cx.closeAsync();
}

export async function getQuestions() {
  const retorno = [];
  const dbCx = await getDbConnection();
  const registros = await dbCx.getAllAsync("SELECT * FROM questions");
  await dbCx.closeAsync();

  for (const registro of registros) {
    retorno.push({
      id: registro.id,
      theme_id: registro.theme_id,
      question_text: registro.question_text,
      correct_answer: registro.correct_answer,
      wrong_answer_1: registro.wrong_answer_1,
      wrong_answer_2: registro.wrong_answer_2,
      wrong_answer_3: registro.wrong_answer_3,
    });
  }

  return retorno;
}

export async function getQuestionsByTheme(themeId) {
  const retorno = [];
  const dbCx = await getDbConnection();
  const registros = await dbCx.getAllAsync(
    "SELECT * FROM questions WHERE theme_id=?",
    [themeId]
  );
  await dbCx.closeAsync();

  for (const registro of registros) {
    retorno.push({
      id: registro.id,
      theme_id: registro.theme_id,
      question_text: registro.question_text,
      correct_answer: registro.correct_answer,
      options: [
        registro.correct_answer,
        registro.wrong_answer_1,
        registro.wrong_answer_2,
        registro.wrong_answer_3,
      ].sort(() => Math.random() - 0.5),
    });
  }

  return retorno;
}

export async function getQuestionCount() {
  if (selectedTheme) {
    const count = await questionsDao.getQuestionCountByTheme(selectedTheme);
    return count;
  }
  return 0;
}

export async function getQuestionCountByTheme(themeId) {
  const dbCx = await getDbConnection();
  const registros = await dbCx.getAllAsync(
    "SELECT COUNT(*) as count FROM questions WHERE theme_id=?",
    [themeId]
  );
  await dbCx.closeAsync();

  return registros[0].count;
}

export async function insertQuestion(question) {
  const dbCx = await getDbConnection();
  const query =
    "INSERT INTO questions (id, theme_id, question_text, correct_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const result = await dbCx.runAsync(query, [
    question.id,
    question.theme_id,
    question.question_text,
    question.correct_answer,
    question.wrong_answer_1,
    question.wrong_answer_2,
    question.wrong_answer_3,
  ]);
  await dbCx.closeAsync();
  return result.changes === 1;
}

export async function updateQuestion(question) {
  const dbCx = await getDbConnection();
  const query =
    "UPDATE questions SET theme_id=?, question_text=?, correct_answer=?, wrong_answer_1=?, wrong_answer_2=?, wrong_answer_3=? WHERE id=?";
  const result = await dbCx.runAsync(query, [
    question.theme_id,
    question.question_text,
    question.correct_answer,
    question.wrong_answer_1,
    question.wrong_answer_2,
    question.wrong_answer_3,
    question.id,
  ]);
  await dbCx.closeAsync();
  return result.changes === 1;
}

export async function deleteQuestion(id) {
  const dbCx = await getDbConnection();
  const query = "DELETE FROM questions WHERE id=?";
  const result = await dbCx.runAsync(query, [id]);
  await dbCx.closeAsync();
  return result.changes === 1;
}

export async function deleteAllQuestions() {
  const dbCx = await getDbConnection();
  const query = "DELETE FROM questions";
  await dbCx.execAsync(query);
  await dbCx.closeAsync();
}
