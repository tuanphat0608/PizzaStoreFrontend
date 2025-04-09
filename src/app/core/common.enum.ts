import {TreeNode} from "./models/tree.model";

export enum PostStatus {
  Published,
  Draft,
  PendingApprove,
  Reject
}

export let PostStatusString = ['Đã xuất bản','Bản Nháp', 'Chờ duyệt','Từ chối']

export enum PostPrivacy {
  Public,
  Private
}

export let PostPrivacyString = ['Công khai','Riêng tư']

export let PostCategories: TreeNode[] = [
  {
    label: "HỢP TÁC MEDIA",
    children: []
  }, {
    label: "M PICK ĐÁNH GIÁ",
    children: []
  }, {
    label: "REVIEW",
    children: []
  }, {
    label: "TIN TỨC",
    children: []
  }, {
    label: "TIPS & TRICKS",
    children: [{
      label: "TIPS ANDROID",
      children: []
    },{
      label: "TIPS IOS",
      children: []
    }]
  },
]

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COOKED = 'COOKED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  ALL = 'ALL'
}

export enum Crust {
  THIN = 'THIN',
  THICK = 'THICK',
  CRISPY = 'CRISPY'
}

export enum Size {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}