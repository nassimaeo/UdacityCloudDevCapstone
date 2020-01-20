import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { FeedComponent } from './feed/feed.component';
import { AdminComponent } from './admin/admin.component';
import { DialogAddJokeComponent } from './dialog-add-joke/dialog-add-joke.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CallbackComponent } from './callback/callback.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  },  
  { path: '',
      redirectTo: '/feed',
      pathMatch: 'full'
  },
  { path: 'callback', component: CallbackComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'admin', component: AdminComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FeedComponent,
    AdminComponent,
    DialogAddJokeComponent,
    CallbackComponent
  ],
  entryComponents:[
    DialogAddJokeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    NgbModule,
    MatDialogModule,
    MatSnackBarModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
    )    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
