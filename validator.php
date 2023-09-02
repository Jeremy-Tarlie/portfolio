<?php

$erreur = false;
$mail_valid = true;
$hack = false;

if (!empty($_POST)) {
    // var_dump($_POST);
     if (empty($_POST['name'])) {
          $erreur = true;
     } else if (empty($_POST['email'])) {
          $erreur = true;
     } else if (empty($_POST['message'])) {
          $erreur = true;
     } else if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
          $mail_valid = false;
     } else if ((!strip_tags($_POST['email']))  && (!strip_tags($_POST['message'])) && (!strip_tags($_POST['name']))){
          $hack = true;
     }
}



if (!$erreur && $mail_valid && !$hack) {
     $from = trim(strip_tags($_POST['email']));
     
     $message = trim(strip_tags($_POST['message']));
     $name = trim(strip_tags($_POST['name']));
     
     $name = preg_replace('#[^a-z]#i',"",$name);
     
     
     
     $i = 0;
     $message = $message." <br><br> De la part de ".$name. ' (email : '. $from . ')';

     sendMail($from,"jeremy.tarlie@gmail.com", null, null, 'Message sur le site', $message, null); 
     sendMail($from,"contact@tarlie.fr", null, null, 'Message sur le site', $message, null); 
     
} else if ($erreur) {
    
     echo "error-input";
     $mail_valid = true;
     $hack = true;
} else if (!$mail_valid) {
    echo "mail-no-valid";
    $hack = true;
} else if(!$hack){
    echo "no-hack";
}


function sendMail($envoimailFrom,$envoimailTo,$CC,$BCC,$sujet,$body,$fichier)
{
     $i = 0;
if (!preg_match("#^[a-z0-9._-]+@(hotmail|live|msn).[a-z]{2,4}$#", $envoimailTo)) { // On filtre les serveurs qui présentent des bogues.
        $passage_ligne = "\r\n";
    } else {
        $passage_ligne = "\n";
    }
    //=====Déclaration des messages au format texte et au format HTML.
    $message_txt = $body;
    //$contenu = str_replace("\n", "<br> \n", $contenu);
    $message_html = "<html><head>
</head><body>" . $body . "</body></html>";
    //=====Lecture et mise en forme des pièces jointes
    if(!empty($fichier))
    {
     while ($i < count($fichier['name'])) {
          $file[$i] =$fichier['name'][$i];
          $fichierOpen = fopen($fichier['tmp_name'][$i], "r");
          $attachement[$i] = fread($fichierOpen, filesize($fichier['tmp_name'][$i]));
          $attachement[$i] = chunk_split(base64_encode($attachement[$i]));
          fclose($fichierOpen);
          $i++;
     }

    }
   
    //=====Création de la boundary.
    $boundary = "-----=" . md5(rand());
    $boundary_alt = "-----=" . md5(rand());
    //=====Création du header de l'e-mail.
    $header = "From: " . $envoimailFrom . "" . $passage_ligne;
    $header.= "Reply-to: " . $envoimailFrom . "" . $passage_ligne;
    if(!empty($CC))
    {
    $header.= "CC: " . $CC . "" . $passage_ligne;
    }
    if(!empty($BCC))
    {
    $header.= "BCC: " . $BCC . "" . $passage_ligne;
    }
    $header.= "MIME-Version: 1.0" . $passage_ligne;
    $header.= "Content-Type: multipart/mixed;" . $passage_ligne . " boundary=\"$boundary\"" . $passage_ligne;
    //=====Création du message.
    $message = $passage_ligne . "--" . $boundary . $passage_ligne;
    $message.= "Content-Type: multipart/alternative;" . $passage_ligne . " boundary=\"$boundary_alt\"" . $passage_ligne;
    $message.= $passage_ligne . "--" . $boundary_alt . $passage_ligne;
    //=====Ajout du message au format texte.
    $message.= "Content-Type: text/plain; charset=\"ISO-8859-1\"" . $passage_ligne;
    $message.= "Content-Transfer-Encoding: 8bit" . $passage_ligne;
    $message.= $passage_ligne . $message_txt . $passage_ligne;
    //==========
 
    $message.= $passage_ligne . "--" . $boundary_alt . $passage_ligne;
 
    //=====Ajout du message au format HTML.
    $message.= "Content-Type: text/html; charset=\"ISO-8859-1\"" . $passage_ligne;
    $message.= "Content-Transfer-Encoding: 8bit" . $passage_ligne;
    $message.= $passage_ligne . $message_html . $passage_ligne;
    //=====On ferme la boundary alternative.
    $message.= $passage_ligne . "--" . $boundary_alt . "--" . $passage_ligne;
    //==========
    $message.= $passage_ligne . "--" . $boundary . $passage_ligne;
 
    //=====Ajout des pièces jointes 
    if(!empty($fichier))
    {
          $i = 0;
          while ($i < count($fichier['name'])) {
              $message.= "Content-Type: " . $fichier['type'][$i] . "; name=\"" . $file[$i] . "\"" . $passage_ligne;
              $message.= "Content-Transfer-Encoding: base64" . $passage_ligne;
              $message.= "Content-Disposition: attachment; filename=\"" . $file[$i] . "\"" . $passage_ligne;
              $message.= $passage_ligne . $attachement[$i] . $passage_ligne . $passage_ligne;
              $message.= $passage_ligne . "--" . $boundary . $passage_ligne;
              $i++;
          }
    }
   
    //=====Envoi de l'e-mail.
    if(mail($envoimailTo, $sujet, $message, $header,"-f".$envoimailFrom)){
         echo "success";
    } else {
         echo "error-send";
    }
}