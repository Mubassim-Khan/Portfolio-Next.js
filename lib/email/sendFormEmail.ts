import emailjs from "@emailjs/browser";

// For Contact Form
export const sendFormEmail = async (
  templateId: string,
  form: HTMLFormElement
): Promise<{ success: boolean }> => {
  try {
    await emailjs.sendForm(
      process.env.NEXT_PUBLIC_SERVICE_ID!,
      templateId,
      form,
      { publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY! }
    );
    return { success: true };
  } catch (err) {
    console.error("EmailJS Form Error:", err);
    return { success: false };
  }
};
