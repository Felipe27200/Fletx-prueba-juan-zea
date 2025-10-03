import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    RouterLink
],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm {
  @Input() title: string = '';
  @Input() product: any;

  @Output() eventEmitter = new EventEmitter();
  errors: any[] = [];

  private router: Router = inject(Router)
  private fb: FormBuilder = inject(FormBuilder)

  productForm = this.fb.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    quantity: ['', Validators.required],
  });

  onSubmit ()
  {
    this.errors = [];

    if (!this.productForm.valid)
      return;

    if (this.name == null || this.name.value == null || this.name.value == undefined)
      this.errors.push("The name is required");
    if (this.price == null || this.price.value == null || this.price.value == undefined)
      this.errors.push("The price is required");

    if (isNaN(Number(this.price?.value)))
      this.errors.push('The price must be a number');
    if ((Number(this.price?.value)) <= 0)
      this.errors.push('the price must be greater than zero');

    if (isNaN(Number(this.quantity?.value)))
      this.errors.push('The quantity must be a number');
    if ((Number(this.quantity?.value)) <= 0)
      this.errors.push('the quantity must be greater than zero');

    if (this.errors.length > 0)
      return;

    let formData = {
      name: this.name?.value,
      price: this.price?.value,
      quantity: this.quantity?.value,
    }

    this.eventEmitter.emit(formData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["product"] === null || changes["product"] === undefined 
      || changes["product"].currentValue === null || changes["product"].currentValue === undefined)
    {
      return;
    }

    this.product = changes["product"].currentValue;

    this.productForm.controls.name.setValue(this.product.name);
    this.productForm.controls.price.setValue(this.product.price);
    this.productForm.controls.quantity.setValue(this.product.quantity);
  }

  regresarProducts()
  {
    this.router.navigate(['/products'])
  }

  get name() { return this.productForm.get('name'); }
  get price() { return this.productForm.get('price'); }
  get quantity() { return this.productForm.get('quantity'); }
}
