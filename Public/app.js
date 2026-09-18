let pageLivresActuelle = 1;
const limiteLivres = 5;

let auteurEnModification = null;
let adherentEnModification = null;


// ===============================
// ÉLÉMENTS DU DOM
// ===============================

// Navigation
const navDashboard = document.getElementById('navDashboard');
const navLivres = document.getElementById('navLivres');
const navAuteurs = document.getElementById('navAuteurs');
const navAdherents = document.getElementById('navAdherents');
const navEmprunts = document.getElementById('navEmprunts');
const navParametres = document.getElementById('navParametres');




const dashboardPage = document.getElementById('dashboardPage');
const livresPage = document.getElementById('livresPage');
const auteursPage = document.getElementById('auteursPage');
const adherentsPage = document.getElementById('adherentsPage');
const empruntsPage = document.getElementById('empruntsPage');
const parametresPage = document.getElementById('parametresPage');



// ===============================
// FONCTION POUR CHANGER DE PAGE
// ===============================

function afficherPage(page) {

    if (dashboardPage) {
        dashboardPage.style.display = 'none';
    }

    if (livresPage) {
        livresPage.style.display = 'none';
    }

    if (auteursPage) {
        auteursPage.style.display = 'none';
    }

    if (adherentsPage) {
        adherentsPage.style.display = 'none';
    }

    if (empruntsPage) {
        empruntsPage.style.display = 'none';
    }

    if (parametresPage) parametresPage.style.display = 'none';

    if (page) {
        page.style.display = 'block';
    }
}


// ===============================
// FONCTION POUR ACTIVER LE MENU
// ===============================

function activerMenu(boutonActif) {

    document.querySelectorAll('.nav-item').forEach((bouton) => {
        bouton.classList.remove('active');
    });

    if (boutonActif) {
        boutonActif.classList.add('active');
    }
}


// ===============================
// NAVIGATION DASHBOARD
// ===============================

if (navDashboard) {

    navDashboard.addEventListener('click', () => {

        afficherPage(dashboardPage);
        activerMenu(navDashboard);

        chargerDashboard();
    });
}


// ===============================
// NAVIGATION LIVRES
// ===============================

if (navLivres) {

    navLivres.addEventListener('click', () => {

        afficherPage(livresPage);
        activerMenu(navLivres);

        pageLivresActuelle = 1;
        chargerLivres();
    });
}


// ===============================
// NAVIGATION AUTEURS
// ===============================

if (navAuteurs) {

    navAuteurs.addEventListener('click', () => {

        afficherPage(auteursPage);
        activerMenu(navAuteurs);

        chargerAuteurs();
    });
}


// ===============================
// NAVIGATION ADHÉRENTS
// ===============================

if (navAdherents) {

    navAdherents.addEventListener('click', () => {

        afficherPage(adherentsPage);
        activerMenu(navAdherents);

        chargerAdherents();
    });
}

if (navEmprunts) {
    navEmprunts.addEventListener('click', () => {
        afficherPage(empruntsPage);
        chargerEmprunts();
    });

    if (navParametres) {
    navParametres.addEventListener('click', () => {
        afficherPage(parametresPage);
    });
}
}




// ===============================
// NAVIGATION EMPRUNTS
// ===============================

if (navEmprunts) {

    navEmprunts.addEventListener('click', () => {

        afficherPage(empruntsPage);
        activerMenu(navEmprunts);

        chargerEmprunts();
    });
}

if (navParametres) {
    navParametres.addEventListener('click', () => {
        afficherPage(parametresPage);
    });
}


// ===============================
// CHARGER LE DASHBOARD
// ===============================

async function chargerDashboard() {

    try {

        const response = await fetch('/api/dashboard');

        if (!response.ok) {
            throw new Error('Erreur lors du chargement du dashboard');
        }

        const data = await response.json();

        const totalLivres = document.getElementById('totalLivres');
        const totalAdherents = document.getElementById('totalAdherents');
        const empruntsEnCours = document.getElementById('empruntsEnCours');
        const empruntsEnRetard = document.getElementById('empruntsEnRetard');

        if (totalLivres) {
            totalLivres.textContent = data.totalLivres;
        }

        if (totalAdherents) {
            totalAdherents.textContent = data.totalAdherents;
        }

        if (empruntsEnCours) {
            empruntsEnCours.textContent = data.empruntsEnCours;
        }

        if (empruntsEnRetard) {
            empruntsEnRetard.textContent = data.empruntsEnRetard;
        }


        // Livre le plus emprunté
        const livrePlusEmprunte =
            document.getElementById('livrePlusEmprunte');

        if (livrePlusEmprunte) {

            if (data.livrePlusEmprunte) {

                livrePlusEmprunte.innerHTML = `
                    <strong>${data.livrePlusEmprunte.titre}</strong>
                    <span>
                        ${data.livrePlusEmprunte.nombreEmprunts} emprunt(s)
                    </span>
                `;

            } else {

                livrePlusEmprunte.innerHTML = `
                    <span>Aucun emprunt</span>
                `;
            }
        }


        // Adhérent le plus actif
        const adherentPlusActif =
            document.getElementById('adherentPlusActif');

        if (adherentPlusActif) {

            if (data.adherentPlusActif) {

                adherentPlusActif.innerHTML = `
                    <strong>${data.adherentPlusActif.nom}</strong>
                    <span>
                        ${data.adherentPlusActif.nombreEmprunts} emprunt(s)
                    </span>
                `;

            } else {

                adherentPlusActif.innerHTML = `
                    <span>Aucun emprunt</span>
                `;
            }
        }
                // Charger les emprunts récents
        const responseEmprunts = await fetch('/api/emprunts');

        if (responseEmprunts.ok) {

            const emprunts = await responseEmprunts.json();

            const recentLoans =
                document.getElementById('recentLoans');

            if (recentLoans) {

                recentLoans.innerHTML = '';

                const empruntsRecents =
                    emprunts.slice(0, 5);

                if (empruntsRecents.length === 0) {

                    recentLoans.innerHTML = `
                        <tr>
                            <td colspan="5" style="text-align:center;">
                                Aucun emprunt récent.
                            </td>
                        </tr>
                    `;

                } else {

                    empruntsRecents.forEach((emprunt) => {

                        let statutTexte = 'En cours';
                        let classeStatut = 'current';

                        if (
                            emprunt.statut_emprunt === 'retourne'
                        ) {
                            statutTexte = 'Retourné';
                            classeStatut = 'returned';

                        } else if (
                            emprunt.statut_emprunt === 'en_retard'
                        ) {
                            statutTexte = 'En retard';
                            classeStatut = 'overdue';
                        }

                        recentLoans.innerHTML += `
                            <tr>

                                <td>
                                    ${emprunt.livre_titre || '-'}
                                </td>

                                <td>
                                    ${emprunt.adherent_nom || '-'}
                                </td>

                                <td>
                                    ${formatDate(
                                        emprunt.date_emprunt
                                    )}
                                </td>

                                <td>
                                    ${formatDate(
                                        emprunt.date_retour_prevue
                                    )}
                                </td>

                                <td>
                                    <span class="book-status ${classeStatut}">
                                        ${statutTexte}
                                    </span>
                                </td>

                            </tr>
                        `;
                    });
                }
            }
        }

    } 
    
    catch (error) {

        console.error(
            'Erreur dashboard :',
            error
        );
    }
}
// ===============================
// CHARGER LES LIVRES
// ===============================

async function chargerLivres() {

    try {

        const rechercheInput =
            document.getElementById('rechercheLivre');

        const recherche =
            rechercheInput ? rechercheInput.value.trim() : '';

        const url =
            `/api/livres?page=${pageLivresActuelle}&limit=${limiteLivres}` +
            (recherche
                ? `&recherche=${encodeURIComponent(recherche)}`
                : '');

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des livres');
        }

        const data = await response.json();

        const tbody =
            document.getElementById('livresTableBody');

        const nombreLivres =
            document.getElementById('nombreLivres');

        const paginationInfo =
            document.getElementById('paginationInfo');

        const btnPagePrecedente =
            document.getElementById('btnPagePrecedente');

        const btnPageSuivante =
            document.getElementById('btnPageSuivante');


        // Nombre total de livres
        if (nombreLivres) {
            nombreLivres.textContent =
                `${data.total} livre${data.total > 1 ? 's' : ''}`;
        }


        // Tableau
        if (tbody) {

            tbody.innerHTML = '';

            if (data.livres.length === 0) {

                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align:center;">
                            Aucun livre trouvé.
                        </td>
                    </tr>
                `;

            } else {

                data.livres.forEach((livre, index) => {

                    const numero =
                        ((data.page - 1) * data.limit) + index + 1;

                    const statut =
                        livre.statut === 'emprunte'
                            ? 'Emprunté'
                            : 'Disponible';

                    const classeStatut =
                        livre.statut === 'emprunte'
                            ? 'borrowed'
                            : 'available';

                    const ligne = document.createElement('tr');

                    ligne.innerHTML = `
                        <td>${numero}</td>

                        <td>
                            <strong>${livre.titre}</strong>
                        </td>

                        <td>
                            ${livre.auteur || '-'}
                        </td>

                        <td>
                            ${livre.annee_publication || '-'}
                        </td>

                        <td>
                            <span class="book-status ${classeStatut}">
                                ${statut}
                            </span>
                        </td>

                        <td>
                            <div class="table-actions">

                                <button
                                    class="table-action-button btn-modifier-livre"
                                    data-id="${livre.id}"
                                    title="Modifier"
                                >
                                    <i class="fi-rr-pencil"></i>
                                </button>

                                <button
                                    class="table-action-button btn-supprimer-livre"
                                    data-id="${livre.id}"
                                    title="Supprimer"
                                >
                                    <i class="fi-rr-trash"></i>
                                </button>

                            </div>
                        </td>
                    `;

                    tbody.appendChild(ligne);
                });
            }
        }


        // Pagination
        if (paginationInfo) {

            paginationInfo.textContent =
                `Page ${data.page} sur ${data.totalPages || 1}`;
        }

        if (btnPagePrecedente) {

            btnPagePrecedente.disabled =
                data.page <= 1;
        }

        if (btnPageSuivante) {

            btnPageSuivante.disabled =
                data.page >= data.totalPages;
        }

    } catch (error) {

        console.error(
            'Erreur lors du chargement des livres :',
            error
        );
    }
}


// ===============================
// RECHERCHE DES LIVRES
// ===============================

const rechercheLivre =
    document.getElementById('rechercheLivre');

if (rechercheLivre) {

    rechercheLivre.addEventListener('input', () => {

        pageLivresActuelle = 1;

        chargerLivres();
    });
}


// ===============================
// PAGINATION — PAGE PRÉCÉDENTE
// ===============================

const btnPagePrecedente =
    document.getElementById('btnPagePrecedente');

if (btnPagePrecedente) {

    btnPagePrecedente.addEventListener('click', () => {

        if (pageLivresActuelle > 1) {

            pageLivresActuelle--;

            chargerLivres();
        }
    });
}


// ===============================
// PAGINATION — PAGE SUIVANTE
// ===============================

const btnPageSuivante =
    document.getElementById('btnPageSuivante');

if (btnPageSuivante) {

    btnPageSuivante.addEventListener('click', () => {

        pageLivresActuelle++;

        chargerLivres();
    });
}


// ===============================
// MODALE LIVRE
// ===============================

const modalLivre =
    document.getElementById('modalLivre');

const btnAjouterLivre =
    document.getElementById('btnAjouterLivre');

const fermerModalLivre =
    document.getElementById('fermerModalLivre');

const annulerLivre =
    document.getElementById('annulerLivre');


if (btnAjouterLivre) {

    btnAjouterLivre.addEventListener('click', () => {

        if (modalLivre) {
            modalLivre.style.display = 'flex';
        }
    });
}


if (fermerModalLivre) {

    fermerModalLivre.addEventListener('click', () => {

        if (modalLivre) {
            modalLivre.style.display = 'none';
        }
    });
}


if (annulerLivre) {

    annulerLivre.addEventListener('click', () => {

        if (modalLivre) {
            modalLivre.style.display = 'none';
        }
    });
}


// Fermer une modale en cliquant à l'extérieur
if (modalLivre) {

    modalLivre.addEventListener('click', (event) => {

        if (event.target === modalLivre) {

            modalLivre.style.display = 'none';
        }
    });
}


// ===============================
// CHARGER LES AUTEURS
// POUR LE FORMULAIRE LIVRE
// ===============================

async function chargerAuteursPourLivre() {

    try {

        const response =
            await fetch('/api/auteurs');

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des auteurs');
        }

        const auteurs =
            await response.json();

        const selectAuteur =
            document.getElementById('auteurLivre');

        if (!selectAuteur) {
            return;
        }

        selectAuteur.innerHTML = `
            <option value="">
                Sélectionner un auteur
            </option>
        `;

        auteurs.forEach((auteur) => {

            const option =
                document.createElement('option');

            option.value = auteur.id;

            option.textContent = auteur.nom;

            selectAuteur.appendChild(option);
        });

    } catch (error) {

        console.error(
            'Erreur auteurs livre :',
            error
        );
    }
}


// ===============================
// FORMULAIRE AJOUT LIVRE
// ===============================

const formLivre =
    document.getElementById('formLivre');

if (formLivre) {

    formLivre.addEventListener('submit', async (event) => {

        event.preventDefault();

        const titre =
            document.getElementById('titreLivre').value.trim();

        const auteurId =
            document.getElementById('auteurLivre').value;

        const annee =
            document.getElementById('anneeLivre').value;

        const statut =
            document.getElementById('statutLivre')
                ? document.getElementById('statutLivre').value
                : 'disponible';


        if (!titre || !auteurId) {

            alert('Veuillez remplir les champs obligatoires.');

            return;
        }


        try {

            const response =
                await fetch('/api/livres', {

                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        titre: titre,
                        auteur_id: Number(auteurId),
                        annee_publication:
                            annee ? Number(annee) : null,
                        statut: statut
                    })
                });


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'Erreur lors de l’ajout du livre'
                );
            }


            alert('Livre ajouté avec succès.');

            formLivre.reset();

            if (modalLivre) {
                modalLivre.style.display = 'none';
            }

            pageLivresActuelle = 1;

            chargerLivres();

        } catch (error) {

            console.error(
                'Erreur ajout livre :',
                error
            );

            alert(error.message);
        }
    });
}


// ===============================
// MODIFIER / SUPPRIMER UN LIVRE
// ===============================

if (livresPage) {

    livresPage.addEventListener('click', async (event) => {

        const boutonModifier =
            event.target.closest('.btn-modifier-livre');

        const boutonSupprimer =
            event.target.closest('.btn-supprimer-livre');


        // Modifier
        if (boutonModifier) {

            const id =
                boutonModifier.dataset.id;

            await modifierLivre(id);
        }


        // Supprimer
        if (boutonSupprimer) {

            const id =
                boutonSupprimer.dataset.id;

            await supprimerLivre(id);
        }
    });
}


// ===============================
// MODIFIER UN LIVRE
// ===============================

async function modifierLivre(id) {

    try {

        const response =
            await fetch(`/api/livres/${id}`);

        if (!response.ok) {

            throw new Error(
                'Impossible de récupérer le livre.'
            );
        }

        const livre =
            await response.json();


        await chargerAuteursPourLivre();


        const titreLivre =
            document.getElementById('titreLivre');

        const auteurLivre =
            document.getElementById('auteurLivre');

        const anneeLivre =
            document.getElementById('anneeLivre');

        const statutLivre =
            document.getElementById('statutLivre');


        if (titreLivre) {
            titreLivre.value = livre.titre;
        }

        if (auteurLivre) {
            auteurLivre.value = livre.auteur_id;
        }

        if (anneeLivre) {
            anneeLivre.value =
                livre.annee_publication || '';
        }

        if (statutLivre) {
            statutLivre.value =
                livre.statut;
        }


        if (modalLivre) {
            modalLivre.style.display = 'flex';
        }

        // On mémorise l'identifiant
        formLivre.dataset.id = id;

    } catch (error) {

        console.error(
            'Erreur modification livre :',
            error
        );

        alert(error.message);
    }
}


// ===============================
// SUPPRIMER UN LIVRE
// ===============================

async function supprimerLivre(id) {

    const confirmation =
        confirm(
            'Voulez-vous vraiment supprimer ce livre ?'
        );

    if (!confirmation) {
        return;
    }


    try {

        const response =
            await fetch(`/api/livres/${id}`, {

                method: 'DELETE'
            });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                'Erreur lors de la suppression.'
            );
        }


        alert('Livre supprimé avec succès.');

        chargerLivres();

    } catch (error) {

        console.error(
            'Erreur suppression livre :',
            error
        );

        alert(error.message);
    }
}
// ===============================
// CHARGER LES AUTEURS
// ===============================

async function chargerAuteurs() {

    try {

        const response =
            await fetch('/api/auteurs');

        if (!response.ok) {
            throw new Error(
                'Erreur lors du chargement des auteurs'
            );
        }

        const auteurs =
            await response.json();

        const tbody =
            document.getElementById('auteursTableBody');

        const nombreAuteurs =
            document.getElementById('nombreAuteurs');


        // Nombre d'auteurs
        if (nombreAuteurs) {

            nombreAuteurs.textContent =
                `${auteurs.length} auteur${auteurs.length > 1 ? 's' : ''}`;
        }


        // Tableau
        if (tbody) {

            tbody.innerHTML = '';

            if (auteurs.length === 0) {

                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align:center;">
                            Aucun auteur trouvé.
                        </td>
                    </tr>
                `;

                return;
            }


            auteurs.forEach((auteur, index) => {

                const ligne =
                    document.createElement('tr');

                ligne.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <strong>
                            ${auteur.nom}
                        </strong>
                    </td>

                    <td>
                        ${auteur.nationalite || '-'}
                    </td>

                    <td>

                        <div class="table-actions">

                            <button
                                class="table-action-button btn-modifier-auteur"
                                data-id="${auteur.id}"
                                title="Modifier"
                            >
                                <i class="fi-rr-pencil"></i>
                            </button>

                            <button
                                class="table-action-button btn-supprimer-auteur"
                                data-id="${auteur.id}"
                                title="Supprimer"
                            >
                                <i class="fi-rr-trash"></i>
                            </button>

                        </div>

                    </td>
                `;

                tbody.appendChild(ligne);
            });
        }

    } catch (error) {

        console.error(
            'Erreur auteurs :',
            error
        );
    }
}


// ===============================
// MODALE AUTEUR
// ===============================

const modalAuteur =
    document.getElementById('modalAuteur');

const btnAjouterAuteur =
    document.getElementById('btnAjouterAuteur');

const fermerModalAuteur =
    document.getElementById('fermerModalAuteur');

const annulerAuteur =
    document.getElementById('annulerAuteur');

const formAuteur =
    document.getElementById('formAuteur');


// ===============================
// OUVRIR MODALE AJOUT AUTEUR
// ===============================

if (btnAjouterAuteur) {

    btnAjouterAuteur.addEventListener('click', () => {

        auteurEnModification = null;

        if (formAuteur) {
            formAuteur.reset();
        }

        if (modalAuteur) {
            modalAuteur.style.display = 'flex';
        }

        const titre =
            modalAuteur?.querySelector('.modal-header h2');

        if (titre) {
            titre.textContent = 'Ajouter un auteur';
        }

    });
}


// ===============================
// FERMER MODALE AUTEUR
// ===============================

if (fermerModalAuteur) {

    fermerModalAuteur.addEventListener('click', () => {

        if (modalAuteur) {
            modalAuteur.style.display = 'none';
        }
    });
}


if (annulerAuteur) {

    annulerAuteur.addEventListener('click', () => {

        if (modalAuteur) {
            modalAuteur.style.display = 'none';
        }
    });
}


// Fermer en cliquant à l'extérieur

if (modalAuteur) {

    modalAuteur.addEventListener('click', (event) => {

        if (event.target === modalAuteur) {

            modalAuteur.style.display = 'none';
        }
    });
}


// ===============================
// AJOUTER / MODIFIER UN AUTEUR
// ===============================

if (formAuteur) {

    formAuteur.addEventListener('submit', async (event) => {

        event.preventDefault();


        const nom =
            document.getElementById('nomAuteur')
                .value.trim();

        const nationalite =
            document.getElementById('nationaliteAuteur')
                .value.trim();


        if (!nom) {

            alert(
                'Le nom de l’auteur est obligatoire.'
            );

            return;
        }


        try {

            let response;

            // =========================
            // MODIFICATION
            // =========================

            if (auteurEnModification) {

                response =
                    await fetch(
                        `/api/auteurs/${auteurEnModification}`,
                        {
                            method: 'PUT',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({
                                nom: nom,
                                nationalite: nationalite
                            })
                        }
                    );

            }

            // =========================
            // AJOUT
            // =========================

            else {

                response =
                    await fetch(
                        '/api/auteurs',
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({
                                nom: nom,
                                nationalite: nationalite
                            })
                        }
                    );
            }


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'Une erreur est survenue.'
                );
            }


            if (auteurEnModification) {

                alert(
                    'Auteur modifié avec succès.'
                );

            } else {

                alert(
                    'Auteur ajouté avec succès.'
                );
            }


            // Réinitialiser
            auteurEnModification = null;

            formAuteur.reset();

            if (modalAuteur) {
                modalAuteur.style.display = 'none';
            }


            // Actualiser la liste
            chargerAuteurs();


        } catch (error) {

            console.error(
                'Erreur auteur :',
                error
            );

            alert(error.message);
        }
    });
}


// ===============================
// BOUTONS MODIFIER / SUPPRIMER
// ===============================

if (auteursPage) {

    auteursPage.addEventListener(
        'click',
        async (event) => {

            const boutonModifier =
                event.target.closest(
                    '.btn-modifier-auteur'
                );

            const boutonSupprimer =
                event.target.closest(
                    '.btn-supprimer-auteur'
                );


            // =========================
            // MODIFIER
            // =========================

            if (boutonModifier) {

                const id =
                    boutonModifier.dataset.id;

                await modifierAuteur(id);
            }


            // =========================
            // SUPPRIMER
            // =========================

            if (boutonSupprimer) {

                const id =
                    boutonSupprimer.dataset.id;

                await supprimerAuteur(id);
            }

        }
    );
}


// ===============================
// MODIFIER UN AUTEUR
// ===============================

async function modifierAuteur(id) {

    try {

        const response =
            await fetch(`/api/auteurs/${id}`);


        if (!response.ok) {

            throw new Error(
                'Impossible de récupérer cet auteur.'
            );
        }


        const auteur =
            await response.json();


        auteurEnModification = id;


        const nomAuteur =
            document.getElementById('nomAuteur');

        const nationaliteAuteur =
            document.getElementById(
                'nationaliteAuteur'
            );


        if (nomAuteur) {

            nomAuteur.value =
                auteur.nom || '';
        }


        if (nationaliteAuteur) {

            nationaliteAuteur.value =
                auteur.nationalite || '';
        }


        // Modifier le titre de la fenêtre

        const titre =
            modalAuteur?.querySelector(
                '.modal-header h2'
            );

        if (titre) {

            titre.textContent =
                'Modifier un auteur';
        }


        // Modifier le texte du bouton

        const boutonSubmit =
            formAuteur?.querySelector(
                'button[type="submit"]'
            );

        if (boutonSubmit) {

            boutonSubmit.innerHTML = `
                <i class="fi-rr-check"></i>
                Enregistrer
            `;
        }


        if (modalAuteur) {

            modalAuteur.style.display =
                'flex';
        }


    } catch (error) {

        console.error(
            'Erreur modification auteur :',
            error
        );

        alert(error.message);
    }
}


// ===============================
// SUPPRIMER UN AUTEUR
// ===============================

async function supprimerAuteur(id) {

    const confirmation =
        confirm(
            'Voulez-vous vraiment supprimer cet auteur ?'
        );


    if (!confirmation) {

        return;
    }


    try {

        const response =
            await fetch(
                `/api/auteurs/${id}`,
                {
                    method: 'DELETE'
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                'Erreur lors de la suppression.'
            );
        }


        alert(
            'Auteur supprimé avec succès.'
        );


        chargerAuteurs();


    } catch (error) {

        console.error(
            'Erreur suppression auteur :',
            error
        );

        alert(error.message);
    }
}
// ===============================
// CHARGER LES ADHÉRENTS
// ===============================

async function chargerAdherents() {

    try {

        const response =
            await fetch('/api/adherents');

        if (!response.ok) {
            throw new Error(
                'Erreur lors du chargement des adhérents'
            );
        }

        const adherents =
            await response.json();

        const tbody =
            document.getElementById('adherentsTableBody');

        const nombreAdherents =
            document.getElementById('nombreAdherents');


        // ===============================
        // NOMBRE D'ADHÉRENTS
        // ===============================

        if (nombreAdherents) {

            nombreAdherents.textContent =
                `${adherents.length} adhérent${adherents.length > 1 ? 's' : ''}`;
        }


        // ===============================
        // TABLEAU
        // ===============================

        if (tbody) {

            tbody.innerHTML = '';

            if (adherents.length === 0) {

                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align:center;">
                            Aucun adhérent trouvé.
                        </td>
                    </tr>
                `;

                return;
            }


            adherents.forEach((adherent, index) => {

                const ligne =
                    document.createElement('tr');


                ligne.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <strong>
                            ${adherent.nom}
                        </strong>
                    </td>

                    <td>
                        ${adherent.contact || '-'}
                    </td>

                    <td>

                        <div class="table-actions">

                            <button
                                class="table-action-button btn-modifier-adherent"
                                data-id="${adherent.id}"
                                title="Modifier"
                            >
                                <i class="fi-rr-pencil"></i>
                            </button>

                            <button
                                class="table-action-button btn-supprimer-adherent"
                                data-id="${adherent.id}"
                                title="Supprimer"
                            >
                                <i class="fi-rr-trash"></i>
                            </button>

                        </div>

                    </td>
                `;


                tbody.appendChild(ligne);

            });
        }

    } catch (error) {

        console.error(
            'Erreur adhérents :',
            error
        );
    }
}


// ===============================
// MODALE ADHÉRENT
// ===============================

const modalAdherent =
    document.getElementById('modalAdherent');

const btnAjouterAdherent =
    document.getElementById('btnAjouterAdherent');

const fermerModalAdherent =
    document.getElementById('fermerModalAdherent');

const annulerAdherent =
    document.getElementById('annulerAdherent');

const formAdherent =
    document.getElementById('formAdherent');


// ===============================
// OUVRIR LA MODALE
// ===============================

if (btnAjouterAdherent) {

    btnAjouterAdherent.addEventListener('click', () => {

        // Très important :
        // on indique qu'il s'agit d'un nouvel adhérent

        adherentEnModification = null;


        // Réinitialiser le formulaire

        if (formAdherent) {
            formAdherent.reset();
        }


        // Titre de la modale

        const titre =
            modalAdherent?.querySelector(
                '.modal-header h2'
            );

        if (titre) {

            titre.textContent =
                'Ajouter un adhérent';
        }


        // Bouton du formulaire

        const boutonSubmit =
            formAdherent?.querySelector(
                'button[type="submit"]'
            );

        if (boutonSubmit) {

            boutonSubmit.innerHTML = `
                <i class="fi-rr-plus"></i>
                Ajouter
            `;
        }


        // Afficher la modale

        if (modalAdherent) {

            modalAdherent.style.display =
                'flex';
        }

    });
}


// ===============================
// FERMER LA MODALE
// ===============================

if (fermerModalAdherent) {

    fermerModalAdherent.addEventListener(
        'click',
        () => {

            if (modalAdherent) {

                modalAdherent.style.display =
                    'none';
            }

        }
    );
}


if (annulerAdherent) {

    annulerAdherent.addEventListener(
        'click',
        () => {

            if (modalAdherent) {

                modalAdherent.style.display =
                    'none';
            }

        }
    );
}


// ===============================
// FERMER EN CLIQUANT À L'EXTÉRIEUR
// ===============================

if (modalAdherent) {

    modalAdherent.addEventListener(
        'click',
        (event) => {

            if (event.target === modalAdherent) {

                modalAdherent.style.display =
                    'none';
            }

        }
    );
}


// ===============================
// AJOUTER / MODIFIER UN ADHÉRENT
// ===============================

if (formAdherent) {

    formAdherent.addEventListener(
        'submit',
        async (event) => {

            event.preventDefault();


            const nom =
                document
                    .getElementById('nomAdherent')
                    .value
                    .trim();


            const contact =
                document
                    .getElementById('contactAdherent')
                    .value
                    .trim();


            // ===============================
            // VALIDATION
            // ===============================

            if (!nom || !contact) {

                alert(
                    'Veuillez remplir tous les champs obligatoires.'
                );

                return;
            }


            try {

                let response;


                // ===============================
                // MODIFICATION
                // ===============================

                if (adherentEnModification) {

                    response =
                        await fetch(
                            `/api/adherents/${adherentEnModification}`,
                            {

                                method: 'PUT',

                                headers: {
                                    'Content-Type':
                                        'application/json'
                                },

                                body: JSON.stringify({

                                    nom: nom,

                                    contact: contact
                                })
                            }
                        );

                }


                // ===============================
                // AJOUT
                // ===============================

                else {

                    response =
                        await fetch(
                            '/api/adherents',
                            {

                                method: 'POST',

                                headers: {
                                    'Content-Type':
                                        'application/json'
                                },

                                body: JSON.stringify({

                                    nom: nom,

                                    contact: contact
                                })
                            }
                        );

                }


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'Une erreur est survenue.'
                    );
                }


                // ===============================
                // MESSAGE
                // ===============================

                if (adherentEnModification) {

                    alert(
                        'Adhérent modifié avec succès.'
                    );

                } else {

                    alert(
                        'Adhérent ajouté avec succès.'
                    );

                }


                // ===============================
                // RÉINITIALISATION
                // ===============================

                adherentEnModification = null;

                formAdherent.reset();


                // Fermer la modale

                if (modalAdherent) {

                    modalAdherent.style.display =
                        'none';
                }


                // Actualiser la liste

                chargerAdherents();


            } catch (error) {

                console.error(
                    'Erreur adhérent :',
                    error
                );

                alert(error.message);
            }

        }
    );
}


// ===============================
// MODIFIER / SUPPRIMER
// ===============================

if (adherentsPage) {

    adherentsPage.addEventListener(
        'click',
        async (event) => {


            const boutonModifier =
                event.target.closest(
                    '.btn-modifier-adherent'
                );


            const boutonSupprimer =
                event.target.closest(
                    '.btn-supprimer-adherent'
                );


            // ===============================
            // MODIFIER
            // ===============================

            if (boutonModifier) {

                const id =
                    boutonModifier.dataset.id;

                await modifierAdherent(id);
            }


            // ===============================
            // SUPPRIMER
            // ===============================

            if (boutonSupprimer) {

                const id =
                    boutonSupprimer.dataset.id;

                await supprimerAdherent(id);
            }

        }
    );
}


// ===============================
// MODIFIER UN ADHÉRENT
// ===============================

async function modifierAdherent(id) {

    try {

        const response =
            await fetch(
                `/api/adherents/${id}`
            );


        if (!response.ok) {

            throw new Error(
                'Impossible de récupérer cet adhérent.'
            );
        }


        const adherent =
            await response.json();


        // Mémoriser l'ID

        adherentEnModification = id;


        // ===============================
        // REMPLIR LE FORMULAIRE
        // ===============================

        const nomAdherent =
            document.getElementById(
                'nomAdherent'
            );


        const contactAdherent =
            document.getElementById(
                'contactAdherent'
            );


        if (nomAdherent) {

            nomAdherent.value =
                adherent.nom || '';
        }


        if (contactAdherent) {

            contactAdherent.value =
                adherent.contact || '';
        }


        // ===============================
        // CHANGER LE TITRE
        // ===============================

        const titre =
            modalAdherent?.querySelector(
                '.modal-header h2'
            );


        if (titre) {

            titre.textContent =
                'Modifier un adhérent';
        }


        // ===============================
        // CHANGER LE BOUTON
        // ===============================

        const boutonSubmit =
            formAdherent?.querySelector(
                'button[type="submit"]'
            );


        if (boutonSubmit) {

            boutonSubmit.innerHTML = `
                <i class="fi-rr-check"></i>
                Enregistrer
            `;
        }


        // ===============================
        // AFFICHER LA MODALE
        // ===============================

        if (modalAdherent) {

            modalAdherent.style.display =
                'flex';
        }


    } catch (error) {

        console.error(
            'Erreur modification adhérent :',
            error
        );

        alert(error.message);
    }
}


// ===============================
// SUPPRIMER UN ADHÉRENT
// ===============================

async function supprimerAdherent(id) {

    const confirmation =
        confirm(
            'Voulez-vous vraiment supprimer cet adhérent ?'
        );


    if (!confirmation) {

        return;
    }


    try {

        const response =
            await fetch(
                `/api/adherents/${id}`,
                {

                    method: 'DELETE'
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                'Erreur lors de la suppression.'
            );
        }


        alert(
            'Adhérent supprimé avec succès.'
        );


        // Actualiser la liste

        chargerAdherents();


    } catch (error) {

        console.error(
            'Erreur suppression adhérent :',
            error
        );

        alert(error.message);
    }
}
// ===============================
// CHARGER LES EMPRUNTS
// ===============================

async function chargerEmprunts() {

    try {

        const response =
            await fetch('/api/emprunts');

        if (!response.ok) {

            throw new Error(
                'Erreur lors du chargement des emprunts'
            );
        }

        const emprunts =
            await response.json();

        const tbody =
            document.getElementById('empruntsTableBody');


        if (!tbody) {
            return;
        }


        tbody.innerHTML = '';


        if (emprunts.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;">
                        Aucun emprunt trouvé.
                    </td>
                </tr>
            `;

            return;
        }


        emprunts.forEach((emprunt, index) => {

            const ligne =
                document.createElement('tr');


            let statutTexte = 'En cours';
            let classeStatut = 'current';


            if (emprunt.statut_emprunt === 'retourne') {

                statutTexte = 'Retourné';
                classeStatut = 'returned';

            } else if (
                emprunt.statut_emprunt === 'en_retard'
            ) {

                statutTexte = 'En retard';
                classeStatut = 'overdue';
            }


            const boutonRetour =
                emprunt.statut_emprunt !== 'retourne'
                    ? `
                        <button
                            class="table-action-button btn-retour-emprunt"
                            data-id="${emprunt.id}"
                            title="Retourner le livre"
                        >
                            <i class="fi-rr-undo"></i>
                        </button>
                    `
                    : '';


            ligne.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${emprunt.adherent_nom || '-'}
                    </strong>
                </td>

                <td>
                    ${emprunt.livre_titre || '-'}
                </td>

                <td>
                    ${formatDate(
                        emprunt.date_emprunt
                    )}
                </td>

                <td>
                    ${formatDate(
                        emprunt.date_retour_prevue
                    )}
                </td>

                <td>
                    <span class="book-status ${classeStatut}">
                        ${statutTexte}
                    </span>
                </td>

                <td>

                    <div class="table-actions">

                        ${boutonRetour}

                        <button
                            class="table-action-button btn-voir-emprunt"
                            data-id="${emprunt.id}"
                            title="Voir"
                        >
                            <i class="fi-rr-eye"></i>
                        </button>

                    </div>

                </td>
            `;


            tbody.appendChild(ligne);

        });


    } catch (error) {

        console.error(
            'Erreur emprunts :',
            error
        );
    }
}


// ===============================
// FORMATER UNE DATE
// ===============================

function formatDate(date) {

    if (!date) {
        return '-';
    }


    const dateObj =
        new Date(date);


    if (Number.isNaN(dateObj.getTime())) {

        return date;
    }


    return dateObj.toLocaleDateString(
        'fr-FR'
    );
}


// ===============================
// MODALE EMPRUNT
// ===============================

const modalEmprunt =
    document.getElementById('modalEmprunt');

const btnAjouterEmprunt =
    document.getElementById('btnAjouterEmprunt');

const fermerModalEmprunt =
    document.getElementById('fermerModalEmprunt');

const annulerEmprunt =
    document.getElementById('annulerEmprunt');

const formEmprunt =
    document.getElementById('formEmprunt');

const adherentEmprunt =
     document.getElementById('adherentEmprunt');
const livreEmprunt = 
     document.getElementById('livreEmprunt');


// ===============================
// OUVRIR LA MODALE EMPRUNT
// ===============================

if (btnAjouterEmprunt) {

    btnAjouterEmprunt.addEventListener(
        'click',
        async () => {

            if (formEmprunt) {

                formEmprunt.reset();
            }


            await chargerAdherentsPourEmprunt();

            await chargerLivresPourEmprunt();


            if (modalEmprunt) {

                modalEmprunt.style.display =
                    'flex';
            }

        }
    );
}


// ===============================
// FERMER LA MODALE
// ===============================

if (fermerModalEmprunt) {

    fermerModalEmprunt.addEventListener(
        'click',
        () => {

            if (modalEmprunt) {

                modalEmprunt.style.display =
                    'none';
            }

        }
    );
}


if (annulerEmprunt) {

    annulerEmprunt.addEventListener(
        'click',
        () => {

            if (modalEmprunt) {

                modalEmprunt.style.display =
                    'none';
            }

        }
    );
}


if (modalEmprunt) {

    modalEmprunt.addEventListener(
        'click',
        (event) => {

            if (event.target === modalEmprunt) {

                modalEmprunt.style.display =
                    'none';
            }

        }
    );
}


// ===============================
// CHARGER LES ADHÉRENTS
// POUR LE FORMULAIRE EMPRUNT
// ===============================

async function chargerAdherentsPourEmprunt() {

    try {

        const response =
            await fetch('/api/adherents');


        if (!response.ok) {

            throw new Error(
                'Erreur lors du chargement des adhérents.'
            );
        }


        const adherents =
            await response.json();


        const select =
            document.getElementById(
                'adherentEmprunt'
            );


        if (!select) {
            return;
        }


        select.innerHTML = `
            <option value="">
                Sélectionner un adhérent
            </option>
        `;


        adherents.forEach((adherent) => {

            const option =
                document.createElement('option');


            option.value =
                adherent.id;


            option.textContent =
                adherent.nom;


            select.appendChild(option);

        });


    } catch (error) {

        console.error(
            'Erreur adhérents emprunt :',
            error
        );
    }
}


// ===============================
// CHARGER LES LIVRES
// POUR LE FORMULAIRE EMPRUNT
// ===============================

async function chargerLivresPourEmprunt() {

    try {

        const response =
            await fetch(
                '/api/livres?limit=100'
            );


        if (!response.ok) {

            throw new Error(
                'Erreur lors du chargement des livres.'
            );
        }


        const data =
            await response.json();


        const select =
            document.getElementById(
                'livreEmprunt'
            );


        if (!select) {
            return;
        }


        select.innerHTML = `
            <option value="">
                Sélectionner un livre
            </option>
        `;


        data.livres
            .filter(
                (livre) =>
                    livre.statut === 'disponible'
            )
            .forEach((livre) => {

                const option =
                    document.createElement(
                        'option'
                    );


                option.value =
                    livre.id;


                option.textContent =
                    livre.titre;


                select.appendChild(option);

            });


    } catch (error) {

        console.error(
            'Erreur livres emprunt :',
            error
        );
    }
}


// ===============================
// CRÉER UN EMPRUNT
// ===============================

if (formEmprunt) {

    formEmprunt.addEventListener(
        'submit',
        async (event) => {

            event.preventDefault();


            const adherentId =
                document.getElementById(
                    'adherentEmprunt'
                ).value;


            const livreId =
                document.getElementById(
                    'livreEmprunt'
                ).value;


            const dateRetourPrevue =
                document.getElementById(
                    'dateRetourPrevue'
                ).value;


            if (
                !adherentId ||
                !livreId ||
                !dateRetourPrevue
            ) {

                alert(
                    'Veuillez remplir tous les champs obligatoires.'
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        '/api/emprunts',
                        {

                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({

                                adherent_id:
                                    Number(
                                        adherentId
                                    ),

                                livre_id:
                                    Number(
                                        livreId
                                    ),

                                date_retour_prevue:
                                    dateRetourPrevue
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'Erreur lors de la création de l’emprunt.'
                    );
                }


                alert(
                    'Emprunt enregistré avec succès.'
                );


                formEmprunt.reset();


                if (modalEmprunt) {

                    modalEmprunt.style.display =
                        'none';
                }


                chargerEmprunts();

                chargerDashboard();


            } catch (error) {

                console.error(
                    'Erreur création emprunt :',
                    error
                );

                alert(error.message);
            }

        }
    );
}


// ===============================
// RETOURNER UN LIVRE
// ===============================

if (empruntsPage) {

    empruntsPage.addEventListener(
        'click',
        async (event) => {


            const boutonRetour =
                event.target.closest(
                    '.btn-retour-emprunt'
                );


            const boutonVoir =
                event.target.closest(
                    '.btn-voir-emprunt'
                );


            // ===============================
            // RETOUR
            // ===============================

            if (boutonRetour) {

                const id =
                    boutonRetour.dataset.id;


                await retournerEmprunt(id);

            }


            // ===============================
            // VOIR
            // ===============================

            if (boutonVoir) {

                const id =
                    boutonVoir.dataset.id;


                await voirEmprunt(id);

            }

        }
    );
}


// ===============================
// RETOURNER UN EMPRUNT
// ===============================

async function retournerEmprunt(id) {

    const confirmation =
        confirm(
            'Confirmer le retour de ce livre ?'
        );


    if (!confirmation) {

        return;
    }


    try {

        const response =
            await fetch(
                `/api/emprunts/${id}/retour`,
                {

                    method: 'PUT'
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                'Erreur lors du retour du livre.'
            );
        }


        alert(
            'Livre retourné avec succès.'
        );


        chargerEmprunts();

        chargerDashboard();


    } catch (error) {

        console.error(
            'Erreur retour livre :',
            error
        );

        alert(error.message);
    }
}


// ===============================
// VOIR UN EMPRUNT
// ===============================

async function voirEmprunt(id) {

    try {

        const response =
            await fetch(
                `/api/emprunts/${id}`
            );


        if (!response.ok) {

            throw new Error(
                'Impossible de récupérer cet emprunt.'
            );
        }


        const emprunt =
            await response.json();


        alert(
            `Adhérent : ${emprunt.adherent_nom || '-'}\n` +
            `Livre : ${emprunt.livre_titre || '-'}\n` +
            `Date d'emprunt : ${formatDate(emprunt.date_emprunt)}\n` +
            `Retour prévu : ${formatDate(emprunt.date_retour_prevue)}\n` +
            `Retour réel : ${formatDate(emprunt.date_retour)}`
        );


    } catch (error) {

        console.error(
            'Erreur détail emprunt :',
            error
        );

        alert(error.message);
    }
}


// ===============================
// INITIALISATION DE L'APPLICATION
// ===============================

document.addEventListener(
    'DOMContentLoaded',
    () => {

        // Afficher le dashboard au démarrage

        afficherPage(dashboardPage);

        activerMenu(navDashboard);


        // Charger les données du dashboard

        chargerDashboard();

    }
);
const btnEnregistrerProfil = document.getElementById('btnEnregistrerProfil');

if (btnEnregistrerProfil) {
    btnEnregistrerProfil.addEventListener('click', () => {
        const profil = {
            nom: document.getElementById('nomProfil').value,
            email: document.getElementById('emailProfil').value,
            telephone: document.getElementById('telephoneProfil').value
        };

        localStorage.setItem('profilBibliotheque', JSON.stringify(profil));

        alert('Profil enregistré avec succès.');
    });
}