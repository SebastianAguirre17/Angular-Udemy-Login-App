import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/app.models';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-registro',
      templateUrl: './registro.component.html',
})
export class RegistroComponent implements OnInit {
      usuario: UsuarioModel = new UsuarioModel();
      recordarme = true;
    
      constructor(private auth: AuthService) {}
    
      ngOnInit() {
            if (localStorage.getItem('email')) {
                  this.usuario.email = localStorage.getItem('email');
                  this.recordarme = true;
            }   
      }
    
      onRegister(formulario: NgForm) {
            if (formulario.invalid) return;
              
            Swal.fire({
                  text: 'Espere por favor',
                  allowOutsideClick: false,
                  icon: 'info'
            });

            Swal.showLoading();

            this.auth.nuevoUsuario(this.usuario).subscribe(
                  (resp) => {
                        Swal.close();
                        if (this.recordarme)
                        localStorage.setItem('email', this.usuario.email);
                  },
                  (err) => {
                        Swal.fire({
                              text: err.error.error.message,
                              icon: 'error',
                              title: 'Error al registrar'
                        });
                  }
            );
      }
}
