import { Component, OnInit } from '@angular/core';
import { DialogAddJokeComponent } from '../dialog-add-joke/dialog-add-joke.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { BlagueItem } from '../models/BlagueItem';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiEndpoint } from '../config';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(public dialog: MatDialog,
    public auth: AuthService,
    private http: HttpClient) { }

  
  lesBlaguesUser : BlagueItem[];

  ngOnInit() {
    this.getBlaguesUser();
  }

  loading = false
  getBlaguesUser(){
    this.loading = true
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${this.auth.getIdToken()}`,
      })
    };
    
    // envoyer une requete API
    console.log("auth", this.auth)
    this.http.get<{"result":BlagueItem[]}>(
      `${apiEndpoint}/blagues/user`, httpOptions
      )
    .subscribe(blagues => {
      this.loading = false
      if (blagues.hasOwnProperty("result")){
        console.log(blagues["result"])
        this.lesBlaguesUser = blagues["result"]; 
      }
      
      //this.lesBlagues = blagues;
    })

  }

  removeBlague(blagueId){
    console.log("Avant delete", this.lesBlaguesUser)
    const blagueToDelete = this.lesBlaguesUser.find(
      blague => {
        return blague.blagueId == blagueId
      }
    )
    const index = this.lesBlaguesUser.indexOf(blagueToDelete)
    this.lesBlaguesUser.splice(index, 1)
  }


  deleteBlague(blagueId): void{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${this.auth.getIdToken()}`,
      })
    };

    this.http.delete<{"result":BlagueItem[]}>(
      `${apiEndpoint}/blagues/user/${blagueId}`, httpOptions
      )
    .subscribe(blagues => {
      console.log("deleted",blagueId, blagues)
      this.removeBlague(blagueId)
      if (blagues.hasOwnProperty("result")){
        console.log("deleted",blagueId, blagues["result"])
      }
    })
  }

  newBlague = null 
  openDialogAjouterBlague(): void {
    const dialogRef = this.dialog.open(DialogAddJokeComponent, {
      width: '500px',
      data: this.newBlague
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("The dialog was closed(result)", result)
      this.lesBlaguesUser.push(result)
    });
  }

}
