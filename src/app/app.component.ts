import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService) {}
  ngOnInit(): void {
    try {
      this.auth.refreshToken();
    } catch (error) {
      this.auth.logOut();
    }
  }
}
