import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss']
})
export class CardModalComponent implements OnInit {

   cardForm!: FormGroup

  constructor(
    
    private fb: FormBuilder,
    private cardService: CardService,
    private dialogRef: MatDialogRef<CardModalComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Card

  ) { }

  ngOnInit(): void {
    console.log('gelen data');
    console.log(this.data);
    this.cardForm = this.fb.group({
      name: [this.data?.name, Validators.max(50)], //  data? data varsa name i al 
      title: [this.data?.title, [Validators.required,Validators.max(255)]],
      phone: [this.data?.phone, [Validators.required,Validators.maxLength(20)]],
      email: [this.data?.email, [Validators.email,Validators.max(50)]],
      address: [this.data?.address, Validators.max(255)]

    });
  }

  addCard(): void {
    console.log(this.cardForm.value);
    this.cardService.addCard(this.cardForm.value)
      .subscribe((res:any)=>{
        this.getSucces(res || 'Kartvizit Başarıyla Eklendi.');
        console.log(res);
      }, (err : any)=>{

        this.getError(err.message || 'Karvizit Eklenirken Bir Sorun Oluştu.');
      }); 
  }

  updateCard(): void {

    this.cardService.updateCard(this.cardForm.value,  this.data.id)
      .subscribe((res : any) =>{
        this.getSucces(res || 'Kartvizit Başarıyla Güncellendi.');
        console.log(res);
      }, (err : any)=>{

        this.getError(err.message || 'Karvizit Güncellenirken Bir Sorun Oluştu.');
      });
  }


  deleteCard(): void {
     
    this.cardService.deleteCard(this.data.id)
      .subscribe((res : any)=>{
        this.getSucces(res || 'Karvizit Başarıyla Silindi');
        console.log(res);
    
      }, (err : any)=>{

        this.getError(err.message || 'Karvizit Silinirken Bir Sorun Oluştu.');
      });


  }


  getSucces(message : string): void {

    this._snackBar.open(message , '',{
      duration: 3000,
    });
   this.cardService.getCards();
   this.dialogRef.close();

  }

  getError(message : string): void {

    this._snackBar.open(message , '',{
      duration: 3000,
    });
  }
 


}
