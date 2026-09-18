/**
 * Branchement de l'assistant conversationnel SETREM.
 *
 * L'URL pointe vers le webhook n8n du workflow « SETREM - Agent
 * conversationnel du site ». Sa construction et sa maintenance sont
 * decrites dans `N8N Workflow/setrem-assistant/INSTALLATION.md`.
 *
 *   POST {sessionId, message, page, locale}
 *   -> 200 {reply: string, chips?: string[]}
 *
 * Tant que l'URL est vide, le panneau reste visible mais annonce
 * franchement son indisponibilite et renvoie vers le telephone et le
 * formulaire de contact. Il ne fait jamais semblant d'avoir repondu.
 *
 * Cette URL est publique par nature : c'est le navigateur du visiteur qui
 * l'appelle. La protection se joue cote n8n (origines autorisees, plafond
 * de 20 messages par heure et par conversation, 40 par IP), pas ici.
 *
 * La demande de rappel ne passe pas par une URL separee : l'agent dispose
 * d'un outil qui envoie l'e-mail lui-meme, une fois qu'il a recueilli le
 * nom et un moyen de joindre le visiteur.
 */
export const assistantConfig = {
  chatWebhook: 'https://ordinia.app.n8n.cloud/webhook/chat-setrem',
} as const;

/**
 * Branchement du formulaire de contact.
 *
 * Les pages /contact et /en/contact postent ici, en POST natif : sans
 * JavaScript la page doit rester complete. Un POST de formulaire est une
 * navigation, il n'est donc pas soumis au CORS, et n8n repond par une
 * redirection 303 vers /contact/merci ou /en/contact/thank-you selon le
 * champ cache `locale`.
 *
 * Le workflow s'appelle « SETREM - Formulaire de contact du site » et se
 * regenere avec `N8N Workflow/setrem-assistant/construire-formulaire.py`.
 *
 * Le champ cache `site_web` est un piege a robots : aucun humain ne le
 * voit, un robot le remplit, et n8n redirige alors sans rien envoyer.
 */
export const contactConfig = {
  webhook: 'https://ordinia.app.n8n.cloud/webhook/contact-setrem',
} as const;
