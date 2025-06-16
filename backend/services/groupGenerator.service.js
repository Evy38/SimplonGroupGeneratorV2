// 🔌 Connexion à la BDD
const db = require("../database");

// 🎲 Fonction utilitaire : mélange aléatoire d’un tableau
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// 📦 Répartir équitablement les personnes dans les groupes
function balanceIntoGroups(persons, groupCount) {
  const groups = Array.from({ length: groupCount }, () => []);
  shuffle(persons);
  persons.forEach((p, i) => groups[i % groupCount].push(p.id));
  return groups;
}

// 🧬 Crée une empreinte unique pour un tirage donné
function createGroupSignature(groups) {
  return groups
    .map(group => group.sort((a, b) => a - b).join("-"))
    .sort()
    .join("|");
}

// 🚀 Fonction principale pour générer des groupes
const generateGroups = async (list_id, groupCount) => {
  // 📥 Récupérer les personnes d'une liste
  const getPeople = () =>
    new Promise((resolve, reject) => {
      db.query("SELECT * FROM people WHERE list_id = ?", [list_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

  // 📂 Récupérer les anciens groupes et calculer leur empreinte
  const getPreviousGroupSignatures = () =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT group_id, person_id FROM group_people gp JOIN groups g ON gp.group_id = g.id WHERE g.list_id = ?",
        [list_id],
        (err, results) => {
          if (err) return reject(err);

          const history = {};
          for (let row of results) {
            if (!history[row.group_id]) history[row.group_id] = [];
            history[row.group_id].push(row.person_id);
          }

          const previousGroups = Object.values(history); // tableau de groupes
          const signature = createGroupSignature(previousGroups); // empreinte unique globale
          resolve([signature]);
        }
      );
    });

  const persons = await getPeople();
  const previous = await getPreviousGroupSignatures();

  let attempts = 0;
  const maxTries = 10;
  let newGroups, newSignature;

  // 🔁 Tenter plusieurs tirages jusqu’à trouver un nouveau
  while (attempts < maxTries) {
    newGroups = balanceIntoGroups(persons, groupCount);
    newSignature = createGroupSignature(newGroups);

    console.log("✨ New signature:", newSignature);
    console.log("🔁 Previous signatures:", previous);

    if (!previous.includes(newSignature)) break;
    attempts++;
  }

  // ❌ Si aucun nouveau tirage trouvé
  if (attempts >= maxTries) {
    throw new Error("Impossible de générer un tirage inédit après plusieurs essais. Supprimez d’anciens groupes ou modifiez les critères.");
  }

  return newGroups;
};

module.exports = { generateGroups };
