import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Certifique-se de ter esses imports
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Para autenticação
import { AngularFirestore } from '@angular/fire/compat/firestore';  // Para Firestore
import { HttpClient } from '@angular/common/http';  // Para fazer a requisição ViaCEP
import { Router } from '@angular/router';  // Para navegação
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  cadastroForm!: FormGroup;
  cepValido: boolean = true;

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/)]],  // Formato DD/MM/AAAA
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],  // Exatamente 8 números
      endereco: [''],
      cidade: [''],
      estado: [''],
      matricula: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],  // Exatamente 8 números
      unidade: ['', [Validators.required]],
      curso: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Função para formatar Data de Nascimento com barras automáticas
  formatarData(event: any) {
    let input = event.target.value.replace(/\D/g, '').slice(0, 8);  // Remove não-dígitos
    let formatted = input;
    if (input.length > 2) {
      formatted = `${input.slice(0, 2)}/${input.slice(2)}`;
    }
    if (input.length > 4) {
      formatted = `${input.slice(0, 2)}/${input.slice(2, 4)}/${input.slice(4)}`;
    }
    event.target.value = formatted;
    this.cadastroForm.controls['dataNascimento'].setValue(formatted);
  }

  // Função para formatar CEP
  formatarCEP(event: any) {
    let input = event.target.value.replace(/\D/g, '').slice(0, 8);  // Remove não-dígitos
    event.target.value = input;
    this.cadastroForm.controls['cep'].setValue(input);
  }

  // Função para formatar Matrícula
  formatarMatricula(event: any) {
    let input = event.target.value.replace(/\D/g, '').slice(0, 8);  // Remove não-dígitos
    event.target.value = input;
    this.cadastroForm.controls['matricula'].setValue(input);
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
    const auth = getAuth();
    console.log(auth);
    if (this.cadastroForm.valid) {
      const { email, senha, nome, dataNascimento, cep, endereco, cidade, estado, matricula, unidade, curso } = this.cadastroForm.value;
      createUserWithEmailAndPassword(auth, email, senha).then((userCredential: { user: { uid: any; }; }) => {
        const userId = userCredential.user?.uid;
        console.log('Usuário criado com sucesso: ', userId);
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
          this.router.navigate(['/login']);
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
