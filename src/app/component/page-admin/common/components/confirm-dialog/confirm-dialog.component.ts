import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogConfirmModel } from './confirm-dialog.model';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogConfirmModel, 
  private dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  ngOnInit() {
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

}
