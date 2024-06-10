import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  showToolbar: boolean = true;
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    try {
      // this.auth.refreshToken();
    } catch (error) {
      // this.auth.logOut();
    }

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.showToolbar = event.url !== '/auth/unauthorized';
      });
  }
}
