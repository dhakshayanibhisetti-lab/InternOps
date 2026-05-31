
async function updatePassword(userId, newHash) {
  await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, userId]);
}

async function updateProfile(userId, fields) {
  const set = [];
  const vals = [];
  let idx = 1;
  for (const [key, val] of Object.entries(fields)) {
    if (['full_name'].includes(key)) {
      set.push(`${key} = $${idx}`);
      vals.push(val);
      idx++;
    }
  }
  if (set.length === 0) return;
  vals.push(userId);
  await pool.query(`UPDATE users SET ${set.join(', ')}, updated_at = NOW() WHERE id = $${idx}`, vals);
}
module.exports = { createUser, findByEmail, findById, verifyPassword, storeRefreshToken, revokeRefreshToken, revokeAllUserTokens, updatePassword, updateProfile };
