import moment from "moment";

export default class CookieAuthenticationService{
    static getExpirationTimeOfToken(token){
        let tokenParts = token.split(".");
        let tokenPayload = JSON.parse(atob(tokenParts[1]));
        return moment.unix(tokenPayload.exp)
    }

    static isTokenExpired(token){
        return this.getExpirationTimeOfToken(token).isBefore(moment())
    }
    static  saveToken(token){
        let expiringTime = this.getExpirationTimeOfToken(token.refresh_token);
        let maxAge = expiringTime.diff(moment(),"second");

        let cookie = CookieAuthenticationService.authCookieIdentifier + "=" + btoa(JSON.stringify(token)) + ";max-age=" + maxAge + ";path=/;SameSite=Lax"
        console.log(cookie)
        document.cookie = cookie
    }
    static logout(){
        console.log("logout")
        document.cookie = CookieAuthenticationService.authCookieIdentifier + "=;max-age=0;path=/"
    }

    static restoreToken(){
        let cookiesString = document.cookie;

        let cookiesStrings = cookiesString.split(";");
        let cookies= {};

        cookiesStrings.forEach((cookieString) => {
            const cookie = cookieString.split("=");
            cookies[cookie[0].trim()] = cookie[1];
        });


        return new Promise(
            (resolve,reject )=>{
                window.console.log("Looking for AuthToken");
                if(cookies.hasOwnProperty(CookieAuthenticationService.authCookieIdentifier)){
                    try {
                        const token = JSON.parse(atob(cookies[CookieAuthenticationService.authCookieIdentifier]));
                        resolve(token);
                    }catch (e){
                        window.console.log(e);
                        reject(e)
                    }
                }
                reject();
            }

        );


    }

    static authCookieIdentifier = "authToken";
}