import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UsuarioModel } from '../models/app.models';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
    private apiKey = 'AIzaSyA4DAb5UCPOruuRvnDZrDYVR7UxaCKGoWs';

    userToken: string;

    constructor(private http: HttpClient) { 
        this.leerToken();
    }
    
    nuevoUsuario (user: UsuarioModel) {
        const authData = {
            ...user,
            returnSecureToken: true
        };

        return this.http.post(`${this.url}signUp?key=${this.apiKey}`, authData).pipe(
            map(resp => {
                this.guardarToken(resp['idToken']);
                return resp;
            })
        );
    }

    login (user: UsuarioModel) {
        const authData = {
            ...user,
            returnSecureToken: true
        };

        return this.http.post(`${this.url}signInWithPassword?key=${this.apiKey}`, authData).pipe(
            map(resp => {
                this.guardarToken(resp['idToken']);
                return resp;
            })
        );
    }

    logout (){
        localStorage.removeItem('token');
    }

    guardarToken (idToken: string){
        this.userToken = idToken;
        localStorage.setItem('token', idToken);

        let hoy = new Date();
        hoy.setSeconds(3600);

        localStorage.setItem('expira', hoy.getTime().toString())
    }

    leerToken(){
        if(localStorage.getItem('token'))
            this.userToken = localStorage.getItem('token');
        else    
            this.userToken = '';
        
        return this.userToken;
    }

    estaAutenticado(): boolean{
        if(this.userToken.length < 2)
            return false;  
        
        const expira = Number(localStorage.getItem('expira')); 
        const expiraDate = new Date();
        expiraDate.setTime(expira);
        
        return expiraDate > new Date() ? true : false;
    }
}
