import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlagueItem } from '../models/BlagueItem';
import { apiEndpoint } from '../config';
import { AuthService } from '../auth.service';
import { FormControl, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  lesBlagues : BlagueItem[];

  ctrl = new FormControl(null, Validators.required);
  
  constructor(
    private http: HttpClient,
    public auth: AuthService,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    this.getBlagues();
  }

  isAuthenticated(){
    return this.auth.isAuthenticated()
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onRateChange(blague: BlagueItem, valeurRating){
    if(!valeurRating) return
    console.log("clicked raiting: ", blague.blagueId)
    console.log("valeur raiting: ", valeurRating)
    // envoyer le rating 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${this.auth.getIdToken()}`,
      })
    }; 


    console.log("enovyer la request")
    this.http.patch(
      `${apiEndpoint}/blagues/rate/${blague.blagueId}`, 
      {"rating":valeurRating}, 
      httpOptions
      )
    .subscribe(result => {
      console.log("rated done")
      this.openSnackBar("Thanks for rating", valeurRating==1? "1 star": valeurRating + " stars")
    })    
  }

  loading = false

  getBlagues(){
    this.loading = true
    // envoyer une requete API
    this.http.get<{"result":BlagueItem[]}>(
      `${apiEndpoint}/blagues`,
      )
    .subscribe(blagues => {
      this.loading = false
      if (blagues.hasOwnProperty("result")){
        console.log(blagues["result"])
        this.lesBlagues = blagues["result"]; 
      }
      
      //this.lesBlagues = blagues;
    })

  }
}
