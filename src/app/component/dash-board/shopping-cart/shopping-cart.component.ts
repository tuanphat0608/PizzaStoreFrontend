import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbService } from "../breadcrumb/breadcrumb.service";
import { ICustomer, IDropdownOption, IOrder, IOrderDetail, IProduct } from "../../../model/model";
import { CartService } from "../../../share/services/cart.service";
import * as cityList from "src/assets/city.json";
import { ShoppingCartService } from "./shopping-cart.service";
import { RouterConstants } from "../../../share/router-constants";
import Utils from "../../../share/utils/utils";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { event } from 'jquery';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit, OnDestroy {

    labelContent: string;
    warrantyLabel: string;
    isOnlinePay: boolean;
    totalProduct: number = 0;
    tempTotalPrice: number = 0;
    totalPrice: number = 0;
    products: IProduct[];
    cartSub: any;
    cities: any;
    districts: any;
    wards: any;
    optionSelected: number = 1;
    shoppingCartForm: FormGroup;
    gender: string = 'Anh';
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    typeDelivery: string = 'Nhận tại cửa hàng';
    storeAddress: string = '71 Trần Phú - TP. Móng Cái - Quảng Ninh';
    selectedCity: any;
    selectedDistrict: any;
    selectedWard: any;
    address: string;
    paymentMethod: string = 'Thanh toán online';
    typeOnlinePayment: string;
    is_received_in_store = true;
    noWarranty: boolean = false;
    typeOnlinePayments: IDropdownOption[] = [
        {
            id: 1,
            value: "Thanh toán thẻ tín dụng"
        },
        {
            id: 2,
            value: "Thanh toán trả góp"
        },
        {
            id: 2,
            value: "Thanh toán thẻ ATM hoặc Internet Banking"
        }
    ];

    typeDeliverys: IDropdownOption[] = [
        {
            id: 1,
            value: "Nhận tại cửa hàng"
        },
        {
            id: 2,
            value: "Nhận tại nhà"
        }
    ];

    homeLocation: IDropdownOption[] = [
        {
            id: 1,
            value: "71 Trần Phú - TP. Móng Cái - Quảng Ninh"
        },
        {
            id: 2,
            value: "125A Cộng Hòa - P.12 - Q. Tân Bình - TP. HCM"
        }
    ];
    genders: IDropdownOption[] = [
        {
            id: 1,
            value: "Anh"
        },
        {
            id: 2,
            value: "Chị"
        }
    ];
    paymentMethods: IDropdownOption[] = [
        {
            id: 1,
            value: "Chuyển khoản ngân hàng"
        },
        {
            id: 2,
            value: "Trả tiền mặt khi nhận hàng"
        },
        {
            id: 3,
            value: "Quét Mã MoMo"
        },
        {
            id: 4,
            value: "Thanh toán online"
        }
    ];
    controlNameTranslations: any = {
        'gender': 'Giới tính',
        'customer_name': 'Tên khách hàng',
        'customer_phone': 'Số điện thoại',
        'customer_email': 'Email',
        'typeDelivery': 'Loại giao hàng',
        'selectedCity': 'Thành phố',
        'selectedDistrict': 'Quận/Huyện',
        'selectedWard': 'Phường/Xã',
        'address': 'Địa chỉ',
        'paymentMethod': 'Phương thức thanh toán',
        'typeOnlinePayment': 'Loại thanh toán online',
    };
    constructor(
        private router: Router,
        private breadcrumbService: BreadcrumbService,
        private shoppingCartService: ShoppingCartService,
        private cartService: CartService,
        private fb: FormBuilder,
        private toastr: ToastrService,

    ) {
        const dataCity = JSON.parse(cityList.default);
        this.cities = dataCity.sort((a, b) => a.Name.localeCompare(b.Name));
        this.shoppingCartForm = this.fb.group({
            gender: [this.gender, Validators.required],
            customer_name: [this.customer_name, [Validators.required, Validators.maxLength(45)]],
            customer_phone: [this.customer_phone, [Validators.required, Validators.maxLength(11), Validators.pattern(/^[0-9]+$/)]],
            customer_email: [this.customer_email, [Validators.required, Validators.email, Validators.maxLength(45)]],
            typeDelivery: [this.typeDelivery, Validators.required],
            selectedCity: [this.selectedCity, Validators.required],
            selectedDistrict: [this.selectedDistrict, Validators.required],
            selectedWard: [this.selectedWard, Validators.required],
            address: [this.address, Validators.required],
            paymentMethod: [this.paymentMethod, Validators.required],
            typeOnlinePayment: [this.typeOnlinePayment],
            is_received_in_store: [''],
        });
    }

    ngOnDestroy(): void {
        if (this.cartSub) {
            this.cartSub.unsubscribe();
        }

    }
    isEmailInvalid(): boolean {
        const emailControl = this.shoppingCartForm.get('customer_email');

        // Check if the email control has errors
        return emailControl.hasError('customer_email') && emailControl.dirty;
    }
    ngOnInit(): void {
        this.breadcrumbService.setBreadcrumbs(['Trang Chủ', 'Thanh toán']);
        this.cartSub = this.cartService.getCart().subscribe((products: IProduct[]) => {
            this.products = products;
            this.totalProduct = products.length;
            this.totalPrice = 0
            this.tempTotalPrice = 0

            for (let product of this.products) {
                product.selectedPrice = product.listPrice
                if ((product.price18 && product.price18 != 0) && (product?.price12 && product?.price12 != 0) && (product?.price && product?.price != 0)) {
                    product.noWarranty = true;
                }
                switch (product.warranty_type.toString()) {
                    case "1": {
                      this.warrantyLabel = "1"
                        if (product.price && product.price != 0)
                            product.selectedPrice = product.price
                        break;
                    }
                    case "6": {
                      this.warrantyLabel = "6"
                      if (product.price6 && product.price6 != 0)
                            product.selectedPrice = product.price6
                        break;
                    }
                    case "12": {
                      this.warrantyLabel = "12"
                      if (product.price12 && product.price12 != 0)
                            product.selectedPrice = product.price12
                        break;
                    }
                    case "15": {
                      this.warrantyLabel = "15"
                      if (product.price15 && product.price15 != 0)
                            product.selectedPrice = product.price15
                        break;
                    }
                    case "18": {
                      this.warrantyLabel = "18"
                      if (product.price18 && product.price18 != 0)
                            product.selectedPrice = product.price18
                        break;
                    }
                    case "24": {
                      this.warrantyLabel = "24"
                      if (product.price24 && product.price24 != 0)
                            product.selectedPrice = product.price24
                        break;
                    }
                }
                this.totalPrice += (product.selectedPrice * product.quantity);
                this.tempTotalPrice += (product.selectedPrice * product.quantity);
            }
        })
        this.shoppingCartForm.get('gender').setValue('Anh');
        this.shoppingCartForm.get('typeDelivery').setValue('Nhận tại cửa hàng');
        this.shoppingCartForm.get('typeOnlinePayment').setValue('Thanh toán online');
        this.idSelected(this.optionSelected)

    }

    onQuantityChange(p: IProduct) {
        if (p.quantity > 0) {
            this.cartService.setQuantityForProduct(p);
        } else {
            this.cartService.popProductFromCart(p);
        }
    }
    onEmailInput(event: any) {
        this.customer_email = event.target.value;
        this.shoppingCartForm.get('customer_email').setValue(event.target.value);
        this.isEmailInvalid();
    }
    onNameInput(event: any) {
        this.customer_name = event.target.value;
        this.shoppingCartForm.get('customer_name').setValue(event.target.value);
    }
    onPhoneInput(event: any) {
        const input = event.target.value
        this.customer_phone = input
        this.shoppingCartForm.get('customer_phone').setValue(input);
        this.checkOnlyNumber(this.customer_phone);
    }
    onAddressInput(event: any) {
        this.address = event.target.value;
        this.shoppingCartForm.get('address').setValue(event.target.value);
    }
    onCityChange($event: any) {
        const districtsData = $event.Districts
        this.districts = districtsData.sort((a, b) => a.Name.localeCompare(b.Name));
        this.selectedDistrict = undefined;
        this.selectedWard = undefined;
        this.shoppingCartForm.get('selectedCity').setValue($event.Name);
    }

    onDistrictsChange($event: any) {
        const wardsData = $event.Wards
        this.wards = wardsData.sort((a, b) => a.Name.localeCompare(b.Name));
        this.selectedWard = undefined;
        this.shoppingCartForm.get('selectedDistrict').setValue($event.Name);
    }

    onWardsChange($event: any) {
        this.shoppingCartForm.get('selectedWard').setValue($event.Name);
    }

    onRemoveFromCartClick(p: IProduct) {
        this.cartService.popProductFromCart(p);
    }

    createOrderDTO(): IOrder {
        var cus: ICustomer = {
            name: this.customer_name,
            phone: this.customer_phone,
            email: this.customer_email,
            gender: this.gender
        }
        var orderDetails: IOrderDetail[] = [];
        for (let product of this.products) {
            orderDetails.push({
                product: product,
                quantity: product.quantity,
                warranty_type: product.warranty_type
            })
        }

        return {
            status: 'CREATED',
            city: this.selectedCity.Name,
            district: this.selectedDistrict.Name,
            ward: this.selectedWard.Name,
            address: this.address,
            product_order_list: orderDetails,
            payment_method: this.paymentMethod,
            customer: cus,
            is_received_in_store: this.is_received_in_store
        };
    }

    onSubmitClick() {
        // Check if the form is valid
        if (this.shoppingCartForm.valid) {
            let iOrder = this.createOrderDTO();
            this.shoppingCartService.createOrder(iOrder).subscribe({
                next: (response: IOrder) => {
                    this.cartService.resetCart();
                    this.router.navigate(
                        [RouterConstants.ORDER_RECEIVED, response.id],
                        { state: { order: response } }
                    );
                },
                error: (e) => e,
            });
        } else {
            // Handle the case where the form is not valid


            //   // Get the list of control names with null values
            //   const nullValueControls = Object.keys(this.shoppingCartForm.controls).filter(controlName => {
            //     const control = this.shoppingCartForm.get(controlName);
            //     return control?.value == null || control?.value == undefined;
            //   });
            // const nullValueControlsTranslated = nullValueControls.map(controlName => 'nhập '+this.controlNameTranslations[controlName]);
            // if(this.isEmailInvalid && this.customer_email){
            //     nullValueControlsTranslated.push(" nhập Email đúng");
            // }
            // if(this.createOrderDTO()?.product_order_list.length == 0)
            // {
            //     nullValueControlsTranslated.push(" thêm sản phẩm vào giỏ hàng!");
            // }
            // this.toastr.error('Vui lòng '+ nullValueControlsTranslated)
        }
    }

    checkOnlyNumber(phoneNumber: string) {
        if (/^\d+$/.test(phoneNumber)) {
            return true;
        }
        return false;
    }

    onWarrantyChange($event: Event) {
        this.totalPrice = 0;
        this.tempTotalPrice = 0
        let selectedPrice: number = 0;
        for (let product of this.products) {
            selectedPrice = product.listPrice
            switch (product.warranty_type.toString()) {
                case "1": {
                    if (product.price && product.price != 0)
                        product.selectedPrice = product.price
                    selectedPrice = product.price
                    break;
                }
                case "12": {
                    if (product.price12 && product.price12 != 0)
                        product.selectedPrice = product.price12
                    selectedPrice = product.price12
                    break;
                }
                case "18": {
                    if (product.price18 && product.price18 != 0)
                        product.selectedPrice = product.price18
                    selectedPrice = product.price18
                    break;
                }
            }
            this.totalPrice += (selectedPrice * product.quantity);
            this.tempTotalPrice += (selectedPrice * product.quantity);
        }
        this.cartService.updateProductToCart(this.products)
    }

    PaymenMethodClick(event: IDropdownOption): void {
        this.paymentMethod = event.value;
        this.shoppingCartForm.get('paymentMethod').setValue(this.paymentMethod);
        if (event.id == 1) {
            this.labelContent = 'Thực hiện thanh toán vào ngay tài khoản ngân hàng của chúng tôi. Vui lòng sử dụng Mã đơn hàng của bạn trong phần Nội dung thanh toán. Đơn hàng sẽ đươc giao sau khi tiền đã chuyển.';
            this.isOnlinePay = false;
        }
        else if (event.id == 2) {
            this.labelContent = 'Trả tiền mặt khi giao hàng';
            this.isOnlinePay = false;
        }
        else if (event.id == 3) {
            this.labelContent = 'Hãy mở App Momo lên và nhấn Đặt Hàng để quét mã thanh toán!';
            this.isOnlinePay = false;
        }
        else {
            this.labelContent = null;
            this.isOnlinePay = true;
        }

    }
    typeOnlinePaymentClick(event: IDropdownOption): void {
        this.typeOnlinePayment = event.value;
        this.shoppingCartForm.get('typeOnlinePayment').setValue(this.typeOnlinePayment);
    }
    onGenderClick(selectedGender: IDropdownOption) {
        this.gender = selectedGender.value;
        this.shoppingCartForm.get('gender').setValue(this.gender);
    }
    typeDeliveryClick(option: string) {
        this.typeDelivery = option;
        this.shoppingCartForm.get('typeDelivery').setValue(this.typeDelivery);
        if (this.typeDelivery == "Nhận tại cửa hàng") {
            this.is_received_in_store = true
            this.idSelected(this.optionSelected)
        } else {
            this.is_received_in_store = false
            this.selectedDistrict = undefined;
            this.selectedWard = undefined;
            this.selectedCity = undefined;
            this.address = ''
            this.shoppingCartForm.get('selectedCity').setValue("");
            this.shoppingCartForm.get('selectedDistrict').setValue("");
            this.shoppingCartForm.get('selectedWard').setValue("");
            this.shoppingCartForm.get('address').setValue("");
        }
    }
    storeAddressClick(option: IDropdownOption) {
        this.storeAddress = option.value;
        this.optionSelected = option.id
        this.idSelected(this.optionSelected)
    }

    idSelected(id: number) {
        if (id == 1) {
            let selectedCityConvert: data = {
                id: 0,
                Name: "Tỉnh Quảng Ninh"
            };
            let selectedDistrictConvert: data = {
                id: 0,
                Name: "Thành phố Móng Cái"
            };
            let selectedWardConvert: data = {
                id: 0,
                Name: "Phường Trần Phú"
            };
            this.selectedCity = selectedCityConvert;
            this.selectedDistrict = selectedDistrictConvert;
            this.selectedWard = selectedWardConvert;
            this.address = "71 Trần Phú - TP. Móng Cái - Quảng Ninh";
            this.shoppingCartForm.get('selectedCity').setValue("Quảng Ninh");
            this.shoppingCartForm.get('selectedDistrict').setValue("Móng Cái");
            this.shoppingCartForm.get('selectedWard').setValue("Trần Phú");
            this.shoppingCartForm.get('address').setValue("71 Trần Phú");
        } else {
            let selectedCityConvert: data = {
                id: 0,
                Name: "Thành phố Hồ Chí Minh"
            };
            let selectedDistrictConvert: data = {
                id: 0,
                Name: "Quận Tân Bình"
            };
            let selectedWardConvert: data = {
                id: 0,
                Name: "Phường 12"
            };
            this.selectedCity = selectedCityConvert;
            this.selectedDistrict = selectedDistrictConvert;
            this.selectedWard = selectedWardConvert;
            this.address = "125A Cộng Hòa - P.12 - Q. Tân Bình - TP. HCM";
            this.shoppingCartForm.get('selectedCity').setValue("Thành phố Hồ Chí Minh");
            this.shoppingCartForm.get('selectedDistrict').setValue("Quận Tân Bình");
            this.shoppingCartForm.get('selectedWard').setValue("Phường 12");
            this.shoppingCartForm.get('address').setValue("125A Cộng Hòa");
        }
    }
}
class data {
    id: number;
    Name: string;
}
