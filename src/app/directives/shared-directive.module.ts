import { NgModule } from '@angular/core';
import { ImageUploaderDirective } from './image-uploader.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ImageUploaderDirective],
  imports: [CommonModule],
  exports: [ImageUploaderDirective],
})
export class SharedDirectiveModule {}
