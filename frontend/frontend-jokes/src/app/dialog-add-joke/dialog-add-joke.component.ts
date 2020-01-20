import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiEndpoint } from '../config';
import { AuthService } from '../auth.service';
import { BlagueItem } from '../models/BlagueItem';

@Component({
  selector: 'app-dialog-add-joke',
  templateUrl: './dialog-add-joke.component.html',
  styleUrls: ['./dialog-add-joke.component.css']
})
export class DialogAddJokeComponent implements OnInit {

  

  constructor(public dialogRef: MatDialogRef<DialogAddJokeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    public auth: AuthService) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  selectedFile: File = null
  onFileChanged(event){
    this.selectedFile = event.target.files[0]
  }

  loading = false
  onCreateBlague(blague : string){
    //console.log("userprofile", this.auth.userProfile$)
    this.loading = true

    // envoyer une requete API
    var nouvelleBlague = null
    if (this.selectedFile){
      nouvelleBlague = {
        "blague": blague,
        "attachmentUrl": true
      }
    }else{
      nouvelleBlague = {
        "blague": blague,
        "attachmentUrl": false
      }
    }


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${this.auth.getIdToken()}`,
      })
    };

    


    console.log("enovyer la request")
    this.http.post(
      `${apiEndpoint}/blagues`, 
      nouvelleBlague, 
      httpOptions
      )
    .subscribe(result => {
        console.log("result",result)
        this.loading = false

        console.log(result['nouvelleBlague'])
        this.data = result['nouvelleBlague']
        /*
        this.data.userId = result['nouvelleBlague'].userId
        this.data.blagueId = result['nouvelleBlague'].blagueId
        this.data.createdAt = result['nouvelleBlague'].createdAt
        this.data.blague = result['nouvelleBlague'].blague
        this.data.imageUrl = result['nouvelleBlague'].imageUrl
        */

        if (this.selectedFile && result.hasOwnProperty("nouvelleBlague")){
          var attachmentUrl = result["nouvelleBlague"]["attachmentUrl"]
          this.loading = true
          const httpOptionsBinary = {
            headers: {
              'Content-Type': this.selectedFile.type,
            }
          };
          
          this.http.put(
            attachmentUrl, 
            this.selectedFile,
            httpOptionsBinary
            )
            .subscribe(resultImage =>{
              this.loading = false
              console.log("image uploaded", resultImage)
              this.onNoClick()
            })
        } else {
          this.onNoClick()
        }
    })
    console.log("fin la request")
  }
}
