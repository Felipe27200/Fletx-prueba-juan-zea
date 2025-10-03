import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Card } from 'primeng/card';
import { Toast } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ProductService } from '../../services/product.service';
import { CommonResponseService } from '../../services/common-response.service';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    Card,
    Toast,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputText,
    Button,
    ConfirmDialogModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],   
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {
  private productService: ProductService = inject(ProductService);
  private messageService: MessageService = inject(MessageService);
  private confirmationService: ConfirmationService = inject(ConfirmationService)
  private commonResponseService: CommonResponseService = inject(CommonResponseService);
  private router: Router = inject(Router)

  products: any[] = [];

  ngOnInit(): void 
  {
    this.productService.findAll()
      .subscribe({
        next: (response) => {
          this.products = response.data;
        },
        error: (error) => {
          this.messageService.addAll(this.commonResponseService.setToastErrorMessage(error));
        }
      });
  }
}
