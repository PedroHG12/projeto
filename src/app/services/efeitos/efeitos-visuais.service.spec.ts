import { TestBed } from '@angular/core/testing';

import { EfeitosVisuaisService } from './efeitos-visuais.service';

describe('EfeitosVisuaisService', () => {
  let service: EfeitosVisuaisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EfeitosVisuaisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
