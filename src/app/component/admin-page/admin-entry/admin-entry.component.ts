import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermisisonService } from 'src/app/share/services/permisison.service';

@Component({
  selector: 'admin-entry',
  template: '<p>Loading... checking token</p>',
  standalone: false,
})
export class AdminEntryComponent implements OnInit {
  constructor(private router: Router, private authService: PermisisonService) {}

  ngOnInit(): void {
    console.log('Admin Entry Component works!!');
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const token = parsedUser._token;
        if (token) {
          this.authService.checkToken(token).subscribe({
            next: (isValid) => {
              if (isValid) {
                this.router.navigate(['/admin/order']);
              } else {
                this.router.navigate(['/admin/login']);
              }
            },
            error: () => this.router.navigate(['/admin/login']),
          });
          return;
        }
      } catch (_) {}
    }
    this.router.navigate(['/admin/login']);
  }
}
