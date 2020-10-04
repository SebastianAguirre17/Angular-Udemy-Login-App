import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/app.models';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    usuario: UsuarioModel = new UsuarioModel();
    recordarme = false;

    constructor(private auth: AuthService, private router: Router) {}

    ngOnInit() {
        if (localStorage.getItem('email')) {
            this.usuario.email = localStorage.getItem('email');
            this.recordarme = true;
        }   
    }

    onLogin(formulario: NgForm) {
        if (formulario.invalid) return;
        
        Swal.fire({
            text: 'Espere por favor',
            allowOutsideClick: false,
            icon: 'info'
        });

        Swal.showLoading();

        this.auth.login(this.usuario)
            .subscribe(
                (resp) => {
                    if (this.recordarme)
                        localStorage.setItem('email', this.usuario.email);
    
                    Swal.close();
                    this.router.navigateByUrl('/home');
                    console.log(resp);
                },
                (err) => {
                    Swal.fire({
                        text: err.error.error.message,
                        icon: 'error',
                        title: 'Error al autenticar'
                    });
            }
        );
    }
}
