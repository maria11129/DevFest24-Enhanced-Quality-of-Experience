import smtplib, os
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

def send_verification_email(to_email, verification_code):
    your_email = os.getenv('mail')
    print(your_email)
    your_password = os.getenv('password_mail')
    print(your_password)
    msg = MIMEText(f"Your verification code is: {verification_code}")
    msg['Subject'] = 'Email Verification'
    msg['From'] = your_email
    msg['To'] = to_email
    
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(your_email, your_password)
            server.send_message(msg)
        print("Verification email sent successfully.")
    except Exception as e:
        print(f"Failed to send email: {e}")