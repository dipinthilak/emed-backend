export interface IMailer {
    sendMail(to: string, otp: string): any;
}

