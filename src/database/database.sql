-- ROLES TABLE -- ROLES TABLE -- ROLES TABLE -- ROLES TABLE -- ROLES TABLE -- ROLES TABLE -- ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id_role INT (2) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR (32) NOT NULL,
    description VARCHAR (255) NOT NULL DEFAULT 'Sin Descripción',
    CONSTRAINT pk_roles PRIMARY KEY (id_role),
    CONSTRAINT uc_roles_name UNIQUE (name)
);
CREATE INDEX idx_roles_name ON roles(name);
-- INSERTIONS ROLES TABLE
INSERT INTO roles (id_role, name, description) VALUES (null, 'Usuario', 'Usuario con pocos privilegios');
INSERT INTO roles (id_role, name, description) VALUES (null, 'Admin', 'Usuario con casi todos los privilegios');
INSERT INTO roles (id_role, name, description) VALUES (null, 'Superadmin', 'Usuario que tiene todos los privilegios');

-- STATUS TABLE -- STATUS TABLE -- STATUS TABLE -- STATUS TABLE -- STATUS TABLE -- STATUS TABLE -- STATUS TABLE
CREATE TABLE IF NOT EXISTS statuses (
    id_status INT (2) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR (32)  NOT NULL,
    description VARCHAR (255) NOT NULL DEFAULT 'Sin Descripción',
    CONSTRAINT pk_status PRIMARY KEY (id_status),
    CONSTRAINT uc_status_name UNIQUE (name)
);
CREATE INDEX idx_status_name ON statuses (name);
-- INSERTIONS STATUS TABLE
INSERT INTO statuses (id_status, name, description) VALUES (null, 'Activado', 'Puede hacer todas las acciones asignadas');
INSERT INTO statuses (id_status, name, description) VALUES (null, 'Desactivado', 'Sólo tiene algunas acciones asignadas');
INSERT INTO statuses (id_status, name, description) VALUES (null, 'Eliminado', 'No se puede loguear');

-- USER TABLE -- USER TABLE -- USER TABLE -- USER TABLE -- USER TABLE -- USER TABLE -- USER TABLE -- USER TABLE
CREATE TABLE IF NOT EXISTS users (
    id_user INT (11) UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR (32) NOT NULL,
    password VARCHAR (60) NOT NULL,
    email VARCHAR (50) NOT NULL,
    fullname VARCHAR (100) NOT NULL,
    password_reset_token VARCHAR(255),
    id_role INT (2) UNSIGNED NOT NULL DEFAULT 1, -- DEFAULT 'Usuario'
    id_status INT (2) UNSIGNED NOT NULL DEFAULT 1, -- DEFAULT 'Activado'
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- DEFAULT CURRENT_TIMESTAMP
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- DEFAULT CURRENT_TIMESTAMP
    CONSTRAINT pk_users PRIMARY KEY (id_user),
    CONSTRAINT uc_users_username UNIQUE (username),
    CONSTRAINT uc_users_email UNIQUE (email),
    CONSTRAINT uc_users_password_reset_token UNIQUE (password_reset_token),
    CONSTRAINT fk_users_role FOREIGN KEY (id_role) REFERENCES roles (id_role),
    CONSTRAINT fk_users_status FOREIGN KEY (id_status) REFERENCES statuses (id_status)
    ON UPDATE CASCADE ON DELETE NO ACTION
);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
-- INSERTIONS USERS TABLE

-- TOKEN TABLE -- TOKEN TABLE -- TOKEN TABLE -- TOKEN TABLE -- TOKEN TABLE -- TOKEN TABLE -- TOKEN TABLE -- TOKEN TABLE
CREATE TABLE IF NOT EXISTS tokens (
    access_token VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    id_user INT (11) UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- DEFAULT CURRENT_TIMESTAMP
    CONSTRAINT pk_tokens PRIMARY KEY (access_token),
    CONSTRAINT uc_tokens_refresh_token UNIQUE (refresh_token),
    CONSTRAINT fk_tokens_id_user FOREIGN KEY (id_user) REFERENCES users (id_user)
    ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX idx_tokens_refresh_token ON tokens (refresh_token);
-- INSERTIONS TOKENS TABLE
-- NO INSERTIONS

DELIMITER $$
CREATE TRIGGER `USERS_DELETE_TOKEN_ON_DEACTIVATED`
AFTER UPDATE ON `users`
FOR EACH ROW
    IF (OLD.id_status = 1 AND NEW.id_status = 2) OR
        (OLD.id_status = 1 AND NEW.id_status = 3)
    THEN 
        DELETE FROM tokens WHERE tokens.id_user = OLD.id_user;
    END IF
$$
DELIMITER ;