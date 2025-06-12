const db = require("../database");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function generateGroups(list_id, groupCount) {
  return new Promise((resolve, reject) => {
    const query = "SELECT id FROM people WHERE list_id = ?";
    db.query(query, [list_id], async (err, results) => {
      if (err) return reject(err);

      const shuffled = shuffleArray(results.map(row => row.id));
      const groups = Array.from({ length: groupCount }, () => []);

      // Répartition équitable
      shuffled.forEach((personId, index) => {
        const groupIndex = index % groupCount;
        groups[groupIndex].push(personId);
      });

      resolve(groups); // => [[2, 5], [1, 4], [3]] par exemple
    });
  });
}

module.exports = { generateGroups };
