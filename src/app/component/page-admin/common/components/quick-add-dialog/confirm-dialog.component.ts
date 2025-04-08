import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogConfirmModel} from './confirm-dialog.model';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class QuickNewDialogComponent implements OnInit {
  newName: any;

  constructor(
    private dialogRef: MatDialogRef<QuickNewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
  ) {
    if(dialogData){
      this.newName = dialogData;
    }
  }

  ngOnInit() {
  }

  onConfirm() {
    this.dialogRef.close(this.newName);
  }

}
