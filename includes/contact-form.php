<?php
declare(strict_types=1);

$formId = $formId ?? 'homeContactForm';
$formClass = $formClass ?? 'home-form';
$idPrefix = $idPrefix ?? 'home';
?>
<form class="<?= htmlspecialchars($formClass, ENT_QUOTES, 'UTF-8') ?>" id="<?= htmlspecialchars($formId, ENT_QUOTES, 'UTF-8') ?>" data-contact-form novalidate>
    <input type="hidden" name="csrf_token" value="">
    <input type="hidden" name="_timestamp" value="">
    <div class="home-honeypot" aria-hidden="true">
        <label for="<?= htmlspecialchars($idPrefix, ENT_QUOTES, 'UTF-8') ?>-website">Site web</label>
        <input type="text" id="<?= htmlspecialchars($idPrefix, ENT_QUOTES, 'UTF-8') ?>-website" name="website" tabindex="-1" autocomplete="off">
    </div>

    <div class="home-form-grid">
        <div class="home-form-group">
            <label for="<?= htmlspecialchars($idPrefix, ENT_QUOTES, 'UTF-8') ?>-name">Nom <span aria-hidden="true">*</span></label>
            <input type="text" id="<?= htmlspecialchars($idPrefix, ENT_QUOTES, 'UTF-8') ?>-name" name="name" placeholder="Votre nom" required autocomplete="name" maxlength="100">
        </div>
        <div class="home-form-group">
            <label for="<?= htmlspecialchars($idPrefix, ENT_QUOTES, 'UTF-8') ?>-email">Email <span aria-hidden="true">*</span></label>
            <input type="email" id="<?= htmlspecialchars($idPrefix, ENT_QUOTES, 'UTF-8') ?>-email" name="email" placeholder="votre@email.com" required autocomplete="email" maxlength="254">
        </div>
    </div>

    <div class="home-form-group">
        <label for="<?= htmlspecialchars($idPrefix, ENT_QUOTES, 'UTF-8') ?>-subject">Sujet</label>
        <select id="<?= htmlspecialchars($idPrefix, ENT_QUOTES, 'UTF-8') ?>-subject" name="subject">
            <option value="">Sélectionnez un sujet</option>
            <option value="job">Opportunité CDI</option>
            <option value="freelance">Mission freelance</option>
            <option value="collaboration">Collaboration</option>
            <option value="other">Autre</option>
        </select>
    </div>

    <div class="home-form-group">
        <label for="<?= htmlspecialchars($idPrefix, ENT_QUOTES, 'UTF-8') ?>-message">Message <span aria-hidden="true">*</span></label>
        <textarea id="<?= htmlspecialchars($idPrefix, ENT_QUOTES, 'UTF-8') ?>-message" name="message" rows="4" placeholder="Parlez-moi du poste, de la mission ou de votre besoin..." required maxlength="500"></textarea>
        <span class="home-char-count"><span data-char-count>0</span>/500</span>
    </div>

    <div class="home-privacy">
        <label class="home-consent">
            <input type="checkbox" name="privacy_consent" id="<?= htmlspecialchars($idPrefix, ENT_QUOTES, 'UTF-8') ?>-privacy-consent" value="1" required>
            <span>J’accepte que mes données (nom, email, message) soient traitées pour me recontacter. <span aria-hidden="true">*</span></span>
        </label>
        <details class="home-privacy-details">
            <summary>Informations sur le traitement des données (RGPD)</summary>
            <div class="home-privacy-body">
                <p><strong>Responsable :</strong> Jérémy Tarlié — <a href="mailto:contact@tarlie.fr">contact@tarlie.fr</a></p>
                <p><strong>Finalité :</strong> répondre à votre demande de contact (intérêt légitime / consentement).</p>
                <p><strong>Données :</strong> nom, email, sujet, message — uniquement ce qui est nécessaire.</p>
                <p><strong>Destinataire :</strong> uniquement le responsable du traitement. Pas de revente ni de transfert hors UE.</p>
                <p><strong>Durée :</strong> conservation le temps du traitement de la demande, puis suppression sous 12 mois maximum.</p>
                <p><strong>Droits :</strong> accès, rectification, effacement, opposition, limitation — via contact@tarlie.fr. Réclamation possible auprès de la CNIL.</p>
            </div>
        </details>
    </div>

    <button type="submit" class="home-form-submit">
        <span class="text-default">Envoyer le message</span>
        <span class="text-loading">Envoi en cours...</span>
        <span class="text-success">Message envoyé !</span>
    </button>
</form>
