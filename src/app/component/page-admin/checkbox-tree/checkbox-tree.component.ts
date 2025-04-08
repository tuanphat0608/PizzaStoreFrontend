import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeNode } from 'src/app/core/models/tree.model';

@Component({
  selector: 'app-checkbox-tree',
  templateUrl: './checkbox-tree.component.html',
  styleUrls: ['./checkbox-tree.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CheckboxTreeComponent {
  @Input() datas: TreeNode[];
  public selectedTreeNode: TreeNode | null;

  constructor() {
    this.selectedTreeNode = null;
  }

  public selectNode(node: TreeNode, value: boolean): void {
    this.check(node, value);
  }

  check(node: any, value: boolean) {
    node.check = value;
    node.children.forEach((x: any) => {
      this.check(x, value);
    });
  }
}
