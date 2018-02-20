/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var fini=false;		// true si le jeu est terminé
var nouveau = false;
var indiceNouveau = 0;
            
var nbCartons = 3;
var cartab0 = new Array();

var cartab1 = {
    name: "carton1",
    identifiant: 1,
    couleur: "#0166FF",
    numeros: [18,41,56,67,83,2,37,61,76,88,15,20,44,52,72],
    compteur:[0,0,0]
};
var cartab2 = {
    name: "carton2",
    identifiant: 2,
    couleur: "#019934",
    numeros: [4,31,41,76,85,11,21,48,60,82,8,25,34,54,75],
    compteur: [0,0,0]
};
var cartab3 = {
    name: "carton3",
    identifiant: 3,
    couleur: "#008194",
    numeros: [19,22,45,63,77,5,24,38,51,71,12,30,49,66,89],
    compteur: [0,0,0]
};
var cartab4 = {
    name: "carton4",
    identifiant: 4,
    couleur: "#5731BA",
    numeros: [11,36,59,69,87,19,23,41,55,74,7,22,44,62,81],
    compteur: [0,0,0]
};


// Gère tous les traitements à faire lorsqu'on appuie sur une touche
function proposer(element) {

    // Si la couleur de fond est lightgreen, c'est qu'on a déjà essayé - on quitte la fonction
    if (element.style.backgroundColor === "lightgreen" || fini) return;
    
    // On récupère le numéro clavier et 
    // On met la touche en lightgreen (pour signaler qu'elle a été cliquée)
    var numero = parseInt(element.innerHTML);
    changeCouleur(element,"lightgreen");



    if (nouveau) {
        remplirNouvelle(numero);
    }
    else {
        for (var i = 1; i <= nbCartons; i++) { // On balaye tous les cartons remplis
            
            // On cherche le numéro dans le carton
            var cartabI = eval("cartab"+i);
            var indI = cartabI.numeros.indexOf(numero);
            
            if (indI !== -1) {
                var ind1 = parseInt(numero/10); // On récupère la colonne (par la dizaine)
                var ind2 = parseInt(indI/5);    // On récupère la ligne (par groupe de 5)
                var indice = 100*i + ind2*10 + ind1;
                // puis on le coche
                changeCouleur(document.getElementById(indice), "tomato");

                // Incrémentation de la ligne
                cartabI.compteur[parseInt(indI/5)]++;
                // Mesure de l'avancement des quines ou du carton plein
                var radio = Array.from(document.querySelectorAll('fieldset input'));
                var partie = radio.length && radio.find(r => r.checked).id;
                switch (partie) {
                    case 'quine':
                        for (var q in cartabI.compteur) {
                            if (cartabI.compteur[q] === 5) { //Nombre de numéros à trouver pour une quine
                                afficherModal("Quine"); // Texte du modal
                                document.getElementById('cartonP').checked = true;
                            }
                        }
                        break;
                    case 'dQuine':
                        
                        break;
                    case 'cartonP':
                        var tot = 0;
                        for (var q in cartabI.compteur) {
                           tot += cartabI.compteur[q];
                        }
                        if (tot === 15) { //Nombre de numéros à trouver pour un carton plein
                            afficherModal("Carton plein"); // Texte du modal
                            fini = true; //Fin de la partie
                        }
                        break;
                }
            }
        }
    }
}

// Permet de changer la couleur des touches de la grille
function changeCouleur(element, couleur) {
        element.style.backgroundColor = couleur;
}

function afficherModal(quineOUcarton) {
    document.getElementById('textModal').innerHTML = quineOUcarton; // Texte du modal
    document.getElementById('modalGagne').style.display = "block";  // Affichage du modal
    gagne=new Audio("gagne.mp3");   // Chargement du son
    gagne.play();                   // Envoi du son
}
            // When the user clicks on <span> (x), close the modal
//            span.onclick = function() {
//                modal.style.display = "none";
//            };

            // When the user clicks anywhere outside of the modal, close it
//            window.onclick = function(event) {
//                if (event.target === modal) {
//                    modal.style.display = "none";
//                }
//            };


// Nouveau carton ==============================================================
// Déclenché à l'appui sur le bouton "Nouveau"----------------------------------
function nouveauCarton() {
    nouveau = true;
    document.getElementById('menuNouveau').style.display = "block";
    document.getElementById('carton0').style.display = "block";
    document.getElementById('0').style.backgroundColor = "LightBlue";
}

function creerNouvelle(i) {
    document.write("<td id=\"" + i + "\">" + "?" + "</td>");
}

function remplirNouvelle(num) {
    // enregistrement des numéros dans le tableau 0
    cartab0.push((num < 10) ? "0" + num : num );
    // Remplissage des cases soit par une div (0, vide) soit par le numéro
    if (num === 0) {
        document.getElementById(indiceNouveau).innerHTML = "<div>'0'</div>";
    }
    else {
        document.getElementById(indiceNouveau).innerHTML = num;
    }
    // La case repasse en blanc
    document.getElementById(indiceNouveau).style.backgroundColor = "white";
    indiceNouveau++; // L'indice avance d'un case
    if (indiceNouveau === 9) {// Si le tableau est rempli, on propose de valider          9=>27
            document.getElementById('btnValideNouveau').style.backgroundColor = "red";
    } else {// Sinon la nouvelle case est coloriée
    document.getElementById(indiceNouveau).style.backgroundColor = "LightBlue";
    }
};

function corrigerNouvelle(num) {
    if (indiceNouveau === 0) return ; // voir avec carton0.length
    if (cartab0[cartab0.length -1] !== 0) {
        document.getElementById("G" + cartab0[cartab0.length -1]).style.backgroundColor = "white";
    }
    cartab0.pop();
    document.getElementById(indiceNouveau).style.backgroundColor = "white";
    indiceNouveau--;
    document.getElementById(indiceNouveau).innerHTML = "?";
    document.getElementById(indiceNouveau).style.backgroundColor = "lightyellow";
}

function validerNouveau() {
    eval("var cartab" + nbCartons + "= new Array;");
    for (var i = 0; i < cartab0.length; i++) {
        eval("cartab" + nbCartons +"[i] = cartab0[i];");
    }
    construireCarton(eval("cartab" + nbCartons));
}

// Constitution des éléments ===================================================
    // Grille de pointage-------------------------------------------------------
    function grillePointage() {
        document.write("<table id='pointage'>");
        for (var i = 0; i < 10; i++) {
            document.write("<tr>");
            document.write("<td id=\"G0" + i + "\" onclick=\"proposer(this);\">" + i + "</td>");
            for (var j = 1; j < 9; j++) {
                document.write("<td id=\"G" + j + i +"\" onclick=\"proposer(this);\">" + j + i + "</td>");
            }
            document.write("</tr>");
        }
        document.write("</table>");
        
        // Pour la première case, on rectifie l'ID et la valeur
        document.getElementById('G00').id = "G90";
        document.getElementById('G90').innerHTML = "90";
    }
    
//    function construireCarton(carton) {
//        var divN = document.createElement("div");
//            divN.id = "carton" + nbCartons;
//            divN.className = "carton";
//            divN.style = "color: #008194";
//            
//        var tabN = document.createElement("table");
//        tabN.innerHTML = construireTab(carton);
//        divN.appendChild(tabN);
//        
//        var divS = document.getElementById("cartons");
//        var div0 = divS.firstChild;
//        
//        divS.insertBefore(divN, div0.nextSibling);
//    }
    
    function dessinerCarton(cartab) {
        document.write("<div id=\""+cartab.name+"\" class=\"carton\" style=\"color: "+cartab.couleur+"\">");
        document.write("<table>");
        var j = 0;
        for (var l = 0; l < 3; l++) {   // 3 lignes
            document.write("<tr>");     //début de ligne
            max = 10;
            for (var i = 0; i < 9; i++) { // 9 cases par ligne
                var y = (l<1) ? "0"+i : l*10 + i; // Numérotation des cases (id)
                var finDeLigne = (j >= (l+1)*5);    // pour remplir les cases vides en fin de lignes
                if (finDeLigne || cartab.numeros[j] >= max && cartab.numeros[j] !== 90) {
                    document.write("<td id=\"" + cartab.identifiant + y + "\"><div>'0'</div></td>");
                } else {
                    document.write("<td id=\"" + cartab.identifiant + y + "\">" + cartab.numeros[j] + "</td>");
                    j++;
                }
                max += 10;
            }
            document.write("</tr>");    //fin de ligne
        }
        document.write("</table>");
        document.write("</div>");
    }