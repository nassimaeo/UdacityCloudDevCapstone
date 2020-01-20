import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.handleAuthentication()
    if (this.auth.isAuthenticated()){
      console.log("Callback route to Admin")
      this.router.navigate(['admin'])
    }else{
      console.log("Callback route to Feed")
      this.router.navigate(['feed'])
    }
    
  }

}
