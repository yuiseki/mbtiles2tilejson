import * as sqlite3 from "sqlite3";
import * as path from "path";

const runQuery = async (
  db: sqlite3.Database,
  sql: string
): Promise<Array<{ name: string; value: string }>> => {
  return new Promise((resolve, reject) => {
    const rows: Array<{ name: string; value: string }> = [];
    db.serialize(() => {
      db.each(
        sql,
        (error, row) => {
          if (error) {
            reject(error);
          } else {
            rows.push(row);
          }
        },
        (error, count) => {
          resolve(rows);
        }
      );
    });
  });
};

export const mbtiles2tilejson = async (
  mbtilesFilePath: string,
  baseUrl: string
) => {
  let tilejson: { [key: string]: string | number | number[] } = {};
  const names = path.parse(mbtilesFilePath);
  tilejson["id"] = names.name;
  tilejson["basename"] = names.base;
  tilejson["tilejson"] = "2.0.0";
  let db = new sqlite3.Database(mbtilesFilePath);
  const rows = await runQuery(db, "SELECT * FROM metadata");
  db.close();
  for await (const row of rows) {
    switch (row.name) {
      case "bounds":
      case "center":
        tilejson[row.name] = row.value.split(",").map((i) => parseFloat(i));
        break;
      case "maxzoom":
      case "minzoom":
        tilejson[row.name] = parseInt(row.value);
        break;
      case "json":
        tilejson = { ...tilejson, ...JSON.parse(row.value) };
        break;
      default:
        tilejson[row.name] = row.value;
        break;
    }
  }
  tilejson["tiles"] = baseUrl + "{z}/{x}/{y}." + tilejson["format"];
  return JSON.stringify(tilejson, null, 2);
};
