import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PaymentHttpInterceptor } from './payment-http.interceptor';
import { NgModule } from '@angular/core';

describe('PaymentHttpInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      PaymentHttpInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: PaymentHttpInterceptor = TestBed.inject(PaymentHttpInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
