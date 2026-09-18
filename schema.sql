-- Suppression des tables si elles existent déjà
DROP TABLE IF EXISTS emprunts;
DROP TABLE IF EXISTS livres;
DROP TABLE IF EXISTS adherents;
DROP TABLE IF EXISTS auteurs;


-- =========================================================
-- TABLE : auteurs
-- =========================================================

CREATE TABLE auteurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    nationalite VARCHAR(100)
);


-- =========================================================
-- TABLE : adherents
-- =========================================================

CREATE TABLE adherents (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    contact VARCHAR(150) NOT NULL
);


-- =========================================================
-- TABLE : livres
-- =========================================================

CREATE TABLE livres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur_id INTEGER NOT NULL,
    annee_publication INTEGER,
    statut VARCHAR(20) NOT NULL DEFAULT 'disponible',

    CONSTRAINT fk_livre_auteur
        FOREIGN KEY (auteur_id)
        REFERENCES auteurs(id)
        ON DELETE CASCADE,

    CONSTRAINT check_statut_livre
        CHECK (statut IN ('disponible', 'emprunte'))
);


-- =========================================================
-- TABLE : emprunts
-- =========================================================

CREATE TABLE emprunts (
    id SERIAL PRIMARY KEY,
    adherent_id INTEGER NOT NULL,
    livre_id INTEGER NOT NULL,
    date_emprunt DATE NOT NULL DEFAULT CURRENT_DATE,
    date_retour_prevue DATE NOT NULL,
    date_retour DATE,

    CONSTRAINT fk_emprunt_adherent
        FOREIGN KEY (adherent_id)
        REFERENCES adherents(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_emprunt_livre
        FOREIGN KEY (livre_id)
        REFERENCES livres(id)
        ON DELETE CASCADE,

    CONSTRAINT check_dates_emprunt
        CHECK (date_retour_prevue >= date_emprunt),

    CONSTRAINT check_date_retour
        CHECK (
            date_retour IS NULL
            OR date_retour >= date_emprunt
        )
);


-- =========================================================
-- DONNÉES DE TEST : AUTEURS
-- =========================================================

INSERT INTO auteurs (nom, nationalite) VALUES
('Victor Hugo', 'Française'),
('Chinua Achebe', 'Nigériane'),
('George Orwell', 'Britannique'),
('Mariama Bâ', 'Sénégalaise'),
('Aimé Césaire', 'Martiniquaise');


-- =========================================================
-- DONNÉES DE TEST : ADHÉRENTS
-- =========================================================

INSERT INTO adherents (nom, contact) VALUES
('Jean Dupont', '06 123 45 67'),
('Marie Martin', '06 234 56 78'),
('Paul Nzambe', '06 345 67 89'),
('Sophie Mbemba', '06 456 78 90'),
('David Moukou', '06 567 89 01');


-- =========================================================
-- DONNÉES DE TEST : LIVRES
-- =========================================================

INSERT INTO livres (titre, auteur_id, annee_publication, statut) VALUES
('Les Misérables', 1, 1862, 'disponible'),
('Notre-Dame de Paris', 1, 1831, 'disponible'),
('Things Fall Apart', 2, 1958, 'disponible'),
('1984', 3, 1949, 'disponible'),
('La Ferme des animaux', 3, 1945, 'disponible'),
('Une si longue lettre', 4, 1979, 'disponible'),
('Cahier d’un retour au pays natal', 5, 1939, 'disponible'),
('La Tragédie du roi Christophe', 5, 1963, 'disponible');
