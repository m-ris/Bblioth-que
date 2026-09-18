/* =========================================================
   FORMATER UNE DATE
========================================================= */

function formaterDate(date) {
    if (!date) {
        return "-";
    }

    const dateObjet = new Date(date);

    if (isNaN(dateObjet.getTime())) {
        return date;
    }

    return dateObjet.toLocaleDateString(
        "fr-FR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC"
        }
    );
}


/* =========================================================
   DATE DU DASHBOARD
========================================================= */

function afficherDate() {
    const dateElement =
        document.getElementById("currentDate");

    if (!dateElement) {
        return;
    }

    const maintenant = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    const dateFormatee =
        maintenant.toLocaleDateString(
            "fr-FR",
            options
        );

    dateElement.textContent =
        dateFormatee.charAt(0).toUpperCase() +
        dateFormatee.slice(1);
}


/* =========================================================
   CHARGEMENT DES STATS DU DASHBOARD
========================================================= */

async function chargerDashboard() {

    try {

        const response =
            await fetch("/api/dashboard");

        if (!response.ok) {

            throw new Error(
                "Impossible de récupérer les données du dashboard."
            );
        }

        const data =
            await response.json();


        /* -------------------------
           STATS
        ------------------------- */

        document.getElementById(
            "totalLivres"
        ).textContent =
            data.totalLivres ?? 0;

        document.getElementById(
            "totalAdherents"
        ).textContent =
            data.totalAdherents ?? 0;

        document.getElementById(
            "empruntsEnCours"
        ).textContent =
            data.empruntsEnCours ?? 0;

        document.getElementById(
            "empruntsEnRetard"
        ).textContent =
            data.empruntsEnRetard ?? 0;


        /* -------------------------
           LIVRE LE PLUS EMPRUNTÉ
        ------------------------- */

        const livreElement =
            document.getElementById(
                "livrePlusEmprunte"
            );

        if (
            data.livrePlusEmprunte &&
            data.livrePlusEmprunte.titre
        ) {

            livreElement.innerHTML = `
                <div class="result-main">

                    <i class="fi-rr-book"></i>

                    <div>

                        <strong>
                            ${data.livrePlusEmprunte.titre}
                        </strong>

                        <span>
                            ${data.livrePlusEmprunte.nombreEmprunts}
                            emprunt(s)
                        </span>

                    </div>

                </div>
            `;

        } else {

            livreElement.textContent =
                "Aucun emprunt enregistré.";
        }


        /* -------------------------
           ADHÉRENT LE PLUS ACTIF
        ------------------------- */

        const adherentElement =
            document.getElementById(
                "adherentPlusActif"
            );

        if (
            data.adherentPlusActif &&
            data.adherentPlusActif.nom
        ) {

            adherentElement.innerHTML = `
                <div class="result-main">

                    <i class="fi-rr-user"></i>

                    <div>

                        <strong>
                            ${data.adherentPlusActif.nom}
                        </strong>

                        <span>
                            ${data.adherentPlusActif.nombreEmprunts}
                            emprunt(s)
                        </span>

                    </div>

                </div>
            `;

        } else {

            adherentElement.textContent =
                "Aucun emprunt enregistré.";
        }


    } catch (error) {

        console.error(
            "Erreur dashboard :",
            error
        );

        document.getElementById(
            "livrePlusEmprunte"
        ).textContent =
            "Impossible de charger les données.";

        document.getElementById(
            "adherentPlusActif"
        ).textContent =
            "Impossible de charger les données.";
    }
}


/* =========================================================
   CHARGEMENT DES EMPRUNTS RÉCENTS
========================================================= */

async function chargerEmpruntsRecents() {

    const recentLoans =
        document.getElementById(
            "recentLoans"
        );

    if (!recentLoans) {
        return;
    }

    try {

        const response =
            await fetch("/api/emprunts");

        if (!response.ok) {

            throw new Error(
                "Impossible de récupérer les emprunts."
            );
        }

        const emprunts =
            await response.json();


        /* -------------------------
           AUCUN EMPRUNT
        ------------------------- */

        if (
            !Array.isArray(emprunts) ||
            emprunts.length === 0
        ) {

            recentLoans.innerHTML = `
                <tr>

                    <td colspan="5">

                        <div class="table-loading">
                            Aucun emprunt enregistré.
                        </div>

                    </td>

                </tr>
            `;

            return;
        }


        /* -------------------------
           TRI DES EMPRUNTS
        ------------------------- */

        const empruntsRecents =
            emprunts
                .sort(
                    (a, b) => b.id - a.id
                )
                .slice(0, 5);


        /* -------------------------
           AFFICHER LES EMPRUNTS
        ------------------------- */

        recentLoans.innerHTML =
            empruntsRecents.map(
                emprunt => {

                    let statut = "";
                    let classe = "";


                    /* EN RETARD */

                    if (
                        emprunt.statut_emprunt ===
                        "en_retard"
                    ) {

                        statut = "En retard";
                        classe = "status-overdue";

                    }


                    /* EN COURS */

                    else if (
                        emprunt.statut_emprunt ===
                        "en_cours"
                    ) {

                        statut = "En cours";
                        classe = "status-current";

                    }


                    /* RETOURNÉ */

                    else {

                        statut = "Retourné";
                        classe = "status-returned";
                    }


                    return `
                        <tr>

                            <td>
                                ${emprunt.livre}
                            </td>

                            <td>
                                ${emprunt.adherent}
                            </td>

                            <td>
                                ${formaterDate(
                                    emprunt.date_emprunt
                                )}
                            </td>

                            <td>
                                ${formaterDate(
                                    emprunt.date_retour_prevue
                                )}
                            </td>

                            <td>

                                <span class="loan-status ${classe}">
                                    ${statut}
                                </span>

                            </td>

                        </tr>
                    `;

                }
            ).join("");


    } catch (error) {

        console.error(
            "Erreur emprunts récents :",
            error
        );

        recentLoans.innerHTML = `
            <tr>

                <td colspan="5">

                    <div class="table-loading">
                        Impossible de charger les emprunts.
                    </div>

                </td>

            </tr>
        `;
    }
}


/* =========================================================
   CHARGER LES LIVRES
========================================================= */

let pageLivres = 1;
const limiteLivres = 5;

async function chargerLivres() {

    const tableBody =
        document.getElementById("livresTableBody");

    const nombreLivres =
        document.getElementById("nombreLivres");

    const paginationInfo =
        document.getElementById("paginationInfo");

    const btnPagePrecedente =
        document.getElementById("btnPagePrecedente");

    const btnPageSuivante =
        document.getElementById("btnPageSuivante");

    const recherche =
        document
            .getElementById("rechercheLivre")
            ?.value
            .trim() || "";

    if (!tableBody) {
        return;
    }

    try {

        tableBody.innerHTML = `
            <tr>

                <td colspan="6">

                    <div class="table-loading">

                        <i class="fi-rr-spinner"></i>

                        <span>
                            Chargement des livres...
                        </span>

                    </div>

                </td>

            </tr>
        `;


        const url =
            `/api/livres?page=${pageLivres}&limit=${limiteLivres}&recherche=${encodeURIComponent(recherche)}`;

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Impossible de récupérer les livres."
            );
        }

        const data =
            await response.json();


        /* -------------------------
           NOMBRE DE LIVRES
        ------------------------- */

        if (nombreLivres) {

            nombreLivres.textContent =
                `${data.total} livre${data.total > 1 ? "s" : ""}`;
        }


        /* -------------------------
           AUCUN LIVRE
        ------------------------- */

        if (
            !data.livres ||
            data.livres.length === 0
        ) {

            tableBody.innerHTML = `
                <tr>

                    <td colspan="6">

                        <div class="table-loading">
                            Aucun livre trouvé.
                        </div>

                    </td>

                </tr>
            `;

        } else {


            /* -------------------------
               AFFICHER LES LIVRES
            ------------------------- */

            tableBody.innerHTML =
                data.livres.map(
                    livre => {

                        const disponible =
                            livre.statut === "disponible";

                        return `
                            <tr>

                                <td>
                                    ${livre.id}
                                </td>

                                <td>

                                    <strong>
                                        ${livre.titre}
                                    </strong>

                                </td>

                                <td>
                                    ${livre.auteur || "-"}
                                </td>

                                <td>
                                    ${livre.annee_publication || "-"}
                                </td>

                                <td>

                                    <span class="book-status ${
                                        disponible
                                            ? "available"
                                            : "borrowed"
                                    }">

                                        <i class="${
                                            disponible
                                                ? "fi-rr-check"
                                                : "fi-rr-book"
                                        }"></i>

                                        ${
                                            disponible
                                                ? "Disponible"
                                                : "Emprunté"
                                        }

                                    </span>

                                </td>

                                <td>

                                    <div class="table-actions">

                                        <button
                                            class="table-action-button"
                                            title="Modifier"
                                            data-id="${livre.id}"
                                        >
                                            <i class="fi-rr-pencil"></i>
                                        </button>

                                        <button
                                            class="table-action-button delete"
                                            title="Supprimer"
                                            data-id="${livre.id}"
                                        >
                                            <i class="fi-rr-trash"></i>
                                        </button>

                                    </div>

                                </td>

                            </tr>
                        `;

                    }
                ).join("");
        }


        /* -------------------------
           PAGINATION
        ------------------------- */

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
            "Erreur livres :",
            error
        );

        tableBody.innerHTML = `
            <tr>

                <td colspan="6">

                    <div class="table-loading">
                        Impossible de charger les livres.
                    </div>

                </td>

            </tr>
        `;
    }
}


/* =========================================================
   CHARGER LES AUTEURS
========================================================= */

async function chargerAuteurs() {

    const tableBody =
        document.getElementById(
            "auteursTableBody"
        );

    const nombreAuteurs =
        document.getElementById(
            "nombreAuteurs"
        );

    if (!tableBody) {
        return;
    }

    try {

        const response =
            await fetch("/api/auteurs");

        if (!response.ok) {

            throw new Error(
                "Impossible de récupérer les auteurs."
            );
        }

        const auteurs =
            await response.json();


        nombreAuteurs.textContent =
            `${auteurs.length} auteur${auteurs.length > 1 ? "s" : ""}`;


        if (auteurs.length === 0) {

            tableBody.innerHTML = `
                <tr>

                    <td colspan="4">

                        <div class="table-loading">
                            Aucun auteur trouvé.
                        </div>

                    </td>

                </tr>
            `;

            return;
        }


        tableBody.innerHTML =
            auteurs.map(
                auteur => `

                    <tr>

                        <td>
                            ${auteur.id}
                        </td>

                        <td>
                            <strong>
                                ${auteur.nom}
                            </strong>
                        </td>

                        <td>
                            ${auteur.nationalite || "-"}
                        </td>

                        <td>

                            <div class="table-actions">

                                <button
                                    class="table-action-button"
                                    title="Modifier"
                                    data-id="${auteur.id}"
                                >
                                    <i class="fi-rr-pencil"></i>
                                </button>

                                <button
                                    class="table-action-button delete"
                                    title="Supprimer"
                                    data-id="${auteur.id}"
                                >
                                    <i class="fi-rr-trash"></i>
                                </button>

                            </div>

                        </td>

                    </tr>

                `
            ).join("");


    } catch (error) {

        console.error(
            "Erreur auteurs :",
            error
        );

        tableBody.innerHTML = `
            <tr>

                <td colspan="4">

                    <div class="table-loading">
                        Impossible de charger les auteurs.
                    </div>

                </td>

            </tr>
        `;
    }
}


/* =========================================================
   INITIALISATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        afficherDate();

        chargerDashboard();

        chargerEmpruntsRecents();

        chargerLivres();

        chargerAuteurs();


        /* =================================================
           RECHERCHE LIVRES
        ================================================= */

        const rechercheLivre =
            document.getElementById(
                "rechercheLivre"
            );

        if (rechercheLivre) {

            rechercheLivre.addEventListener(
                "input",
                () => {

                    pageLivres = 1;

                    chargerLivres();

                }
            );
        }


        /* =================================================
           PAGINATION LIVRES
        ================================================= */

        const btnPagePrecedente =
            document.getElementById(
                "btnPagePrecedente"
            );

        const btnPageSuivante =
            document.getElementById(
                "btnPageSuivante"
            );


        if (btnPagePrecedente) {

            btnPagePrecedente.addEventListener(
                "click",
                () => {

                    if (pageLivres > 1) {

                        pageLivres--;

                        chargerLivres();
                    }

                }
            );
        }


        if (btnPageSuivante) {

            btnPageSuivante.addEventListener(
                "click",
                () => {

                    pageLivres++;

                    chargerLivres();
                }
            );
        }


        /* =================================================
           NAVIGATION LIVRES
        ================================================= */

        const dashboardPage =
            document.getElementById(
                "dashboardPage"
            );

        const livresPage =
            document.getElementById(
                "livresPage"
            );

        const navLivres =
            document.getElementById(
                "navLivres"
            );


        if (navLivres) {

            navLivres.addEventListener(
                "click",
                () => {

                    dashboardPage.style.display =
                        "none";

                    livresPage.style.display =
                        "block";


                    document
                        .querySelectorAll(".nav-item")
                        .forEach(
                            item => {
                                item.classList.remove(
                                    "active"
                                );
                            }
                        );


                    navLivres.classList.add(
                        "active"
                    );

                }
            );
        }


        /* =================================================
           NAVIGATION DASHBOARD
        ================================================= */

        const navDashboard =
            document.getElementById(
                "navDashboard"
            );

        if (navDashboard) {

            navDashboard.addEventListener(
                "click",
                () => {

                    dashboardPage.style.display =
                        "block";

                    livresPage.style.display =
                        "none";


                    document
                        .querySelectorAll(".nav-item")
                        .forEach(
                            item => {
                                item.classList.remove(
                                    "active"
                                );
                            }
                        );


                    navDashboard.classList.add(
                        "active"
                    );

                }
            );
        }


        /* =================================================
           NAVIGATION AUTEURS
        ================================================= */

        const auteursPage =
            document.getElementById(
                "auteursPage"
            );

        const navAuteurs =
            document.getElementById(
                "navAuteurs"
            );


        if (navAuteurs) {

            navAuteurs.addEventListener(
                "click",
                () => {

                    dashboardPage.style.display =
                        "none";

                    livresPage.style.display =
                        "none";

                    auteursPage.style.display =
                        "block";


                    document
                        .querySelectorAll(".nav-item")
                        .forEach(
                            item => {
                                item.classList.remove(
                                    "active"
                                );
                            }
                        );


                    navAuteurs.classList.add(
                        "active"
                    );

                }
            );
        }

        const navAdherents =
    document.getElementById("navAdherents");

if (navAdherents) {

    navAdherents.addEventListener("click", () => {

        console.log("Navigation vers Adhérents");

        document
            .querySelectorAll(".dashboard, .page-section")
            .forEach(page => {
                page.style.display = "none";
            });

        const adherentsPage =
            document.getElementById("adherentsPage");

        if (adherentsPage) {
            adherentsPage.style.display = "block";
        }

        document
            .querySelectorAll(".nav-item")
            .forEach(item => {
                item.classList.remove("active");
            });

        navAdherents.classList.add("active");

        chargerAdherents();
    });

}

        /* =================================================
           MODAL AJOUT AUTEUR
        ================================================= */

        const btnAjouterAuteur =
            document.getElementById(
                "btnAjouterAuteur"
            );

        const modalAuteur =
            document.getElementById(
                "modalAuteur"
            );

        const fermerModalAuteur =
            document.getElementById(
                "fermerModalAuteur"
            );

        const annulerAuteur =
            document.getElementById(
                "annulerAuteur"
            );


        if (btnAjouterAuteur) {

            btnAjouterAuteur.addEventListener(
                "click",
                () => {

                    auteurEnModification = null;

                    modalAuteur.style.display =
                        "flex";

                }
            );
        }


        if (fermerModalAuteur) {

            fermerModalAuteur.addEventListener(
                "click",
                () => {

                    modalAuteur.style.display =
                        "none";

                }
            );
        }


        if (annulerAuteur) {

            annulerAuteur.addEventListener(
                "click",
                () => {

                    modalAuteur.style.display =
                        "none";

                }
            );
        }

    }
);


/* =========================================================
   AJOUT / MODIFICATION AUTEUR
========================================================= */

const formAuteur =
    document.getElementById(
        "formAuteur"
    );

let auteurEnModification = null;


if (formAuteur) {

    formAuteur.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const nom =
                document
                    .getElementById(
                        "nomAuteur"
                    )
                    .value
                    .trim();


            const nationalite =
                document
                    .getElementById(
                        "nationaliteAuteur"
                    )
                    .value
                    .trim();


            if (!nom) {

                alert(
                    "Le nom de l'auteur est obligatoire."
                );

                return;
            }


            try {

                const url =
                    auteurEnModification
                        ? `/api/auteurs/${auteurEnModification}`
                        : "/api/auteurs";


                const method =
                    auteurEnModification
                        ? "PUT"
                        : "POST";


                const response =
                    await fetch(
                        url,
                        {
                            method: method,

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                nom: nom,
                                nationalite:
                                    nationalite
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Erreur lors de l'enregistrement."
                    );
                }


                alert(
                    auteurEnModification
                        ? "Auteur modifié avec succès."
                        : "Auteur ajouté avec succès."
                );


                formAuteur.reset();

                modalAuteur.style.display =
                    "none";

                auteurEnModification =
                    null;


                chargerAuteurs();


            } catch (error) {

                console.error(
                    "Erreur auteur :",
                    error
                );

                alert(
                    error.message
                );
            }
        }
    );
}


/* =========================================================
   MODIFIER UN AUTEUR
========================================================= */

document.addEventListener(
    "click",
    async (event) => {

        const boutonModifier =
            event.target.closest(
                ".table-action-button:not(.delete)"
            );


        if (!boutonModifier) {
            return;
        }


        const id =
            boutonModifier.dataset.id;


        /*
           Pour éviter que les boutons Modifier
           des livres soient traités comme des auteurs
        */

        const ligne =
            boutonModifier.closest("tr");

        if (
            !ligne ||
            !document.getElementById(
                "auteursPage"
            )?.contains(ligne)
        ) {
            return;
        }


        auteurEnModification =
            id;


        try {

            const response =
                await fetch(
                    `/api/auteurs/${id}`
                );


            if (!response.ok) {

                throw new Error(
                    "Impossible de récupérer l'auteur."
                );
            }


            const auteur =
                await response.json();


            document.getElementById(
                "nomAuteur"
            ).value =
                auteur.nom;


            document.getElementById(
                "nationaliteAuteur"
            ).value =
                auteur.nationalite || "";


            document.getElementById(
                "modalAuteur"
            ).style.display =
                "flex";


        } catch (error) {

            console.error(
                "Erreur modification auteur :",
                error
            );

            alert(
                error.message
            );
        }
    }
);
document.addEventListener("click", async (event) => {

    const boutonSupprimer =
        event.target.closest(".table-action-button.delete");

    if (!boutonSupprimer) {
        return;
    }

    const ligne =
        boutonSupprimer.closest("tr");

    if (
        !ligne ||
        !document.getElementById("auteursPage")?.contains(ligne)
    ) {
        return;
    }

    const id =
        boutonSupprimer.dataset.id;

    const confirmation =
        confirm("Voulez-vous vraiment supprimer cet auteur ?");

    if (!confirmation) {
        return;
    }

    try {

        const response =
            await fetch(`/api/auteurs/${id}`, {
                method: "DELETE"
            });

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Erreur lors de la suppression."
            );
        }

        alert("Auteur supprimé avec succès.");

        chargerAuteurs();

    } catch (error) {

        console.error(
            "Erreur suppression auteur :",
            error
        );

        alert(error.message);
    }
});

/* =========================================================
   CHARGER LES ADHÉRENTS
========================================================= */

async function chargerAdherents() {

    try {

        const response =
            await fetch("/api/adherents");

        if (!response.ok) {
            throw new Error(
                "Impossible de récupérer les adhérents."
            );
        }

        const adherents =
            await response.json();

        const tbody =
            document.getElementById(
                "adherentsTableBody"
            );

        const nombre =
            document.getElementById(
                "nombreAdherents"
            );

        if (!tbody) {
            return;
        }

        tbody.innerHTML = "";

        if (nombre) {
            nombre.textContent =
                `${adherents.length} adhérent${adherents.length > 1 ? "s" : ""}`;
        }

        if (adherents.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        <div class="table-loading">
                            Aucun adhérent trouvé.
                        </div>
                    </td>
                </tr>
            `;

            return;
        }

        adherents.forEach(
            (adherent, index) => {

                const ligne =
                    document.createElement("tr");

                ligne.innerHTML = `
                    <td>${index + 1}</td>

                    <td>
                        <strong>
                            ${adherent.nom}
                        </strong>
                    </td>

                    <td>
                        ${adherent.contact}
                    </td>

                    <td>

                        <div class="table-actions">

                            <button
                                class="table-action-button"
                                data-id="${adherent.id}"
                                title="Modifier"
                            >
                                <i class="fi-rr-pencil"></i>
                            </button>

                            <button
                                class="table-action-button delete"
                                data-id="${adherent.id}"
                                title="Supprimer"
                            >
                                <i class="fi-rr-trash"></i>
                            </button>

                        </div>

                    </td>
                `;

                tbody.appendChild(ligne);
            }
        );

    } catch (error) {

        console.error(
            "Erreur chargement adhérents :",
            error
        );

    }
}


/* =========================================================
   AJOUT / MODIFICATION ADHÉRENT
========================================================= */

let adherentEnModification = null;


const btnAjouterAdherent =
    document.getElementById(
        "btnAjouterAdherent"
    );

const modalAdherent =
    document.getElementById(
        "modalAdherent"
    );

const fermerModalAdherent =
    document.getElementById(
        "fermerModalAdherent"
    );

const annulerAdherent =
    document.getElementById(
        "annulerAdherent"
    );

const formAdherent =
    document.getElementById(
        "formAdherent"
    );


/* =========================================================
   OUVRIR LE MODAL AJOUT ADHÉRENT
========================================================= */

if (
    btnAjouterAdherent &&
    modalAdherent
) {

    btnAjouterAdherent.addEventListener(
        "click",
        () => {

            // On passe en mode AJOUT
            adherentEnModification = null;

            // On vide le formulaire
            if (formAdherent) {
                formAdherent.reset();
            }

            // On ouvre le modal
            modalAdherent.style.display =
                "flex";

        }
    );

}


/* =========================================================
   FERMER LE MODAL
========================================================= */

if (
    fermerModalAdherent &&
    modalAdherent
) {

    fermerModalAdherent.addEventListener(
        "click",
        () => {

            modalAdherent.style.display =
                "none";

        }
    );

}


if (
    annulerAdherent &&
    modalAdherent
) {

    annulerAdherent.addEventListener(
        "click",
        () => {

            modalAdherent.style.display =
                "none";

            adherentEnModification = null;

            if (formAdherent) {
                formAdherent.reset();
            }

        }
    );

}


/* =========================================================
   ENREGISTRER ADHÉRENT
========================================================= */

if (formAdherent) {

    formAdherent.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const nom =
                document
                    .getElementById(
                        "nomAdherent"
                    )
                    .value
                    .trim();


            const contact =
                document
                    .getElementById(
                        "contactAdherent"
                    )
                    .value
                    .trim();


            if (!nom || !contact) {

                alert(
                    "Le nom et le contact sont obligatoires."
                );

                return;
            }


            try {

                const url =
                    adherentEnModification
                        ? `/api/adherents/${adherentEnModification}`
                        : "/api/adherents";


                const method =
                    adherentEnModification
                        ? "PUT"
                        : "POST";


                const response =
                    await fetch(
                        url,
                        {
                            method: method,

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                nom: nom,
                                contact: contact
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Erreur lors de l'enregistrement de l'adhérent."
                    );

                }


                if (adherentEnModification) {

                    alert(
                        "Adhérent modifié avec succès."
                    );

                } else {

                    alert(
                        "Adhérent ajouté avec succès."
                    );

                }


                formAdherent.reset();

                modalAdherent.style.display =
                    "none";

                adherentEnModification =
                    null;


                chargerAdherents();


            } catch (error) {

                console.error(
                    "Erreur adhérent :",
                    error
                );

                alert(
                    error.message
                );

            }

        }
    );

}


/* =========================================================
   MODIFIER UN ADHÉRENT
========================================================= */

document.addEventListener(
    "click",
    async (event) => {

        const boutonModifier =
            event.target.closest(
                ".table-action-button:not(.delete)"
            );


        if (!boutonModifier) {
            return;
        }


        const ligne =
            boutonModifier.closest("tr");


        if (
            !ligne ||
            !document
                .getElementById(
                    "adherentsPage"
                )
                ?.contains(ligne)
        ) {
            return;
        }


        const id =
            boutonModifier.dataset.id;


        adherentEnModification =
            id;


        try {

            const response =
                await fetch(
                    `/api/adherents/${id}`
                );


            if (!response.ok) {

                throw new Error(
                    "Impossible de récupérer l'adhérent."
                );

            }


            const adherent =
                await response.json();


            document.getElementById(
                "nomAdherent"
            ).value =
                adherent.nom;


            document.getElementById(
                "contactAdherent"
            ).value =
                adherent.contact;


            document.getElementById(
                "modalAdherent"
            ).style.display =
                "flex";


        } catch (error) {

            console.error(
                "Erreur modification adhérent :",
                error
            );

            alert(
                error.message
            );

        }

    }
);


/* =========================================================
   SUPPRIMER UN ADHÉRENT
========================================================= */

document.addEventListener(
    "click",
    async (event) => {

        const boutonSupprimer =
            event.target.closest(
                ".table-action-button.delete"
            );


        if (!boutonSupprimer) {
            return;
        }


        const ligne =
            boutonSupprimer.closest("tr");


        if (
            !ligne ||
            !document
                .getElementById(
                    "adherentsPage"
                )
                ?.contains(ligne)
        ) {
            return;
        }


        const id =
            boutonSupprimer.dataset.id;


        const confirmation =
            confirm(
                "Voulez-vous vraiment supprimer cet adhérent ?"
            );


        if (!confirmation) {
            return;
        }


        try {

            const response =
                await fetch(
                    `/api/adherents/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Erreur lors de la suppression."
                );

            }


            alert(
                "Adhérent supprimé avec succès."
            );


            chargerAdherents();


        } catch (error) {

            console.error(
                "Erreur suppression adhérent :",
                error
            );

            alert(
                error.message
            );

        }

    }
);

const btnAjouterAdherent =
    document.getElementById("btnAjouterAdherent");

const modalAdherent =
    document.getElementById("modalAdherent");

const fermerModalAdherent =
    document.getElementById("fermerModalAdherent");

const annulerAdherent =
    document.getElementById("annulerAdherent");


if (btnAjouterAdherent && modalAdherent) {

    btnAjouterAdherent.addEventListener(
        "click",
        () => {

            modalAdherent.style.display = "flex";

        }
    );

}


if (fermerModalAdherent && modalAdherent) {

    fermerModalAdherent.addEventListener(
        "click",
        () => {

            modalAdherent.style.display = "none";

        }
    );

}


if (annulerAdherent && modalAdherent) {

    annulerAdherent.addEventListener(
        "click",
        () => {

            modalAdherent.style.display = "none";

        }
    );

}
const formAdherent =
    document.getElementById("formAdherent");


if (formAdherent) {

    formAdherent.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const nom =
                document
                    .getElementById("nomAdherent")
                    .value
                    .trim();

            const contact =
                document
                    .getElementById("contactAdherent")
                    .value
                    .trim();


            if (!nom || !contact) {

                alert(
                    "Le nom et le contact sont obligatoires."
                );

                return;
            }
            


           try {

    const url =
        adherentEnModification
            ? `/api/adherents/${adherentEnModification}`
            : "/api/adherents";

    const method =
        adherentEnModification
            ? "PUT"
            : "POST";


    const response =
        await fetch(
            url,
            {
                method: method,

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    nom: nom,
                    contact: contact
                })
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Erreur lors de l'enregistrement de l'adhérent."
        );

    }


    alert(
        adherentEnModification
            ? "Adhérent modifié avec succès."
            : "Adhérent ajouté avec succès."
    );


    formAdherent.reset();

    modalAdherent.style.display =
        "none";

    adherentEnModification = null;


    chargerAdherents();


 

        }
    );

}
let adherentEnModification = null;


document.addEventListener("click", async (event) => {

    const boutonModifier =
        event.target.closest(
            ".table-action-button:not(.delete)"
        );

    if (!boutonModifier) {
        return;
    }

    const ligne =
        boutonModifier.closest("tr");

    if (
        !ligne ||
        !document
            .getElementById("adherentsPage")
            ?.contains(ligne)
    ) {
        return;
    }

    const id =
        boutonModifier.dataset.id;

    adherentEnModification = id;

    try {

        const response =
            await fetch(
                `/api/adherents/${id}`
            );

        if (!response.ok) {
            throw new Error(
                "Impossible de récupérer l'adhérent."
            );
        }

        const adherent =
            await response.json();

        document.getElementById(
            "nomAdherent"
        ).value = adherent.nom;

        document.getElementById(
            "contactAdherent"
        ).value = adherent.contact;

        document.getElementById(
            "modalAdherent"
        ).style.display = "flex";

    } catch (error) {

        console.error(
            "Erreur modification adhérent :",
            error
        );

        alert(error.message);
    }

});