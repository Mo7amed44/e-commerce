import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../core/services/payment/payment.service';
import { ActivatedRoute } from '@angular/router';
import { access } from 'fs';
import { UserService } from '../../core/services/user/user.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder)
  private readonly paymentService = inject(PaymentService)
  private readonly activatedRoute = inject(ActivatedRoute)


  x: object = {}
  userInfoForm!: FormGroup;
  cartId: string = '';
  ngOnInit(): void {
    this.formControlData()
    this.getCartId()
  }

  formControlData(): void {
    this.userInfoForm = this.formBuilder.group({
      details: [null, [Validators.required]],
      city: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
    })
  }


  getCartId() {
    return this.activatedRoute.paramMap.subscribe({
      next: (res) => {
        this.cartId = res.get('id')!
      },
      error: (err) => {
        console.log(err);

      }
    })
  }


  submitForm() {
    this.paymentService.CheckoutSession(this.cartId, this.userInfoForm.value).subscribe({
      next: (res) => {
        console.log(res);
        open(res.session.url, '_self');
      },
      error: (err) => {
        console.log(err);

      }
    })

  }
}




