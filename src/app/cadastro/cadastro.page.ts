import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Certifique-se de ter esses imports
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Para autenticação
import { AngularFirestore } from '@angular/fire/compat/firestore';  // Para Firestore
import { HttpClient } from '@angular/common/http';  // Para fazer a requisição ViaCEP
import { Router } from '@angular/router';  // Para navegação

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  cadastroForm!: FormGroup;  // Usando o operador de asserção não nula

  cepValido: boolean = true;  // Para controle do CEP

  constructor(
    private fb: FormBuilder,  // Injetando o FormBuilder para construir o formulário
    private afAuth: AngularFireAuth,  // Firebase Authentication
    private firestore: AngularFirestore,  // Firebase Firestore
    private http: HttpClient,  // Cliente HTTP para ViaCEP
    private router: Router  // Navegação
  ) {}

  ngOnInit() {
    // Inicializando o FormGroup com validações
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)]],  // Formato DD/MM/AAAA
      cep: ['', [Validators.required]],
      endereco: [''],
      cidade: [''],
      estado: [''],
      matricula: ['', [Validators.required]],
      unidade: ['', [Validators.required]],
      curso: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Método para buscar o endereço usando o ViaCEP
  buscarEndereco() {
    const cep = this.cadastroForm.get('cep')?.value;

    if (cep && cep.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((data: any) => {
        if (data.erro) {
          this.cepValido = false;
          alert('CEP inválido!');
        } else {
          this.cepValido = true;
          this.cadastroForm.patchValue({
            endereco: data.logradouro,
            cidade: data.localidade,
            estado: data.uf
          });
        }
      });
    }
  }

  // Método para submeter o cadastro
  onSubmit() {
    if (this.cadastroForm.valid) {
      const { email, senha, nome, dataNascimento, cep, endereco, cidade, estado, matricula, unidade, curso } = this.cadastroForm.value;
      
      // Criar o usuário no Firebase Auth
      this.afAuth.createUserWithEmailAndPassword(email, senha).then((userCredential) => {
        const userId = userCredential.user?.uid;

        // Salvar informações do usuário no Firestore
        this.firestore.collection('usuarios').doc(userId).set({
          nome,
          email,
          dataNascimento,
          cep,
          endereco,
          cidade,
          estado,
          matricula,
          unidade,
          curso
        }).then(() => {
          alert('Cadastro realizado com sucesso!');
          this.router.navigate(['/feed']);  // Redirecionar para o feed
        }).catch(error => {
          console.error('Erro ao salvar dados do usuário: ', error);
        });
      }).catch(error => {
        console.error('Erro ao criar usuário: ', error);
      });
    } else {
      alert('Preencha todos os campos corretamente!');
    }
  }
}
