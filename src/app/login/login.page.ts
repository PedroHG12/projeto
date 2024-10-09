import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  onSubmit() {
    const { email, senha } = this.loginForm.value;
    this.afAuth.signInWithEmailAndPassword(email, senha)
      .then(() => {
        this.router.navigate(['/feed']);
      })
      .catch(err => {
        console.error('Erro de login:', err);
      });
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }

  loginComGoogle() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(result => {
        const user = result.user;
        if (user) {
          this.router.navigate(['/cadastro'], {
            queryParams: {
              email: user.email,
              nome: user.displayName
            }
          });
        }
      })
      .catch(err => {
        console.error('Erro ao fazer login com Google:', err);
      });
  }
}
