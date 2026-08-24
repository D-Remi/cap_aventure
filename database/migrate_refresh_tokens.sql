-- Sécurité auth : sessions révocables (refresh tokens)
-- Stocke le HASH du refresh token, jamais le token en clair.
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  tokenHash VARCHAR(255) NOT NULL,
  userAgent VARCHAR(255),
  ip VARCHAR(64),
  expiresAt DATETIME NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tokenHash (tokenHash),
  INDEX idx_userId (userId),
  CONSTRAINT fk_refresh_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
