let title = document.getElementById('title')
var change = 0;
changeTitle()

function changeTitle() {


    setTimeout(function() {
        $("#title").fadeOut(2000, function() {
            if (change === 0) {
                title.innerHTML = "Je m'appelle Jérémy et je suis   Programmeur web / web mobile"

                title.style.top = "20%"
                $("#title").fadeIn(2000)
            }

            if (change === 1) {
                title.innerHTML = "N'hésitez pas à vous balader sur le site pour découvrir ce qu'il propose"

                title.style.top = "20%"
                $("#title").fadeIn(2000)
            }

            if (change === 2) {
                title.innerHTML = "<ul><li>Mes Expériences</li><li>Mon Parcour</li><li>Mes créations</li></ul>"

                title.style.top = "20%"
                $("#title").fadeIn(2000)
            }

            if (change === 3) {
                title.innerHTML = "Bonjour et bienvenue sur mon site"

                title.style.top = "30%"
                $("#title").fadeIn(2000)
                change = -1
            }



            change++;
            changeTitle()
        })
    }, 4000)
}




if (document.documentElement.clientWidth >= 726) {
    myFunction()
    window.onscroll = function() { myFunction() };
}
var scroll = []

var container = document.getElementById('container')
    // container.style.opacity = 0
var i = 0

function myFunction() {
    var winScroll = document.body.scrollLeft || document.documentElement.scrollLeft;
    var height = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    var scrolled = (winScroll / height) * 100;


    if (scrolled >= 25) {
        $("#title_Presentation").fadeIn(1000, function() {
            $("#description_presentation").fadeIn(1000, function() {
                $("#title_Site").fadeIn(1000, function() {
                    $("#description_site").fadeIn(1000, function() {
                        $("#site1").fadeIn(2000, function() {
                            $("#site2").fadeIn(2000, function() {
                                $("#site3").fadeIn(2000, function() {

                                });
                            });
                        });
                    });
                });
            });
        });
    }


    if (scrolled >= 47) {
        $("#title_competence").fadeIn(1000, function() {
            $("#description_competence").fadeIn(1000, function() {
                $("#img-html").fadeIn(1000, function() {
                    $("#img-php").fadeIn(1000, function() {
                        $("#img-mysql").fadeIn(1000, function() {
                            $("#img-bootstrap").fadeIn(1000, function() {
                                $("#img-symfony").fadeIn(1000, function() {
                                    $("#img-node").fadeIn(1000, function() {
                                        $("#img-vue").fadeIn(1000, function() {
                                            $("#img-react").fadeIn(1000, function() {

                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }


    if (scrolled >= 60) {
        $("#title_parcour").fadeIn(1000, function() {
            // var spanWidth = $('#title_parcour span').width();
            // $('#title_parcour').animate({ width: spanWidth }, 3000);
            $("#description_parcour").fadeIn(1000, function() {

                $("#parcour_scolaire").fadeIn(1000, function() {
                    $("#parcour_pro").fadeIn(1000, function() {});
                });
            });
        });
    }


    if (scrolled >= 90) {
        $(".section-header").fadeIn(1000, function() {
            $("#contact-form").fadeIn(1000, function() {
                $(".direct-contact-container").fadeIn(1000, function() {

                });
            });
        });
    }


    var i = height * scrolled / 100



    document.getElementById("myBar").style.width = scrolled + "%";
}



window.addEventListener("wheel", event => {
    const delta = Math.sign(event.deltaY);
    const delta2 = Math.sign(event.deltaX);

    var height = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    if ((delta > 0 || delta2 > 0) && i <= height) {
        i += 50;
    }

    if ((delta < 0 || delta2 < 0) && i >= 25) {
        i -= 50;
    }

    if (document.documentElement.clientWidth >= 726) {
        window.scrollTo(i, 0)
    }
});

window.addEventListener('mouseup', () => {
    var winScroll = document.body.scrollLeft || document.documentElement.scrollLeft;
    i = winScroll
});




let liste_caroussel = ['Home', 'Presentation', 'Competence', 'Parcour', 'Contact']

$('#prev').click(function(e) {
    e.preventDefault();
    var winScroll = document.body.scrollLeft || document.documentElement.scrollLeft;
    var height = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    var scrolled = (winScroll / height) * 100;
    let prev = document.getElementById('prev')

    if (scrolled <= 26) {
        prev.setAttribute('href', '#' + liste_caroussel[0])
        document.location = $('#prev').attr('href');
    }


    if (scrolled > 26 && scrolled < 51) {
        prev.setAttribute('href', '#' + liste_caroussel[1])
        document.location = $('#prev').attr('href');
    }

    if (scrolled >= 51 && scrolled < 76) {
        prev.setAttribute('href', '#' + liste_caroussel[2])
        document.location = $('#prev').attr('href');
    }

    if (scrolled >= 76) {
        prev.setAttribute('href', '#' + liste_caroussel[3])
        document.location = $('#prev').attr('href');
    }
});





$('#next').click(function(e) {
    e.preventDefault();
    var winScroll = document.body.scrollLeft || document.documentElement.scrollLeft;
    var height = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    var scrolled = (winScroll / height) * 100;
    let next = document.getElementById('next')

    if (scrolled <= 24) {
        next.setAttribute('href', '#' + liste_caroussel[1])
        document.location = $('#next').attr('href');
    }


    if (scrolled > 24 && scrolled < 49) {
        next.setAttribute('href', '#' + liste_caroussel[2])
        document.location = $('#next').attr('href');
    }

    if (scrolled >= 49 && scrolled < 74) {
        next.setAttribute('href', '#' + liste_caroussel[3])
        document.location = $('#next').attr('href');
    }

    if (scrolled >= 74) {
        next.setAttribute('href', '#' + liste_caroussel[4])
        document.location = $('#next').attr('href');
    }
});


$("#linkedin").click(function(e) {
    e.preventDefault();

    window.open("https://fr.linkedin.com/in/j%C3%A9r%C3%A9my-tarli%C3%A9-89422a1a1", '_blank');
});


$("#github").click(function(e) {
    e.preventDefault();

    window.open("https://github.com/Jeremy-Tarlie", '_blank');
});


$("#download").click(function(e) {
    e.preventDefault();

    window.open("https://tarlie.fr//assets/file/CV-Tarlie-Jeremy.pdf", '_blank');
});



function form(name, email, message) {
    let message_submit = document.getElementById('message-submit')
    let i = 0

    while (i < message_submit.classList.length) {
        if (message_submit.classList[i] === "error") {
            message_submit.classList.remove('error')
        }
        if (message_submit.classList[i] === "success") {
            message_submit.classList.remove('success')
        }

        i++
    }
    message_submit.innerHTML = "";

    
    $.ajax({
        type: "post",
        url: "validator.php",
        data: { name: name.value, email: email.value, message: message.value },
        success: function(contenu) {
            if (contenu === "successsuccess") {
                message_submit.classList.add('success')
                message_submit.innerHTML = "Votre message à été envoyer"
                
            } else if (contenu === "error-senderror-send") {
                message_submit.classList.add('error')
                message_submit.innerHTML = "Il y a eu une erreur lors de l'envoie, veuiller réessayer"
                
            } else if (contenu === "error-input") {
                message_submit.classList.add('error')
                message_submit.innerHTML = "Votre message ne c'est pas envoyer car un champ ou des champs doivent être vide(s), veiller tout complêté"
                
            } else if (contenu === "mail-no-valid") {
                message_submit.classList.add('error')
                message_submit.innerHTML = "Désolé le mail que vous avez mis n'est pas valide"
                
            } else if (contenu === "no-hack") {
                message_submit.classList.add('error')
                message_submit.innerHTML = "Merci de ne pas essayer de mettre du code dans le formulaire de contact"
                
            }
        },
        error: function(responce) {
            console.error(responce)
        }
    });
}



