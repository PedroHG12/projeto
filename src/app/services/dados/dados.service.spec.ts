import { TestBed } from '@angular/core/testing';

import { Dados } from './dados.service';

describe('DadosService', () => {
  let service: Dados;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dados);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
