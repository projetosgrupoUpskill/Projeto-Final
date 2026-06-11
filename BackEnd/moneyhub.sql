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
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name ENUM('Alimentação', 'Bem-estar', 'Compras', 'Educação', 'Habitação', 'Lazer', 'Restaurantes', 'Salário', 'Saúde', 'Tecnologia', 'Transporte', 'Viagens', 'Outras Receitas', 'Outras Despesas') NOT NULL
);
-- ------------------------------------------
--  CORE 
-- ------------------------------------------

CREATE TABLE users (
    id          INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(500) NOT NULL,       
    currency_id INT NOT NULL DEFAULT 1,      -- EUR (moeda fixa inicialmente)
    FOREIGN KEY (currency_id) REFERENCES currency (id)
);

CREATE TABLE transactions (
    id 					INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title 				VARCHAR(50) NOT NULL,
    amount 				DECIMAL(10 , 2 ) NOT NULL,
    type 				ENUM('income', 'expense') NOT NULL,
    transaction_date 	DATE NOT NULL,
    created_at 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    currency_id 		INT NOT NULL,    
    FOREIGN KEY (currency_id)
        REFERENCES currency (id),
        
    category_id 		INT NOT NULL,
    FOREIGN KEY (category_id)
        REFERENCES category (id),
        
    user_id 			INT NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
);

CREATE TABLE chat_history (
    id 			INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    role 		ENUM('user', 'model') NOT NULL,
    content 	TEXT NOT NULL,
    created_at 	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id 	INT NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
);

CREATE TABLE expense_limit (
    id 				INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    amount_limit 	DECIMAL(10,2) NOT NULL,
    period 			ENUM('yearly', 'monthly', 'weekly', 'daily') DEFAULT 'monthly', /* multiperiod é feature futura */
    
    category_id INT NOT NULL,
    FOREIGN KEY (category_id)
        REFERENCES category (id),
        
    user_id INT NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users (id),
        
	UNIQUE (user_id, category_id)
);
-- um utilizador só terá um limite por categoria, independentemente do período (quando houver multiperiod)

-- --------------------------------------------
--  SEEDS
-- --------------------------------------------
INSERT INTO currency (id, currency_code) VALUES
(1, 'EUR'),
(2, 'USD'),
(3, 'BRL'),
(4, 'GBP');
 
-- Categorias pré-definidas
INSERT INTO category (id, name) VALUES
(1,  'Alimentação'),
(2,  'Bem-estar'),
(3,  'Compras'),
(4,  'Educação'),
(5,  'Habitação'),
(6,  'Lazer'),
(7,  'Restaurantes'),
(8,  'Salário'),
(9,  'Saúde'),
(10, 'Tecnologia'),
(11, 'Transporte'),
(12, 'Viagens'),
(13, 'Outras Receitas'),
(14, 'Outras Despesas');
