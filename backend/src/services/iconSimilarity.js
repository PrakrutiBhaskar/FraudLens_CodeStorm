import imageHash from "image-hash";

// Turn callback function into Promise
function getHash(path) {
  return new Promise((resolve) => {
    imageHash.hash(path, 16, "hex", (err, data) => {
      if (err || !data) return resolve(null);
      resolve(data);
    });
  });
}

export const compareIcons = async (officialPath, candidatePath) => {
  // If either icon missing, return similarity = 0
  if (!candidatePath || !officialPath) {
    return { phash: null, similarity: 0 };
  }

    const h1 = await getHash(officialPath);
    const h2 = await getHash(candidatePath);
    
    console.log("🔍 Official icon path:", officialPath);
    console.log("🔍 Candidate icon path:", candidatePath);
    console.log("🔍 Hash 1 (official):", h1);
    console.log("🔍 Hash 2 (candidate):", h2);


  // If either hash fails → avoid crash
  if (!h1 || !h2) {
    return { phash: null, similarity: 0 };
  }

  const dist = hammingHex(h1, h2);
  const sim = Math.max(0, 1 - dist / (h1.length * 4));

  return { phash: dist, similarity: sim };
};

function hammingHex(a, b) {
  if (!a || !b || a.length !== b.length) return 128;

  let dist = 0;
  for (let i = 0; i < a.length; i++) {
    dist += bitCount(parseInt(a[i], 16) ^ parseInt(b[i], 16));
  }
  return dist;
}

function bitCount(n) {
  return n.toString(2).split("1").length - 1;
}
