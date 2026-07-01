DROP DATABASE IF EXISTS moneyhub;
CREATE DATABASE moneyhub;
USE moneyhub;

-- --------------------------------------------
--  LOOKUP 
-- --------------------------------------------
CREATE TABLE currency (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    currency_code ENUM('EUR', 'USD', 'BRL', 'GBP') NOT NULL DEFAULT 'EUR'
);

CREATE TABLE category (
    id    INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name  ENUM('Alimentação', 'Bem-estar', 'Compras', 'Educação', 'Habitação', 'Lazer', 'Restaurantes', 'Salário', 'Saúde', 'Tecnologia', 'Transporte', 'Viagens', 'Outras Receitas', 'Outras Despesas') NOT NULL,
    slug  VARCHAR(50),
    color VARCHAR(7)
);

-- ------------------------------------------
--  CORE 
-- ------------------------------------------
CREATE TABLE users (
    id          INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(500) NOT NULL,
    currency_id INT NOT NULL DEFAULT 1,
    FOREIGN KEY (currency_id) REFERENCES currency (id)
);

CREATE TABLE transactions (
    id               INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title            VARCHAR(50) NOT NULL,
    amount           DECIMAL(10, 2) NOT NULL,
    type             ENUM('income', 'expense') NOT NULL,
    transaction_date DATE NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    currency_id      INT NOT NULL,
    FOREIGN KEY (currency_id) REFERENCES currency (id),
    category_id      INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category (id),
    user_id          INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE chat_history (
    id         INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    role       ENUM('user', 'model') NOT NULL,
    content    TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id    INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE expense_limit (
    id           INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    amount_limit DECIMAL(10, 2) NOT NULL,
    period       ENUM('yearly', 'monthly', 'weekly', 'daily') DEFAULT 'monthly',
    category_id  INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category (id),
    user_id      INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE (user_id, category_id)
);

-- --------------------------------------------
--  SEEDS
-- --------------------------------------------

INSERT INTO currency (id, currency_code) VALUES
(1, 'EUR'),
(2, 'USD'),
(3, 'BRL'),
(4, 'GBP');

INSERT INTO category (id, name, slug, color) VALUES
(1,  'Alimentação',   'alimentacao',     '#F97316'),
(2,  'Bem-estar',     'bem-estar',       '#8B5CF6'),
(3,  'Compras',       'compras',         '#EC4899'),
(4,  'Educação',      'educacao',        '#06B6D4'),
(5,  'Habitação',     'habitacao',       '#10B981'),
(6,  'Lazer',         'lazer',           '#F59E0B'),
(7,  'Restaurantes',  'restaurantes',    '#F97316'),
(8,  'Salário',       'salario',         '#22C55E'),
(9,  'Saúde',         'saude',           '#EF4444'),
(10, 'Tecnologia',    'tecnologia',      '#6366F1'),
(11, 'Transporte',    'transporte',      '#3B82F6'),
(12, 'Viagens',       'viagens',         '#14B8A6'),
(13, 'Outras Receitas', 'outras-receitas', '#22C55E'),
(14, 'Outras Despesas', 'outras-despesas', '#E65668');

-- --------------------------------------------
--  Utilizador de teste
--  password: test123 (bcrypt hash)
-- --------------------------------------------
INSERT INTO users (id, name, email, password, currency_id) VALUES
(1, 'Test User', 'test@moneyhub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);


INSERT INTO transactions (title, amount, type, transaction_date, currency_id, category_id, user_id) VALUES
('Supermercado',   85.50,   'expense', '2025-06-01', 1, 1,  2),
('Renda',         750.00,   'expense', '2025-06-01', 1, 5,  2),
('Gasolina',       60.00,   'expense', '2025-06-03', 1, 11, 2),
('Restaurante',    32.00,   'expense', '2025-06-05', 1, 7,  2),
('Electricidade',  45.00,   'expense', '2025-06-07', 1, 5,  2),
('Ginásio',        30.00,   'expense', '2025-06-08', 1, 2,  2),
('Netflix',        15.99,   'expense', '2025-06-09', 1, 10, 2),
('Farmácia',       22.50,   'expense', '2025-06-10', 1, 9,  2),
('Uber',           12.00,   'expense', '2025-06-11', 1, 11, 2),
('Café',            8.50,   'expense', '2025-06-12', 1, 1,  2),
('Salário',      1500.00,   'income',  '2025-06-01', 1, 8,  2),
('Freelance',     300.00,   'income',  '2025-06-10', 1, 13, 2);