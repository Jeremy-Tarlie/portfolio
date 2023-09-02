<!DOCTYPE html>
<html lang="fr">

<head>
   <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="Je suis un developpeur web, je fais des site internet, je suis à votre disposition pour plus d'information">
    <meta name="keywords" content="Tarlié, développeur web, web designer, créateur de site web, site web, Tarlié Jérémy, Jérémy, tarlie.fr, tarlie, tarlié, tarlie jérémy">
    <meta name="author" content="Tarlié Jérémy">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="all" />
    <title>Jérémy Tarlié</title>
    <link rel="stylesheet" href="./assets/css/style.css">
    <link rel="stylesheet" href="./assets/css/fond.css">
    <link rel="stylesheet" href="./assets/css/contact.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==" crossorigin="anonymous" referrerpolicy="no-referrer"
    />
     <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="js/jquery.mousewheel.js"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-82LBNWRR60"></script>
    <script async src="./webhook.js"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'your_token');
    </script>
    <script src="https://www.google.com/recaptcha/"></script>


</head>

<body onscroll="scroll()">
    <div id="all">

        <nav>
            <ul class="menu-ul">
                <li class="menu-li"><a href="#Presentation">Présentation</a></li>
                <li class="menu-li"><a href="#Competence">Compétence</a></li>
                <li class="menu-li"><a href="#Parcour">Parcours</a></li>
                <li class="menu-li"><a href="#Contact">Contact</a></li>
            </ul>
            <div class="progress-container">
                <div class="progress-bar" id="myBar"></div>
            </div>
        </nav>
        <main id="container">


            <div class="slide one" id="Home">
                <ul class="background">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <h1 id="title">Bonjour et bienvenue sur mon site</h1>
                <div id="triangle_haut"></div>
                <div id="triangle_bas"></div>
            </div>
            <div class="slide two" id="Presentation">
                <h1 id="title_Presentation">Présentation</h1>
                <p id="description_presentation">Bienvenue sur mon portfolio, je me présente, je m'appelle Jérémy Tarlié, j'ai 23 ans et je suis développeur web. Je suis quelqu'un d'autonome, curieux, travailleur, passionné par la programmation et j'ai aussi l'esprit d'équipe. Je suis
                    à la recherche d'un emploi, dans le secteur du développement web. Je suis à votre disponibilité pour plus d'information.</p>
                <h1 id="title_Site">Mes créations de sites</h1>
                <p id="description_site">Vous pouvez voir ci dessous les sites web que j'ai créer, avec une description de quel genre de site sagit-il.</p>
                <div class="site" id="site1">
                    <p>Portfolio : <a href="https://tarlie.fr" target="_blank" rel="noopener noreferrer" class="link-site">Cliquez ici</a></p>
                    <p>Mon Portfolio est mon site internet qui permet à vous et aux autres utilisateurs de mieux me connaitre, de connaitre mon parcours, mes expériences, mes compétences et de pouvoir de me contacter.</p>
                </div>
                <div class="site" id="site2">
                    <p>Just3d : <a href="http://tarlie.fr/just3d/public/" target="_blank" rel="noopener noreferrer" class="link-site">Cliquez ici</a></p>
                    <p>Just3d est un site E-commerce, pour vendre ou acheter des fichiers d'objet 3d, pour pouvoir les utiliser pour la création de jeu vidéo, pour la présentation d'un projet en 3d ou juste pour une impression 3d.</p>
                </div>
                <div class="site" id="site3">
                    <p>Sudoku : <a href="http://tarlie.fr/sudoku/" target="_blank" rel="noopener noreferrer" class="link-site">Cliquez ici</a></p>
                    <p>J'ai fais un sudoku en React.js, avec plusieur niveau de difficulté, qui fonctionne avec le pad ou en cliquant sur les chiffres.</p>
                </div>

            </div>
            <div class="slide three" id="Competence">
                <h1 id="title_competence">Compétences</h1>
                <p id="description_competence">Vous pouvez trouver ci-dessous les langages et les frameworks que j'ai appris lors de ma formation ainsi qu'en autodidacte. </p>
                <div class="img-group">
                    <img src="./assets/img/html_logo-removebg-preview.png" alt="html_css_js.png" id="img-html">
                    <img src="./assets/img/php_logo-removebg-preview.png" alt="php.png" id="img-php">
                    <img src="./assets/img/logo_mysql-removebg-preview.png" alt="mysql.png" id="img-mysql">
                    <img src="./assets/img/bootstrap_logo-removebg-preview.png" alt="bootstrap.png" id="img-bootstrap">
                    <img src="./assets/img/symfony_logo-removebg-preview.png" alt="symfony.png" id="img-symfony">
                    <img src="./assets/img/node_logo-removebg-preview.png" alt="nodejs.png" id="img-node">
                    <img src="./assets/img/vue.png" alt="vue.png" id="img-vue">
                    <img src="./assets/img/react.png" alt="react.png" id="img-react">
                </div>
            </div>
            <div class="slide four" id="Parcour">
                <h1 id="title_parcour"><span>Parcours</span></h1>
                <p id="description_parcour">Vous pouvez voir ci-dessous tout mon parcours professionnel et scolaire.</p>
                <div id="parcour_scolaire" class="parcour">
                    <h1 id="title_parcour_scolaire">Parcours Scolaire</h1>
                    <p>Obtention du BAC STI2D au lycée Pablo Néruda, DIEPPE 76200 | 2017</p>
                    <p>L1 IEEA, Licence Informatique à l'UFR des sciences et techniques, Madrillet, Saint-Étienne du Rouvray | 2017-2019</p>
                    <p>Obtention du certificat de développeur web/web mobile, WebForce 3 | 2021</p>
                </div>
                <div id="parcour_pro" class="parcour">
                    <h1 id="title_parcour_pro">Parcours professionnel</h1>
                    <p>Sup'Interim, manutentionnaire en intérim | 2019-2023</p>
                    <p>Carbon Décor, ouvrier | 2022</p>
                    <p>Oxygène, développeur web (création d'une base de données) | 2021</p>
                </div>
            </div>
            <div class="slide five" id="Contact">
                <section id="contact">

                    <h1 class="section-header">Contact</h1>

                    <div class="contact-wrapper">

                        <!-- Left contact page -->

                        <form id="contact-form" class="form-horizontal" role="form" action="javascript:form(nom, email, message);" method="post">
                            <h1 id="title_send">Envoyer un message</h1>
                            <div class="form-group">
                                <div class="col-sm-12">
                                    <input type="text" class="form-control" id="nom" placeholder="NOM ET PRÉNOM" name="nom" value="" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="col-sm-12">
                                    <input type="email" class="form-control" id="email" placeholder="EMAIL" name="email" value="" required>
                                </div>
                            </div>

                            <textarea class="form-control" rows="10" placeholder="MESSAGE" name="message" id="message" required></textarea>

                            <button class="btn btn-primary send-button" id="submit" type="submit" value="SEND">
                                
                              <div class="alt-send-button">
                                <i class="fa fa-paper-plane" style="margin-top: 10px;"></i><span class="send-text">SEND</span>
                              </div>
                            
                            </button>
                            <p id="message-submit" class="center"></p>
                        </form>

                        <!-- Left contact page -->

                        <div class="direct-contact-container">

                            <ul class="contact-list">
                                <li class="list-item"><i class="fa fa-map-marker fa-2x"><span class="contact-text place"><a href="https://goo.gl/maps/eARKzrvtWVdsfwru5" target="_blank" rel="noopener noreferrer">Dieppe, Normandie, France</a></span></i></li>

                                <li class="list-item"><i class="fa fa-phone fa-2x"><span class="contact-text phone"><a href="tel:06-72-61-79-96" title="Give me a call">06 72 61 79 96</a></span></i></li>

                                <li class="list-item"><i class="fa fa-envelope fa-2x"><span class="contact-text gmail"><a href="mailto:contact@tarlie.fr" title="Send me an email">contact@tarlie.fr</a></span></i></li>

                            </ul>

                            <hr>
                            <ul class="social-media-list">
                                <li id="linkedin">
                                    <a href="https://fr.linkedin.com/in/j%C3%A9r%C3%A9my-tarli%C3%A9-89422a1a1" target="_blank" class="contact-icon">
                                        <i class="fa-brands fa-linkedin" aria-hidden="true"></i></a>
                                </li>
                                <li id="github">
                                    <a href="https://github.com/khraii" target="_blank" class="contact-icon">
                                        <i class="fa-brands fa-github" aria-hidden="true"></i></a>
                                </li>
                                <li id="download">
                                    <a href="https://tarlie.fr//assets/file/CV-Tarlie-Jeremy.pdf" target="_blank" class="contact-icon">
                                        <i class="fa-solid fa-download" aria-hidden="true"></i></a>
                                </li>
                            </ul>
                            <hr>

                            <div class="copyright">&copy;Jérémy Tarlié</div>

                        </div>

                    </div>

                </section>


            </div>
            <a id="prev" href="#">&#10094;</a>
            <a id="next" href="#">&#10095;</a>
        </main>
        <footer>
            <svg viewBox="0 -20 700 110" width="75%" height="110" preserveAspectRatio="none">
              <path transform="translate(0, -20)" d="M0,8 c80,-22 240,0 350,18 c90,17 260,7.5 350,-20 v50 h-700" fill="#CEB964" />
              <path d="M0,12 c80,-18 230,-12 350,7 c80,13 260,17 350,-5 v100 h-700z" fill="#00273F" />
            </svg>
            <svg viewBox="0 -20 700 110" width="100%" height="110" preserveAspectRatio="none">
                <path transform="translate(0, -20)" d="M0,10 c80,-22 240,0 350,20 c90,17 260,7.5 350,-20 v50 h-700" fill="#CEB964" />
                <path d="M0,14 c80,-18 230,-12 350,5 c80,13 260,17 350,-5 v100 h-700z" fill="#00273F" />
              </svg>
            <svg viewBox="0 -20 700 110" width="100%" height="110" preserveAspectRatio="none">
                <path transform="translate(0, -20)" d="M0,10 c80,-22 240,0 350,20 c90,17 260,7.5 350,-20 v50 h-700" fill="#CEB964" />
                <path d="M0,14 c80,-18 230,-12 350,5 c80,13 260,17 350,-5 v100 h-700z" fill="#00273F" />
              </svg>
            <svg viewBox="0 -20 700 110" width="100%" height="110" preserveAspectRatio="none">
                <path transform="translate(0, -20)" d="M0,10 c80,-22 240,0 350,20 c90,17 260,7.5 350,-20 v50 h-700" fill="#CEB964" />
                <path d="M0,14 c80,-18 230,-12 350,5 c80,13 260,17 350,-5 v100 h-700z" fill="#00273F" />
              </svg>
        </footer>
    </div>
</body>


<script src="./assets/js/main.js"></script>
<script>
    window.onload = function() {
        var slide = document.getElementsByClassName("slide");
        var hauteurFenetre = window.innerHeight - 45; 
        
        var i = 1;
        while(i <= slide.length){
            slide[i].style.height = hauteurFenetre + "px";
            i++;
        }
        
        
    };
</script>



</html>

