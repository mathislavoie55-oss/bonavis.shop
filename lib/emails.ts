import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string) {
  try {
    await resend.emails.send({
      from: 'Bonavis <onboarding@bonavis.shop>',
      to: email,
      subject: 'Bienvenue sur Bonavis',
      html: `
        <h1>Bienvenue sur Bonavis</h1>
        <p>Votre compte a été créé avec succès.</p>
        <p>Vous pouvez maintenant gérer vos puces NFC et suivre vos taps depuis votre espace client.</p>
        <a href="https://www.bonavis.shop/dashboard">Accéder à mon espace</a>
      `,
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

export async function sendPurchaseEmail(email: string, plan: string) {
  try {
    await resend.emails.send({
      from: 'Bonavis <orders@bonavis.shop>',
      to: email,
      subject: 'Confirmation de votre abonnement Bonavis',
      html: `
        <h1>Merci pour votre abonnement</h1>
        <p>Votre forfait <strong>${plan}</strong> est maintenant actif.</p>
        <p>Nous allons préparer vos puces NFC et vous les envoyer prochainement.</p>
        <a href="https://www.bonavis.shop/dashboard">Voir mon espace client</a>
      `,
    })
  } catch (error) {
    console.error('Failed to send purchase email:', error)
  }
}
