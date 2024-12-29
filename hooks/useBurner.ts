import { useJsonFileSystem } from './useJsonFileSystem';

const words = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
  "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
  "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit",
  "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
  "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert",
  "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter",
  "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger",
  "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique",
  "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic",
  "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest",
  "arrive", "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset",
  "assist", "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction",
  "audit", "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake",
  "aware", "away", "awesome", "awful", "awkward", "axis"
];

function generateMnemonic(): string {
  return Array(12).fill(0).map(() => words[Math.floor(Math.random() * words.length)]).join(' ');
}

function generatePrivateKey(): string {
  return Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generatePublicKey(): string {
  return Array(32).fill(0).map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
}

export function useBurner() {
  const { createDirectory, createFile, updateFileContent, directoryExists } = useJsonFileSystem();

  return () => {
    const mnemonic = generateMnemonic();
    const privateKey = generatePrivateKey();
    const publicKey = generatePublicKey();

    const walletInfo = `Mnemonic: ${mnemonic}\nPrivate Key: ${privateKey}\nPublic Key: ${publicKey}`;

    return {
      mnemonic,
      privateKey,
      publicKey,
      walletInfo
    };
  };
}

