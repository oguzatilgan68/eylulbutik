// app/(marketing)/lib/emailTemplate.ts

interface EmailWrapperOptions {
  title: string;
  content: string;
  previewText?: string;
}

export function wrapEmailTemplate({ title, content }: EmailWrapperOptions) {
  const currentYear = new Date().getFullYear();
  
  const instagramUrl = "https://www.instagram.com/eylull_butik1";
  const whatsappUrl = "https://wa.me/905064208578"; 
  const address = "Fatih mah. 57, Ziraat Cd. 27 A, Merkez/Aksaray";

  return `
  <!DOCTYPE html>
  <html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Helvetica', 'Arial', sans-serif;
        background-color: #f7f7f7;
        color: #333333;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        border: 1px solid #eaeaea;
      }
      .header {
        background: linear-gradient(135deg, #db2777, #f472b6);
        color: #ffffff;
        text-align: center;
        padding: 30px 20px;
        font-size: 26px;
        font-weight: bold;
        letter-spacing: 0.5px;
      }
      .content {
        padding: 35px 30px;
        font-size: 15px;
        line-height: 1.6;
      }
      .content p {
        margin: 15px 0;
      }
      .button {
        display: inline-block;
        padding: 14px 28px;
        margin: 20px 0;
        background-color: #db2777;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 4px 10px rgba(219, 39, 119, 0.2);
      }
      .footer {
        padding: 25px 20px;
        text-align: center;
        font-size: 13px;
        color: #777777;
        background-color: #fcfcfc;
        border-top: 1px solid #eaeaea;
      }
      .social-links {
        margin-bottom: 15px;
      }
      .social-links a {
        display: inline-block;
        margin: 0 10px;
        color: #db2777;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
      }
      .address {
        font-size: 12px;
        color: #999999;
        margin-top: 8px;
      }
      @media only screen and (max-width: 480px) {
        .email-container {
          width: 95% !important;
          margin: 10px auto;
        }
        .header {
          font-size: 22px !important;
          padding: 20px !important;
        }
        .content {
          padding: 20px 15px !important;
        }
        .button {
          padding: 12px 20px !important;
          display: block;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        Eylül Butik
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <div class="social-links">
          <a href="${instagramUrl}" target="_blank">Instagram</a> | 
          <a href="${whatsappUrl}" target="_blank">WhatsApp Destek</a>
        </div>
        <div class="address">
          ${address}
        </div>
        <p style="margin-top: 15px; font-size: 12px; color: #aaaaaa;">
          &copy; ${currentYear} Eylül Butik. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
}