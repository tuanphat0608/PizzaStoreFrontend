import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'quantity-dialog',
  templateUrl: './quantity-dialog.component.html',
  styleUrls: ['./quantity-dialog.component.scss'],
  standalone: false
})
export class QuantityDialogComponent {
  quantity: number;

  constructor(
    public dialogRef: MatDialogRef<QuantityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentQuantity: number }
  ) {
    this.quantity = data.currentQuantity ?? 0;
  }

  onConfirm() {
    this.dialogRef.close(this.quantity);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
