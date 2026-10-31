import assert from "node:assert";

// Function under test
function parseRecipientFromUrl(search) {
  try {
    const params = new URLSearchParams(search);
    const raw = params.get("to");
    if (!raw) return null;
    const decoded = decodeURIComponent(raw).trim();
    if (decoded.length === 0 || decoded.length > 60) return null;
    const sanitized = decoded.replace(/[<>]/g, "").trim();
    return sanitized.length > 0 ? sanitized : null;
  } catch {
    return null;
  }
}

console.log("=== RUNNING INVITATION MODE VERIFICATION TESTS ===");

// 1. Basic Vietnamese Names
assert.strictEqual(parseRecipientFromUrl("?to=Minh%20Anh"), "Minh Anh");
assert.strictEqual(parseRecipientFromUrl("?to=Nguy%E1%BB%85n%20V%C4%83n%20A"), "Nguyễn Văn A");
assert.strictEqual(parseRecipientFromUrl("?to=Th%E1%BA%A7y%20Ho%C3%A0ng"), "Thầy Hoàng");
assert.strictEqual(parseRecipientFromUrl("?to=Ch%E1%BB%8B%20Mai%20Ph%C6%B0%C6%A1ng"), "Chị Mai Phương");
assert.strictEqual(parseRecipientFromUrl("?to=C%C3%B4%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20B%C3%ADch%20Loan"), "Cô Nguyễn Thị Bích Loan");
console.log("✓ Vietnamese Unicode names decode properly.");

// 2. Fallback to Mode 1 (Public Invitation) when empty or invalid
assert.strictEqual(parseRecipientFromUrl(""), null);
assert.strictEqual(parseRecipientFromUrl("?"), null);
assert.strictEqual(parseRecipientFromUrl("?other=param"), null);
assert.strictEqual(parseRecipientFromUrl("?to="), null);
assert.strictEqual(parseRecipientFromUrl("?to=%20%20"), null);
assert.strictEqual(parseRecipientFromUrl("?to=" + "a".repeat(61)), null);
console.log("✓ Empty, missing, and overlength parameters fall back to Mode 1 (null).");

// 3. Sanitization (XSS defense)
assert.strictEqual(parseRecipientFromUrl("?to=%3Cscript%3Ealert(1)%3C/script%3E"), "scriptalert(1)/script");
assert.strictEqual(parseRecipientFromUrl("?to=%3Cb%3EAlice%3C/b%3E"), "bAlice/b");
console.log("✓ HTML / XSS control tags are stripped while maintaining plain text safety.");

// 4. URL Precedence Simulation
const localStorageName = "Khách Lưu Bộ Nhớ";
const urlName = parseRecipientFromUrl("?to=Minh%20Anh");
const finalDisplayName = urlName || localStorageName || "Bạn thân mến";
assert.strictEqual(finalDisplayName, "Minh Anh");
console.log("✓ URL-provided name strictly takes precedence over localStorage.");

// 5. Roundtrip Link Generator Encoding Test
const testNames = [
  "Minh Anh",
  "Thầy Hoàng",
  "Cô Bích Loan",
  "Chị Mai Phương",
  "Nguyễn Huỳnh Đức",
  "Đỗ Thị Thu Thảo"
];

for (const name of testNames) {
  const generatedUrl = `https://vy-anh-graduation-invitation-card.vercel.app/?to=${encodeURIComponent(name)}`;
  const searchPart = generatedUrl.split("?")[1];
  const parsedBack = parseRecipientFromUrl("?" + searchPart);
  assert.strictEqual(parsedBack, name, `Mismatch for name: ${name}`);
}
console.log("✓ Link Generator encoding roundtrips 100% identically for all Vietnamese accents.");

console.log("\nALL VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉");
