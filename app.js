// localStorage

let panier =
    JSON.parse(
        localStorage.getItem("panier")
    ) || [];

afficherPanier();

function sauvegarderPanier() {

    localStorage.setItem(

        "panier",

        JSON.stringify(
            panier
        )

    );

}

// Ajouter un produit
function ajouterProduit() {

    const nom =
        document
            .getElementById("nom")
            .value
            .trim();

    const prix =
        parseFloat(
            document
                .getElementById("prix")
                .value
        );

    const quantite =
        parseInt(
            document
                .getElementById("quantite")
                .value
        );

    if (!nom) {

        afficherErreur(
            "Veuillez saisir un produit"
        );

        return;

    }

    if (
        isNaN(prix)
        ||
        prix < 0
    ) {

        afficherErreur(
            "Prix invalide"
        );

        return;

    }

    if (
        isNaN(quantite)
        ||
        quantite < 1
    ) {

        afficherErreur(
            "Quantité invalide"
        );

        return;

    }

    document
        .getElementById(
            "form-error"
        )
        .style.display =
        "none";

    const produit = {

        nom: nom,

        prix: prix,

        quantite: quantite

    };

    panier.push(
        produit
    );

    sauvegarderPanier();

    document
        .getElementById(
            "nom"
        ).value = "";

    document
        .getElementById(
            "prix"
        ).value = "";

    document
        .getElementById(
            "quantite"
        ).value = 1;

    afficherPanier();

    cacherTicket();

}

// Suppression produit

function supprimerProduit(index){

    const position =
        panier.findIndex(
            function(_, i){
                return i === index;
            }
        );

    panier.splice(
        position,
        1
    );

    sauvegarderPanier();

    afficherPanier();

    cacherTicket();

}

// vider le panier
function viderPanier() {

    if (
        panier.length === 0
    ) {
        return;
    }

    panier = [];

    localStorage.removeItem(
        "panier"
    );

    afficherPanier();

    cacherTicket();

}

// calcul du sous total

function calculerSousTotal() {

    return panier.reduce(

        function (total, p) {

            return total +

                (
                    p.prix *
                    p.quantite
                );

        },

        0

    );

}

// Remise

function calculerRemise(total) {

    if (total > 50000) {

        return {

            taux: 10,

            montant:
                total * 0.10

        };

    }

    else if (
        total > 20000
    ) {

        return {

            taux: 5,

            montant:
                total * 0.05

        };

    }

    return {

        taux: 0,

        montant: 0

    };

}

// afficher panier de produit
function afficherPanier() {

    const wrap =
        document.getElementById(
            "panier-wrap"
        );

    if (
        panier.length === 0
    ) {

        wrap.innerHTML = `

<div class="empty-state">

<p>

Votre panier est vide

</p>

</div>

`;

        document
            .getElementById(
                "totaux-wrap"
            )
            .style.display =
            "none";

        document
            .getElementById(
                "actions-wrap"
            )
            .style.display =
            "none";

        return;

    }

    let rows = "";

    panier.forEach(

        function (
            p,
            i
        ) {

            const sousTotal =
                p.prix *
                p.quantite;

            rows += `

<tr>

<td>

${p.nom}

</td>

<td>

${p.quantite}

</td>

<td class="mono">

${p.prix.toFixed(0)}

FCFA

</td>

<td class="mono">

${sousTotal.toFixed(0)}

FCFA

</td>

<td>

<button
class="btn btn-danger"
onclick="supprimerProduit(${i})"
>

✕

</button>

</td>

</tr>

`;

        }

    );

    wrap.innerHTML = `

<div class="table-wrap">

<table>

<thead>

<tr>

<th>

Produit

</th>

<th>

Qté

</th>

<th>

Prix Unitaire

</th>

<th>

Sous-total

</th>

<th>

</th>

</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>

</div>

`;

    const sousTotal =
        calculerSousTotal();

    const remise =
        calculerRemise(
            sousTotal
        );

    const totalNet =
        sousTotal -
        remise.montant;

    document
        .getElementById(
            "affich-subtotal"
        )
        .textContent =

        sousTotal.toFixed(0)
        +
        " FCFA";

    document
        .getElementById(
            "affich-total"
        )
        .textContent =

        totalNet.toFixed(0)
        +
        " FCFA";

    if (
        remise.taux > 0
    ) {

        document
            .getElementById(
                "ligne-remise"
            )
            .style.display =
            "flex";

        document
            .getElementById(
                "taux-remise"
            )
            .textContent =
            "-" + remise.taux + "%";

        document
            .getElementById(
                "affich-remise"
            )
            .textContent =

            remise.montant
                .toFixed(0)
            +
            " FCFA";

    }

    else {

        document
            .getElementById(
                "ligne-remise"
            )
            .style.display =
            "none";

    }

    document
        .getElementById(
            "totaux-wrap"
        )
        .style.display =
        "block";

    document
        .getElementById(
            "actions-wrap"
        )
        .style.display =
        "flex";

}

// ticket

function genererTicket() {

    if (
        panier.length === 0
    ) {
        return;
    }

    const now =
        new Date();

    let nombreArticles = 0;

    panier.forEach(
        function (p) {

            nombreArticles +=
                p.quantite;

        }
    );

    const sousTotal =
        calculerSousTotal();

    const remise =
        calculerRemise(
            sousTotal
        );

    const totalNet =
        sousTotal -
        remise.montant;

    let lignes = "";

    panier.forEach(
        function (p) {

            lignes += `

<div class="ticket-line">

<span>

${p.nom}
x${p.quantite}

</span>

<span>

${(
                    p.prix *
                    p.quantite
                ).toFixed(0)}

FCFA

</span>

</div>

`;

        }
    );

    document
        .getElementById(
            "ticket-contenu"
        )
        .innerHTML = `

<h2>

Ticket

</h2>

<p>

${now.toLocaleString()}

</p>

${lignes}

<hr>

<p>

Nombre articles :

${nombreArticles}

</p>

<p>

Total :

${totalNet.toFixed(0)}

FCFA

</p>

`;

    document
        .getElementById(
            "ticket-section"
        )
        .classList.add(
            "visible"
        );

}

// cacher ticket

function cacherTicket() {

    document
        .getElementById(
            "ticket-section"
        )
        .classList.remove(
            "visible"
        );

}

// erreurs

function afficherErreur(msg) {

    const erreur =
        document
            .getElementById(
                "form-error"
            );

    erreur.textContent =
        msg;

    erreur.style.display =
        "block";

}

document.addEventListener(

    "keydown",

    function (e) {

        if (

            e.key === "Enter"

            &&

            e.target.matches(
                "input"
            )

        ) {

            ajouterProduit();

        }

    }

);