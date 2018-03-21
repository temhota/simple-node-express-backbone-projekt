define(['backbone', 'underscore'], function(Backbone, _) {

document.addEventListener("DOMContentLoaded", function(event) {

    /* Initialisierung von Variablen fürs Modal-Fenster */
    var modal = document.getElementById('modal');
    var modalImg = document.getElementById("modalImg");
    var modalVideo = document.getElementById("modalVideo");
    var modalVideoSrc = document.getElementById("modalVideoSrc");
    var captionText = document.getElementById("caption");

    /**
     * Setzt Eventlistener auf alle Likebuttons /
     * @type {boolean}
     */
    Array.from(document.getElementsByClassName("likeButton")).forEach((likeButton) => {
        likeButton.isLiked = false;
        likeButton.isShared = false;
        likeButton.addEventListener("click", saveLike);
        likeButton.addEventListener("click", saveNotice);
    });

    /**
     * Spreichert Likestatus + Ändert den Like-Button-Zustand
     * @param e : Klick-Event
     */
    function saveLike(e) {
        if (e.offsetX < 40 && e.offsetY < 40) { // wird nur dann angewendet, wenn Like-Buttons oben links gecklickt werden
            changeButtonActivity(this, this.isLiked, "isLiked");
        }
    }

    /**
     * Spreichert Merkstatus + Ändert den Merken-Button-Zustand
     * @param e : Klick-Event
     */
    function saveNotice(e) {
        if (e.offsetX > 220 && e.offsetY > 250) { // wird nur dann angewendet, wenn Merken-Buttons unten rechts gecklickt werden
            changeButtonActivity(this, this.isShared, "isRemembered");
        }
    }

    /**
     * Ändert den Zustand des Buttons
     * @param button
     * @param activity
     * @param classname
     */
    function changeButtonActivity (button, activity, classname) {
        if (button.classList.contains(classname)) {
            button.classList.remove(classname);
            button.activity = false;
        } else {
            button.classList.add(classname);
            button.activity = true;
        }
    }


    /**
     * Setzt Eventlistener auf alle Bilder und Images
     * @likes {number} : Anzahl von Likes
     * @date : Erstellungsdatum
     */
    Array.from(document.getElementsByClassName("item")).forEach((item) => {
        item.likes = 0;
        item.date = new Date(2017,11,17);
        item.addEventListener("click", openModal);
    });

    /**
     * Öffnet das Modal-Fester
     * @param e : Klick-Event
     */
   var openModal = function openModal(e) {
        if ((e.offsetX > 40 || e.offsetY > 40) && (e.offsetX < 220 || e.offsetY < 250)) { // Überlappung mit Like- und Merken-Button wird vermieden
            modal.style.display = "block";
            if (this.tagName == "IMG") {
                modalVideo.style.display = "none";
                modalImg.style.display = "inline-block";
                modalImg.src = this.src;
                captionText.innerHTML =
                    "<p class='description'>" + this.alt + "</p>"
                    + "<p class='left'>Created on: " + this.date.toLocaleDateString()+ "</p>"
                    + "<p class='right'>Likes: " + this.likes + "</p>";

            }
            if (this.tagName == "VIDEO") {
                modalImg.style.display = "none";
                modalVideo.style.display = "inline-block";
                modalVideo.poster = this.poster;
                modalVideo.innerHTML = this.innerHTML;
                captionText.innerHTML =
                    "<p class='description'>Some video description</p>"
                    + "<p class='left'>Created on: " + this.date.toLocaleDateString()+ "</p>"
                    + "<p class='right'>Likes: " + this.likes + "</p>";
            }

        }
        // Hier werden die Likes hochgezählt,
        // nur um zu testen, dass für jedes Bild entsprechendes Attribut mit Werten gibt.
        this.likes++;
    }


    /**
     * Setzt Eventlistener auf <span> Element, das Modalfenster schießt
     */
    var close = document.getElementsByClassName("close")[0];
    close.addEventListener("click", closeModal);

    /**
     * Schließt das Modal-Fester
     * @param e : Klick-Event
     */
    function closeModal(e) {
        modal.style.display = "none";
    }
});

    var testFunction = function (){
        console.log("test");
    }

    var functions = {};
    functions.openModal = this.openModal;
    functions.testFunction = this.testFunction;
    return functions;

});