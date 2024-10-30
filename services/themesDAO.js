import * as SQLite from "expo-sqlite/next";

export async function getDbConnection() {
  const cx = await SQLite.openDatabaseAsync("dbQuiz.db");
  return cx;
}

export async function createTable() {
  const query = `CREATE TABLE IF NOT EXISTS themes
        (
            id text not null primary key,
            name text not null
        )`;
  const cx = await getDbConnection();
  await cx.execAsync(query);
  await cx.closeAsync();
}

export async function getThemes() {
  const retorno = [];
  const dbCx = await getDbConnection();
  const registros = await dbCx.getAllAsync("SELECT * FROM themes");
  await dbCx.closeAsync();

  for (const registro of registros) {
    retorno.push({
      id: registro.id,
      name: registro.name,
    });
  }

  return retorno;
}

export async function insertTheme(theme) {
  const dbCx = await getDbConnection();
  const query = "INSERT INTO themes (id, name) VALUES (?, ?)";
  const result = await dbCx.runAsync(query, [theme.id, theme.name]);
  await dbCx.closeAsync();
  return result.changes === 1;
}

export async function updateTheme(theme) {
  const dbCx = await getDbConnection();
  const query = "UPDATE themes SET name=? WHERE id=?";
  const result = await dbCx.runAsync(query, [theme.name, theme.id]);
  await dbCx.closeAsync();
  return result.changes === 1;
}

export async function deleteTheme(id) {
  const dbCx = await getDbConnection();
  const query = "DELETE FROM themes WHERE id=?";
  const result = await dbCx.runAsync(query, [id]);
  await dbCx.closeAsync();
  return result.changes === 1;
}

export async function deleteAllThemes() {
  const dbCx = await getDbConnection();
  const query = "DELETE FROM themes";
  await dbCx.execAsync(query);
  await dbCx.closeAsync();
}
