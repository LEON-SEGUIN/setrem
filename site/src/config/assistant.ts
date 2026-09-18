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
