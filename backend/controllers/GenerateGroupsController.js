const db = require("../database");
const { generateGroups } = require("../services/groupGenerator.service");

const GenerateGroupsController = {
generate: async (req, res) => {
  const { list_id, groupCount } = req.body;

  if (!list_id || !groupCount) {
    return res.status(400).json({ error: "list_id et groupCount requis" });
  }

  try {
    const groupSets = await generateGroups(list_id, groupCount);
    const groupIds = [];

    // 1. Créer les groupes
    for (let i = 0; i < groupSets.length; i++) {
      const groupName = `Groupe ${i + 1}`;
      const insertGroup = await new Promise((resolve, reject) => {
        db.query("INSERT INTO groups (nom, list_id, date_creation) VALUES (?, ?, NOW())",
          [groupName, list_id],
          (err, result) => {
            if (err) return reject(err);
            resolve(result.insertId);
          });
      });
      groupIds.push(insertGroup);
    }

    // 2. Associer les personnes
    for (let i = 0; i < groupSets.length; i++) {
      const groupId = groupIds[i];
      for (let personId of groupSets[i]) {
        await new Promise((resolve, reject) => {
          db.query("INSERT INTO group_people (group_id, person_id) VALUES (?, ?)",
            [groupId, personId],
            (err) => (err ? reject(err) : resolve())
          );
        });
      }
    }

    res.status(201).json({ message: "Groupes générés avec succès" });

 } catch (err) {
  console.error(err);
  res.status(400).json({ error: err.message });
}

}

};

module.exports = GenerateGroupsController;
